export interface Comment {
  id: string;
  username: string;
  email: string;
  homepage: string;
  text: string;
  created_at: string;
  parent: string | null;
  replies?: Comment[];
}

export interface ICommentList {
  count: number;
  next: string | null;
  previous: string | null;
  results: IComment[];
}

export interface IComment {
  id: string;
  username: string;
  text: string;
  created_at: string;
  parent: string | null;
}
