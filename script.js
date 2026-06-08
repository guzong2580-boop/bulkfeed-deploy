// ─────────────────────────────────────
// Year in footer
// ─────────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();

// ─────────────────────────────────────
// Nav scrolled state
// ─────────────────────────────────────
const nav = document.getElementById('nav');
const updateNav = () => {
  if (window.scrollY > 20) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
};
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// ─────────────────────────────────────
// Reveal on scroll
// ─────────────────────────────────────
const revealEls = document.querySelectorAll(
  '.section-head, .award-card, .flow-step, .pillar, .process-step, .contact-card, .kv-row, .col-label, .lead, .eval-stage, .criterion, .keynote-quote, .keynote-policy, .press-card, .tl-item, .ctx-card, .contact-info, .contact-form, .info-block'
);
revealEls.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

revealEls.forEach(el => io.observe(el));

// ─────────────────────────────────────
// Smooth anchor adjustment for fixed header
// ─────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ─────────────────────────────────────
// Contact form → Google Apps Script + 봇 스팸 방지
// ─────────────────────────────────────
const INQUIRY_API_URL = 'https://script.google.com/macros/s/AKfycbyL5yItqTn7OjaNumMXcErtE-3QVpI3kTk1z9ly9p8vJW3LZZK0-QRE3yltOgIJmA2G/exec';

const inquiryForm = document.getElementById('inquiryForm');
if (inquiryForm) {
  const formLoadTime = Date.now();
  const MIN_FILL_TIME_MS = 3000;

  const isValidEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
  const looksLikeSpam = (s) => {
    if (!s) return false;
    const urlCount = (s.match(/https?:\/\//gi) || []).length;
    if (urlCount >= 3) return true;
    if (/\[url[=\]]|<a\s+href=/i.test(s)) return true;
    return false;
  };

  const submitBtn = inquiryForm.querySelector('.form-submit');
  const submitBtnHTML = submitBtn ? submitBtn.innerHTML : '';

  const setSubmitting = (yes) => {
    if (!submitBtn) return;
    submitBtn.disabled = yes;
    submitBtn.innerHTML = yes
      ? '<span>접수 중...</span>'
      : submitBtnHTML;
  };

  const showSuccess = (id) => {
    const card = inquiryForm;
    card.innerHTML = `
      <div class="form-success">
        <div class="success-icon" aria-hidden="true">
          <svg viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="32" cy="32" r="28"/>
            <path d="M20 32 L28 40 L44 24"/>
          </svg>
        </div>
        <h3 class="success-title">접수가 완료되었습니다</h3>
        <p class="success-desc">담당자가 확인 후 영업시간 내에 회신드리겠습니다.<br>감사합니다.</p>
        <div class="success-id">접수번호 · <strong>${id || '-'}</strong></div>
        <div class="success-cta">
          <a href="tel:01047514071" class="btn btn-primary">전화로 빠른 상담</a>
          <a href="#top" class="btn btn-ghost">홈으로 돌아가기</a>
        </div>
      </div>
    `;
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  inquiryForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(inquiryForm);

    // [1] Honeypot
    const honeypot = (fd.get('website') || '').toString();
    if (honeypot.trim() !== '') {
      console.warn('[bot blocked] honeypot triggered');
      inquiryForm.reset();
      showSuccess('BOT-BLOCKED'); // 봇에게는 가짜 성공
      return;
    }

    // [2] 시간 검증
    const elapsed = Date.now() - formLoadTime;
    if (elapsed < MIN_FILL_TIME_MS) {
      console.warn('[bot blocked] too fast: ' + elapsed + 'ms');
      alert('잠시 후 다시 시도해 주세요.');
      return;
    }

    // [3] 개인정보 동의
    const privacy = fd.get('privacy');
    if (!privacy) {
      alert('개인정보 수집·이용에 동의해 주세요.');
      return;
    }

    // [4] 필수/형식 검증
    const name = (fd.get('name') || '').toString().trim();
    const company = (fd.get('company') || '').toString().trim();
    const phone = (fd.get('phone') || '').toString().trim();
    const email = (fd.get('email') || '').toString().trim();
    const category = (fd.get('category') || '기타 문의').toString().trim();
    const message = (fd.get('message') || '').toString().trim();

    if (!name || !email || !message) {
      alert('이름, 이메일, 문의 내용은 필수 입력 항목입니다.');
      return;
    }
    if (!isValidEmail(email)) {
      alert('이메일 형식이 올바르지 않습니다.');
      return;
    }
    if (name.length < 2) {
      alert('이름을 정확히 입력해 주세요.');
      return;
    }
    if (message.length < 5) {
      alert('문의 내용을 5자 이상 작성해 주세요.');
      return;
    }

    // [5] 스팸 패턴
    if (looksLikeSpam(message) || looksLikeSpam(name) || looksLikeSpam(company)) {
      console.warn('[bot blocked] spam pattern');
      alert('스팸으로 의심되는 내용이 포함되어 있습니다. 다시 작성해 주세요.');
      return;
    }

    // [6] 전송 — Google Apps Script
    setSubmitting(true);

    const payload = {
      name, company, phone, email, category, message,
      privacy: true,
      website: honeypot, // 백엔드에서 한 번 더 검증
      ua: navigator.userAgent.slice(0, 200),
      source: 'feedbulk.com'
    };

    try {
      // Content-Type 안 지정 → CORS preflight 회피
      const res = await fetch(INQUIRY_API_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
        redirect: 'follow'
      });
      const data = await res.json();

      if (data.success) {
        showSuccess(data.id);
      } else {
        alert(
          '❌ 접수 실패\n\n' +
          (data.error || '알 수 없는 오류') + '\n\n' +
          '급하신 경우 010-4751-4071로 연락해 주세요.'
        );
        setSubmitting(false);
      }
    } catch (err) {
      console.error('문의 전송 실패:', err);
      alert(
        '❌ 네트워크 오류\n\n' +
        '잠시 후 다시 시도해 주세요.\n' +
        '급하신 경우 010-4751-4071로 연락해 주세요.'
      );
      setSubmitting(false);
    }
  });
}

// ─────────────────────────────────────
// Hero 배경 슬라이드 (4초 크로스페이드, lazy 주입)
// ─────────────────────────────────────
(() => {
  const wrap = document.getElementById('heroSlides');
  if (!wrap) return;
  const slides = Array.from(wrap.querySelectorAll('.hero-slide'));
  if (slides.length < 2) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return; // 모션 최소화 환경 → 첫 장 고정

  // data-bg에 정의된 슬라이드 배경을 한 번만 주입(+이미지 프리로드)
  const ensureBg = (slide) => {
    const url = slide.dataset.bg;
    if (!url) return;
    const img = new Image();
    img.onload = () => { slide.style.backgroundImage = `url('${url}')`; };
    img.src = url;
    slide.removeAttribute('data-bg');
  };

  let cur = slides.findIndex(s => s.classList.contains('is-active'));
  if (cur < 0) cur = 0;

  // 다음 장 미리 로드
  ensureBg(slides[(cur + 1) % slides.length]);

  const INTERVAL = 4000;
  let timer = null;

  const step = () => {
    const next = (cur + 1) % slides.length;
    slides[cur].classList.remove('is-active');
    slides[next].classList.add('is-active');
    cur = next;
    // 그 다음 장 선주입
    ensureBg(slides[(cur + 1) % slides.length]);
  };

  const start = () => { if (!timer) timer = setInterval(step, INTERVAL); };
  const stop = () => { if (timer) { clearInterval(timer); timer = null; } };

  // 탭 비활성 시 정지(불필요 페인트 절약)
  document.addEventListener('visibilitychange', () => {
    document.hidden ? stop() : start();
  });

  start();
})();
