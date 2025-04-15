"use client";

import { useEffect, useRef, useState } from "react";
import CommentBox from "./CommentBox";
import { Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import PendingCommentItem from "./PendingComment";
import Button from "@mui/material/Button";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

type Comment = {
  id: number;
  text: string;
  timestamp: number;
  isEditing?: boolean;
};

const formatTimestamp = (timeInSeconds: number) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export default function YouTubeCommentBox({
  id,
  authorEmail,
}: {
  id: string;
  authorEmail: string;
}) {
  const playerRef = useRef<any>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [pendingComments, setPendingComments] = useState<Comment[]>([]);
  const [commentCounter, setCommentCounter] = useState(0);
  const [open, setOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    (window as any).onYouTubeIframeAPIReady = () => {
      playerRef.current = new (window as any).YT.Player("yt-player", {
        height: "390",
        width: "640",
        videoId: id,
        events: {
          onReady: () => setPlayerReady(true),
        },
      });
    };
  }, [id]);

  const handleSubmitComment = (text: string) => {
    if (!playerRef.current) return;

    const timestamp = playerRef.current.getCurrentTime();

    const newComment: Comment = {
      id: commentCounter,
      text,
      timestamp,
    };

    setPendingComments((prev) => [newComment, ...prev]);
    setCommentCounter((prev) => prev + 1);
  };

  const handleDelete = (id: number) => {
    setPendingComments((prev) => prev.filter((c) => c.id !== id));
  };

  const handleEditToggle = (id: number) => {
    setPendingComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isEditing: !c.isEditing } : c))
    );
  };

  const handleEditChange = (id: number, newText: string) => {
    setPendingComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, text: newText } : c))
    );
  };

  const handleSubmitAll = async () => {
    if (!pendingComments.length) return;

    setIsSending(true);

    const htmlContent = `
      <h2>📺 New Comments on Your Video</h2>
      <ul>
        ${pendingComments
          .map((comment) => {
            const minutes = Math.floor(comment.timestamp / 60);
            const seconds = Math.floor(comment.timestamp % 60)
              .toString()
              .padStart(2, "0");
            return `<li><strong>${minutes}:${seconds}</strong> — ${comment.text}</li>`;
          })
          .join("")}
      </ul>
      <p>🧠 View all of them inside your app for more details.</p>
    `;

    try {
      await addDoc(collection(db, "mail"), {
        to: [authorEmail],
        message: {
          subject: `📩 You got new comments on your video`,
          html: htmlContent,
        },
      });

      console.log("✅ Email document created successfully.");
      setPendingComments([]);
      setOpen(false);
    } catch (error) {
      console.error("❌ Failed to send email:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex min-h-screen py-8 px-4 gap-8">
      {/* Main Section */}
      <div className="flex flex-col items-center w-[75%] max-w-5xl">
        <div id="yt-player" className="w-full h-[600px] mb-4" />
      </div>

      {/* Right Panel: Comment Input + Pending Comments */}
      <div
        className="relative w-[25%] max-w-md bg-gray-100 rounded shadow-md"
        style={{ height: "600px" }}
      >
        {/* Scrollable Comments Area */}
        <div className="overflow-y-auto h-full p-4 pb-20">
          <CommentBox onSubmit={handleSubmitComment} />

          <Typography variant="h6" gutterBottom className="mt-4">
            Pending Comments ({pendingComments.length})
          </Typography>

          {pendingComments.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No comments yet.
            </Typography>
          ) : (
            pendingComments.map((comment) => (
              <PendingCommentItem
                key={comment.id}
                id={comment.id}
                text={comment.text}
                timestamp={comment.timestamp}
                isEditing={comment.isEditing}
                onEditToggle={handleEditToggle}
                onEditChange={handleEditChange}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>

        {/* Floating Action Button */}
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
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Would you like to submit all comments?"}
          </DialogTitle>
          <DialogContent>
            {pendingComments.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No comments yet.
              </Typography>
            ) : (
              pendingComments.map((comment) => (
                <PendingCommentItem
                  key={comment.id}
                  id={comment.id}
                  text={comment.text}
                  timestamp={comment.timestamp}
                  isEditing={comment.isEditing}
                  onEditToggle={handleEditToggle}
                  onEditChange={handleEditChange}
                  onDelete={handleDelete}
                />
              ))
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>No</Button>
            <Button onClick={handleSubmitAll} disabled={isSending} autoFocus>
              {isSending ? "Sending..." : "Yes"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
