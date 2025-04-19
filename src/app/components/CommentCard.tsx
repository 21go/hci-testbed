"use client";

import { useState } from "react";
import { Comment } from "@/type/Comment";
import { Stack, Typography, Popover, Tooltip } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";
import { writeReply } from "../lib/firestore";
import { formatCommentTime } from "../lib/commentTime";
import { UserResource } from "@clerk/types";
import DeletePopover from "./DeletePopover";
type CommentCardProps = {
  comment: Comment;
  replies?: Comment[];
  user: UserResource | null | undefined;
  replyingTo: string | null;
  setReplyingTo: (id: string | null) => void;
  replyText: string;
  setReplyText: (text: string) => void;
  replyAnon: boolean;
  setReplyAnon: (val: boolean) => void;
  seekTo: (time: number) => void;
  videoId: string;
};

export default function CommentCard({
  comment,
  user,
  replyingTo,
  setReplyingTo,
  replyText,
  setReplyText,
  replyAnon,
  setReplyAnon,
  seekTo,
  videoId,
}: CommentCardProps) {
  const isReplying = replyingTo === comment.id;
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [pendingDelete, setPending] = useState<Comment | null>(null);

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    deleteComment: Comment
  ) => {
    setAnchorEl(event.currentTarget);
    setPending(deleteComment);
  };

  const handleClose = () => {
    setAnchorEl(null); // closes the popover
    setPending(null); // clear selected comment
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleReply = (e: React.MouseEvent) => {
    e.stopPropagation();
    setReplyingTo(comment.id);
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user || !replyText.trim()) return;

    writeReply(
      replyText.trim(),
      user.id,
      replyAnon ? null : user.imageUrl,
      replyAnon ? null : user.fullName,
      comment,
      videoId
    );

    setReplyingTo(null);
    setReplyText("");
    setReplyAnon(false);
  };

  return comment.reply === null ? (
    <Tooltip
      title={`Click to jump to ${formatCommentTime(comment.timestamp)}s`}
      arrow
    >
      <div
        onClick={() => {
          seekTo(comment.timestamp);
        }}
        className={`p-3 border rounded cursor-pointer transition-colors bg-white shadow-sm ${
          comment.reply === null ? "hover:bg-gray-100" : ""
        }`}
      >
        <Stack direction="column">
          <Stack direction="row" spacing={3} alignItems="center">
            {comment.imgUrl ? (
              <img src={comment.imgUrl} className="w-8 h-8 rounded-full" />
            ) : (
              <Avatar sx={{ width: 32, height: 32 }}>
                <Person2RoundedIcon fontSize="small" />
              </Avatar>
            )}

            <Stack direction="column">
              <p className="text-xs text-gray-500">
                {comment.name ? comment.name : "Anonymous"}
              </p>
              <Typography variant="body1">{comment.text}</Typography>

              <Stack direction="row" alignItems="center" spacing={1}>
                {comment.reply === null && (
                  <>
                    <p className="text-xs text-gray-500">
                      ⏱ {formatCommentTime(comment.timestamp)}s
                    </p>
                    <span className="text-gray-300">|</span>
                  </>
                )}

                <p className="text-xs text-gray-500">
                  {comment.published.toDate().toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>

                {comment.userId !== user?.id && comment.reply === null && (
                  <>
                    <span className="text-gray-300">|</span>

                    <button
                      onClick={handleReply}
                      className="text-blue-500 hover:underline text-xs"
                    >
                      Reply
                    </button>
                  </>
                )}

                {comment.userId === user?.id && (
                  <>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClick(e, comment);
                        console.log("Delete triggered (not yet implemented)");
                      }}
                      className="text-red-500 hover:underline text-xs"
                    >
                      Delete
                    </button>
                  </>
                )}
              </Stack>
            </Stack>
          </Stack>
        </Stack>

        {isReplying && (
          <div
            className="mt-2 space-y-2"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full p-2 border text-sm rounded"
              placeholder="Write your reply..."
            />
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <input
                type="checkbox"
                checked={replyAnon}
                onChange={(e) => setReplyAnon(e.target.checked)}
                className="accent-blue-500"
              />
              <label>Reply anonymously</label>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setReplyingTo(null);
                  setReplyText("");
                  setReplyAnon(false);
                }}
                className="text-xs text-gray-600 hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="text-xs text-blue-600 hover:underline font-medium"
              >
                Submit
              </button>
            </div>
          </div>
        )}
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          {pendingDelete && (
            <DeletePopover
              comment={pendingDelete}
              videoId={videoId}
              onClose={handleClose}
            ></DeletePopover>
          )}
        </Popover>
      </div>
    </Tooltip>
  ) : (
    <div
      onClick={() => {
        if (comment.reply === null) {
          seekTo(comment.timestamp);
        }
      }}
      className={`p-3 border rounded cursor-pointer transition-colors bg-white shadow-sm ${
        comment.reply === null ? "hover:bg-gray-100" : ""
      }`}
    >
      <Stack direction="column">
        <Stack direction="row" spacing={3} alignItems="center">
          {comment.imgUrl ? (
            <img src={comment.imgUrl} className="w-8 h-8 rounded-full" />
          ) : (
            <Avatar sx={{ width: 32, height: 32 }}>
              <Person2RoundedIcon fontSize="small" />
            </Avatar>
          )}

          <Stack direction="column">
            <p className="text-xs text-gray-500">
              {comment.name ? comment.name : "Anonymous"}
            </p>
            <Typography variant="body1">{comment.text}</Typography>

            <Stack direction="row" alignItems="center" spacing={1}>
              {comment.reply === null && (
                <>
                  <p className="text-xs text-gray-500">
                    ⏱ {formatCommentTime(comment.timestamp)}s
                  </p>
                  <span className="text-gray-300">|</span>
                </>
              )}

              <p className="text-xs text-gray-500">
                {comment.published.toDate().toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>

              {comment.userId !== user?.id && comment.reply === null && (
                <>
                  <span className="text-gray-300">|</span>

                  <button
                    onClick={handleReply}
                    className="text-blue-500 hover:underline text-xs"
                  >
                    Reply
                  </button>
                </>
              )}

              {comment.userId === user?.id && (
                <>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick(e, comment);
                      console.log("Delete triggered (not yet implemented)");
                    }}
                    className="text-red-500 hover:underline text-xs"
                  >
                    Delete
                  </button>
                </>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      {isReplying && (
        <div
          className="mt-2 space-y-2"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="w-full p-2 border text-sm rounded"
            placeholder="Write your reply..."
          />
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <input
              type="checkbox"
              checked={replyAnon}
              onChange={(e) => setReplyAnon(e.target.checked)}
              className="accent-blue-500"
            />
            <label>Reply anonymously</label>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                setReplyingTo(null);
                setReplyText("");
                setReplyAnon(false);
              }}
              className="text-xs text-gray-600 hover:underline"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              Submit
            </button>
          </div>
        </div>
      )}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        {pendingDelete && (
          <DeletePopover
            comment={pendingDelete}
            videoId={videoId}
            onClose={handleClose}
          ></DeletePopover>
        )}
      </Popover>
    </div>
  );
}
