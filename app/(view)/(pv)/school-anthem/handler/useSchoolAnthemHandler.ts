'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/** The parts of the YouTube IFrame API the player uses. */
interface YouTubePlayer {
  playVideo: () => void;
  pauseVideo: () => void;
}

interface YouTubeApi {
  Player: new (
    elementId: string,
    options: { events: { onReady: () => void; onStateChange: (event: { data: number }) => void } }
  ) => YouTubePlayer;
}

declare global {
  interface Window {
    YT?: YouTubeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

/** YT.PlayerState.PLAYING */
const PLAYING = 1;

/**
 * The floating "Listen to the Anthem" button: plays and pauses the anthem video in the banner
 * (`videoId` is the iframe's id) through the YouTube IFrame API, loaded the first time it is
 * pressed. It shows only while the lyrics (`sectionId`) are on screen.
 */
export function useSchoolAnthemHandler(videoId: string, sectionId: string) {
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const player = useRef<YouTubePlayer | null>(null);
  const isReady = useRef(false);
  const isRequested = useRef(false);
  /** Whether the visitor still wants it playing once the player is ready. */
  const wantsPlay = useRef(false);

  useEffect(() => {
    const section = document.getElementById(sectionId);
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.12 });
    observer.observe(section);
    return () => observer.disconnect();
  }, [sectionId]);

  // Leaving the page stops the anthem.
  useEffect(
    () => () => {
      wantsPlay.current = false;
      if (isReady.current) player.current?.pauseVideo();
    },
    []
  );

  const createPlayer = useCallback(() => {
    if (!window.YT?.Player || !document.getElementById(videoId)) return;
    try {
      player.current = new window.YT.Player(videoId, {
        events: {
          onReady: () => {
            isReady.current = true;
            if (wantsPlay.current) player.current?.playVideo();
          },
          onStateChange: (event) => {
            const playing = event.data === PLAYING;
            setIsPlaying(playing);
            if (playing) setIsLoading(false);
          },
        },
      });
    } catch {
      player.current = null;
      setIsLoading(false);
    }
  }, [videoId]);

  const loadApi = useCallback(() => {
    if (isRequested.current) return;
    isRequested.current = true;
    if (window.YT?.Player) {
      createPlayer();
      return;
    }
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      createPlayer();
    };
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(script);
    }
  }, [createPlayer]);

  const toggle = () => {
    if (isPlaying || isLoading) {
      wantsPlay.current = false;
      if (isReady.current) player.current?.pauseVideo();
      setIsPlaying(false);
      setIsLoading(false);
      return;
    }
    wantsPlay.current = true;
    loadApi();
    if (isReady.current) player.current?.playVideo();
    else setIsLoading(true);
  };

  return { isVisible, isPlaying, isLoading, toggle };
}

export default useSchoolAnthemHandler;
