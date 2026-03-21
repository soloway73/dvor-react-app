import React, { useEffect, useRef } from 'react';
import Hls, { HlsConfig } from 'hls.js';
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
  const playbackRateCheckRef = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const authHeader = authToken ? `Basic ${authToken}` : '';

    if (Hls.isSupported()) {
      const hlsConfig: Partial<HlsConfig> = {
        debug: false,
        enableWorker: true,
        // Максимальная плавность (приоритет стабильности)
        lowLatencyMode: false,
        // Большой буфер для предотвращения подтормаживаний
        maxBufferLength: 90,
        maxMaxBufferLength: 180,
        maxBufferSize: 90 * 1000 * 1000, // 90 MB
        maxBufferHole: 0.5,
        // Back buffer для экономии памяти
        backBufferLength: 120,
        // Плавный старт с низким качеством
        startLevel: 0,
        startFragPrefetch: true,
        // Повторы при ошибках
        manifestLoadingMaxRetry: 5,
        manifestLoadingRetryDelay: 1000,
        levelLoadingMaxRetry: 5,
        levelLoadingRetryDelay: 1000,
        fragLoadingMaxRetry: 10,
        fragLoadingRetryDelay: 1000,
        // Консервативное переключение уровней (избегать резких скачков)
        abrBandWidthFactor: 0.8,
        abrBandWidthUpFactor: 0.5,
        abrMaxWithRealBitrate: true,
        // Большая задержка от live-края для стабильности (15-20 сек)
        liveSyncDurationCount: 15,
        liveMaxLatencyDurationCount: 30,
        liveDurationInfinity: true,
        // AES настройки
        enableSoftwareAES: true,
        minAutoBitrate: 0,
        // Прочие настройки
        stretchShortVideoTrack: true,
        appendErrorMaxRetry: 5,
        fpsDroppedMonitoringPeriod: 5000,
        fpsDroppedMonitoringThreshold: 0.2,
        // Обязательные свойства
        preferManagedMediaSource: false,
        preserveManualLevelOnError: false,
        ignorePlaylistParsingErrors: false,
        enableInterstitialPlayback: false,
        interstitialAppendInPlace: true,
        interstitialLiveLookAhead: 10,
        // Настройка XHR
        xhrSetup: (xhr) => {
          if (authHeader) {
            xhr.setRequestHeader('Authorization', authHeader);
          }
          if (xhr instanceof XMLHttpRequest) {
            xhr.withCredentials = false;
          }
        },
      };

      hlsRef.current = new Hls(hlsConfig as HlsConfig);

      hlsRef.current.loadSource(streamUrl);
      hlsRef.current.attachMedia(video);

      // Ждём накопления буфера перед стартом
      hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('Manifest parsed, waiting for buffer...');
      });

      // Устанавливаем нормальную скорость воспроизведения
      video.defaultPlaybackRate = 1.0;
      video.playbackRate = 1.0;

      hlsRef.current.on(Hls.Events.BUFFER_CREATED, () => {
        console.log('Buffer created, starting playback...');
        if (autoPlay && video) {
          // Небольшая задержка перед стартом для накопления буфера
          setTimeout(() => {
            // Гарантируем нормальную скорость перед стартом
            video.playbackRate = 1.0;
            video.defaultPlaybackRate = 1.0;
            video.play().catch((err) => {
              console.error('Auto-play failed:', err);
            });
          }, 1000);
        }
      });

      // Мониторинг и коррекция скорости воспроизведения
      playbackRateCheckRef.current = window.setInterval(() => {
        if (video && video.playbackRate !== 1.0) {
          console.warn(`Playback rate changed to ${video.playbackRate}, resetting to 1.0`);
          video.playbackRate = 1.0;
        }
      }, 2000);

      video.addEventListener('ratechange', () => {
        if (video.playbackRate !== 1.0) {
          console.debug(`Rate changed to ${video.playbackRate}`);
        }
      });

      hlsRef.current.on(Hls.Events.LEVEL_LOADED, (_, data) => {
        // Логирование для отладки
        console.debug('HLS level loaded:', data.details?.targetduration);
      });

      hlsRef.current.on(Hls.Events.FRAG_LOADED, (_, data) => {
        // Логирование для отладки
        console.debug('HLS fragment loaded:', data.frag.sn);
      });

      hlsRef.current.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          console.error('HLS fatal error:', data);
          // Автоматическое восстановление
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log('Network error, recovering...');
              hlsRef.current?.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log('Media error, recovering...');
              hlsRef.current?.recoverMediaError();
              break;
            default:
              console.error('Unrecoverable error');
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      if (autoPlay) {
        video.play().catch(console.error);
      }
    }

    return () => {
      if (playbackRateCheckRef.current) {
        clearInterval(playbackRateCheckRef.current);
      }
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
