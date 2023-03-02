export interface Post {
  id: number;
  content: string;
  createdAt: number;
  name: string;
  authorId: number;
  author: string;
}

export interface signUpFields {
  name: string;
  email: string;
  pass: string;
  confirmPass: string;
}

export interface tokenData {
  id: number;
  rank: "Admin" | "User";
  name: string;
}
