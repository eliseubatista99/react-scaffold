# Core — Components

All components live in `src/components/<name>/`. Every component accepts style override props that are spread **after** the defaults. Components marked with **(Feedback)** must be rendered inside a `FeedbackProvider` and are shown/hidden through `useFeedback().showItem(id)` / `hideItem(id)`.

---

## Button
File: `components/button/button.tsx`

```ts
type ButtonProps = {
  onClick: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children?: React.ReactNode;
  styles?: CSSProperties;
};
```
- Renders a native `<button>`; flex row, centered.
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
  styles?: CSSProperties;
  checkboxStyles?: CSSProperties;
};
```
- Controlled: renders a hidden `<input type="checkbox" name>` (so it participates in `Form`) and a 25×25 visual box (`borderRadius 4px`, `1px solid #969696ff`, black when checked, white when unchecked).
- Click calls `onToggle(!checked)`. Custom renders replace the default box for each state.

## Drawer (Feedback)
Files: `components/drawer/drawer.tsx`, `drawer.hook.ts` (`useDrawerHelper`, internal).

```ts
interface DrawerHandleProps { render: React.ReactNode; styles?: CSSProperties; }
interface DrawerProps {
  id: string;
  drawerCloseOffset?: number;     // default 15 (px)
  children?: React.ReactNode;
  backgroundStyles?: CSSProperties;
  contentStyles?: CSSProperties;
  handle?: DrawerHandleProps;
  onCloseDrawer?: () => void;
}
```
- Bottom sheet. Backdrop: `position: fixed`, full viewport, `#00000068`, `zIndex 1000`. Content anchored to bottom with top radii 16px. Optional handle area (24px high) at the top.
- `useDrawerHelper` uses `useDrag` on the handle ref: while dragging down the content moves down (`drawerBottomDistance = -distanceY`, capped at 0 when dragging up). When the drag distance reaches `drawerHeight - drawerCloseOffset`, `onCloseDrawer()` is called and position resets. Releasing resets position to 0.
- The drawer does **not** hide itself: `onCloseDrawer` must call `hideItem(id)`.
- Visibility: `isItemVisible(id)` from `useFeedback`.

## Form
Files: `components/form/form.tsx`, `form.hook.ts` (`useFormHelper`, internal). Types in `src/types/types.ts`.

```ts
interface FormSubmitButton { styles?: React.CSSProperties; content: React.ReactNode; }
interface FormSubmitSection {
  renderBeforeSubmitButton?: React.ReactNode;
  submitButton: FormSubmitButton;
  renderAfterSubmitButton?: React.ReactNode;
  styles?: React.CSSProperties;
}
interface FormProps {
  children?: React.ReactNode;
  configurations?: FormFieldConfiguration[];
  submitSection: FormSubmitSection;
  onMount?: (data: FormFieldOutputData[], hasErrors?: boolean) => Promise<void>;
  onPreSubmit?: () => void;
  onSubmit: (data: FormFieldOutputData[], hasErrors?: boolean) => Promise<void>;
  onChange?: (changedField: FormFieldOutputData, data: FormFieldOutputData[], hasErrors?: boolean) => Promise<void>;
  styles?: React.CSSProperties;
  childrenStyles?: React.CSSProperties;
}
```
- Uncontrolled native `<form>`. Field data is collected from `form.elements` that have a `name` attribute; value is `element.value.trim()` (always a string).
- Submit section renders `renderBeforeSubmitButton`, an emotion `SubmitButton` (`div`, children have `pointer-events: none`) whose click calls `formRef.current.requestSubmit()`, then `renderAfterSubmitButton`. Has `data-testid="submit-section"`.
- **Validation moments:** `"mount"` (via `useDidMount` → `onMount`), `"change"` (native form `onChange` → validates all fields + the changed field → `onChange`), `"submit"` (`onSubmit`). On `submit` every configured rule runs; on `change`/`mount` a rule runs only if its `validateOnChange` / `validateOnMount` flag is true.
- Rule order per field (first failure wins, sets `error`): `emptyValidation` (when `allow === false`) → `minLengthValidation` → `maxLengthValidation` → (only if `!isNaN(value)`) `minValueValidation` → `maxValueValidation` → `exactValueValidation` (`!==` comparison) → each custom `validations[i].validate(value)` (sync or async, returns error string or `undefined`).
- `hasErrors` is `true` if any field has an `error`.
- Submit flow: guard `isSubmittingRef` → `onPreSubmit()` → `preventDefault` → validate → `onSubmit(fields, hasErrors)`. Submission is not blocked when there are errors; consumers must check `hasErrors`.
- Use `FormsHelper` to read values from the output array.

## Image
File: `components/image/image.tsx`
```ts
type ImageProps = { src: string; alt?: string; onClick?: () => void; styles?: CSSProperties; };
```
- `<img>` with `objectFit: cover`, `display: flex`.

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
  placeHolder?: string;
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
  styles?: CSSProperties;
}
```
- Layout: emotion container (width 100%, `maxWidth 357px`, gap 8px) → label → input row (height 47px, `2px solid #000000`, radius 5px, left icon, input, right icon) → bottom message.
- Emotion CSS removes focus outline and autofill background.
- `ref` is a regular prop (React 19 style).
- `onChange` is debounced with `setTimeout` when `onChangeDelayInMilliseconds` is set (previous timeout cleared).

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
  onClickOutsideModal?: () => void;
}
```
- Backdrop: fixed, centered via `top/left 50%` + `translate(-50%, -50%)`, `minHeight 100vh`, `#00000068`, `zIndex 1000`. Click calls `onClickOutsideModal`.
- Content: `width 90%`, `maxWidth 375px`, `minHeight 80px`, `maxHeight 50%`, white, radius 16px, `padding 24px`, `zIndex 1001`; click `stopPropagation`.
- Does not hide itself; consumer calls `hideItem(id)`.

## NumericInputField
Files: `components/numericInputField/numericInputField.tsx`, `numericInputField.hook.ts` (`useNumericInputFieldHelper`, internal).

```ts
type NumericInputFieldProps = Omit<InputFieldProps, "type"> & {
  max?: number;
  min?: number;
  decimalScale?: number;    // default 2
  allowDecimals?: boolean;  // default true
  allowNegatives?: boolean; // default true
};
```
- Wraps `InputField` (`type="text"`, `pattern="^-?[0-9]*.?[0-9]*$"`) and sanitises the value inside an `onInput` handler on every keystroke (directly rewriting `target.value`):
  1. strips characters other than digits, `.` and `-`;
  2. negatives: only one leading `-` (all removed if `allowNegatives` is false);
  3. decimals: single `.`, leading `.` becomes `0.`, `-.` becomes `-`; typing beyond `decimalScale` digits keeps the previous decimal part (all dots removed if `allowDecimals` is false);
  4. min/max: out-of-range values revert to the previous valid value (stored in a `prevValue` ref). If `max` is undefined but `maxLength` is set, max becomes `"9".repeat(maxLength)`;
  5. restores caret position after rewriting the value.
- The consumer's own `onInput` prop is overwritten by the internal handler.

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
  onClick?: (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  styles?: CSSProperties;
  checkedStyles?: CSSProperties;
};
```
- 25×25 circle, `2px solid` border (`#969696ff` unchecked / `#000` checked), checked fill black with an inner white dot (40%). Purely visual: no hidden `<input>`, so it is **not** collected by `Form`.

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
  styles?: CSSProperties;
};
```
- Renders `<svg xmlns=... viewBox width height fill stroke>{src}</svg>`.

## TextAreaField
File: `components/textAreaField/textAreaField.tsx`
```ts
interface TextAreaFieldProps {
  name: string;
  label?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  bottomMessage?: React.ReactNode;
  placeHolder?: string;
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
  styles?: React.CSSProperties;
  durationInSeconds?: number; // default 3
}
```
- Fixed at `top: 10px`, horizontally centered, `100×40px`, `#534a4aff`, white text, radius 20px, `3px solid #000`, `zIndex 1000`.
- When it becomes visible, schedules `hideItem(id)` after `durationInSeconds` (auto-hide). A ref (`isVisibleCache`) avoids re-scheduling on re-render. The timeout is never cleared on unmount.

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
