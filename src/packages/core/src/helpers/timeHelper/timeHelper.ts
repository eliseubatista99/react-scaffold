import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export interface WaitForConditionOptions {
  timeoutMs?: number;
  signal?: AbortSignal;
}

const MAX_TIMEOUT_MS = 2_147_483_647;

const createWaitError = (
  name: "AbortError" | "TimeoutError",
  message: string,
) => {
  const error = new Error(message);
  error.name = name;
  return error;
};

const waitForCondition = (
  condition: () => boolean | Promise<boolean>,
  options: WaitForConditionOptions = {},
): Promise<void> => {
  const { timeoutMs, signal } = options;

  if (
    timeoutMs !== undefined &&
    (!Number.isFinite(timeoutMs) ||
      timeoutMs < 0 ||
      timeoutMs > MAX_TIMEOUT_MS)
  ) {
    return Promise.reject(
      new RangeError(
        `timeoutMs must be between 0 and ${MAX_TIMEOUT_MS} milliseconds.`,
      ),
    );
  }

  return new Promise((resolve, reject) => {
    let settled = false;
    let pollTimer: ReturnType<typeof setTimeout> | undefined;
    let timeoutTimer: ReturnType<typeof setTimeout> | undefined;

    const cleanup = () => {
      if (pollTimer !== undefined) {
        clearTimeout(pollTimer);
      }

      if (timeoutTimer !== undefined) {
        clearTimeout(timeoutTimer);
      }

      signal?.removeEventListener("abort", handleAbort);
    };

    const settle = (callback: () => void) => {
      if (settled) {
        return;
      }

      settled = true;
      cleanup();
      callback();
    };

    const handleAbort = () => {
      settle(() =>
        reject(
          createWaitError("AbortError", "The condition wait was aborted."),
        ),
      );
    };

    if (signal?.aborted) {
      handleAbort();
      return;
    }

    signal?.addEventListener("abort", handleAbort, { once: true });

    if (timeoutMs !== undefined) {
      timeoutTimer = setTimeout(
        () =>
          settle(() =>
            reject(
              createWaitError(
                "TimeoutError",
                `The condition was not met within ${timeoutMs} ms.`,
              ),
            ),
          ),
        timeoutMs,
      );
    }

    const checkCondition = () => {
      if (settled) {
        return;
      }

      let result: boolean | Promise<boolean>;

      try {
        result = condition();
      } catch (error) {
        settle(() => reject(error));
        return;
      }

      Promise.resolve(result).then(
        (isConditionMet) => {
          if (settled) {
            return;
          }

          if (isConditionMet) {
            settle(resolve);
          } else {
            pollTimer = setTimeout(checkCondition, 100);
          }
        },
        (error: unknown) => settle(() => reject(error)),
      );
    };

    checkCondition();
  });
};

export class TimeHelper {
  static waitForMilliseconds = (ms: number): Promise<void> => {
    return new Promise((res) => setTimeout(res, ms));
  };

  static waitForCondition = (
    condition: () => boolean,
    options?: WaitForConditionOptions,
  ): Promise<void> => {
    return waitForCondition(condition, options);
  };

  static waitForAsyncCondition = (
    condition: () => Promise<boolean>,
    options?: WaitForConditionOptions,
  ): Promise<void> => {
    return waitForCondition(condition, options);
  };

  static differenceInMonths = (d1: Date, d2: Date): number => {
    let months = 0;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months;
  };

  static isDateOneAfterDateTwo = (d1: Date, d2: Date): boolean => {
    const year1 = d1.getFullYear();
    const year2 = d2.getFullYear();

    if (year1 !== year2) {
      return year1 > year2;
    }

    const month1 = d1.getMonth();
    const month2 = d2.getMonth();

    if (month1 !== month2) {
      return month1 > month2;
    }

    return d1.getDate() > d2.getDate();
  };

  static isSameDate = (d1: Date | undefined, d2: Date | undefined): boolean => {
    return (
      d1?.getFullYear() === d2?.getFullYear() &&
      d1?.getMonth() === d2?.getMonth() &&
      d1?.getDate() === d2?.getDate()
    );
  };

  static getDateInUTC = (date: string | null | undefined) => {
    if (date === null || date === undefined) {
      return undefined;
    }

    const utcDate = dayjs.utc(date);
    if (!utcDate.isValid()) {
      return undefined;
    }

    const day = utcDate.date();
    const month = utcDate.month();
    const year = utcDate.year();
    const hour = utcDate.hour();
    const minute = utcDate.minute();
    const weekday = utcDate.day();

    return {
      day,
      month,
      year,
      hour,
      minute,
      weekday,
    };
  };

  static formatDateLocalTime = (
    date: string | null | undefined,
    format?: string
  ): string => {
    if (!date) {
      return "";
    }

    const localDate = dayjs.utc(date);
    if (!localDate.isValid()) {
      return "";
    }

    return localDate.local().format(format || "DD/MM/YYYYㆍHH:mm");
  };

  static formatDateUTC = (
    date: string | null | undefined,
    format?: string
  ): string => {
    if (!date) {
      return "";
    }

    const utcDate = dayjs.utc(date);
    if (!utcDate.isValid()) {
      return "";
    }

    return utcDate.format(format || "DD/MM/YYYYㆍHH:mm");
  };
}
