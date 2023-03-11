import algoliasearch from "algoliasearch";
import { z, ZodRawShape } from "zod";

export const searchIndex = async (
  search: string,
  index: string,
  options?: any
) => {
  const searchClient = algoliasearch(
    "22HUYWU131",
    "ac531d2a89cbdacd4718e5bb7c48fa8b"
  );
  const clientIndex = searchClient.initIndex(index);
  const i = await clientIndex.search(search, options);
  return i.hits;
};

export const handleChange = (
  event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  setFormData: any
) => {
  const { value, name } = event.currentTarget;
  return setFormData((prev: any) => {
    return {
      ...prev,
      [name]: value,
    };
  });
};

export const formValidation = async (schema: ZodRawShape, fields: any) => {
  const s = z.object(schema).strict();
  const f = fields;
  const result = s.safeParse(f);

  return result;
};

export const fetchWrapper = async (url: string, data: any) => {
  let json;
  try {
    const req = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json",
      },
    });
    if (!req.ok) {
      throw new Error("An error happened");
    }

    json = await req.json();
  } catch (e) {
    if (e instanceof Error) {
      return console.log("An Error occured", e.message);
    }
    if (e instanceof SyntaxError) {
      return console.log("Syntax error occured", e.message);
    }
  }
  if (json) {
    return json;
  }
};
