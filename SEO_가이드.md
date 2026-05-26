# 벌크피드영농조합법인 — 검색엔진 등록 가이드

이 문서는 사이트 코드 측 SEO 작업이 모두 끝난 후, **사용자(관리자)께서 직접 검색엔진 콘솔에 사이트를 등록**하는 절차입니다.

코드는 이미 다음을 모두 갖추고 있습니다:
- 메타 태그 (title, description, keywords, geo, robots 등)
- Open Graph + Twitter 카드
- JSON-LD 구조화 데이터 (Organization, LocalBusiness, WebSite)
- sitemap.xml (`https://feedbulk.com/sitemap.xml`)
- robots.txt (`https://feedbulk.com/robots.txt`)
- 시맨틱 HTML (h1 1개, alt, aria-label)
- 모바일 반응형
- HTTPS

---

## 1️⃣ 네이버 서치어드바이저 등록 (가장 중요 — 국내 검색 점유율)

### URL
**https://searchadvisor.naver.com/**

### 절차
1. 네이버 로그인 (samddeul 계정 또는 회사 대표 계정)
2. 우측 상단 **「내 사이트 추가」** 클릭
3. URL 입력: `https://feedbulk.com`
4. **「소유권 확인」** 단계 → 두 가지 방법 중 하나:

#### 방법 A: HTML 메타 태그 (추천 — 코드만 한 줄 추가)
- 네이버가 주는 메타 태그 (예시):
  ```html
  <meta name="naver-site-verification" content="abc123xyz...">
  ```
- 위 코드를 복사해서 클로드에게 주시면 `index.html` head에 즉시 추가 → 재배포

#### 방법 B: HTML 파일 업로드
- 네이버가 제공하는 `.html` 파일 (예: `naverXXXX.html`)을 클로드에게 주시면 폴더에 추가 → 재배포

5. 소유권 확인 완료 후 → **「요청 → 사이트맵 제출」** 메뉴
6. 사이트맵 URL 입력: `sitemap.xml`
7. **「요청 → RSS 제출」** (선택, RSS 없음)

### 등록 후 1주일 이내 효과
- 네이버 검색에서 "벌크피드영농조합법인" 검색 시 사이트 노출
- 사이트 정보(설명·이미지) 검색결과에 표시

---

## 2️⃣ 구글 서치 콘솔 등록

### URL
**https://search.google.com/search-console**

### 절차
1. 구글 로그인 (samddeul / 본인 계정)
2. **「속성 추가」** → **「URL 접두어」** 선택
3. URL 입력: `https://feedbulk.com`
4. 소유권 확인 → **HTML 태그** 방법 선택:
   ```html
   <meta name="google-site-verification" content="xxxxxxxx">
   ```
5. 위 코드를 클로드에게 주시면 즉시 추가 → 재배포 → 확인
6. 좌측 메뉴 **「Sitemaps」** → 사이트맵 URL 입력: `sitemap.xml` → 제출

### 등록 후 효과
- 구글 검색 노출
- 검색 트래픽 분석 데이터 확인 가능
- 사이트맵 색인 상태 모니터링

---

## 3️⃣ 다음(카카오) 검색 등록

### URL
**https://register.search.daum.net/index.daum**

### 절차
1. 다음 로그인
2. **「사이트 등록」** 클릭
3. 사이트 URL: `https://feedbulk.com` 입력
4. 사이트명, 설명, 분류(예: 비즈니스 > 농업) 입력
5. 제출 → 카카오 검수 (영업일 기준 7~14일)

### 다음의 특성
- 자동 크롤링 (robots.txt 따름)
- 별도 사이트맵 제출 메뉴 없음 → robots.txt의 Sitemap 라인이 가이드 역할

---

## 4️⃣ Bing 웹마스터 도구 (선택)

### URL
**https://www.bing.com/webmasters**

### 특이점
- 구글 서치 콘솔과 연동되어 **자동 import 가능** (가장 쉬움)
- 구글 등록 후 Bing 들어가서 "Import from Google Search Console" 클릭

---

## 📊 PageSpeed Insights — 직접 측정

**https://pagespeed.web.dev/**

1. 위 URL 접속
2. `https://feedbulk.com` 입력 → 분석
3. 모바일·데스크탑 모두 측정
4. 목표 점수:
   - Performance: 85+ (정적 사이트 + Vercel CDN이라 90~100 예상)
   - Accessibility: 95+
   - Best Practices: 95+
   - SEO: **100** (모든 항목 충족)

---

## 📋 등록 후 1주일 점검 체크리스트

```
□ 네이버에서 "벌크피드영농조합법인" 검색 → 노출 확인
□ 구글에서 site:feedbulk.com 검색 → 인덱싱 페이지 확인
□ 네이버 서치어드바이저 「사이트 진단」에서 모든 항목 정상
□ 구글 서치 콘솔 「색인 → 페이지」에서 1페이지 이상 색인 완료
□ 카카오톡에서 https://feedbulk.com 링크 보냈을 때 OG 카드 정상 표시
□ 페이스북·X(트위터)에서 같은 링크 보냈을 때 카드 정상 표시
```

---

## 🔍 코드 측에서 이미 완료된 SEO 작업

### 메타 태그 (완료)
- ✅ 페이지 title (60자 내외, 키워드 포함)
- ✅ description (150자 내외, 핵심 키워드 + 행동 유도)
- ✅ keywords (16개)
- ✅ author, publisher, copyright
- ✅ robots, googlebot, naver-bot, yeti
- ✅ canonical URL
- ✅ geo.region, geo.placename, geo.position
- ✅ theme-color
- ✅ format-detection

### 소셜 공유 (완료)
- ✅ Open Graph 풀 셋 (type, site_name, title, description, url, image, locale, image:width/height/alt)
- ✅ Twitter Card (summary_large_image)
- ✅ OG 이미지 1200x630 (다크그린 배경 + 로고 합성)

### 구조화 데이터 JSON-LD (완료)
- ✅ Organization (회사 정보, 대표, 수상, 연락처)
- ✅ LocalBusiness (이천 백사면, 좌표, 영업 범위)
- ✅ WebSite (사이트 정보)

### 크롤러 안내 (완료)
- ✅ sitemap.xml (모든 섹션 + 이미지 sitemap 통합)
- ✅ robots.txt (모든 크롤러 허용 + 사이트맵 위치)

### 성능 (완료)
- ✅ 이미지 width/height 명시 (CLS 방지)
- ✅ hero 로고 preload + fetchpriority="high"
- ✅ 푸터 이미지 lazy loading
- ✅ async decoding
- ✅ font preconnect + dns-prefetch
- ✅ HTTPS (Let's Encrypt 자동 갱신)

### 시맨틱 HTML (완료)
- ✅ h1 페이지당 1개 (hero-title)
- ✅ h2 섹션 제목, h3 카드 제목 (위계 정상)
- ✅ 모든 img에 alt 속성
- ✅ 장식 요소에 aria-hidden
- ✅ landmark 요소 (header, main, footer, nav, section)
- ✅ 폼 label
- ✅ 모바일 반응형

---

## 다음에 클로드에게 요청할 때 양식

```
"네이버 인증코드 받았어 → <코드>"
"구글 인증코드 받았어 → <코드>"
"naver1a2b3c4d5e.html 파일 업로드해줘"
"sitemap.xml 갱신해줘 (○○ 페이지 추가)"
```

이렇게 알려주시면 즉시 코드에 반영 → 재배포 → 검증까지 진행합니다.
