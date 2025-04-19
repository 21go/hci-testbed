import { Draft, Comment } from "@/type/Comment";
import { Timestamp } from "firebase/firestore";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { v4 as uuidv4 } from "uuid";

export function writeAnonComment(draft: Draft, id: string) {
  const comment: Comment = {
    ...draft,
    anon: draft.anon ?? false,
    published: Timestamp.now(),
    reply: null,
  };
  return addDoc(collection(db, "videos", id, "comments"), comment);
}

export function writeComment(
  draft: Draft,
  id: string,
  userImg: string | null,
  name: string | null
) {
  const comment: Comment = {
    ...draft,
    anon: draft.anon ?? false,
    published: Timestamp.now(),
    reply: null,
    imgUrl: userImg,
    name: name,
  };
  return addDoc(collection(db, "videos", id, "comments"), comment);
}

export function writeReply(
  text: string,
  userId: string,
  imgUrl: string | null,
  name: string | null,
  originalComment: Comment,
  videoId: string
) {
  console.log(name);
  console.log(imgUrl);
  const comment: Comment = {
    reply: originalComment.id,
    id: uuidv4(),
    text: text,
    timestamp: originalComment.timestamp,
    published: Timestamp.now(),
    userId: userId,
    anon: name || imgUrl ? false : true,
    name: name,
    imgUrl: imgUrl,
  };
  return addDoc(collection(db, "videos", videoId, "comments"), comment);
}

export async function handleDeleteComment(videoId: string, comment: Comment) {
  console.log(comment.id);
  console.log(videoId);
  const repliesQuery = query(
    collection(db, "videos", videoId, "comments"),
    where("reply", "==", comment.id)
  );

  const replySnapshot = await getDocs(repliesQuery);

  if (!replySnapshot.empty) {
    alert("You cannot delete this comment because it has replies.");
    return;
  }

  // Safe to delete
  await deleteDoc(doc(db, "videos", videoId, "comments", comment.id));
  console.log("Comment deleted");
}
