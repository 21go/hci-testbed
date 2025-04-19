"use client";

import { useEffect, useRef } from "react";

type YouTubePlayerProps = {
  videoId: string;
  onReady: () => void;
  setPlayerRef: (ref: any) => void; // <-- add this
};

export default function YouTubePlayer({
  videoId,
  onReady,
  setPlayerRef,
}: YouTubePlayerProps) {
  const playerRef = useRef<any>(null);

  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    (window as any).onYouTubeIframeAPIReady = () => {
      playerRef.current = new (window as any).YT.Player("yt-player", {
        height: "390",
        width: "640",
        videoId,
        events: {
          onReady: () => {
            setPlayerRef(playerRef.current); // <-- set the player reference
            onReady();
          },
        },
      });
    };
  }, [videoId, onReady, setPlayerRef]);

  return <div id="yt-player" className="w-full h-[600px] mb-4" />;
}
