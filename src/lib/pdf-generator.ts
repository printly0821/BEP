import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { format } from "date-fns";

/**
 * HTML 요소를 PDF로 변환하여 다운로드합니다.
 *
 * @param elementId - PDF로 변환할 HTML 요소의 ID
 * @param fileName - 다운로드할 PDF 파일명 (기본값: BEP_Report_YYYY-MM-DD.pdf)
 * @returns Promise<void>
 */
export async function generatePDF(
  elementId: string,
  fileName?: string
): Promise<void> {
  try {
    const element = document.getElementById(elementId);

    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    // 현재 날짜 기반 파일명 생성
    const today = new Date();
    const defaultFileName = `BEP_Report_${format(today, "yyyy-MM-dd")}.pdf`;
    const finalFileName = fileName || defaultFileName;

    // html2canvas로 HTML을 캔버스로 변환
    // scale: 2 로 고해상도 렌더링
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: "#ffffff",
      foreignObjectRendering: false, // OKLCH 파싱 에러 방지
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      onclone: (clonedDoc) => {
        // 클론된 문서에서 모든 CSS 변수 및 외부 스타일 완전 제거
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          // 1. 모든 스타일시트 완전 제거 (oklch 포함)
          const stylesheets = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]');
          stylesheets.forEach((sheet) => {
            sheet.remove();
          });

          // 2. head의 모든 스타일 관련 요소 제거
          const head = clonedDoc.head;
          if (head) {
            const styleElements = head.querySelectorAll('style, link[rel="stylesheet"], [class*="tailwind"]');
            styleElements.forEach((el) => el.remove());
          }

          // 3. CSS 변수 모두 제거 (oklch 변수 포함)
          const rootStyle = clonedDoc.documentElement.style;
          for (let i = rootStyle.length - 1; i >= 0; i--) {
            const property = rootStyle[i];
            if (property.startsWith("--")) {
              rootStyle.removeProperty(property);
            }
          }

          // 4. 기본 스타일 강제 적용
          clonedElement.style.backgroundColor = "#ffffff";
          clonedElement.style.color = "#000000";
          clonedElement.style.fontFamily = "'Noto Sans KR', sans-serif";
          clonedElement.style.padding = "20px";

          // 5. 모든 하위 요소의 클래스 및 CSS 변수 제거 후 인라인 스타일 적용
          const allElements = clonedElement.querySelectorAll("*");
          allElements.forEach((el) => {
            const htmlEl = el as HTMLElement;

            // 클래스 제거
            if (htmlEl.className) {
              htmlEl.removeAttribute("class");
            }

            // 요소의 CSS 변수 제거
            const elStyle = htmlEl.style;
            for (let i = elStyle.length - 1; i >= 0; i--) {
              const property = elStyle[i];
              if (property.startsWith("--")) {
                elStyle.removeProperty(property);
              }
              // oklch 또는 var() 함수가 포함된 속성값 제거
              const value = elStyle.getPropertyValue(property);
              if (value.includes("oklch") || value.includes("var(")) {
                elStyle.removeProperty(property);
              }
            }

            // 기본 안전 스타일 적용
            if (!htmlEl.style.backgroundColor || htmlEl.style.backgroundColor.includes("oklch") || htmlEl.style.backgroundColor.includes("var(")) {
              htmlEl.style.backgroundColor = "transparent";
            }
            if (!htmlEl.style.color || htmlEl.style.color.includes("oklch") || htmlEl.style.color.includes("var(")) {
              htmlEl.style.color = "#000000";
            }
            if (!htmlEl.style.borderColor || htmlEl.style.borderColor.includes("oklch") || htmlEl.style.borderColor.includes("var(")) {
              htmlEl.style.borderColor = "#cccccc";
            }
          });
        }
      },
    });

    // 캔버스를 이미지로 변환
    const imgData = canvas.toDataURL("image/png");

    // PDF 생성 (A4 크기)
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // A4 크기 (210mm x 297mm)
    const pdfWidth = 210;
    const pdfHeight = 297;

    // 캔버스 비율 계산
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = imgHeight / imgWidth;

    // PDF에 맞게 이미지 크기 조정
    const finalImgWidth = pdfWidth;
    const finalImgHeight = pdfWidth * ratio;

    // 페이지 나눔 처리
    let heightLeft = finalImgHeight;
    let position = 0;

    // 첫 페이지 추가
    pdf.addImage(imgData, "PNG", 0, position, finalImgWidth, finalImgHeight);
    heightLeft -= pdfHeight;

    // 페이지가 넘어가는 경우 추가 페이지 생성
    while (heightLeft > 0) {
      position = heightLeft - finalImgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, finalImgWidth, finalImgHeight);
      heightLeft -= pdfHeight;
    }

    // PDF 다운로드
    pdf.save(finalFileName);
  } catch (error) {
    console.error("PDF 생성 중 오류 발생:", error);
    throw error;
  }
}

/**
 * 모바일 환경 감지
 */
export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * PDF 생성 전 최적화 옵션 반환
 */
export function getPDFOptions() {
  const mobile = isMobileDevice();

  return {
    scale: mobile ? 1.5 : 2, // 모바일은 1.5, 데스크톱은 2
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
  };
}
