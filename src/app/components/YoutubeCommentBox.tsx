"use client";

import { useState } from "react";
import { Stack, Typography } from "@mui/material";
import { useUser } from "@clerk/nextjs";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { v4 as uuidv4 } from "uuid";

import CommentTimeline from "./CommentTimeline";
import YouTubePlayer from "./YoutubePlayer";
import PendingCommentsPanel from "./PendingCommentsPanel";
import SubmitDialog from "./SubmitDialog";
import { Draft, Comment } from "@/type/Comment";
import { generateCommentEmailHTML } from "../lib/generateCommentEmailHTML";
import { writeComment, writeAnonComment } from "../lib/firestore";

export default function YouTubeCommentBox({
  id,
  authorEmail,
  title,
}: {
  id: string;
  authorEmail: string;
  title: string;
}) {
  const [playerReady, setPlayerReady] = useState(false);
  const [playerRef, setPlayerRef] = useState<any>(null);

  const [anon, setAnon] = useState(false);
  const [pendingComments, setPendingComments] = useState<Draft[]>([]);
  const [open, setOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { user } = useUser();

  const handleAnonToggle = () => setAnon((prev) => !prev);

  const handleSubmitComment = (text: string) => {
    if (!playerRef) return;

    const timestamp = playerRef.getCurrentTime();
    const newComment: Draft = {
      id: uuidv4(),
      text,
      timestamp,
      userId: user?.id || "anonymous",
      anon,
    };

    setPendingComments((prev) => [newComment, ...prev]);
  };

  const handleEditToggle = (id: string) => {
    setPendingComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isEditing: !c.isEditing } : c))
    );
  };

  const handleEditChange = (id: string, newText: string) => {
    setPendingComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, text: newText } : c))
    );
  };

  const handleDelete = (id: string) => {
    setPendingComments((prev) => prev.filter((c) => c.id !== id));
  };

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmitAll = async () => {
    if (!pendingComments.length) return;
    setIsSending(true);

    try {
      const htmlContent = generateCommentEmailHTML(pendingComments);
      const commentWrites = anon
        ? pendingComments.map((draft) => {
            writeAnonComment(draft, id);
          })
        : pendingComments.map((draft) => {
            const imgUrl = user?.imageUrl || null;
            const name = user?.fullName || null;
            writeComment(draft, id, imgUrl, name);
          });

      const email = addDoc(collection(db, "mail"), {
        to: [authorEmail],
        message: {
          subject: `📩 You got new comments on your video`,
          html: htmlContent,
        },
      });

      await Promise.all([commentWrites, email]);
      await setPendingComments([]);
      setOpen(false);
    } catch (err) {
      console.error("❌ Failed to submit comments:", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex min-h-screen py-8 px-4 gap-8">
      {/* Video Player */}
      <Stack width={"100%"}>
        <YouTubePlayer
          videoId={id}
          onReady={() => setPlayerReady(true)}
          setPlayerRef={setPlayerRef}
        />
        <Typography variant="h4">{title}</Typography>
        <CommentTimeline
          videoId={id}
          getCurrentTime={() => playerRef?.getCurrentTime?.() || 0}
          seekTo={(time: number) => playerRef?.seekTo?.(time, true)}
        />
      </Stack>

      {/* Comment Panel */}
      <div
        className="relative w-[25%] max-w-md bg-gray-100 rounded shadow-md"
        style={{ height: "600px" }}
      >
        <div className="overflow-y-auto h-full p-4 pb-20">
          <PendingCommentsPanel
            anon={anon}
            onAnonToggle={handleAnonToggle}
            pendingComments={pendingComments}
            onSubmitComment={handleSubmitComment}
            onEditToggle={handleEditToggle}
            onEditChange={handleEditChange}
            onDelete={handleDelete}
          />
        </div>

        {pendingComments.length > 0 && (
          <div className="absolute bottom-0 left-0 w-full px-4 py-3 bg-gray-200 border-t border-gray-300 flex justify-end">
            <button
              onClick={handleClickOpen}
              className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700"
            >
              Submit All
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <SubmitDialog
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmitAll}
        isSending={isSending}
        pendingComments={pendingComments}
        onEditToggle={handleEditToggle}
        onEditChange={handleEditChange}
        onDelete={handleDelete}
      />
    </div>
  );
}
