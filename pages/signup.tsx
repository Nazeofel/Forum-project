import { fetchWrapper, formValidation, handleChange } from "@/Utils/formUtils";
import Link from "next/link";
import React, { useState } from "react";
import nookies from "nookies";
import { signUpFormInformations } from "@/Utils/zodSchemas";
import { decodeURL, encodeURL } from "@/Utils/apiUtils";
import router from "next/router";

export async function getServerSideProps(ctx: any) {
  const cookies = nookies.get(ctx);
  const params = ctx.query;
  let errors = {};
  if (cookies.token !== undefined) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  if (params.error) {
    await decodeURL(params.error);
    errors = await decodeURL(params.error);
  }
  return {
    props: {
      cookies,
      errors,
    },
  };
}

export default function Signup(props: { errors: any }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    pass: "",
    confirmPass: "",
  });
  const [clientErrors, setClientErrors] = useState<any | null>(null);
  const [serverErrors, setServerErrors] = useState(props.errors);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const sufInfos = await signUpFormInformations(formData);
    const result = await formValidation(sufInfos.schema, sufInfos.fields);
    if (!result.success) {
      setClientErrors(result.error.flatten());
      return;
    } else {
      setClientErrors(null);
      const base64 = await encodeURL(formData);
      router.push(`/action/sign-up?formData=${base64}`);
    }
  }
  return (
    <>
      {serverErrors.success !== undefined ? (
        <h1
          style={{ height: "100vh", display: "grid", placeContent: "center" }}
          className="success"
        >
          Successfully signed up ! sign in{" "}
          <Link
            className="link-animation"
            style={{
              fontWeight: 700,
              fontSize: 16,
              color: "rgba(44, 44, 44, 0.75)",
              textAlign: "center",
            }}
            href="/signin"
          >
            here
          </Link>
        </h1>
      ) : (
        <div className="form-container">
          <h1
            className="form-title"
            style={{ marginTop: "65px", marginBottom: "63px" }}
          >
            Sign-up
          </h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name" className="form-label">
              Name:
            </label>
            {clientErrors !== null ? (
              <p className="error">{clientErrors.fieldErrors.name}</p>
            ) : (
              ""
            )}
            {serverErrors.name !== undefined ? (
              <p className="error">{serverErrors.name}</p>
            ) : (
              ""
            )}
            <input
              style={{ marginBottom: "40px" }}
              className="form-input form-placeholder"
              value={formData.name}
              type="text"
              name="name"
              placeholder="Ex : John Smith"
              onChange={(e) => handleChange(e, setFormData)}
            />
            <label htmlFor="email" className="form-label">
              E-mail:
            </label>
            {clientErrors !== null ? (
              <p className="error">{clientErrors.fieldErrors.email}</p>
            ) : (
              ""
            )}
            {serverErrors.email !== undefined ? (
              <p className="error">{serverErrors.email}</p>
            ) : (
              ""
            )}
            <input
              style={{ marginBottom: "40px" }}
              className="form-input form-placeholder"
              value={formData.email}
              type="email"
              name="email"
              placeholder="example@example.com"
              onChange={(e) => handleChange(e, setFormData)}
            />
            <label htmlFor="password" className="form-label">
              Password:
            </label>
            {clientErrors !== null ? (
              <p className="error">{clientErrors.fieldErrors.pass}</p>
            ) : (
              ""
            )}

            <input
              style={{ marginBottom: "40px" }}
              className="form-input form-placeholder"
              value={formData.pass}
              type="password"
              name="pass"
              placeholder="password"
              onChange={(e) => handleChange(e, setFormData)}
            />
            <label htmlFor="confirmPass" className="form-label">
              Confirm Password:
            </label>
            {clientErrors !== null ? (
              <p className="error">
                {clientErrors.fieldErrors.pass}
                {clientErrors.fieldErrors.confirmPass}
              </p>
            ) : (
              ""
            )}
            <input
              style={{ marginBottom: "30px" }}
              className="form-input form-placeholder"
              value={formData.confirmPass}
              type="password"
              name="confirmPass"
              placeholder="Confirm Password"
              onChange={(e) => handleChange(e, setFormData)}
            />
            <input type="submit" value="Sign up" className="form-submit" />
          </form>
          <p
            style={{
              fontWeight: 300,
              fontSize: 16,
              color: "rgba(44, 44, 44, 0.75)",
              textAlign: "center",
              paddingBottom: 7,
            }}
          >
            Already have an account ?
          </p>
          <Link
            className="link-animation"
            style={{
              fontWeight: 700,
              fontSize: 16,
              color: "rgba(44, 44, 44, 0.75)",
              textAlign: "center",
            }}
            href="/signin"
          >
            Sign in
          </Link>
        </div>
      )}
    </>
  );
}
