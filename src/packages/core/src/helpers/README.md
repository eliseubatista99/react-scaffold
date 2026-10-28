# Core Helpers

Import helpers from the core package entry point:

```ts
import {
  EmailHelper,
  FormsHelper,
  NumberHelper,
  ObjectsHelper,
  ScrollHelper,
  TextHelper,
  TimeHelper,
} from "@eliseubatista99/react-scaffold-core";
```

Helpers are static APIs; you do not need to instantiate their classes.

## FormsHelper

Use these methods with the `FormFieldOutputData[]` values passed to `Form` callbacks:

```ts
const emailField = FormsHelper.getField(data, "email");
const email = FormsHelper.getFieldValue<string>(emailField);
const page = FormsHelper.getFieldValueOrDefault(
  FormsHelper.getField(data, "page"),
  "1",
);
```

- `getField(data, name)` returns the first matching field, or `undefined`.
- `getFieldValue<T>(field)` returns the field value, or `undefined` if the field or value is `null`/`undefined`.
- `getFieldValueOrDefault<T>(field, defaultValue)` uses the default only when the field value is nullish. Values such as `0`, `false`, and `""` are preserved.
- `T` is a compile-time assertion, not a conversion. Form input values are strings; convert them explicitly when another runtime type is needed.

## NumberHelper

`NumberHelper.clamp(num, min, max)` returns `num` limited to the inclusive `[min, max]` range. All three arguments must be finite numbers and `min` must not exceed `max`; otherwise it throws `RangeError`.

```ts
NumberHelper.clamp(120, 0, 100); // 100
```

## ObjectsHelper

`ObjectsHelper.isSameObject(first, second)` performs deep equality using lodash `isEqual`. Nested arrays and objects, and supported built-in types such as `Date`, `Map`, and `Set`, are compared by value. For backward compatibility, `null` and `undefined` are considered equivalent.

```ts
ObjectsHelper.isSameObject(
  { user: { name: "Ada" } },
  { user: { name: "Ada" } },
); // true
```

## ScrollHelper

- `ScrollHelper.isScrollEnabled()` checks the computed vertical overflow of `document.body`. It returns `false` when overflow is `hidden` or `clip`; without a DOM it returns `true`.
- `ScrollHelper.disableScroll()` saves the current inline `overflow` value and priority, then sets it to `hidden`. Repeated calls before enabling are idempotent.
- `ScrollHelper.enableScroll()` restores the saved inline value and priority, or removes the inline property if it was initially unset. Calling it without a preceding disable does nothing.
- The mutating methods are no-ops without a DOM. This helper manages one global body lock; it does not count nested lock owners.

## TextHelper

- `getPascalCase(text)` uppercases the first letter of each Unicode word and lowercases the remaining letters. It preserves whitespace and punctuation, so `"i am a text"` becomes `"I Am A Text"` (title case, not separator-free PascalCase).
- `isEqual(first, second, caseSensitive = true)` compares strings directly; when case-insensitive, it compares their uppercase forms.
- `isEmail(value)` performs a basic syntax check (`non-whitespace@non-whitespace.non-whitespace`); it is not full RFC validation and cannot verify that a mailbox exists.
- `isPhoneNumber(value)` accepts an optional leading `+` followed by 9–15 ASCII digits. Spaces and punctuation are not accepted.
- `isValidName(value)` accepts Latin letters (including the ranges covered by its regular expression), separated by a single space, hyphen, or straight apostrophe. It does not trim input or accept names from every writing system.

## TimeHelper

- `waitForMilliseconds(ms)` resolves after the requested timer delay.
- `waitForCondition(condition, options?)` polls a synchronous condition immediately and then every 100 ms until it returns `true`.
- `waitForAsyncCondition(condition, options?)` does the same for an asynchronous condition and does not overlap checks.
- Condition waits have no timeout by default. Options may include `timeoutMs` (a finite value from 0 to 2,147,483,647) and an `AbortSignal`. Timeout rejects with an error named `TimeoutError`; cancellation rejects with `AbortError`; errors from the condition are propagated. Aborting stops the wait but cannot cancel a callback already in progress.
- `differenceInMonths(first, second)` returns the calendar-month difference based on year and month, ignoring the day and time; it can be negative.
- `isDateOneAfterDateTwo(first, second)` compares local calendar dates, ignoring time. Invalid dates return `false`.
- `isSameDate(first, second)` compares local year, month, and day, ignoring time. Two absent (`undefined`) arguments compare equal.
- `getDateInUTC(date)` returns UTC date parts, or `undefined` for missing, null, or invalid input. The returned `month` is zero-based and `weekday` uses Sunday as `0`.
- `formatDateUTC(date, format?)` formats the input as UTC; `formatDateLocalTime(date, format?)` converts the UTC input to local time before formatting. Both return `""` for missing or invalid input. The default format is `DD/MM/YYYYㆍHH:mm` (`ㆍ` is U+318D).

## EmailHelper

`EmailHelper.maskEmail(email)` trims surrounding whitespace and masks the local part, preserving its first Unicode code point:

```ts
EmailHelper.maskEmail("john@example.com"); // "j***@example.com"
```

It returns `""` for `null`, `undefined`, or blank input. It throws `TypeError` unless a non-empty local part and domain are separated by exactly one `@`. This checks only the shape required for masking; it is not full email validation.
