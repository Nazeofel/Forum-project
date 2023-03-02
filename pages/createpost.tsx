import { formValidation, handleChange } from "@/Utils/formUtils";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { postInformations } from "@/Utils/zodSchemas";
import { decodeURL, encodeURL, getTokenData } from "@/Utils/apiUtils";
import { tokenData } from "@/Utils/interfaces";
import { useRedirect } from "@/Utils/customHooks";

interface FormData {
  id: string;
  content: string;
  title: string;
  tags: string;
}

export async function getServerSideProps(ctx: any) {
  let tokenData: tokenData = await getTokenData(ctx);
  const params = ctx.query;
  let errors = {};
  if (tokenData === undefined) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  if (params.error !== undefined) {
    await decodeURL(params.error);
    errors = await decodeURL(params.error);
    console.log(errors);
  }
  return {
    props: {
      tokenData,
      errors,
    },
  };
}

export default function CreatePost({ tokenData, errors }: any) {
  const [clientErrors, setClientErrors] = useState<any | null>(null);
  const [serverErrors, _] = useState<any>(errors);
  const [timer, setTimer] = useRedirect(`/post/${serverErrors.id}`, null);
  const [formData, setFormData] = useState<FormData>({
    id: tokenData.id,
    content: "",
    title: "",
    tags: "",
  });
  const router = useRouter();
  useEffect(() => {
    if (serverErrors.id) {
      setTimer(5);
      return;
    }
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const postData = await postInformations(formData);
    const result = await formValidation(postData.schema, postData.fields);
    if (!result.success) {
      setClientErrors(result.error.flatten());
      return;
    } else {
      setClientErrors(null);
      const base64 = await encodeURL(formData);
      router.push(`/action/create-post?formData=${base64}`);
    }
  }
  return (
    <div className="form-container">
      {serverErrors.success !== undefined ? (
        <>
          <h1 style={{ color: "green" }}>
            Post successfully created ! redirection to post page in {timer}
            {timer <= 1 ? "second" : "seconds"}
          </h1>
        </>
      ) : (
        <>
          <h1
            className="form-title"
            style={{ marginBottom: "73px", marginTop: "148px" }}
          >
            Create a Post
          </h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="title" className="form-label">
              Title :
            </label>
            {clientErrors !== null ? (
              <p className="error">{clientErrors.fieldErrors.title}</p>
            ) : (
              ""
            )}
            <input
              className="form-input form-placeholder"
              style={{ marginBottom: "41px" }}
              type="text"
              name="title"
              value={formData.title}
              onChange={(e) => handleChange(e, setFormData)}
              placeholder="Ex: I need help with..."
            />
            <label htmlFor="content" className="form-label">
              Content :
            </label>
            {clientErrors !== null ? (
              <p className="error">{clientErrors.fieldErrors.content}</p>
            ) : (
              ""
            )}
            <textarea
              className="form-input form-placeholder"
              style={{ marginBottom: "41px", resize: "none", height: "auto" }}
              name="content"
              maxLength={240}
              minLength={50}
              value={formData.content}
              onChange={(e) => handleChange(e, setFormData)}
              rows={5}
              placeholder="Ex : my problem with zustand..."
            />

            <label htmlFor="tag" className="form-label">
              Tags :
            </label>
            {clientErrors !== null ? (
              <p className="error">{clientErrors.fieldErrors.tags}</p>
            ) : (
              ""
            )}
            <input
              className="form-input form-placeholder"
              style={{ marginBottom: "41px" }}
              type="text"
              name="tag"
              value={formData.tags}
              onChange={(e) => {
                const { value } = e.currentTarget;
                return setFormData((prev) => {
                  return {
                    ...prev,
                    tags: value,
                  };
                });
              }}
              placeholder="Ex: #Javascript, #C, #NodeJS, #TS"
            />
            <input type="submit" value="Submit" className="form-submit" />
          </form>
        </>
      )}
    </div>
  );
}
