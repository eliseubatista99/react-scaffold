# Core — Types

## Form types (`src/types/types.ts`)

```ts
type FormFieldBaseValidation = {
  validateOnChange?: boolean;   // also run this rule on "change"
  validateOnMount?: boolean;    // also run this rule on "mount"
};                               // every rule always runs on "submit"

type FormFieldUnknownValueValidation = FormFieldBaseValidation & { value: number; errorMessage: string };
type FormFieldNumericValidation      = FormFieldBaseValidation & { value: number; errorMessage: string };
type FormFieldEmptyValidation        = FormFieldBaseValidation & { allow: boolean; errorMessage: string };
type FormFieldCustomValidation       = FormFieldBaseValidation & {
  validate: (value: unknown) => string | undefined | Promise<string | undefined>;
};

export interface FormFieldConfiguration {
  name: string;                                        // must match the input "name" attribute
  emptyValidation?: FormFieldEmptyValidation;
  minLengthValidation?: FormFieldNumericValidation;
  maxLengthValidation?: FormFieldNumericValidation;
  minValueValidation?: FormFieldNumericValidation;
  maxValueValidation?: FormFieldNumericValidation;
  exactValueValidation?: FormFieldUnknownValueValidation;
  validations?: FormFieldCustomValidation[];
}

export interface FormFieldInputData {   // exported but not used by Form
  name: string;
  configuration?: FormFieldConfiguration;
  content: JSX.Element;
}

export interface FormFieldOutputData {
  name: string;
  value?: unknown;   // in practice always a trimmed string
  error?: string;    // first failed rule message
}
```

Only `FormFieldConfiguration`, `FormFieldInputData` and `FormFieldOutputData` are exported; the validation sub-types are module-private.

## Types exported from other modules

| Type | Source |
|---|---|
| `ButtonProps`, `CarouselProps`, `CarouselSlideProps`, `CheckboxProps`, `DrawerProps`, `DrawerHandleProps`, `FormProps`, `FormSubmitSection`, `FormSubmitButton`, `ImageProps`, `InputFieldProps`, `LoaderProps`, `ModalProps`, `NumericInputFieldProps`, `PageLayoutProps`, `PageLayoutHeaderAndFooterProps`, `ProgressBarProps`, `RadioButtonProps`, `SvgImageProps`, `TextAreaFieldProps`, `ToastProps`, `TypographyProps` | components (see [components.md](components.md)) |
| `DragData`, `UseDragInput`, `MousePositionData`, `FetchOutput`, `Breakpoint`, `Size`, `BreakpointConfiguration`, `UseResponsiveInput`, `UseResponsiveOutput`, `Language`, `Translation`, `TranslationValues`, `TranslationList`, `UseTranslationsInput`, `UseTranslationsOutput` | hooks (see [hooks.md](hooks.md)) |
| `NavigationProviderRoute`, `NavigationProviderInputProps`, `NavigationRoutesProps`, `GoToParams`, `GoBackParams`, `FeedbackProviderInputProps` | providers (see [providers.md](providers.md)) |

Constant: `defaultBreakpoints` (from `useResponsive`).
