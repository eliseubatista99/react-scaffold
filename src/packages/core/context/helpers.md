# Core — Helpers

Helpers are classes with **static arrow-function methods** (no instances). They live in `src/helpers/<name>/` and are exported from the package root, **except `EmailHelper`** (folder exists but is missing from `helpers/index.ts`).

---

## FormsHelper
File: `helpers/formsHelper/formsHelper.ts` — reads values from `Form` callbacks.
```ts
FormsHelper.getField(data: FormFieldOutputData[], name: string): FormFieldOutputData | undefined
FormsHelper.getFieldValue<T>(field?: FormFieldOutputData): T | undefined
FormsHelper.getFieldValueOrDefault<T>(field: FormFieldOutputData | undefined, defaultValue: T): T
```
- Both methods preserve falsy values such as `0`, `false`, and `""`. `getFieldValue` returns `undefined` for nullish values; `getFieldValueOrDefault` returns its default in that case.
- The generic type is a compile-time assertion only; values are not converted. Form inputs are strings, so convert them explicitly before requesting a different type.

Example:
```ts
onSubmit={async (data, hasErrors) => {
  if (hasErrors) return;
  const email = FormsHelper.getFieldValue<string>(FormsHelper.getField(data, "email"));
}}
```

## NumberHelper
File: `helpers/numberHelper/numberHelper.ts`
```ts
NumberHelper.clamp(num: number, min: number, max: number): number
```

## ObjectsHelper
File: `helpers/objectsHelper/objectsHelper.ts`
```ts
ObjectsHelper.isSameObject(o1: any, o2: any): boolean
```
- `null`/`undefined` are considered equal to each other.
- **Shallow** comparison: same number of own keys and `===` on each value (nested objects/arrays are compared by reference).

## ScrollHelper
File: `helpers/scrollHelper/scrollHelper.ts`
```ts
ScrollHelper.isScrollEnabled(): boolean  // body.style.overflow is "unset" or "auto"
ScrollHelper.disableScroll(): void       // body.style.overflow = "hidden"
ScrollHelper.enableScroll(): void        // body.style.overflow = "unset"
```
- `isScrollEnabled()` returns `false` when the inline style was never set (`""`).

## TextHelper
File: `helpers/text/textHelper.ts`
```ts
TextHelper.getPascalCase(text: string): string             // each Unicode word: First upper, rest lower (keeps spaces)
TextHelper.isEqual(a: string, b: string, caseSensitive = true): boolean
TextHelper.isEmail(value: string): boolean                 // /^[^\s@]+@[^\s@]+\.[^\s@]+$/
TextHelper.isPhoneNumber(value: string): boolean           // /^\+?\d{9,15}$/ (no spaces)
TextHelper.isValidName(value: string): boolean             // Latin letters incl. accents; single ' - or space separators
```

## TimeHelper
File: `helpers/timeHelper/timeHelper.ts` — uses `dayjs` + `dayjs/plugin/utc` (extended at module load).
```ts
TimeHelper.waitForMilliseconds(ms: number): Promise<void>
TimeHelper.waitForCondition(condition: () => boolean, options?: { timeoutMs?: number; signal?: AbortSignal }): Promise<void>
TimeHelper.waitForAsyncCondition(condition: () => Promise<boolean>, options?: { timeoutMs?: number; signal?: AbortSignal }): Promise<void>
TimeHelper.differenceInMonths(d1: Date, d2: Date): number                           // (y2-y1)*12 - m1 + m2
TimeHelper.isDateOneAfterDateTwo(d1: Date, d2: Date): boolean                       // compares local calendar dates, ignoring time
TimeHelper.isSameDate(d1?: Date, d2?: Date): boolean                                // year/month/date equality
TimeHelper.getDateInUTC(date?: string | null): { day, month, year, hour, minute, weekday } | undefined
TimeHelper.formatDateLocalTime(date?: string | null, format = "DD/MM/YYYYㆍHH:mm"): string // utc → local
TimeHelper.formatDateUTC(date?: string | null, format = "DD/MM/YYYYㆍHH:mm"): string
```
- `month` in `getDateInUTC` is **0-based** (dayjs). `weekday` 0 = Sunday.
- Format functions return `""` for empty input. The default format uses the Hangul character `ㆍ` (U+318D) as separator.
- Condition waits poll every 100 ms, with no timeout unless `timeoutMs` is provided (0–2,147,483,647 ms). They reject with `TimeoutError` on timeout and `AbortError` when the optional `signal` is aborted. Errors from the condition are propagated. Aborting stops the wait but cannot cancel a condition callback already in progress.

## EmailHelper (not exported)
File: `helpers/emailHelper/emailHelper.ts`
```ts
EmailHelper.maskEmail(email?: string | null): string  // "john@x.com" → "j***@x.com"; "" for empty; original if no "@"
```
- To expose it, add `export * from "./emailHelper";` to `helpers/index.ts`.
