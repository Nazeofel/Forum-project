import { formValidation, handleChange } from "@/Utils/formUtils";
import Link from "next/link";
import React, { useState } from "react";
import nookies from "nookies";
import { signUpFormInformations } from "@/Utils/zodSchemas";
import { decodeURL, encodeURL } from "@/Utils/apiUtils";
import router from "next/router";
import type { GetServerSidePropsContext } from "next/types";
import { useAtomValue } from "jotai";
import { localFMC } from "@/Utils/globalStates";
import { serverResponseObject } from "@/Utils/types";
import { signUpForm } from "@/Utils/interfaces";
import { uploadFile } from "@/Utils/blaze";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const cookies = nookies.get(ctx);
  const params = ctx.query;
  let serverResponse = {};
  if (cookies.token !== undefined) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  if (params.serverResponse) {
    await decodeURL(params.serverResponse);
    serverResponse = await decodeURL(params.serverResponse);
  }
  return {
    props: {
      cookies,
      serverResponse,
    },
  };
}

export default function Signup({ serverResponse }: serverResponseObject) {
  const [formData, setFormData] = useState<signUpForm>({
    name: "",
    email: "",
    pass: "",
    confirmPass: "",
    deviceID: "",
    notifications: 0,
    profilPicture: {} as File,
  });

  const [clientErrors, setClientErrors] = useState<any | null>(null);
  const localFMCValue = useAtomValue(localFMC);
  console.log(formData.profilPicture);
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const sufInfos = await signUpFormInformations(formData);
    const result = await formValidation(sufInfos.schema, sufInfos.fields);
    if (!result.success) {
      setClientErrors(result.error.flatten());
      return;
    } else {
      setClientErrors(null);
      try {
        const req = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}/api/backBlaze`,
          {
            method: "GET",
          }
        );
        if (!req.ok) {
          throw new Error("Error while fetching the upload URL !");
        }
        const res = await req.json();
        await uploadFile(
          res.success.uploadUrl,
          res.success.authorizationToken,
          formData.profilPicture,
          formData.name
        );
        const form = {
          ...formData,
          profilPicture: `https://f003.backblazeb2.com/file/FORUM-PROFILE-PICTURES/${formData.name}-${formData.profilPicture.name}`,
          deviceID: localFMCValue,
        };
        const base64 = await encodeURL(form);
        router.push(`/action/sign-up?formData=${base64}`);
      } catch (e) {
        if (e instanceof Error) {
          return console.log(e.message);
        }
      }
    }
  }
  return (
    <>
      {serverResponse.success !== undefined ? (
        <h1
          style={{ height: "100vh", display: "grid", placeContent: "center" }}
          className="success"
        >
          {serverResponse.success}{" "}
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
          {serverResponse.error !== undefined ? (
            <h1 className="error">{serverResponse.error}</h1>
          ) : (
            ""
          )}
          <form onSubmit={handleSubmit}>
            <label htmlFor="name" className="form-label">
              Name:
            </label>
            {clientErrors !== null ? (
              <p className="error">{clientErrors.fieldErrors.name}</p>
            ) : (
              ""
            )}
            {serverResponse.name !== undefined ? (
              <p className="error">{serverResponse.name}</p>
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
            {serverResponse.email !== undefined ? (
              <p className="error">{serverResponse.email}</p>
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
            {clientErrors !== null ? (
              <p className="error">{clientErrors.fieldErrors.profilPicture}</p>
            ) : (
              ""
            )}

            <input
              style={{ marginBottom: "30px" }}
              type="file"
              name="profilPicture"
              onChange={async (e) => {
                const { files } = e.target;
                if (!files) return;
                const filesArray = Array.from(files);
                for (const file of filesArray) {
                  setFormData((prev) => {
                    return {
                      ...prev,
                      profilPicture: file,
                    };
                  });
                }
              }}
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
