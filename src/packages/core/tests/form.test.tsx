import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { FormFieldOutputData } from "../src/types";
import { Form } from "../src/components/form";

afterEach(cleanup);

const createForm = (
  props: Partial<React.ComponentProps<typeof Form>> = {},
  children: React.ReactNode = <input name="name" defaultValue="Ada" />,
) => (
  <Form
    submitSection={{ submitButton: { content: "Submit" } }}
    onSubmit={async () => undefined}
    {...props}
  >
    {children}
  </Form>
);

describe("Form", () => {
  it("uses a native submit button and honors the style prop", () => {
    const onSubmit = vi.fn(async () => undefined);
    render(
      createForm(
        {
          onSubmit,
          style: { width: "80%" },
          submitSection: {
            submitButton: {
              content: <span>Save</span>,
              style: { marginTop: "8px" },
            },
          },
        },
        <input name="name" defaultValue="Ada" />,
      ),
    );

    const submitButton = screen.getByRole("button", { name: "Save" });
    expect(submitButton.getAttribute("type")).toBe("submit");
    expect(submitButton.parentElement?.parentElement?.style.width).toBe("80%");
    expect(submitButton.style.marginTop).toBe("8px");

    fireEvent.click(submitButton);

    return waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
  });

  it("returns checked checkbox values as booleans and only includes the selected radio", async () => {
    const onSubmit = vi.fn(
      async (fields: FormFieldOutputData[]) => undefined,
    );
    render(
      createForm(
        { onSubmit },
        <>
          <input type="checkbox" name="terms" defaultChecked />
          <input type="radio" name="plan" value="basic" />
          <input
            type="radio"
            name="plan"
            value="pro"
            defaultChecked
          />
        </>,
      ),
    );

    fireEvent.submit(screen.getByRole("button", { name: "Submit" }).closest("form")!);

    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
    expect(onSubmit.mock.calls[0][0]).toEqual([
      { name: "terms", value: true },
      { name: "plan", value: "pro" },
    ]);
  });

  it("reports validation errors to onSubmit without blocking the callback", async () => {
    const onSubmit = vi.fn(async () => undefined);
    render(
      createForm(
        {
          onSubmit,
          configurations: [
            {
              name: "age",
              exactValueValidation: {
                value: 18,
                errorMessage: "Must be 18",
              },
            },
          ],
        },
        <input name="age" defaultValue="17" />,
      ),
    );

    fireEvent.submit(screen.getByRole("button", { name: "Submit" }).closest("form")!);

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        [{ name: "age", value: "17", error: "Must be 18" }],
        true,
      ),
    );
  });

  it("treats an unchecked checkbox as empty for required validation", async () => {
    const onSubmit = vi.fn(async () => undefined);
    render(
      createForm(
        {
          onSubmit,
          configurations: [
            {
              name: "terms",
              emptyValidation: {
                allow: false,
                errorMessage: "Required",
              },
            },
          ],
        },
        <input type="checkbox" name="terms" />,
      ),
    );

    fireEvent.submit(
      screen.getByRole("button", { name: "Submit" }).closest("form")!,
    );

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        [{ name: "terms", value: false, error: "Required" }],
        true,
      ),
    );
  });

  it("reports the changed control when multiple controls share a name", async () => {
    const onChange = vi.fn(async () => undefined);
    render(
      createForm(
        { onChange },
        <>
          <input type="checkbox" name="features" value="one" />
          <input type="checkbox" name="features" value="two" />
        </>,
      ),
    );

    fireEvent.click(screen.getAllByRole("checkbox")[1]);

    await waitFor(() =>
      expect(onChange).toHaveBeenCalledWith(
        { name: "features", value: true },
        [
          { name: "features", value: false },
          { name: "features", value: true },
        ],
        false,
      ),
    );
  });

  it("does not allow overlapping async submissions", async () => {
    let finishSubmission: (() => void) | undefined;
    const onSubmit = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finishSubmission = resolve;
        }),
    );
    render(createForm({ onSubmit }));

    const form = screen.getByRole("button", { name: "Submit" }).closest("form")!;
    fireEvent.submit(form);
    fireEvent.submit(form);

    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
    await act(async () => finishSubmission?.());

    fireEvent.submit(form);
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(2));
    await act(async () => finishSubmission?.());
  });

  it("does not call onSubmit when a custom validator throws", async () => {
    const onSubmit = vi.fn(async () => undefined);
    const error = new Error("validation failed");
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      createForm(
        {
          onSubmit,
          configurations: [
            {
              name: "name",
              validations: [{ validate: () => Promise.reject(error) }],
            },
          ],
        },
        <input name="name" defaultValue="Ada" />,
      ),
    );

    fireEvent.submit(screen.getByRole("button", { name: "Submit" }).closest("form")!);

    await waitFor(() => expect(consoleError).toHaveBeenCalled());
    expect(onSubmit).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });
});
