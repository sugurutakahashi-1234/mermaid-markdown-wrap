import { describe, expect, it } from "bun:test";
import { add, divide, multiply, subtract } from "./example.js";

describe("Calculator", () => {
  describe("add", () => {
    it("should add two positive numbers", () => {
      expect(add(2, 3)).toBe(5);
    });

    it("should add negative numbers", () => {
      expect(add(-5, -3)).toBe(-8);
    });

    it("should add zero correctly", () => {
      expect(add(10, 0)).toBe(10);
    });
  });

  describe("subtract", () => {
    it("should subtract two positive numbers", () => {
      expect(subtract(10, 4)).toBe(6);
    });

    it("should handle negative results", () => {
      expect(subtract(3, 5)).toBe(-2);
    });

    it("should subtract zero correctly", () => {
      expect(subtract(7, 0)).toBe(7);
    });
  });

  describe("multiply", () => {
    it("should multiply two positive numbers", () => {
      expect(multiply(4, 5)).toBe(20);
    });

    it("should handle multiplication by zero", () => {
      expect(multiply(100, 0)).toBe(0);
    });

    it("should multiply negative numbers", () => {
      expect(multiply(-3, -4)).toBe(12);
    });
  });

  describe("divide", () => {
    it("should divide two positive numbers", () => {
      expect(divide(20, 4)).toBe(5);
    });

    it("should handle decimal results", () => {
      expect(divide(7, 2)).toBe(3.5);
    });

    it("should throw error when dividing by zero", () => {
      expect(() => divide(10, 0)).toThrow("Division by zero is not allowed");
    });

    it("should divide negative numbers", () => {
      expect(divide(-15, -3)).toBe(5);
    });
  });
});
