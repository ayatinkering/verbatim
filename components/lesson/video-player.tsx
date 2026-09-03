"use client";

import React, { useState } from "react";
import posthog from "posthog-js";
import { Play } from "lucide-react";

export interface VideoPlayerProps {
  videoUrl?: string | null;
  posterUrl?: string | null;
  title: string;
  startSeconds?: number;
}

function parseVideoUrl(url?: string | null, startSeconds?: number): { type: "youtube" | "vimeo" | "direct" | "unknown"; embedUrl: string } | null {
  if (!url) return null;

  // YouTube parser
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    let embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&enablejsapi=1`;
    if (startSeconds && startSeconds > 0) {
      embedUrl += `&autoplay=1&start=${Math.floor(startSeconds)}`;
    }
    return { type: "youtube", embedUrl };
  }

  // Vimeo parser
  const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    let embedUrl = `https://player.vimeo.com/video/${videoId}`;
    if (startSeconds && startSeconds > 0) {
      embedUrl += `?autoplay=1#t=${Math.floor(startSeconds)}s`;
    }
    return { type: "vimeo", embedUrl };
  }

  // Direct MP4 or unknown embed
  return { type: url.match(/\.(mp4|webm|ogg)$/i) ? "direct" : "unknown", embedUrl: url };
}

export function VideoPlayer({ videoUrl, posterUrl, title, startSeconds }: VideoPlayerProps) {
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
  const parsed = parseVideoUrl(videoUrl, startSeconds);

  const handlePlayClick = () => {
    setHasStartedPlaying(true);
    posthog.capture("lesson_video_played", {
      video_url: videoUrl,
      lesson_title: title,
      start_seconds: startSeconds ?? 0,
    });
  };

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-neutral-950 shadow-lg border border-neutral-800 flex items-center justify-center group">
      {parsed?.type === "youtube" || parsed?.type === "vimeo" || (parsed?.type === "unknown" && parsed?.embedUrl.startsWith("http")) ? (
        <iframe
          src={parsed.embedUrl}
          title={title}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onLoad={() => {
            if (!hasStartedPlaying) {
              posthog.capture("video_embed_loaded", { lesson_title: title });
            }
          }}
        />
      ) : parsed?.type === "direct" ? (
        <video
          src={parsed.embedUrl}
          controls
          poster={posterUrl || undefined}
          className="w-full h-full object-cover"
          onPlay={handlePlayClick}
        >
          <track kind="captions" />
        </video>
      ) : (
        /* Fallback placeholder styled video container matching UI when no video URL is provided */
        <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 text-white p-6 select-none">
          {/* Subtle stylized background grid/pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
          
          <button
            type="button"
            onClick={handlePlayClick}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary-600/90 hover:bg-primary-500 text-white flex items-center justify-center shadow-2xl transition-all duration-300 transform group-hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400"
            aria-label="Play video"
          >
            <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white translate-x-0.5" />
          </button>
          
          <p className="mt-4 text-xs sm:text-sm font-medium text-neutral-400 text-center max-w-md">
            {title}
          </p>
        </div>
      )}
    </div>
  );
}
