import { describe, it, expect } from "vitest";
import { generateSensitivityData } from "../excel-generator";

describe("generateSensitivityData", () => {
  const basePrice = 50000;
  const baseUnitCost = 20000;
  const fixedCost = 3000000;
  const targetProfit = 5000000;

  describe("기본 동작", () => {
    it("should generate 20 sensitivity data points", () => {
      const result = generateSensitivityData(
        basePrice,
        baseUnitCost,
        fixedCost
      );

      // 가격 변동 10개 + 원가 변동 10개 = 20개
      expect(result).toHaveLength(20);
    });

    it("should generate data points with correct structure", () => {
      const result = generateSensitivityData(
        basePrice,
        baseUnitCost,
        fixedCost
      );

      result.forEach((point) => {
        expect(point).toHaveProperty("price");
        expect(point).toHaveProperty("unitCost");
        expect(point).toHaveProperty("bep");
        expect(point).toHaveProperty("profit");

        expect(typeof point.price).toBe("number");
        expect(typeof point.unitCost).toBe("number");
        expect(typeof point.bep).toBe("number");
        expect(typeof point.profit).toBe("number");
      });
    });

    it("should include target profit in calculations when provided", () => {
      const resultWithTarget = generateSensitivityData(
        basePrice,
        baseUnitCost,
        fixedCost,
        targetProfit
      );

      const resultWithoutTarget = generateSensitivityData(
        basePrice,
        baseUnitCost,
        fixedCost
      );

      // 목표 수익이 있을 때와 없을 때 profit 값이 달라야 함
      expect(resultWithTarget[0].profit).not.toBe(
        resultWithoutTarget[0].profit
      );
    });
  });

  describe("가격 변동 범위 검증", () => {
    it("should vary price within ±20% range", () => {
      const result = generateSensitivityData(
        basePrice,
        baseUnitCost,
        fixedCost
      );

      // 첫 10개는 가격 변동 (원가는 baseUnitCost 고정)
      const priceVariations = result.filter(
        (point) => point.unitCost === baseUnitCost
      );

      expect(priceVariations.length).toBe(10);

      const minExpectedPrice = basePrice * 0.8; // -20%
      const maxExpectedPrice = basePrice * 1.2; // +20%

      priceVariations.forEach((point) => {
        expect(point.price).toBeGreaterThanOrEqual(
          Math.floor(minExpectedPrice)
        );
        expect(point.price).toBeLessThanOrEqual(Math.ceil(maxExpectedPrice));
      });
    });

    it("should include lowest price variation (-20%)", () => {
      const result = generateSensitivityData(
        basePrice,
        baseUnitCost,
        fixedCost
      );

      const priceVariations = result.filter(
        (point) => point.unitCost === baseUnitCost
      );
      const prices = priceVariations.map((p) => p.price);
      const minPrice = Math.min(...prices);

      const expectedMinPrice = Math.round(basePrice * 0.8);
      expect(minPrice).toBe(expectedMinPrice);
    });

    it("should include highest price variation (+20%)", () => {
      const result = generateSensitivityData(
        basePrice,
        baseUnitCost,
        fixedCost
      );

      const priceVariations = result.filter(
        (point) => point.unitCost === baseUnitCost
      );
      const prices = priceVariations.map((p) => p.price);
      const maxPrice = Math.max(...prices);

      const expectedMaxPrice = Math.round(basePrice * 1.2);
      expect(maxPrice).toBe(expectedMaxPrice);
    });
  });

  describe("원가 변동 범위 검증", () => {
    it("should vary unit cost within ±20% range", () => {
      const result = generateSensitivityData(
        basePrice,
        baseUnitCost,
        fixedCost
      );

      // 나머지 10개는 원가 변동 (가격은 basePrice 고정)
      const costVariations = result.filter((point) => point.price === basePrice);

      expect(costVariations.length).toBe(10);

      const minExpectedCost = baseUnitCost * 0.8; // -20%
      const maxExpectedCost = baseUnitCost * 1.2; // +20%

      costVariations.forEach((point) => {
        expect(point.unitCost).toBeGreaterThanOrEqual(
          Math.floor(minExpectedCost)
        );
        expect(point.unitCost).toBeLessThanOrEqual(Math.ceil(maxExpectedCost));
      });
    });

    it("should include lowest cost variation (-20%)", () => {
      const result = generateSensitivityData(
        basePrice,
        baseUnitCost,
        fixedCost
      );

      const costVariations = result.filter((point) => point.price === basePrice);
      const costs = costVariations.map((p) => p.unitCost);
      const minCost = Math.min(...costs);

      const expectedMinCost = Math.round(baseUnitCost * 0.8);
      expect(minCost).toBe(expectedMinCost);
    });

    it("should include highest cost variation (+20%)", () => {
      const result = generateSensitivityData(
        basePrice,
        baseUnitCost,
        fixedCost
      );

      const costVariations = result.filter((point) => point.price === basePrice);
      const costs = costVariations.map((p) => p.unitCost);
      const maxCost = Math.max(...costs);

      const expectedMaxCost = Math.round(baseUnitCost * 1.2);
      expect(maxCost).toBe(expectedMaxCost);
    });
  });

  describe("BEP 계산 정확성", () => {
    it("should calculate BEP correctly for each data point", () => {
      const result = generateSensitivityData(
        basePrice,
        baseUnitCost,
        fixedCost
      );

      result.forEach((point) => {
        const contributionMargin = point.price - point.unitCost;
        const expectedBep = Math.ceil(fixedCost / contributionMargin);

        expect(point.bep).toBe(expectedBep);
      });
    });

    it("should handle edge case when contribution margin is very small", () => {
      // 가격과 원가가 매우 비슷한 경우
      const result = generateSensitivityData(21000, 20000, fixedCost);

      result.forEach((point) => {
        expect(point.bep).toBeGreaterThan(0);
        expect(Number.isFinite(point.bep)).toBe(true);
      });
    });
  });

  describe("Profit 계산 정확성", () => {
    it("should calculate profit correctly without target profit", () => {
      const result = generateSensitivityData(
        basePrice,
        baseUnitCost,
        fixedCost
      );

      result.forEach((point) => {
        const contributionMargin = point.price - point.unitCost;
        const targetQty = point.bep; // 목표 수익 없으면 BEP 수량 기준

        const expectedProfit =
          point.price * targetQty - point.unitCost * targetQty - fixedCost;

        expect(point.profit).toBe(expectedProfit);
      });
    });

    it("should calculate profit correctly with target profit", () => {
      const result = generateSensitivityData(
        basePrice,
        baseUnitCost,
        fixedCost,
        targetProfit
      );

      result.forEach((point) => {
        const contributionMargin = point.price - point.unitCost;
        const targetQty = Math.ceil(
          (fixedCost + targetProfit) / contributionMargin
        );

        const expectedProfit =
          point.price * targetQty - point.unitCost * targetQty - fixedCost;

        expect(point.profit).toBe(expectedProfit);
      });
    });

    it("should have higher profit with target profit parameter", () => {
      const resultWithTarget = generateSensitivityData(
        basePrice,
        baseUnitCost,
        fixedCost,
        targetProfit
      );

      const resultWithoutTarget = generateSensitivityData(
        basePrice,
        baseUnitCost,
        fixedCost
      );

      // 같은 인덱스의 데이터 포인트 비교
      for (let i = 0; i < 10; i++) {
        expect(resultWithTarget[i].profit).toBeGreaterThan(
          resultWithoutTarget[i].profit
        );
      }
    });
  });

  describe("Edge Cases", () => {
    it("should handle zero target profit", () => {
      const result = generateSensitivityData(basePrice, baseUnitCost, fixedCost, 0);

      expect(result).toHaveLength(20);
      result.forEach((point) => {
        expect(point.bep).toBeGreaterThan(0);
        expect(Number.isFinite(point.profit)).toBe(true);
      });
    });

    it("should handle very large numbers", () => {
      const result = generateSensitivityData(
        5000000,
        2000000,
        300000000,
        500000000
      );

      expect(result).toHaveLength(20);
      result.forEach((point) => {
        expect(Number.isFinite(point.bep)).toBe(true);
        expect(Number.isFinite(point.profit)).toBe(true);
      });
    });

    it("should handle small numbers", () => {
      const result = generateSensitivityData(100, 50, 1000);

      expect(result).toHaveLength(20);
      result.forEach((point) => {
        expect(point.bep).toBeGreaterThan(0);
        expect(Number.isFinite(point.profit)).toBe(true);
      });
    });

    it("should filter out invalid data points when contribution margin is negative or zero", () => {
      // 원가가 가격보다 높은 경우
      const result = generateSensitivityData(10000, 15000, fixedCost);

      // 일부 데이터 포인트가 필터링되어 20개보다 적을 수 있음
      expect(result.length).toBeLessThanOrEqual(20);

      // 모든 데이터 포인트는 유효한 공헌이익을 가져야 함
      result.forEach((point) => {
        const contributionMargin = point.price - point.unitCost;
        expect(contributionMargin).toBeGreaterThan(0);
      });
    });
  });

  describe("데이터 일관성", () => {
    it("should maintain consistent data structure across multiple calls", () => {
      const result1 = generateSensitivityData(
        basePrice,
        baseUnitCost,
        fixedCost
      );
      const result2 = generateSensitivityData(
        basePrice,
        baseUnitCost,
        fixedCost
      );

      expect(result1).toEqual(result2);
    });

    it("should generate different results for different inputs", () => {
      const result1 = generateSensitivityData(
        basePrice,
        baseUnitCost,
        fixedCost
      );
      const result2 = generateSensitivityData(
        basePrice * 2,
        baseUnitCost,
        fixedCost
      );

      expect(result1).not.toEqual(result2);
    });
  });
});
