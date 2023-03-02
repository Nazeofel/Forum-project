import algoliasearch from "algoliasearch";
import { z, ZodRawShape } from "zod";

interface r {
  method: string;
  body: string;
  headers: Object;
}

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

export const sendData = (data: any): r => {
  return {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
    },
  };
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

export const fetchWrapper = async (req: string, data: any) => {
  const r = await fetch(req, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
    },
  });
  if (r.status !== 200) {
    let mess = "lol";
  }
  const json = await r.json();
  return json;
};
