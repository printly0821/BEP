# API 문서 (Scalar API Reference)

## 📖 개요

이 페이지는 **Scalar API Reference**를 사용한 현대적인 API 문서입니다.

Scalar은 Swagger UI의 대안으로, 더 깔끔한 디자인과 향상된 UX를 제공합니다.

## 🌐 접속 방법

브라우저에서 다음 URL 접속:
```
http://localhost:3002/api-docs-scalar
```

## ✨ 주요 기능

### 1. 현대적인 디자인
- 깔끔하고 세련된 UI
- 다크 모드 지원
- 반응형 레이아웃

### 2. 향상된 API 테스트
- 인터랙티브 테스트 UI
- 다양한 언어의 코드 예시 (JavaScript, Python, PHP, etc.)
- 실시간 응답 확인

### 3. 뛰어난 검색
- 전체 문서 검색
- 키보드 단축키 지원
- 빠른 네비게이션

### 4. React 19 완벽 호환
- 콘솔 경고 없음
- 최신 React 기능 활용
- 안정적인 성능

## 📊 Swagger UI와 비교

| 기능 | Scalar | Swagger UI |
|------|--------|------------|
| **디자인** | 🎨 현대적, 세련됨 | 📄 전통적 |
| **React 19** | ✅ 완벽 호환 | ⚠️ 경고 있음 |
| **다크 모드** | ✅ | ❌ |
| **코드 예시** | ✅ 다양한 언어 | ✅ cURL만 |
| **속도** | ⚡ 빠름 | ✅ 보통 |
| **인기도** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

## 🎯 사용 방법

### API 테스트하기

1. **엔드포인트 선택**
   - 좌측 사이드바에서 API 선택
   - 또는 검색 기능 사용 (Cmd/Ctrl + K)

2. **파라미터 입력**
   - Request 섹션에서 파라미터 입력
   - 예시 값이 자동으로 채워짐

3. **실행**
   - "Send Request" 버튼 클릭
   - 또는 Enter 키

4. **응답 확인**
   - Response 섹션에서 결과 확인
   - Status, Headers, Body 모두 표시

### 코드 예시 복사

1. 원하는 API 선택
2. "Code Examples" 탭 클릭
3. 언어 선택 (JavaScript, Python, cURL, etc.)
4. 복사 버튼 클릭

## 🚀 장점

### Swagger UI 대비 장점

1. **더 나은 UX**
   - 직관적인 네비게이션
   - 빠른 검색
   - 키보드 단축키

2. **React 19 호환**
   - 콘솔 경고 없음
   - 안정적인 동작
   - 최신 기술 스택

3. **현대적 디자인**
   - 깔끔한 인터페이스
   - 다크 모드
   - 애니메이션 효과

4. **다양한 코드 예시**
   - JavaScript (Fetch, Axios)
   - Python (Requests)
   - PHP, Ruby, Go, etc.

## ⚙️ 설정

Scalar API Reference는 `api-docs-scalar/page.tsx`에서 설정할 수 있습니다:

```typescript
module.default(container, {
  spec: {
    content: spec,
  },
  configuration: {
    theme: "default",      // 테마: default, alternate, moon, purple
    layout: "modern",      // 레이아웃: modern, classic
  },
});
```

### 테마 변경

```typescript
configuration: {
  theme: "moon",  // 다크 테마
}
```

### 레이아웃 변경

```typescript
configuration: {
  layout: "classic",  // 전통적인 3단 레이아웃
}
```

## 🔄 Swagger UI로 전환

Swagger UI 버전을 선호하시나요?

```
http://localhost:3002/api-docs
```

두 버전 모두 동일한 OpenAPI 스펙을 사용하므로 자유롭게 전환 가능합니다!

## 🔍 트러블슈팅

### Scalar이 렌더링되지 않음

**원인:** 브라우저 캐시 문제

**해결:**
1. 브라우저 강제 새로고침 (Ctrl+Shift+R)
2. 캐시 삭제
3. 개발 서버 재시작

### 스타일이 깨짐

**원인:** CSS 로드 실패

**해결:**
```typescript
import "@scalar/api-reference/style.css";
```
이 import가 있는지 확인

### API 스펙을 불러올 수 없음

**원인:** API 엔드포인트 연결 실패

**해결:**
1. `/api/swagger` 엔드포인트 확인
2. 콘솔에서 네트워크 에러 확인
3. 개발 서버 실행 상태 확인

## 📚 참고 자료

- [Scalar Documentation](https://github.com/scalar/scalar)
- [Scalar Examples](https://github.com/scalar/scalar/tree/main/examples)
- [OpenAPI Specification](https://swagger.io/specification/)

## 🎨 커스터마이징

### 브랜딩 추가

```typescript
configuration: {
  theme: "default",
  layout: "modern",
  metadata: {
    title: "내 API 문서",
    description: "설명...",
    favicon: "/favicon.ico",
  },
}
```

### 색상 커스터마이징

CSS 변수를 사용하여 색상을 변경할 수 있습니다:

```css
:root {
  --scalar-color-1: #1a202c;
  --scalar-color-2: #2d3748;
  --scalar-color-3: #4a5568;
  --scalar-background-1: #ffffff;
  --scalar-background-2: #f7fafc;
}
```

## 🌟 추천 사용 케이스

### Scalar을 선택해야 하는 경우:

- ✅ 현대적인 디자인을 선호
- ✅ React 19 프로젝트
- ✅ 다양한 언어의 코드 예시 필요
- ✅ 다크 모드 필요
- ✅ 빠른 검색 기능 중요

### Swagger UI를 선택해야 하는 경우:

- ✅ 업계 표준 도구 선호
- ✅ 팀이 이미 Swagger에 익숙함
- ✅ 레거시 브라우저 지원 필요
- ✅ 안정성 우선

## 🎯 결론

Scalar API Reference는 Swagger UI의 훌륭한 대안입니다. 특히 React 19 프로젝트에서 콘솔 경고 없이 깔끔하게 작동합니다.

두 가지 버전을 모두 사용해보고 팀에 맞는 것을 선택하세요! 🚀
