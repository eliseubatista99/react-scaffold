export class NumberHelper {
  static clamp = (num: number, min: number, max: number): number => {
    if (![num, min, max].every(Number.isFinite)) {
      throw new RangeError("clamp arguments must be finite numbers.");
    }

    if (min > max) {
      throw new RangeError("min must be less than or equal to max.");
    }

    if (num > max) {
      return max;
    }

    if (num < min) {
      return min;
    }

    return num;
  };
}
