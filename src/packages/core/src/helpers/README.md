# Core Helpers

Import helpers from the Core package entry point. They are static APIs and do
not need to be instantiated:

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

| Helper | Purpose |
| --- | --- |
| `EmailHelper` | Mask an email address for display |
| `FormsHelper` | Read fields and values from form output |
| `NumberHelper` | Clamp a number to a range |
| `ObjectsHelper` | Compare values using deep equality |
| `ScrollHelper` | Inspect and temporarily disable document scrolling |
| `TextHelper` | Common string checks and formatting |
| `TimeHelper` | Date/time utilities and asynchronous waits |

Examples:

```ts
NumberHelper.clamp(120, 0, 100); // 100
TextHelper.isEmail("person@example.com"); // true
EmailHelper.maskEmail("person@example.com"); // "p***@example.com"
```

Some helpers have input constraints: for example, `NumberHelper.clamp` throws
when its bounds are invalid, and `EmailHelper.maskEmail` throws when the input
does not contain a local part and domain separated by one `@`. These utilities
do not replace application-specific validation.

See the [Core README](../../README.md) for installation and the
[helper reference](../../context/helpers.md) for complete signatures and
behavior.
