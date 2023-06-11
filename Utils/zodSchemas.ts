import { z } from "zod";
import { ZodCustomParseFunction } from "./interfaces";

function checkTag(str: string[]): boolean {
  let bools = true;
  str.forEach((el) => {
    return el[0] !== "#" ? (bools = false) : (bools = true);
  });
  return bools;
}

export const postInformations = async (
  formData: Record<string, any>
): Promise<ZodCustomParseFunction> => {
  const fields = {
    content: formData.content,
    title: formData.title,
    tags: formData.tags.split(" ").filter((el: string) => el !== ""),
  };
  const schema = {
    content: z
      .string({
        invalid_type_error: "Invalid content",
        required_error: "Content is required",
      })
      .min(50, { message: "Content should be atleast 50 !" })
      .max(244, { message: "Content should be less than 244  !" })
      .trim(),
    title: z
      .string({
        invalid_type_error: "Invalid title",
        required_error: "Title is required !",
      })
      .min(10, { message: "Title should be atleast 10 characters" })
      .max(50, { message: "Title should be less than 50 characters" })
      .trim(),
    tags: z
      .string()
      .array()
      .refine((el) => checkTag(el), {
        message: "all tags should start with #",
      }),
  };
  return {
    fields,
    schema,
  };
};

export const signInFormInformations = async (
  formData: Record<string, any>
): Promise<ZodCustomParseFunction> => {
  const fields = {
    email: formData.email,
    pass: formData.pass,
  };
  const schema = {
    email: z
      .string({
        invalid_type_error: "Invalid email",
        required_error: "Email is required",
      })
      .email({ message: "Email is required !" })
      .trim(),
    pass: z
      .string({
        invalid_type_error: "Invalid password",
        required_error: "Password is minimum 6 characters",
      })
      .min(6, { message: "Password is minimum 6 characters" })
      .trim(),
  };
  return {
    fields,
    schema,
  };
};

export const signUpFormInformations = async (
  formData: Record<string, any>
): Promise<ZodCustomParseFunction> => {
  const fields = {
    name: formData.name,
    email: formData.email,
    pass: formData.pass,
    confirmPass: formData.confirmPass,
    profilPicture: formData.profilPicture,
  };
  const ARRAY_TYPES = ["image/jpg", "image/jpeg", "image/png"];
  const schema = {
    name: z
      .string({
        invalid_type_error: "name must be a string",
        required_error: "Name is required",
      })
      .min(3, { message: "Name is minimum 3 characters" })
      .max(24, { message: "Name is maximum 24 characters" }),
    email: z
      .string({
        invalid_type_error: "Invalid email ",
        required_error: "Email is required",
      })
      .email({ message: "Email is invalid ! Ex : example@example.com" })
      .trim(),
    pass: z
      .string({
        invalid_type_error: "Invalid password",
        required_error: "Password is minimum 6 characters",
      })
      .min(6, { message: "Password is minimum 6 characters" })
      .trim(),
    confirmPass: z.string().refine((val) => val === formData.pass, {
      message: "Passwords should match",
    }),
    profilPicture: z
      .instanceof(File)
      .refine((f) => f.size <= 500000, {
        message: "File size too big ! max 5mb.",
      })
      .refine((f) => ARRAY_TYPES.includes(f.type), {
        message: "Only JPG, PNG, JPEG images format are supported",
      }),
  };
  return {
    fields,
    schema,
  };
};
