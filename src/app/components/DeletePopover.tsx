"use client";

import { Comment } from "@/type/Comment";
import { Avatar, Stack, Typography, Button, Divider } from "@mui/material";
import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";
import { formatCommentTime } from "../lib/commentTime";
import { handleDeleteComment } from "../lib/firestore";

type DeletePopoverProps = {
  comment: Comment;
  videoId: string;
  onClose: () => void;
};

export default function DeletePopover({
  comment,
  videoId,
  onClose,
}: DeletePopoverProps) {
  return (
    <Stack spacing={2} sx={{ p: 2, minWidth: 500 }}>
      <Typography variant="h6" fontWeight="bold">
        Delete this comment?
      </Typography>

      <Typography variant="body2" color="text.secondary">
        This action cannot be undone.
      </Typography>

      <div className="p-3 border rounded bg-white shadow-sm">
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
                {comment.name || "Anonymous"}
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
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </div>

      <Divider />

      <Stack direction="row" justifyContent="flex-end" spacing={1}>
        <Button
          size="small"
          variant="text"
          color="inherit"
          onClick={() => {
            onClose();
          }}
        >
          Cancel
        </Button>
        <Button
          size="small"
          variant="contained"
          color="error"
          onClick={async () => {
            await handleDeleteComment(videoId, comment);
          }}
        >
          Delete
        </Button>
      </Stack>
    </Stack>
  );
}
