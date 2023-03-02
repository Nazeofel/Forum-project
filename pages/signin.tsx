import { fetchWrapper, formValidation, handleChange } from "@/Utils/formUtils";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import nookies from "nookies";
import { useAtom } from "jotai";
import { jwtoken } from "@/Utils/globalStates";
import { signInFormInformations } from "@/Utils/zodSchemas";
import { decodeURL, encodeURL } from "@/Utils/apiUtils";

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

export default function Signin(props: { errors: any }) {
  const [clientErrors, setClientErrors] = useState<any | null>(null);
  const [serverErrors, setServerErrors] = useState<any | null>(props.errors);
  const [formData, setFormData] = useState({
    email: "",
    pass: "",
  });
  const [_, setJWTOKEN] = useAtom(jwtoken);
  const router = useRouter();
  console.log(props.errors);
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const signInData = await signInFormInformations(formData);
    const result = await formValidation(signInData.schema, signInData.fields);
    if (!result.success) {
      setClientErrors(result.error.flatten());
      return;
    } else {
      setClientErrors(null);
      const base64 = await encodeURL(formData);
      router.push(`/action/sign-in?formData=${base64}`);
    }
  }
  return (
    <div className="form-container">
      <h1
        className="form-title"
        style={{ marginBottom: "73px", marginTop: "148px" }}
      >
        Sign-in
      </h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email" className="form-label">
          E-mail:
        </label>
        {clientErrors !== null ? (
          <p className="error">{clientErrors.fieldErrors.email}</p>
        ) : (
          ""
        )}
        {serverErrors !== null ? (
          <p className="error">{serverErrors.failure}</p>
        ) : (
          ""
        )}
        <input
          className="form-input form-placeholder"
          style={{ marginBottom: "41px" }}
          type="text"
          name="email"
          value={formData.email}
          onChange={(e) => handleChange(e, setFormData)}
          placeholder="example@example.com"
        />
        <label htmlFor="pass" className="form-label">
          Password:
        </label>
        {clientErrors !== null ? (
          <p className="error">{clientErrors.fieldErrors.pass}</p>
        ) : (
          ""
        )}
        <input
          style={{ marginBottom: 37 }}
          className="form-input form-placeholder"
          type="password"
          name="pass"
          value={formData.pass}
          onChange={(e) => handleChange(e, setFormData)}
          placeholder="password"
        />
        <input type="submit" value="Submit" className="form-submit" />
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
        Don’t have an account ?
      </p>
      <Link
        className="link-animation"
        style={{
          fontWeight: 700,
          fontSize: 16,
          color: "rgba(44, 44, 44, 0.75)",
          textAlign: "center",
        }}
        href={"/signup"}
      >
        Sign up
      </Link>
    </div>
  );
}
