import { Draft } from "@/type/Comment";

export function generateCommentEmailHTML(pendingComments: Draft[]): string {
  return `
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
}
