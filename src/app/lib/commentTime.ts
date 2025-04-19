import { Comment } from "@/type/Comment";

export function formatCommentTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function groupCommentsByTime(comments: Comment[], windowSize = 30) {
  const groups: { timestamp: number; comments: Comment[] }[] = [];

  comments.forEach((comment) => {
    const group = groups.find(
      (g) => Math.abs(g.timestamp - comment.timestamp) <= windowSize
    );

    if (group) {
      group.comments.push(comment);
    } else {
      groups.push({ timestamp: comment.timestamp, comments: [comment] });
    }
  });

  return groups;
}
