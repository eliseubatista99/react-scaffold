import { useState } from "react";
import { FormFieldOutputData } from "../../../types";
import { Form, FormProps } from "../form";

export const FormStoriesSetup = (props: FormProps) => {
  const [showLoader, setShowLoader] = useState(false);

  const onSubmit = async (data: FormFieldOutputData[]) => {
    console.log("Form > OnSubmit > ", { data });

    setShowLoader(false);
  };

  return (
    <div style={{ width: "100%" }}>
      {showLoader && (
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          style={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            background: "#0000004d",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
          }}
        >
          <p
            style={{
              textAlign: "center",
              fontSize: "40px",
              fontWeight: 800,
              color: "#ffffff",
            }}
          >
            Loading ....
          </p>
        </div>
      )}
      <Form
        {...props}
        onSubmit={onSubmit}
        onPreSubmit={() => {
          setShowLoader(true);
        }}
      />
    </div>
  );
};
