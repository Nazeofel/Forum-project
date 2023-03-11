export type notificationStatus = "seen" | "unseen";

export type serverResponseObject = Record<string, any>;

export type Action =
  | "delete-post"
  | "create-post"
  | "post-comment"
  | "delete-comment"
  | "update-rank"
  | "sign-in"
  | "sign-up"
  | "edit-comment";
