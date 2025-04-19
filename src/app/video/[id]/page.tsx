"use client";

import YouTubeCommentBox from "@/app/components/YoutubeCommentBox";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Video } from "@/app/components/VideoSelectPopover";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

export default function HomePage() {
  const [videoDoc, setVideoDoc] = useState<Video | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchDoc = async () => {
      if (!id) return;
      const docRef = doc(db, "videos", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setVideoDoc({
          id: id,
          thumbnailUrl: docSnap.data().thumbnail,
          author: docSnap.data().author,
          title: docSnap.data().title,
          authorEmail: docSnap.data().authorEmail,
        });
      }
    };
    fetchDoc();
  }, [id]);

  if (!videoDoc) {
    return (
      <main className="p-6">
        <p className="text-lg text-gray-600">Loading video...</p>
      </main>
    );
  }

  return (
    <main className="p-6">
      <YouTubeCommentBox
        id={id}
        authorEmail={videoDoc.authorEmail}
        title={videoDoc.title}
      />
    </main>
  );
}
