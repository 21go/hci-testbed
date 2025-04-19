"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { Comment } from "@/type/Comment";
import { useUser } from "@clerk/nextjs";
import CommentCard from "./CommentCard";
import { Popover } from "@headlessui/react";

type Props = {
  videoId: string;
  getCurrentTime: () => number;
  seekTo: (time: number) => void;
};

function groupComments(comments: Comment[]) {
  const topLevel: Comment[] = [];
  const replies: Record<string, Comment[]> = {};

  comments.forEach((comment) => {
    if (!comment.reply) {
      topLevel.push(comment);
    } else {
      if (!replies[comment.reply]) {
        replies[comment.reply] = [];
      }
      replies[comment.reply].push(comment);
    }
  });

  return { topLevel, replies };
}

export default function CommentTimeline({
  videoId,
  getCurrentTime,
  seekTo,
}: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyAnon, setReplyAnon] = useState(false);

  const { user } = useUser();

  // Fetch and order comments by timestamp
  const [grouped, setGrouped] = useState<{
    topLevel: Comment[];
    replies: Record<string, Comment[]>;
  }>({ topLevel: [], replies: {} });

  useEffect(() => {
    const q = query(
      collection(db, "videos", videoId, "comments"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedComments = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Comment[];

      setGrouped(groupComments(loadedComments));
    });

    return () => unsubscribe();
  }, [videoId]);

  const handleReply = (e: React.MouseEvent, comment: Comment) => {
    e.stopPropagation();
    setReplyingTo(comment.id);
  };

  return (
    <div className="mt-4 px-2 pb-4 space-y-4">
      {grouped.topLevel.map((comment) => (
        <div key={comment.id} className="space-y-2">
          {/* Top-level comment */}
          <CommentCard
            comment={comment}
            user={user}
            replyingTo={replyingTo}
            setReplyingTo={setReplyingTo}
            replyText={replyText}
            setReplyText={setReplyText}
            replyAnon={replyAnon}
            setReplyAnon={setReplyAnon}
            seekTo={seekTo}
            videoId={videoId}
          />

          {/* Replies (if any) */}
          {grouped.replies[comment.id]?.length > 0 && (
            <div className="ml-6 space-y-2 border-l border-gray-200 pl-4">
              {grouped.replies[comment.id].map((reply) => (
                <CommentCard
                  key={reply.id}
                  comment={reply}
                  user={user}
                  replyingTo={replyingTo}
                  setReplyingTo={setReplyingTo}
                  replyText={replyText}
                  setReplyText={setReplyText}
                  replyAnon={replyAnon}
                  setReplyAnon={setReplyAnon}
                  seekTo={seekTo}
                  videoId={videoId}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
