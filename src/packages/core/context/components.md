# Core — Components

All components live in `src/components/<name>/`. Every component accepts style override props that are spread **after** the defaults. Components marked with **(Feedback)** must be rendered inside a `FeedbackProvider` and are shown/hidden through `useFeedback().showItem(id)` / `hideItem(id)`.

---

## Button
File: `components/button/button.tsx`

```ts
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
```
- Renders a native `<button>`; defaults to `type="button"` to avoid accidental form submission. Set `type="submit"` or `"reset"` when needed.
- Supports native button attributes, including `onClick`, `disabled`, `aria-*`, `className`, and `style`. Use `style` to override the default styles.
- Defaults: `border: none`, `borderRadius: 1000px`, `background: #d6d6d6ff`, `padding: 12px 18px`, `fontSize: 16px`.

## Carousel
File: `components/carousel/carousel.tsx` — external: `react-slick` (`Slider`, `Settings`), `slick-carousel/slick/slick.css`, `slick-carousel/slick/slick-theme.css`, `@emotion/styled`.

```ts
interface CarouselSlideProps { content: JSX.Element; styles?: React.CSSProperties; }
interface CarouselProps {
  content: CarouselSlideProps[];
  settings?: Settings;   // react-slick settings, merged over defaults
  gap?: number;          // default 15 (px, applied as padding-right on each slide)
  styles?: CSSProperties;
}
```
- Default slick settings: `{ dots: false, speed: 500, slidesToScroll: 1, infinite: false, variableWidth: true, arrows: false, rows: 1 }`.
- Emotion wrapper overrides `.slick-*` classes: dots at `bottom: -25px`, 5px spacing, dot opacity `0.25` → `0.75` when active; width 100%, height fit-content.
- Importing core pulls in slick CSS (side-effect imports), so `slick-carousel` must be installed even if `Carousel` is not used.

## Checkbox
File: `components/checkbox/checkbox.tsx`

```ts
type CheckboxProps = {
  name: string;
  checked?: boolean;
  label?: React.ReactNode;
  customUncheckedRender?: React.ReactNode;
  customCheckedRender?: React.ReactNode;
  onToggle?: (checked: boolean) => void;
  style?: CSSProperties;
  checkboxStyles?: CSSProperties;
};
```
- Controlled native checkbox with a visually hidden input and a 25×25 visual box (`borderRadius 4px`, `1px solid #969696ff`, black when checked, white when unchecked). The optional label is associated with the input.
- Supports native input attributes such as `disabled`, `required`, `value`, `aria-*`, and `onBlur`. `style` overrides the wrapper defaults; `checkboxStyles` customizes the visual box. `onToggle` receives the newly checked state. Keyboard focus has a visible indicator.
- Custom renders replace the default box for each state.

## Drawer (Feedback)
Files: `components/drawer/drawer.tsx`, `drawer.hook.ts` (`useDrawerHelper`, internal).

```ts
interface DrawerHandleProps { render: React.ReactNode; style?: CSSProperties; }
interface DrawerProps {
  id: string;
  drawerCloseOffset?: number;     // default 15 (px)
  children?: React.ReactNode;
  backgroundStyles?: CSSProperties;
  contentStyles?: CSSProperties;
  handle?: DrawerHandleProps;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  onCloseDrawer?: () => void;
}
```
- Bottom sheet. Backdrop: `position: fixed`, full viewport, `#00000068`, `zIndex 1000`. Content anchored to bottom with top radii 16px. Optional handle area (24px high) at the top.
- `useDrawerHelper` uses `useDrag` on the handle ref: while dragging down the content moves down (`drawerBottomDistance = -distanceY`, capped at 0 when dragging up). When the drag distance reaches `drawerHeight - drawerCloseOffset`, `onCloseDrawer()` is called and position resets. Releasing resets position to 0.
- Accessible modal dialog: provide `aria-label` or `aria-labelledby`; focus moves into the drawer, Tab is contained, Escape closes through `onCloseDrawer`, and focus returns to its previous element when hidden.
- Backdrop clicks and swipe-to-close both call `onCloseDrawer`. The drawer does **not** hide itself: the consumer must call `hideItem(id)`.
- The panel scrolls when content exceeds the available height. Dragging is restricted to the handle area.
- Visibility: `isItemVisible(id)` from `useFeedback`.

## Form
Files: `components/form/form.tsx`, `form.hook.ts` (`useFormHelper`, internal). Types in `src/types/types.ts`.

```ts
interface FormSubmitButton { style?: React.CSSProperties; content: React.ReactNode; }
interface FormSubmitSection {
  renderBeforeSubmitButton?: React.ReactNode;
  submitButton: FormSubmitButton;
  renderAfterSubmitButton?: React.ReactNode;
  style?: React.CSSProperties;
}
interface FormProps {
  children?: React.ReactNode;
  configurations?: FormFieldConfiguration[];
  submitSection: FormSubmitSection;
  onMount?: (data: FormFieldOutputData[], hasErrors?: boolean) => Promise<void>;
  onPreSubmit?: () => void;
  onSubmit: (data: FormFieldOutputData[], hasErrors?: boolean) => Promise<void>;
  onChange?: (changedField: FormFieldOutputData, data: FormFieldOutputData[], hasErrors?: boolean) => Promise<void>;
  style?: React.CSSProperties;
  childrenStyles?: React.CSSProperties;
}
```
- Native `<form>` with an actual `type="submit"` button. Submit content should be presentational content, not another interactive button.
- Named inputs, textareas, and selects are collected. Text values are trimmed strings; checkbox values are booleans; multi-select values are arrays; only the selected radio per group is included.
- **Validation moments:** `"mount"` (via `useDidMount` → `onMount`), `"change"` (native form `onChange` → validates all fields + the changed field → `onChange`), `"submit"` (`onSubmit`). On `submit` every configured rule runs; on `change`/`mount` a rule runs only if its `validateOnChange` / `validateOnMount` flag is true.
- Rule order per field (first failure wins): `emptyValidation` → `minLengthValidation` → `maxLengthValidation` → `minValueValidation` → `maxValueValidation` → `exactValueValidation` (numeric text is compared numerically) → custom validations.
- `hasErrors` is `true` if any field has an `error`.
- Submission is not blocked when there are errors; `onSubmit(fields, hasErrors)` is always called after validation so consumers can preserve their existing behavior and decide whether to proceed.
- Concurrent submissions are ignored until the current `onSubmit` promise settles. Callback errors are logged; validator errors prevent submission rather than appearing as successful validation.
- `style` customizes the form; `childrenStyles` customizes the fields wrapper; `submitSection.style` and `submitSection.submitButton.style` customize the submit section and button.
- Use `FormsHelper` to read values from the output array.

## Image
File: `components/image/image.tsx`
```ts
type ImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "style" | "onClick"> & {
  src: string;
  alt?: string;
  onClick?: () => void;
  style?: CSSProperties;
};
```
- Renders a native `<img>` and supports its attributes, including `loading`, `decoding`, `srcSet`, and `aria-*`. `style` overrides the image defaults.
- When `onClick` is provided, the image becomes keyboard-operable with button role and focus support; provide meaningful `alt` text or `aria-label`.

## InputField
Files: `components/inputField/inputField.tsx`, `inputField.hook.ts` (`useInputFieldHelper`, internal).

```ts
interface InputFieldProps {
  ref?: React.Ref<HTMLInputElement>;
  name: string;
  onChangeDelayInMilliseconds?: number;   // debounce for onChange
  label?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  bottomMessage?: React.ReactNode;        // e.g. validation error
  step?: string | number;
  placeholder?: string;
  autoComplete?: HTMLInputAutoCompleteAttribute; // default "off"
  value?: string;                          // controlled
  initialValue?: string;                   // uncontrolled (defaultValue)
  pattern?: string;
  maxLength?: number;
  disabled?: boolean;
  type?: HTMLInputTypeAttribute;           // default "text"
  onInput?: (e: React.FormEvent<HTMLInputElement>) => void;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onClick?: () => void;
  inputStyles?: CSSProperties;
  containerStyles?: CSSProperties;
  style?: CSSProperties;
}
```
- Layout: emotion container (width 100%, `maxWidth 357px`, gap 8px) → associated label → input row (height 47px, `2px solid #000000`, radius 5px, left icon, input, right icon) → optional description.
- Supports native input attributes (including `placeholder`, `aria-*`, `required`, and `readOnly`). Generates an input ID when one is not supplied, associates the label, and connects the bottom message with `aria-describedby`.
- The row displays a visible focus outline when its input receives keyboard focus. `style` customizes the outer wrapper; `containerStyles` and `inputStyles` customize the row and input respectively.
- `ref` is a regular prop (React 19 style).
- `onChange` is debounced with `setTimeout` when `onChangeDelayInMilliseconds` is set (previous timeout cleared).
- Pending debounced changes are canceled when the component unmounts.

## Loader (Feedback)
File: `components/loader/loader.tsx`
```ts
interface LoaderProps { id: string; children?: React.ReactNode; styles?: React.CSSProperties; }
```
- Full-screen fixed overlay (`zIndex 1000`, flex centered) rendered only when `isItemVisible(id)`. Content (spinner, text) is provided via `children`.

## Modal (Feedback)
File: `components/modal/modal.tsx`
```ts
interface ModalProps {
  id: string;
  children?: React.ReactNode;
  backgroundStyles?: React.CSSProperties;
  contentStyles?: React.CSSProperties;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  onClickOutsideModal?: () => void;
}
```
- Backdrop: fixed full viewport, centered content, `#00000068`, `zIndex 1000`. Clicking the backdrop calls `onClickOutsideModal`.
- Content: `width 90%`, `maxWidth 375px`, `minHeight 80px`, `maxHeight 90vh`, white, radius 16px, `padding 24px`, `zIndex 1001`; scrolls when content exceeds available height.
- Accessible modal dialog: provide `aria-label` or `aria-labelledby`; focus moves into the modal, Tab is contained, Escape calls `onClickOutsideModal`, and focus returns to its previous element when hidden.
- Does not hide itself; consumer calls `hideItem(id)`.

## NumericInputField
Files: `components/numericInputField/numericInputField.tsx`, `numericInputField.hook.ts` (`useNumericInputFieldHelper`, internal).

```ts
type NumericInputFieldProps = Omit<
  InputFieldProps,
  "type" | "min" | "max" | "pattern"
> & {
  max?: number;
  min?: number;
  decimalScale?: number;    // default 2; non-negative integer
  allowDecimals?: boolean;  // default true
  allowNegatives?: boolean; // default true
};
```
- Wraps `InputField` with `type="text"` and a generated pattern matching the decimal/negative options. Defaults `inputMode` to `decimal` or `numeric`, while allowing a caller override.
- Sanitizes input to digits, one optional leading minus, and one decimal point. A leading decimal point becomes `0.`; decimal digits are limited to `decimalScale` (clamped to a non-negative integer).
- Preserves the existing range behavior: an out-of-range numeric value reverts to the last accepted value. If `max` is undefined and `maxLength` is set, max falls back to `"9".repeat(maxLength)`.
- Attempts to preserve the caret after sanitizing. The consumer's `onInput` is called after sanitization rather than being overwritten.

## PageLayout
Files: `components/pageLayout/pageLayout.tsx`, `pageLayout.hook.ts` (`usePageLayoutHelper`, internal).

```ts
interface PageLayoutHeaderAndFooterProps {
  content: React.ReactNode;
  visibility?: "always" | "fixed";
  styles?: React.CSSProperties;
}
interface PageLayoutProps {
  header?: PageLayoutHeaderAndFooterProps;
  footer?: PageLayoutHeaderAndFooterProps;
  sidebar?: Omit<PageLayoutHeaderAndFooterProps, "visibility">;
  floatingContent?: React.ReactNode;   // declared but NOT rendered
  allowScroll?: boolean;               // default true
  reserveSpaceForScrollbar?: boolean;  // scrollbarGutter: "stable"
  containerStyles?: React.CSSProperties;
  pageStyles?: React.CSSProperties;
  children?: React.ReactNode;
}
```
- DOM ids: `#page-container` (emotion, flex column, 100% height) → `#page-header` → body wrapper → `#page-sidebar` (width 30%) + `#page-body` → `#page-content` (scroll area) → `#page-footer`.
- Header/footer: `position: sticky` by default; `relative` when `visibility: "fixed"` (the name is counter-intuitive: "fixed" means it is part of the normal flow and not overlaying the content).
- Hook measures header/footer height (`clientHeight`, initial 24) and sidebar width (initial 300). For non-"fixed" header/footer, the body wrapper gets negative `marginTop`/`marginBottom` and the content gets matching `paddingTop`/`paddingBottom`, so content scrolls under sticky bars.
- `page.extraHeight` (sum of "always" header/footer heights) is calculated but not used by the component.

## ProgressBar
File: `components/progressBar/progressBar.tsx`
```ts
interface ProgressBarProps {
  percentage: number;
  min?: number;  // default 0
  max?: number;  // default 100
  styles?: React.CSSProperties;
  barStyles?: React.CSSProperties;
}
```
- `NumberHelper.clamp(percentage, min, max)`; track `width 90%`, `height 30px`, `1px solid #000`, radius 3px, white; fill `#f58b00ff` with width `${clamped}%`.

## RadioButton
File: `components/radioButton/radioButton.tsx`
```ts
type RadioButtonProps = {
  checked: boolean;
  customUncheckedRender?: React.ReactNode;
  customCheckedRender?: React.ReactNode;
  style?: CSSProperties;
  checkedStyles?: CSSProperties;
};
```
- Selectable visual control, rendered as a native `<button type="button">` with `aria-pressed`; use `aria-label` or another accessible name.
- Supports native button attributes other than `type` and `aria-pressed`, plus standard keyboard interaction. `style` overrides defaults; `checkedStyles` apply only when checked and may be overridden by `style`.
- 25×25 circle, `2px solid` border (`#969696ff` unchecked / `#000` checked), checked fill black with an inner white dot (40%). It does not render a radio input and is not collected by `Form`.

## SvgImage
File: `components/svgImage/svgImage.tsx` — uses `csstype` `Property` types.
```ts
type SvgImageProps = {
  viewBox?: string;            // default "0 0 22 28"
  width?: Property.Width;      // default "22"
  height?: Property.Height;    // default "28"
  fill?: Property.Fill;        // default "#000000"
  stroke?: Property.Stroke;
  src: React.ReactElement<React.SVGProps<SVGElement>>; // inner SVG nodes
  alt?: string;
  onClick?: () => void;
  style?: CSSProperties;
};
```
- Renders an `<svg>` with the provided inner nodes, supporting native SVG attributes such as `className`, `aria-*`, and `focusable`. `style` overrides the default display.
- Meaningful `alt` text labels the SVG; an SVG without text is hidden from assistive technology by default. When `onClick` is provided, it becomes keyboard-operable with button role and focus support; provide meaningful `alt` text or `aria-label`.

## TextAreaField
File: `components/textAreaField/textAreaField.tsx`
```ts
interface TextAreaFieldProps {
  name: string;
  label?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  bottomMessage?: React.ReactNode;
  placeholder?: string;
  value?: string;
  initialValue?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  inputStyles?: CSSProperties;
  containerStyles?: CSSProperties;
  styles?: CSSProperties;
}
```
- Same layout as `InputField` with a `<textarea>`; emotion styles a thin webkit scrollbar (5px, track `#f0f0f0`, thumb `#888`, hover `#555`). No debounce support.

## Toast (Feedback)
File: `components/toast/toast.tsx`
```ts
interface ToastProps {
  id: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  durationInSeconds?: number; // default 3
}
```
- Fixed at `top: 10px`, horizontally centered, `100×40px`, `#534a4aff`, white text, radius 20px, `3px solid #000`, `zIndex 1000`.
- Has `role="status"`, `aria-live="polite"`, and `aria-atomic="true"` by default; supports native div attributes and allows overriding the live-region semantics.
- When it becomes visible, schedules `hideItem(id)` after `durationInSeconds`; the timer is reset when the ID/duration/visibility changes and cleared when hidden or unmounted.
- Use `style` to override the default toast appearance.

## Typography
File: `components/typography/typography.tsx`
```ts
interface TypographyProps {
  overflowEllipsis?: boolean;
  maxNumberOfLines?: number;
  children?: React.ReactNode;
  styles?: CSSProperties;
}
```
- Renders `<p>` inheriting font properties; `display: -webkit-box` with `WebkitLineClamp = maxNumberOfLines` and `textOverflow: ellipsis` when requested.
