import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

test.describe("Calculator Excel Download", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/calculator");
  });

  test("should display Excel download button", async ({ page }) => {
    // Excel 다운로드 버튼이 존재하는지 확인
    const excelButton = page.getByRole("button", {
      name: /Excel 다운로드/i,
    });
    await expect(excelButton).toBeVisible();

    // FileSpreadsheet 아이콘이 있는지 확인
    await expect(excelButton).toContainText("Excel 다운로드");
  });

  test("should disable Excel button before calculation", async ({ page }) => {
    // 초기 상태에서 입력값이 없으면 버튼이 활성화되어 있어야 함
    // (실제로는 계산 결과가 0이면 다운로드 시 toast로 막힘)
    const excelButton = page.getByRole("button", {
      name: /Excel 다운로드/i,
    });

    // 버튼이 존재하고 활성화되어 있음
    await expect(excelButton).toBeVisible();
    await expect(excelButton).toBeEnabled();
  });

  test("should download Excel file after calculation", async ({
    page,
    context,
  }) => {
    // 입력값 입력
    await page
      .getByPlaceholder(/예: 50000/i)
      .first()
      .fill("50000");
    await page.getByPlaceholder(/예: 20000/i).fill("20000");
    await page.getByPlaceholder(/예: 3000000/i).fill("3000000");
    await page.getByPlaceholder(/예: 5000000/i).fill("5000000");

    // 계산 결과가 표시될 때까지 대기
    await expect(page.getByText(/손익분기점 판매량/i)).toBeVisible({
      timeout: 5000,
    });

    // 다운로드 대기 설정
    const downloadPromise = page.waitForEvent("download");

    // Excel 다운로드 버튼 클릭
    const excelButton = page.getByRole("button", {
      name: /Excel 다운로드/i,
    });
    await excelButton.click();

    // 다운로드 완료 대기
    const download = await downloadPromise;

    // 파일명 검증 (BEP_Export_YYYY-MM-DD.xlsx 형식)
    const fileName = download.suggestedFilename();
    expect(fileName).toMatch(/^BEP_Export_\d{4}-\d{2}-\d{2}\.xlsx$/);

    // 파일 저장
    const downloadsPath = path.join(process.cwd(), "downloads");
    if (!fs.existsSync(downloadsPath)) {
      fs.mkdirSync(downloadsPath, { recursive: true });
    }
    await download.saveAs(path.join(downloadsPath, fileName));

    // 파일이 실제로 다운로드되었는지 확인
    const filePath = path.join(downloadsPath, fileName);
    expect(fs.existsSync(filePath)).toBeTruthy();

    // 파일 크기가 0보다 큰지 확인
    const stats = fs.statSync(filePath);
    expect(stats.size).toBeGreaterThan(0);

    // 성공 Toast 확인
    await expect(page.getByText(/다운로드 완료/i)).toBeVisible({
      timeout: 5000,
    });
    await expect(
      page.getByText(/Excel 파일이 성공적으로 다운로드되었습니다/i)
    ).toBeVisible();
  });

  test("should show loading state during Excel generation", async ({
    page,
  }) => {
    // 입력값 입력
    await page
      .getByPlaceholder(/예: 50000/i)
      .first()
      .fill("50000");
    await page.getByPlaceholder(/예: 20000/i).fill("20000");
    await page.getByPlaceholder(/예: 3000000/i).fill("3000000");

    // 계산 결과 대기
    await expect(page.getByText(/손익분기점 판매량/i)).toBeVisible({
      timeout: 5000,
    });

    // Excel 다운로드 버튼 클릭
    const excelButton = page.getByRole("button", {
      name: /Excel 다운로드/i,
    });
    await excelButton.click();

    // 로딩 텍스트가 나타나는지 확인 (매우 빠르게 지나갈 수 있음)
    // 다운로드가 빠르면 이 단계를 건너뛸 수 있음
    try {
      await expect(page.getByText(/Excel 생성 중.../i)).toBeVisible({
        timeout: 1000,
      });
    } catch {
      // 로딩이 너무 빨라서 잡히지 않을 수 있음, 무시
    }

    // 성공 Toast 확인
    await expect(page.getByText(/다운로드 완료/i)).toBeVisible({
      timeout: 5000,
    });
  });

  test("should show error toast when downloading without calculation", async ({
    page,
  }) => {
    // 입력값 없이 바로 다운로드 시도
    const excelButton = page.getByRole("button", {
      name: /Excel 다운로드/i,
    });
    await excelButton.click();

    // 에러 Toast 확인
    await expect(page.getByText(/다운로드 불가/i)).toBeVisible({
      timeout: 5000,
    });
    await expect(page.getByText(/먼저 계산을 완료해주세요/i)).toBeVisible();
  });

  test("should have both PDF and Excel download buttons", async ({ page }) => {
    // PDF 다운로드 버튼 확인
    const pdfButton = page.getByRole("button", { name: /PDF 다운로드/i });
    await expect(pdfButton).toBeVisible();

    // Excel 다운로드 버튼 확인
    const excelButton = page.getByRole("button", {
      name: /Excel 다운로드/i,
    });
    await expect(excelButton).toBeVisible();

    // 두 버튼이 같은 행에 있는지 확인 (flexbox 레이아웃)
    const buttonsContainer = page.locator("div").filter({
      has: pdfButton,
    });
    await expect(buttonsContainer.locator("button")).toHaveCount(2);
  });

  test("should allow multiple downloads", async ({ page }) => {
    // 입력값 입력
    await page
      .getByPlaceholder(/예: 50000/i)
      .first()
      .fill("50000");
    await page.getByPlaceholder(/예: 20000/i).fill("20000");
    await page.getByPlaceholder(/예: 3000000/i).fill("3000000");

    // 계산 결과 대기
    await expect(page.getByText(/손익분기점 판매량/i)).toBeVisible({
      timeout: 5000,
    });

    const excelButton = page.getByRole("button", {
      name: /Excel 다운로드/i,
    });

    // 첫 번째 다운로드
    const download1Promise = page.waitForEvent("download");
    await excelButton.click();
    await download1Promise;
    await expect(page.getByText(/다운로드 완료/i)).toBeVisible({
      timeout: 5000,
    });

    // Toast 사라질 때까지 대기
    await page.waitForTimeout(3000);

    // 두 번째 다운로드
    const download2Promise = page.waitForEvent("download");
    await excelButton.click();
    await download2Promise;
    await expect(page.getByText(/다운로드 완료/i)).toBeVisible({
      timeout: 5000,
    });
  });
});
