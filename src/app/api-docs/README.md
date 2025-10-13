# API 문서 (Swagger UI)

## 📖 개요

이 페이지는 제작 의뢰서 API의 **Swagger/OpenAPI 3.0** 문서입니다.

## 🌐 접속 방법

브라우저에서 다음 URL 접속:
```
http://localhost:3002/api-docs
```

## ✨ 주요 기능

### 1. 인터랙티브 API 문서
- 모든 엔드포인트 목록 확인
- 요청/응답 스키마 확인
- 실제 예시 데이터 제공

### 2. API 테스트
- "Try it out" 버튼으로 바로 테스트
- 파라미터 입력 UI 제공
- 실시간 응답 확인

### 3. 스키마 문서
- TypeScript 타입과 동일한 스키마
- 필수 필드 표시
- 예시 값 제공

## 🎯 사용 방법

### API 테스트하기

1. **엔드포인트 선택**
   - `/api/job-orders` (목록) 또는 `/api/job-orders/{id}` (상세) 선택

2. **Try it out 클릭**
   - 우측 상단의 "Try it out" 버튼 클릭

3. **파라미터 입력**
   - GET `/api/job-orders/{id}`: id 파라미터 입력 (예: `1`, `2`, `3`)
   - POST `/api/job-orders/{id}`: Request body JSON 입력

4. **Execute 실행**
   - "Execute" 버튼 클릭

5. **응답 확인**
   - Response body에서 JSON 응답 확인
   - Response headers 확인

### OpenAPI 스펙 다운로드

Swagger UI 우측 상단의 링크를 통해 OpenAPI JSON 다운로드:
```
http://localhost:3002/api/swagger
```

## 📋 API 엔드포인트

### GET /api/job-orders
제작 의뢰서 목록 조회

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

### GET /api/job-orders/{id}
제작 의뢰서 상세 조회

**파라미터:**
- `id` (path): 제작 의뢰서 ID (예: `1`, `2`, `3`)

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "documentNumber": "202510-BIZ-00431_00",
    "orderNumber": "8360443",
    "clientName": "BIZ",
    ...
  }
}
```

### POST /api/job-orders/{id}
제작 의뢰서 생성 (테스트용)

**Request Body:**
```json
{
  "documentNumber": "202510-TEST-00001_00",
  "orderNumber": "8360001",
  "orderDate": "2025-10-10",
  "clientName": "테스트 고객",
  ...
}
```

## 🔧 Postman/Insomnia 연동

### OpenAPI 스펙 가져오기

**Postman:**
1. Import 클릭
2. "Link" 탭 선택
3. URL 입력: `http://localhost:3002/api/swagger`
4. Continue → Import

**Insomnia:**
1. Create → Import from URL
2. URL 입력: `http://localhost:3002/api/swagger`
3. Scan

### 자동 생성된 컬렉션 사용

모든 API 엔드포인트가 자동으로 컬렉션에 추가되며, 스키마와 예시도 함께 제공됩니다.

## 📝 스키마 정의

모든 스키마는 TypeScript 타입과 동일합니다:

```typescript
// src/types/job-order.ts
interface JobOrderData {
  documentNumber: string;
  orderNumber: string;
  orderDate: string;
  clientName: string;
  ordererName: string;
  // ...
}
```

## 🚀 개발 가이드

### Swagger 스펙 수정

`src/lib/swagger.ts` 파일을 수정하여 API 문서를 업데이트할 수 있습니다:

```typescript
// 새 엔드포인트 추가
paths: {
  "/api/new-endpoint": {
    get: {
      tags: ["new-tag"],
      summary: "새 엔드포인트",
      // ...
    },
  },
},
```

### 스키마 추가

```typescript
components: {
  schemas: {
    NewSchema: {
      type: "object",
      properties: {
        field1: { type: "string" },
        field2: { type: "number" },
      },
    },
  },
},
```

### 자동 리로드

파일을 수정하면 Next.js가 자동으로 재컴파일하며, 브라우저를 새로고침하면 업데이트된 문서를 볼 수 있습니다.

## 🔍 트러블슈팅

### Swagger UI가 로딩되지 않음

**원인:** API 스펙 JSON 생성 실패

**해결:**
1. 콘솔에서 에러 확인
2. `http://localhost:3002/api/swagger` 직접 접속하여 JSON 확인
3. `src/lib/swagger.ts`의 문법 오류 확인

### "Failed to fetch API specification"

**원인:** API 엔드포인트 연결 실패

**해결:**
1. 개발 서버가 실행 중인지 확인: `npm run dev`
2. 포트 번호 확인 (3000, 3001, 3002 중 하나)
3. 브라우저 콘솔에서 네트워크 탭 확인

### CORS 오류

**원인:** 외부 도메인에서 접근 시도

**해결:**
현재는 localhost만 지원합니다. 프로덕션 배포 시 CORS 설정 추가 필요.

## 📚 참고 자료

- [OpenAPI 3.0 Specification](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/docs/open-source-tools/swagger-ui/usage/installation/)
- [swagger-jsdoc GitHub](https://github.com/Surnet/swagger-jsdoc)
- [OpenAPI Best Practices](https://swagger.io/resources/articles/best-practices-in-api-documentation/)
