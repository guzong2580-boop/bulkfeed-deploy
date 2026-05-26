// ════════════════════════════════════════════════════════
// 벌크피드영농조합법인 — 홈페이지 문의 백엔드
// 구글 시트 저장 + 이메일 알림
// ════════════════════════════════════════════════════════

const SHEET_NAME      = '문의';
const NOTIFY_EMAIL    = 'samddeul@naver.com';
const COMPANY_NAME    = '벌크피드영농조합법인';
const COMPANY_DOMAIN  = 'feedbulk.com';

// ────────────────────────────────────────────────────────
// 헬스체크 (GET 요청)
// ────────────────────────────────────────────────────────
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      service: '벌크피드 문의 API',
      status:  'running',
      time:    new Date().toLocaleString('ko-KR')
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ────────────────────────────────────────────────────────
// 폼 제출 처리 (POST 요청)
// ────────────────────────────────────────────────────────
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // [봇 차단] honeypot 필드 검증
    if (data.website && data.website.trim() !== '') {
      return jsonResponse({ success: true, id: 'BOT-BLOCKED' });
    }

    // 필수 필드 검증
    if (!data.name || !data.email || !data.message) {
      return jsonResponse({ success: false, error: '필수 항목 누락' });
    }

    // 1) 시트 저장
    const id = saveToSheet(data);

    // 2) 이메일 알림
    try { sendEmailNotification(data, id); }
    catch (err) { Logger.log('이메일 알림 실패: ' + err); }

    return jsonResponse({ success: true, id: id });
  } catch (err) {
    Logger.log('doPost 오류: ' + err);
    return jsonResponse({ success: false, error: err.toString() });
  }
}

// ────────────────────────────────────────────────────────
// 구글 시트 저장
// ────────────────────────────────────────────────────────
function saveToSheet(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  // 시트가 없으면 자동 생성 + 헤더
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      '접수시각', '접수ID', '이름', '회사/기관', '연락처',
      '이메일', '문의유형', '문의내용', '개인정보동의', '비고'
    ]);
    sheet.getRange(1, 1, 1, 10)
      .setBackground('#2a4d34')
      .setFontColor('#ffffff')
      .setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  const now = new Date();
  const id  = 'INQ-' + Utilities.formatDate(now, 'Asia/Seoul', 'yyMMdd-HHmmss');

  sheet.appendRow([
    now,
    id,
    data.name     || '',
    data.company  || '',
    data.phone    || '',
    data.email    || '',
    data.category || '기타 문의',
    data.message  || '',
    data.privacy  ? '동의' : '미동의',
    ''
  ]);

  return id;
}

// ────────────────────────────────────────────────────────
// 이메일 알림 발송
// ────────────────────────────────────────────────────────
function sendEmailNotification(data, id) {
  const subject =
    '[' + COMPANY_NAME + '] 새 문의 - ' +
    (data.category || '기타') + ' (' + (data.name || '익명') + ')';

  const body =
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    COMPANY_NAME + ' 홈페이지 문의\n' +
    '접수번호: ' + id + '\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
    '▶ 이름\n' + (data.name || '') + '\n\n' +
    '▶ 회사/기관\n' + (data.company || '(미기재)') + '\n\n' +
    '▶ 연락처\n' + (data.phone || '(미기재)') + '\n\n' +
    '▶ 이메일\n' + (data.email || '') + '\n\n' +
    '▶ 문의 유형\n' + (data.category || '기타 문의') + '\n\n' +
    '▶ 문의 내용\n' + (data.message || '') + '\n\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    '· 접수 시각: ' + new Date().toLocaleString('ko-KR') + '\n' +
    '· 출처: ' + COMPANY_DOMAIN + '\n' +
    '· 개인정보 동의: ' + (data.privacy ? '동의함' : '미동의') + '\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
    '※ 이 메일에 회신하시면 문의자(' + (data.email || '') + ')에게 직접 전송됩니다.\n';

  const options = {};
  if (data.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    options.replyTo = data.email;
  }

  GmailApp.sendEmail(NOTIFY_EMAIL, subject, body, options);
}

// ────────────────────────────────────────────────────────
// 응답 헬퍼
// ────────────────────────────────────────────────────────
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ────────────────────────────────────────────────────────
// 수동 테스트 (Apps Script 에디터에서 실행)
// ────────────────────────────────────────────────────────
function 테스트() {
  const sample = {
    name: '테스트 사용자',
    company: '테스트 회사',
    phone: '010-1234-5678',
    email: 'test@example.com',
    category: '조사료 공급 문의',
    message: '이것은 테스트 메시지입니다.\n2줄째 내용.',
    privacy: true,
    website: '' // honeypot
  };
  const id = saveToSheet(sample);
  Logger.log('저장 완료. 접수ID: ' + id);
  sendEmailNotification(sample, id);
  Logger.log('이메일 발송 완료 → ' + NOTIFY_EMAIL);
}
