import { ZodRawShape } from "zod/lib/types";
import { notificationStatus } from "./types";

export interface tokenData {
  id: number;
  rank: "Admin" | "User";
  name: string;
}

export interface NotificationDataObject {
  content: string;
  date: string;
  name: string;
  seen: notificationStatus;
}

export interface NotificationObject {
  data: NotificationDataObject;
  fcmOptions: {
    link: string;
  };
  from: string;
  messageId: string;
  notification: {
    title: string;
    body: string;
  };
}

export interface ZodCustomParseFunction {
  fields: Object;
  schema: ZodRawShape;
}

export interface signUpForm {
  name: string;
  email: string;
  pass: string;
  confirmPass: string;
  deviceID: string;
  notifications: 0;
  profilPicture: File;
}

export interface refinedComment {
  profilPicture: string;
  name: string;
  authorID: number;
  content: string;
  createdAt: string;
  id: number;
  postID: number;
  editable: boolean;
}
