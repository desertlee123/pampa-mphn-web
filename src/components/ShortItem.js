// /src/components/ShortItem.js
"use client";
import YouTube from "react-youtube";
import { useRef, useEffect } from "react";

export function getYoutubeId(url) {
  const reg = /(?:shorts\/|v=|youtu\.be\/)([^&?/]+)/;
  const match = url.match(reg);
  return match ? match[1] : null;
}

export default function ShortItem({ url, visible }) {
  const id = getYoutubeId(url);
  const playerRef = useRef(null);

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: visible ? 1 : 0,
      controls: 0,
      modestbranding: 1,
      rel: 0,
      playsinline: 1,
      fs: 0,
      iv_load_policy: 3,
      disablekb: 1,
    },
  };

  useEffect(() => {
    if (visible && playerRef.current) {
      playerRef.current.playVideo();
    } else if (playerRef.current) {
      playerRef.current.pauseVideo();
    }
  }, [visible]);

  return (
    <div style={{
      width: "100%",
      height: "100%",
      background: "black",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <div style={{
        width: "100%",
        height: "100%",
        maxWidth: "100%",
        maxHeight: "100%",
        aspectRatio: "9/16",
        position: "relative"
      }}>
        <YouTube
          videoId={id}
          opts={opts}
          onReady={(e) => {
            playerRef.current = e.target;
            const iframe = e.target.getIframe();
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            iframe.style.position = "absolute";
            iframe.style.top = "0";
            iframe.style.left = "0";
          }}
          onEnd={() => {
            if (visible && playerRef.current) {
              playerRef.current.seekTo(0);
              playerRef.current.playVideo();
            }
          }}
          onError={(e) => console.log("YouTube error:", e)}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
      </div>
    </div>
  );
}
