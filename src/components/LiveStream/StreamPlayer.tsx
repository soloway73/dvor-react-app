import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import './StreamPlayer.css';

interface StreamPlayerProps {
  streamUrl: string;
  autoPlay?: boolean;
  authToken?: string | null;
}

export const StreamPlayer: React.FC<StreamPlayerProps> = ({
  streamUrl,
  autoPlay = true,
  authToken,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const authHeader = authToken ? `Basic ${authToken}` : '';

    if (Hls.isSupported()) {
      hlsRef.current = new Hls({
        debug: false,
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        xhrSetup: (xhr) => {
          if (authHeader) {
            xhr.setRequestHeader('Authorization', authHeader);
          }
        },
      });

      hlsRef.current.loadSource(streamUrl);
      hlsRef.current.attachMedia(video);

      hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
        if (autoPlay) {
          video.play().catch(console.error);
        }
      });

      hlsRef.current.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          console.error('HLS fatal error:', data);
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      if (autoPlay) {
        video.play().catch(console.error);
      }
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [streamUrl, autoPlay, authToken]);

  return (
    <div className="stream-player">
      <video
        ref={videoRef}
        controls
        autoPlay={autoPlay}
        muted
        playsInline
        className="video-element"
      />
    </div>
  );
};
