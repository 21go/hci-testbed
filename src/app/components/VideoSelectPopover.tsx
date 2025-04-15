"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import { Box, Stack, Typography, Divider } from "@mui/material";

export type Video = {
  id: string;
  thumbnailUrl: string;
  author: string;
  authorEmail: string;
  title: string;
};

export default function VideoStack() {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const querySnapshot = await getDocs(collection(db, "videos"));
      const data: Video[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        thumbnailUrl: doc.data().thumbnail,
        author: doc.data().author,
        title: doc.data().title,
        authorEmail: doc.data().authorEmail,
      }));
      setVideos(data);
    };

    fetchVideos();
  }, []);

  return (
    <Stack spacing={2} sx={{ width: "100%", maxWidth: 800, mx: "auto", py: 4 }}>
      {videos.map((video) => (
        <Link key={video.id} href={`/video/${video.id}`} passHref>
          <Stack
            direction="row"
            spacing={2}
            sx={{
              cursor: "pointer",
              "&:hover": { backgroundColor: "#f9f9f9" },
              p: 2,
              borderRadius: 2,
              transition: "background-color 0.2s ease-in-out",
            }}
          >
            <Box
              component="img"
              src={video.thumbnailUrl}
              alt={`Thumbnail for ${video.title}`}
              sx={{
                width: 180,
                height: 100,
                objectFit: "cover",
                borderRadius: 1,
              }}
            />
            <Stack spacing={0.5}>
              <Typography variant="subtitle1" fontWeight={600}>
                {video.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {video.author}
              </Typography>
            </Stack>
          </Stack>
        </Link>
      ))}
    </Stack>
  );
}
