# Core Components

The Core package exports reusable React UI components from its package entry
point:

```tsx
import {
  Button,
  Checkbox,
  Form,
  InputField,
  Modal,
  Typography,
} from "@eliseubatista99/react-scaffold-core";
```

The component set includes:

- **Inputs and forms:** `Checkbox`, `Form`, `InputField`,
  `NumericInputField`, `RadioButton`, and `TextAreaField`.
- **Layout and display:** `Carousel`, `Image`, `PageLayout`, `ProgressBar`,
  `SvgImage`, and `Typography`.
- **Actions and feedback:** `Button`, `Drawer`, `Loader`, `Modal`, and `Toast`.

Import the package stylesheet once in the application entry point to load the
styles used by `Carousel`:

```ts
import "@eliseubatista99/react-scaffold-core/dist/react-scaffold-core.css";
```

`Modal`, `Drawer`, `Toast`, and `Loader` use the shared feedback state and must
be rendered beneath `FeedbackProvider`. Give `Modal` and `Drawer` an accessible
name with `aria-label` or `aria-labelledby`. Use the
[Core README](../../README.md) for setup and the
[component reference](../../context/components.md) for props and behavior.
