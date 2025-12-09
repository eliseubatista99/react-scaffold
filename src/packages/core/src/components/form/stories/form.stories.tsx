import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../button";
import { InputField } from "../../inputField";
import { Form } from "../form";
import { FormStoriesSetup } from "./setup";

const meta = {
  title: "Core/Components/Form",
  component: FormStoriesSetup,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    fields: {
      list: [
        {
          name: "card-number",
          content: (
            <InputField
              name="card-number"
              label="Card Number"
              placeHolder="Card Number"
              styles={{ maxWidth: undefined }}
              containerStyles={{ marginTop: "15px" }}
              inputStyles={{ padding: "10px" }}
            />
          ),
        },
        {
          name: "date",
          content: (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "0.6fr 0.4fr",
                width: "100%",
                alignItems: "flex-end",
                gap: "15px",
              }}
            >
              <div style={{ minWidth: "100%" }}>
                <p>Expiration Date</p>
                <div
                  style={{
                    display: "grid",
                    gap: "4px",
                    gridTemplateColumns: "0.4fr 0.6fr",
                  }}
                >
                  <InputField
                    name="expiration-month"
                    type="number"
                    placeHolder="MM"
                    styles={{ width: undefined, overflow: "hidden" }}
                    containerStyles={{
                      maxWidth: "96%",
                      marginTop: "15px",
                      padding: 0,
                    }}
                    inputStyles={{
                      padding: "0",
                      maxWidth: "100%",
                      textAlign: "center",
                    }}
                  />

                  <InputField
                    name="expiration-year"
                    type="number"
                    placeHolder="YYYY"
                    styles={{
                      // maxWidth: "96%",
                      width: undefined,
                      overflow: "hidden",
                    }}
                    containerStyles={{
                      maxWidth: "96%",
                      marginTop: "15px",
                      padding: 0,
                    }}
                    inputStyles={{
                      padding: "0",
                      maxWidth: "100%",
                      textAlign: "center",
                    }}
                  />
                </div>
              </div>

              <div style={{ minWidth: "100%" }}>
                <InputField
                  name="security"
                  label="Security Code"
                  placeHolder="Security Code"
                  styles={{ width: undefined, overflow: "hidden" }}
                  containerStyles={{
                    maxWidth: "96%",
                    marginTop: "15px",
                    padding: 0,
                  }}
                  inputStyles={{
                    padding: "0",
                    maxWidth: "100%",
                    textAlign: "center",
                  }}
                />
              </div>
            </div>
          ),
        },
        {
          name: "name",
          content: (
            <InputField
              name="name"
              label="Card Holder"
              placeHolder="Card Holder"
              styles={{ maxWidth: undefined }}
              containerStyles={{ marginTop: "15px" }}
              inputStyles={{ padding: "10px" }}
            />
          ),
        },
      ],
      styles: {
        gap: "20px",
      },
    },
    submitButton: {
      content: (
        <Button
          onClick={() => {
            //click
          }}
        >
          Submit
        </Button>
      ),
      styles: {
        marginTop: "auto",
      },
    },
    onSubmit: async (_) => {
      //
    },
    styles: { boxSizing: "border-box", width: "90%", padding: "20px" },
  },
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
