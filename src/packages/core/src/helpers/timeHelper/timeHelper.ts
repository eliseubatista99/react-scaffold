export class TimeHelper {
  static waitForMilliseconds = (ms: number): Promise<void> => {
    return new Promise((res) => setTimeout(res, ms));
  };

  static waitForCondition = (condition: () => boolean): Promise<void> => {
    return new Promise((resolve) => {
      const checkCondition = () => {
        if (condition()) {
          resolve();
        } else {
          setTimeout(checkCondition, 100);
        }
      };
      checkCondition();
    });
  };

  static waitForAsyncCondition = (
    condition: () => Promise<boolean>
  ): Promise<void> => {
    return new Promise((resolve) => {
      const checkCondition = async () => {
        const result = await condition();
        if (result) {
          resolve();
        } else {
          setTimeout(checkCondition, 100);
        }
      };
      checkCondition();
    });
  };

  static differenceInMonths = (d1: Date, d2: Date): number => {
    let months = 0;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months;
  };

  static isDateOneAfterDateTwo = (d1: Date, d2: Date): boolean => {
    if (d1.getFullYear() >= d2.getFullYear()) {
      if (d1.getMonth() >= d2.getMonth()) {
        return d1.getDay() > d2.getDay();
      }

      return false;
    }

    return false;
  };
}
