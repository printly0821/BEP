# 제작 의뢰서 API 테스트 시스템

이 디렉토리는 API 기반 동적 리포트 생성 시스템의 테스트 구현입니다.

## 📋 개요

외부 JSON 데이터를 API로 받아서 동적으로 제작 의뢰서 리포트를 생성하고 PDF로 다운로드할 수 있는 시스템입니다.

## 🏗️ 아키텍처

```
┌─────────────┐      ┌──────────────┐      ┌─────────────────┐
│   Browser   │─────▶│  Next.js API │─────▶│  Mock Database  │
│             │◀─────│   Routes     │◀─────│  (job-orders)   │
└─────────────┘      └──────────────┘      └─────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  JobOrderReportView (React Component)   │
│  - 동적 데이터 렌더링                      │
│  - 실시간 바코드/QR코드 생성               │
└─────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  PDF Generator (html2canvas + jsPDF)    │
│  - A4 크기 PDF 생성                       │
│  - 다중 페이지 지원                        │
└─────────────────────────────────────────┘
```

## 📁 파일 구조

```
src/
├── app/
│   ├── api/
│   │   └── job-orders/
│   │       ├── route.ts              # GET /api/job-orders (목록)
│   │       └── [id]/
│   │           └── route.ts          # GET /api/job-orders/:id (상세)
│   └── test-report/
│       ├── page.tsx                  # 메인 페이지
│       ├── components/
│       │   └── JobOrderReportView.tsx # 리포트 컴포넌트
│       └── README.md                 # 이 파일
└── types/
    └── job-order.ts                  # TypeScript 타입 정의
```

## 🔌 API 명세

### 1. 제작 의뢰서 목록 조회

```http
GET /api/job-orders
```

**응답 예시:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "documentNumber": "202510-BIZ-00431_00",
      "orderNumber": "8360443",
      "clientName": "BIZ",
      "orderDate": "2025-10-02",
      "productName": "2단접지카드"
    }
  ],
  "total": 3
}
```

### 2. 제작 의뢰서 상세 조회

```http
GET /api/job-orders/:id
```

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "documentNumber": "202510-BIZ-00431_00",
    "orderDate": "2025-10-02",
    "clientName": "BIZ",
    "orderNumber": "8360443",
    "ordererName": "최정희",
    "deliveryDate": "2025-10-15",
    "deliveryMethod": "택배",
    "itemCount": "1 / 1",
    "recipientName": "최정희",
    "deliveryMemo": "부재시 집앞에 놔주세요.",
    "productName": "2단접지카드",
    "companyProductName": "2단 엽서카드-접이식 엽서카드",
    "productSize": "150x100mm [15.2 X 20.2]",
    "productionNumber": "30153892",
    "productionQuantity": "10 매",
    "note": "",
    "options": {
      "option1": "랑데뷰 240g",
      "option2": "흰색 무지봉투(165x115mm)",
      "option3": "-",
      "option4": "50",
      "option5": "-",
      "option6": "-",
      "option7": "-"
    },
    "printDate": "2025년 10월 12일 오후 11:16:38",
    "printedBy": "어드민(admin)"
  }
}
```

### 3. 제작 의뢰서 생성 (테스트용)

```http
POST /api/job-orders/:id
Content-Type: application/json

{
  "documentNumber": "202510-TEST-00001_00",
  "orderNumber": "8360001",
  ...
}
```

## 🚀 사용 방법

### 1. 개발 서버 실행

```bash
npm run dev
```

### 2. 페이지 접속

#### 테스트 리포트 페이지
```
http://localhost:3000/test-report
```

#### API 문서 (Swagger UI)
```
http://localhost:3000/api-docs
```

#### API 문서 (Scalar - 현대적 디자인)
```
http://localhost:3000/api-docs-scalar
```

#### API 스펙 (JSON)
```
http://localhost:3000/api/swagger
```

### 3. 기능 테스트

1. **목록 선택**: 드롭다운에서 제작 의뢰서 선택
2. **데이터 로딩**: 선택한 의뢰서의 상세 정보가 자동으로 로딩됨
3. **리포트 확인**: 화면에 실제 제작 의뢰서 형태로 표시
4. **PDF 다운로드**: "PDF 다운로드" 버튼 클릭

## 📊 API 문서 도구 비교

두 가지 API 문서 도구를 제공합니다:

| 기능 | Swagger UI | Scalar API Reference |
|------|------------|---------------------|
| **디자인** | 전통적 | 현대적, 세련됨 |
| **React 19 호환** | 경고 있음 (필터링 처리) | 완벽 호환 |
| **인기도** | ⭐⭐⭐⭐⭐ (업계 표준) | ⭐⭐⭐⭐ (신규) |
| **API 테스트** | ✅ Try it out | ✅ 인터랙티브 테스트 |
| **코드 예시** | ✅ cURL만 | ✅ 다양한 언어 |
| **다크 모드** | ❌ | ✅ |
| **검색** | ✅ | ✅ 향상됨 |
| **URL** | `/api-docs` | `/api-docs-scalar` |

**권장:** 두 가지 모두 사용 가능하며, 취향에 따라 선택하세요!

## 🧪 API 테스트

### Swagger UI로 테스트

1. 브라우저에서 `http://localhost:3000/api-docs` 접속
2. API 엔드포인트 선택
3. "Try it out" 클릭
4. 파라미터 입력
5. "Execute" 클릭
6. 응답 확인

### curl로 테스트

```bash
# 목록 조회
curl http://localhost:3000/api/job-orders

# 상세 조회
curl http://localhost:3000/api/job-orders/1

# 새 데이터 추가 (POST)
curl -X POST http://localhost:3000/api/job-orders/1 \
  -H "Content-Type: application/json" \
  -d '{
    "documentNumber": "202510-TEST-00001_00",
    "orderNumber": "8360001",
    "clientName": "테스트 고객",
    ...
  }'
```

### Postman/Insomnia로 테스트

**OpenAPI 스펙 가져오기:**
1. Import → URL
2. `http://localhost:3000/api/swagger` 입력
3. 자동으로 모든 엔드포인트 생성됨

**수동으로 테스트:**
1. 새 요청 생성
2. Method: GET
3. URL: `http://localhost:3000/api/job-orders/1`
4. Send 클릭

## 📦 Mock 데이터

현재 3개의 샘플 데이터가 포함되어 있습니다:

- **ID 1**: BIZ - 2단접지카드
- **ID 2**: 쉬잇크루 - 명함
- **ID 3**: 주식회사 테크노 - 포스터

Mock 데이터는 `src/app/api/job-orders/[id]/route.ts`에서 수정할 수 있습니다.

## 🔧 커스터마이징

### 새 제작 의뢰서 추가

`src/app/api/job-orders/[id]/route.ts` 파일의 `mockDatabase` 객체에 추가:

```typescript
const mockDatabase: Record<string, JobOrderData> = {
  "1": { /* 기존 데이터 */ },
  "2": { /* 기존 데이터 */ },
  "4": {
    documentNumber: "202510-NEW-00001_00",
    orderNumber: "8361111",
    // ... 나머지 필드
  },
};
```

### 리포트 레이아웃 수정

`src/app/test-report/components/JobOrderReportView.tsx` 파일을 수정하여 레이아웃을 변경할 수 있습니다.

## 🎨 주요 기능

### 1. 동적 바코드/QR코드 생성

- **QR코드**: 문서번호를 QR코드로 자동 생성 (react-qr-code)
- **1D 바코드**: 주문번호를 CODE128 바코드로 생성 (react-barcode)

### 2. PDF 생성

- **A4 크기**: 210mm x 297mm
- **고해상도**: scale=2로 선명한 출력
- **다중 페이지**: 긴 콘텐츠 자동 페이지 분할

### 3. API 통합

- **RESTful API**: 표준 HTTP 메서드 사용
- **타입 안전성**: TypeScript 타입 정의
- **에러 처리**: 네트워크 오류 및 404 처리

## 🔍 트러블슈팅

### API 호출 실패

```
Error: Failed to fetch
```

**해결**: 개발 서버가 실행 중인지 확인하세요.

```bash
npm run dev
```

### PDF 생성 실패

```
Error: Attempting to parse an unsupported color function 'oklch'
```

**해결**: `JobOrderReportView.tsx`에서 모든 스타일이 인라인 스타일로 작성되었는지 확인하세요. Tailwind 클래스는 사용하지 마세요.

### 바코드/QR코드가 보이지 않음

**해결**: `react-barcode`와 `react-qr-code` 라이브러리가 설치되었는지 확인:

```bash
npm install react-barcode react-qr-code
```

## 📚 참고 자료

- [Next.js App Router - Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc)
- [html2canvas](https://html2canvas.hertzen.com/)
- [jsPDF](https://github.com/parallax/jsPDF)
- [react-qr-code](https://www.npmjs.com/package/react-qr-code)
- [react-barcode](https://www.npmjs.com/package/react-barcode)

## 🚧 향후 개선 사항

- [ ] 실제 데이터베이스 연동 (PostgreSQL/MongoDB)
- [ ] 인증/권한 추가
- [ ] 이미지 업로드 기능
- [ ] 제작 의뢰서 생성/수정/삭제 UI
- [ ] 다국어 지원 (i18n)
- [ ] PDF 템플릿 커스터마이징
- [ ] 이메일 발송 기능
