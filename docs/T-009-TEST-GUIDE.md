# T-009 Excel 다운로드 기능 테스트 가이드

## 📋 개요

ZAQN 프로젝트의 T-009 작업인 "엑셀 다운로드 기능"을 테스트하기 위한 종합 가이드입니다.

---

## 1️⃣ 수동 브라우저 테스트

### 🚀 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000/calculator` 접속

### ✅ 테스트 체크리스트

#### 1. UI 렌더링 확인
- [ ] "Excel 다운로드" 버튼이 표시됨
- [ ] FileSpreadsheet 아이콘이 표시됨
- [ ] PDF 다운로드 버튼과 함께 나란히 배치됨
- [ ] 모바일 반응형 레이아웃 동작 확인

#### 2. 기본 다운로드 기능
**입력값:**
- 판매가: `50000`
- 단위 원가: `20000`
- 월 고정비: `3000000`
- 목표 수익: `5000000`

**실행:**
1. 입력값 입력
2. 계산 결과 확인 (손익분기점: 100개)
3. "Excel 다운로드" 버튼 클릭
4. 파일 다운로드 확인

**검증:**
- [ ] 파일명: `BEP_Export_2025-10-14.xlsx` (날짜는 오늘 날짜)
- [ ] 다운로드 완료 Toast 알림 표시
- [ ] 로딩 인디케이터 표시 (빠르면 안 보일 수 있음)

#### 3. Excel 파일 내용 검증

**MS Excel에서 열기:**
- [ ] 파일이 정상적으로 열림
- [ ] 4개 시트 존재 (Inputs, Results, Sensitivity, Readme)
- [ ] 워터마크 확인: 각 데이터 시트 A1 셀에 "WATERMARK: SHEATCREW FREE"
- [ ] 한글 인코딩 정상 표시

**Google Sheets에서 열기:**
- [ ] Google Drive에 업로드 후 열기
- [ ] 4개 시트 정상 표시
- [ ] 데이터 정확성 확인

#### 4. Inputs 시트 검증
- [ ] 헤더: "필드", "값"
- [ ] 판매가: 50000
- [ ] 단위 원가: 20000
- [ ] 월 고정비: 3000000
- [ ] 목표 수익: 5000000

#### 5. Results 시트 검증
- [ ] 헤더: "지표", "값"
- [ ] 손익분기점 판매량: 100
- [ ] 손익분기점 매출액: 5000000
- [ ] 공헌이익률 (%): 60.00
- [ ] 목표 수익 달성 판매량: 267

#### 6. Sensitivity 시트 검증
- [ ] 헤더: "판매가", "단위 원가", "손익분기점", "수익"
- [ ] 데이터 행 개수: 20개
- [ ] 가격 변동 데이터: 10행 (40000 ~ 60000)
- [ ] 원가 변동 데이터: 10행 (16000 ~ 24000)
- [ ] 모든 숫자 데이터 정상 표시

#### 7. Readme 시트 검증
- [ ] 제목: "쉬잇크루 BEP 계산기"
- [ ] 설명 텍스트 정상 표시
- [ ] 무료 버전 안내 표시
- [ ] 생성일 표시
- [ ] URL 표시

#### 8. 에러 처리 테스트
**테스트 1: 계산 전 다운로드**
- [ ] 입력값 없이 "Excel 다운로드" 클릭
- [ ] "다운로드 불가" Toast 표시
- [ ] "먼저 계산을 완료해주세요" 메시지 표시

**테스트 2: 부분 입력**
- [ ] 판매가만 입력 후 다운로드
- [ ] BEP가 0이면 다운로드 불가

#### 9. 여러 번 다운로드
- [ ] 같은 계산 결과로 2회 이상 다운로드
- [ ] 매번 새로운 파일명으로 다운로드됨
- [ ] 파일 내용 일관성 확인

#### 10. 다양한 입력값 테스트
**테스트 케이스 1: 작은 숫자**
- 판매가: 1000, 원가: 500, 고정비: 10000

**테스트 케이스 2: 큰 숫자**
- 판매가: 5000000, 원가: 2000000, 고정비: 300000000

**테스트 케이스 3: 목표 수익 없음**
- 판매가: 50000, 원가: 20000, 고정비: 3000000
- 목표 수익: (빈 값)

---

## 2️⃣ 단위 테스트 (Vitest)

### 실행 방법

```bash
# 단위 테스트 실행
npm run test

# Watch 모드
npm run test:watch

# UI 모드
npm run test:ui

# 커버리지 확인
npm run test:coverage
```

### 테스트 파일
- `src/lib/__tests__/excel-generator.test.ts`

### 테스트 커버리지
- ✅ `generateSensitivityData()` 함수
- ✅ 20개 데이터 포인트 생성
- ✅ 가격 변동 ±20% 검증
- ✅ 원가 변동 ±20% 검증
- ✅ BEP 계산 정확성
- ✅ Profit 계산 정확성
- ✅ Edge cases 처리

### 예상 결과
```
✓ src/lib/__tests__/excel-generator.test.ts (32)
  ✓ generateSensitivityData (32)
    ✓ 기본 동작 (3)
    ✓ 가격 변동 범위 검증 (3)
    ✓ 원가 변동 범위 검증 (3)
    ✓ BEP 계산 정확성 (2)
    ✓ Profit 계산 정확성 (3)
    ✓ Edge Cases (5)
    ✓ 데이터 일관성 (2)

Test Files  1 passed (1)
     Tests  32 passed (32)
```

---

## 3️⃣ E2E 테스트 (Playwright)

### 실행 방법

```bash
# E2E 테스트 실행
npm run test:e2e

# UI 모드 (디버깅)
npm run test:e2e:watch

# Headed 모드 (브라우저 표시)
npm run test:e2e:headed
```

### 테스트 파일
- `e2e/calculator-excel.spec.ts`

### 테스트 시나리오
1. ✅ Excel 다운로드 버튼 표시
2. ✅ 계산 전 버튼 상태
3. ✅ 계산 후 Excel 다운로드
4. ✅ 파일명 검증
5. ✅ 파일 크기 검증
6. ✅ 로딩 상태 표시
7. ✅ Toast 알림
8. ✅ 에러 처리
9. ✅ PDF/Excel 버튼 배치
10. ✅ 여러 번 다운로드

### 예상 결과
```
Running 8 tests using 1 worker

  ✓ [chromium] › calculator-excel.spec.ts:7:3 › should display Excel download button (1.2s)
  ✓ [chromium] › calculator-excel.spec.ts:18:3 › should disable Excel button before calculation (0.8s)
  ✓ [chromium] › calculator-excel.spec.ts:31:3 › should download Excel file after calculation (3.5s)
  ✓ [chromium] › calculator-excel.spec.ts:89:3 › should show loading state during Excel generation (2.1s)
  ✓ [chromium] › calculator-excel.spec.ts:114:3 › should show error toast when downloading without calculation (1.5s)
  ✓ [chromium] › calculator-excel.spec.ts:127:3 › should have both PDF and Excel download buttons (0.9s)
  ✓ [chromium] › calculator-excel.spec.ts:145:3 › should allow multiple downloads (4.2s)

  8 passed (14.2s)
```

---

## 4️⃣ 통합 테스트

### 전체 테스트 실행

```bash
# 모든 테스트 실행
npm run test:all
```

### 순차 실행

```bash
# 1. 타입 체크
npm run typecheck

# 2. 단위 테스트
npm run test

# 3. E2E 테스트
npm run test:e2e
```

---

## 📊 테스트 결과 정리

### ✅ Pass Criteria
- [ ] 모든 단위 테스트 통과 (32개)
- [ ] 모든 E2E 테스트 통과 (8개)
- [ ] 수동 테스트 체크리스트 완료 (30개 항목)
- [ ] TypeScript 타입 에러 없음
- [ ] MS Excel 호환성 확인
- [ ] Google Sheets 호환성 확인

### ⚠️ Known Issues
- 로딩 인디케이터가 너무 빠르면 E2E 테스트에서 감지 안 될 수 있음
- 다운로드 파일은 `downloads/` 폴더에 저장됨 (E2E 테스트)
- 민감도 데이터는 가격/원가 변동에 따라 일부 필터링될 수 있음

---

## 🐛 문제 해결

### Issue 1: Excel 파일이 열리지 않음
**원인:** 파일이 손상되었거나 xlsx 라이브러리 버전 문제
**해결:**
```bash
npm install xlsx@latest
```

### Issue 2: 민감도 데이터가 20개 미만
**원인:** 공헌이익이 0 이하인 데이터 포인트가 필터링됨
**해결:** 정상 동작입니다. 가격이 원가보다 낮은 경우 제외됩니다.

### Issue 3: 한글이 깨짐
**원인:** 파일 인코딩 문제
**해결:** UTF-8 BOM으로 저장됨. Excel에서는 정상 표시됩니다.

### Issue 4: E2E 테스트가 실패함
**원인:** 개발 서버가 실행 중이 아님
**해결:**
```bash
# 터미널 1: 개발 서버
npm run dev

# 터미널 2: E2E 테스트
npm run test:e2e
```

---

## 📚 참고 자료

- [T-009 작업 상세 사항](./.vooster/tasks/T-009.txt)
- [SheetJS Documentation](https://docs.sheetjs.com/)
- [Playwright Documentation](https://playwright.dev/)
- [Vitest Documentation](https://vitest.dev/)

---

## ✨ 다음 단계

1. 모든 테스트 통과 확인
2. 프로덕션 빌드 테스트
3. 성능 측정 (10k 행 민감도 데이터)
4. 다양한 브라우저 호환성 테스트
5. T-010 엑셀 Import 기능 개발 준비

---

**작성일:** 2025-10-14
**작성자:** Claude Code
**버전:** 1.0
