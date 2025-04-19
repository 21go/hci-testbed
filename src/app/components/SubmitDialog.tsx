import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Button,
} from "@mui/material";
import PendingCommentItem from "./PendingComment";
import { Draft } from "@/type/Comment";

export default function SubmitDialog({
  open,
  onClose,
  onSubmit,
  isSending,
  pendingComments,
  onEditToggle,
  onEditChange,
  onDelete,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  isSending: boolean;
  pendingComments: Draft[];
  onEditToggle: (id: string) => void;
  onEditChange: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Would you like to submit all comments?</DialogTitle>
      <DialogContent>
        {pendingComments.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No comments yet.
          </Typography>
        ) : (
          pendingComments.map((comment) => (
            <PendingCommentItem
              key={comment.id}
              draft={comment}
              onEditToggle={onEditToggle}
              onEditChange={onEditChange}
              onDelete={onDelete}
            />
          ))
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>No</Button>
        <Button onClick={onSubmit} disabled={isSending}>
          {isSending ? "Sending..." : "Yes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
