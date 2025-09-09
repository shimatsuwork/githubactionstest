const { validateEmail, formatDate, calculateSum } = require('../src/utils');

describe('Utils', () => {
  describe('validateEmail', () => {
    test('should return true for valid email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.jp')).toBe(true);
    });

    test('should return false for invalid email', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
    });
  });

  describe('formatDate', () => {
    test('should format date to YYYY-MM-DD', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      expect(formatDate(date)).toBe('2024-01-15');
    });
  });

  describe('calculateSum', () => {
    test('should calculate sum of numbers', () => {
      expect(calculateSum([1, 2, 3, 4])).toBe(10);
      expect(calculateSum([0])).toBe(0);
      expect(calculateSum([])).toBe(0);
    });
  });
});