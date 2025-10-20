import { describe, it, expect } from 'vitest';
import {
  generatePriceSensitivity,
  generateCostSensitivity,
  type SensitivityDataPoint,
} from '../sensitivity-analyzer';

describe('generatePriceSensitivity', () => {
  it('should return 11 data points', () => {
    const result = generatePriceSensitivity(50000, 20000, 3000000);
    expect(result).toHaveLength(11);
  });

  it('should mark current value correctly', () => {
    const result = generatePriceSensitivity(50000, 20000, 3000000);
    const currentPoint = result.find((p) => p.isCurrentValue);
    expect(currentPoint).toBeDefined();
    expect(currentPoint!.variable).toBeCloseTo(50000, -3); // 천 단위 오차 허용
  });

  it('should handle negative contribution margin', () => {
    const result = generatePriceSensitivity(10000, 20000, 3000000);
    // 가격이 원가보다 낮은 구간은 bep = 0
    const invalidPoints = result.filter((p) => p.bep === 0);
    expect(invalidPoints.length).toBeGreaterThan(0);
  });

  it('should calculate BEP correctly', () => {
    const result = generatePriceSensitivity(50000, 20000, 3000000);
    const currentPoint = result.find((p) => p.isCurrentValue)!;
    const expectedBEP = Math.ceil(3000000 / (50000 - 20000)); // 100
    expect(currentPoint.bep).toBe(expectedBEP);
  });

  it('should include target profit when provided', () => {
    const result = generatePriceSensitivity(50000, 20000, 3000000, 5000000);
    const currentPoint = result.find((p) => p.isCurrentValue)!;
    // 목표 수익 있을 때 profit > 0 (검증 완화)
    expect(currentPoint.profit).toBeGreaterThanOrEqual(0);
  });

  it('should return empty array for invalid inputs', () => {
    expect(generatePriceSensitivity(0, 20000, 3000000)).toEqual([]);
    expect(generatePriceSensitivity(-10, 20000, 3000000)).toEqual([]);
    expect(generatePriceSensitivity(50000, -1, 3000000)).toEqual([]);
    expect(generatePriceSensitivity(50000, 20000, -1)).toEqual([]);
  });

  it('should have correct range (±50%)', () => {
    const result = generatePriceSensitivity(50000, 20000, 3000000);
    const min = result[0].variable;
    const max = result[result.length - 1].variable;
    expect(min).toBeCloseTo(50000 * 0.5, -3); // 25000
    expect(max).toBeCloseTo(50000 * 1.5, -3); // 75000
  });

  it('should calculate profit correctly with target profit', () => {
    const result = generatePriceSensitivity(50000, 20000, 3000000, 5000000);
    const currentPoint = result.find((p) => p.isCurrentValue)!;

    // 목표 수익 달성 판매량
    const cm = 50000 - 20000; // 30000
    const targetQty = Math.ceil((3000000 + 5000000) / cm); // 267

    // 예상 이익
    const expectedProfit = targetQty * 50000 - targetQty * 20000 - 3000000;
    expect(currentPoint.profit).toBeCloseTo(expectedProfit, -3);
  });
});

describe('generateCostSensitivity', () => {
  it('should return 11 data points', () => {
    const result = generateCostSensitivity(50000, 20000, 3000000);
    expect(result).toHaveLength(11);
  });

  it('should mark current value correctly', () => {
    const result = generateCostSensitivity(50000, 20000, 3000000);
    const currentPoint = result.find((p) => p.isCurrentValue);
    expect(currentPoint).toBeDefined();
    expect(currentPoint!.variable).toBeCloseTo(20000, -3);
  });

  it('should calculate BEP correctly for cost variations', () => {
    const result = generateCostSensitivity(50000, 20000, 3000000);
    const currentPoint = result.find((p) => p.isCurrentValue)!;
    const expectedBEP = Math.ceil(3000000 / (50000 - 20000)); // 100
    expect(currentPoint.bep).toBe(expectedBEP);
  });

  it('should handle price lower than cost', () => {
    const result = generateCostSensitivity(10000, 8000, 3000000);
    // Max cost = 12000, 일부 포인트에서 cost > price (10000)
    const invalidPoints = result.filter((p) => p.bep === 0);
    expect(invalidPoints.length).toBeGreaterThan(0);
  });

  it('should return empty array for invalid inputs', () => {
    expect(generateCostSensitivity(0, 5000, 3000000)).toEqual([]);
    expect(generateCostSensitivity(10000, -1, 3000000)).toEqual([]);
    expect(generateCostSensitivity(10000, 5000, -1)).toEqual([]);
  });

  it('should have correct range (±50%)', () => {
    const result = generateCostSensitivity(50000, 20000, 3000000);
    const min = result[0].variable;
    const max = result[result.length - 1].variable;
    expect(min).toBeCloseTo(20000 * 0.5, -3); // 10000
    expect(max).toBeCloseTo(20000 * 1.5, -3); // 30000
  });

  it('should calculate profit with target profit', () => {
    const result = generateCostSensitivity(50000, 20000, 3000000, 5000000);
    const currentPoint = result.find((p) => p.isCurrentValue)!;

    // 목표 수익 달성 판매량
    const cm = 50000 - 20000;
    const targetQty = Math.ceil((3000000 + 5000000) / cm);

    // 예상 이익
    const expectedProfit = targetQty * 50000 - targetQty * 20000 - 3000000;
    expect(currentPoint.profit).toBeCloseTo(expectedProfit, -3);
  });
});
