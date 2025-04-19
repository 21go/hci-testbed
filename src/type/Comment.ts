import { Timestamp } from "firebase/firestore";

export type Draft = {
  userId: string;
  id: string;
  text: string;
  timestamp: number;
  isEditing?: boolean;
  anon?: boolean;
};

export type Comment = {
  userId: string;
  id: string;
  text: string;
  timestamp: number;
  anon: boolean;
  published: Timestamp;
  name?: string | null;
  imgUrl?: string | null;
  reply: string | null;
};

export const commentFromDraft = (
  draft: Draft,
  reply_id: string | null
): Comment => ({
  userId: draft.userId,
  id: draft.id,
  text: draft.text,
  timestamp: draft.timestamp,
  anon: draft.anon ?? false,
  published: Timestamp.now(),
  reply: reply_id,
});
