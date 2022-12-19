import { UnstyledButton } from 'components-library/button';
import { Icon } from 'components-library/icon';
import { useCallback, useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { fadeIn, fadeOut, slideInBottom } from 'utils/keyframes';

export const ControlsBtn = styled(UnstyledButton)`
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  font-size: 60px;
  transition: 0.2s;
  background: ${(p) => p.theme.color.primary};
  border-radius: 50%;
  box-shadow: 0 8px 10px 4px ${(p) => p.theme.color.black}11;
  padding: 8px;
  box-shadow: 0 0 0 12px ${(p) => p.theme.color.primary}33;
  color: ${(p) => p.theme.color.buttonText};

  opacity: 0;
  animation: 0.4s 1s ${slideInBottom} forwards;

  @media (max-width: 800px) {
    font-size: 40px;
    box-shadow: 0 0 0 8px ${(p) => p.theme.color.primary}33;
  }
`;

const FullscreensBtn = styled(UnstyledButton)<{ $playing: boolean }>`
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 32px;
  padding: 8px;
  color: ${(p) => p.theme.color.lightText};
  transition: 0.2s;
  border-radius: ${(p) => p.theme.borderRadius.default};
  opacity: ${(p) => (p.$playing ? 0 : 1)};

  :hover {
    background-color: ${(p) => p.theme.color.black}11;
  }
`;

const VideoWrapper = styled.div`
  position: relative;
  cursor: pointer;

  :hover {
    ${ControlsBtn} {
      opacity: 1;
    }

    ${FullscreensBtn} {
      opacity: 1;
    }
  }
`;

const VideoComponent = styled.video`
  border-radius: ${(p) => p.theme.borderRadius.default};
  overflow: hidden;
  background: ${(p) => p.theme.color.text};
  width: 100%;
`;

const ControlsBtnWrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Video = ({ src, poster }: { src: string; poster?: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const handleControlClick = useCallback((control: 'play' | 'pause') => {
    if (control === 'play') {
      videoRef?.current?.play();
      setPlaying(true);
    } else if (control === 'pause') {
      videoRef?.current?.pause();
      setPlaying(false);
    }
  }, []);

  function toggleFullScreen(e: any) {
    e.stopPropagation();
    if (videoRef?.current?.requestFullscreen)
      videoRef?.current?.requestFullscreen();
  }

  const SHOW_NATIVE_CONTROLS = true;

  if (SHOW_NATIVE_CONTROLS) {
    return (
      <VideoComponent ref={videoRef} controls poster={poster}>
        <source src={src} type="video/mp4" />
      </VideoComponent>
    );
  }

  return (
    <VideoWrapper
      onClick={() => handleControlClick(playing ? 'pause' : 'play')}
    >
      <VideoComponent ref={videoRef} poster={poster}>
        <source src={src} type="video/mp4" />
      </VideoComponent>
      <ControlsBtnWrapper>
        <ControlsBtn>
          <Icon name={playing ? 'pause' : 'play_arrow'} />
        </ControlsBtn>

        <FullscreensBtn onClick={toggleFullScreen} $playing={playing}>
          <Icon name="fullscreen" />
        </FullscreensBtn>
      </ControlsBtnWrapper>
    </VideoWrapper>
  );
};

const VideoIframe = styled.iframe`
  border-radius: ${(p) => p.theme.borderRadius.default};
  background: ${(p) => p.theme.color.text};
  width: 100%;
  max-width: 1200px;
  aspect-ratio: 16 / 9;
  z-index: 99;
  margin: 8px;
`;

const YoutubeModalWrapper = styled.div``;

const CloseButton = styled(UnstyledButton)`
  font-size: 32px;
  transition: 0.2s;
  background: ${(p) => p.theme.color.buttonText}22;
  color: ${(p) => p.theme.color.buttonText};
  border-radius: 50%;
  padding: 8px;
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 99999;

  @media (max-width: 800px) {
    font-size: 28px;
    padding: 4px;
  }
`;

const VideoIframeWrapper = styled.div<{ isClosing: boolean }>`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  animation: 0.4s ${fadeIn} forwards;

  ${(p) =>
    p.isClosing &&
    css`
      animation: 0.4s ${fadeOut} forwards;
    `}

  @media (max-width: 800px) {
    backdrop-filter: blur(4px);
    background: ${(p) => p.theme.color.black}77;
  }
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${(p) => p.theme.color.black}bb;

  @media (max-width: 800px) {
    backdrop-filter: blur(4px);
    background: ${(p) => p.theme.color.black}77;
  }
`;

export const YoutubeModal = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenClosing, setFullScreenIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setTimeout(() => {
      setIsFullScreen(false);
      setFullScreenIsClosing(false);
    }, 400);
    setFullScreenIsClosing(true);
  }, []);

  return (
    <>
      <ControlsBtnWrapper onClick={() => setIsFullScreen(true)}>
        <ControlsBtn>
          <Icon name="play_arrow" />
        </ControlsBtn>
      </ControlsBtnWrapper>

      {isFullScreen && (
        <YoutubeModalWrapper>
          <YoutubeModalVideo
            onClose={handleClose}
            fullScreenIsClosing={fullScreenClosing}
          />
        </YoutubeModalWrapper>
      )}
    </>
  );
};

const YoutubeModalVideo = ({
  onClose,
  fullScreenIsClosing,
}: {
  onClose: () => void;
  fullScreenIsClosing: boolean;
}) => {
  useEffect(() => {
    // Stop scrolling when the modal open
    document.body.style.overflow = 'hidden';

    // Cleanup the body overflow style on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <VideoIframeWrapper isClosing={fullScreenIsClosing}>
      <Backdrop onClick={onClose} />

      <VideoIframe
        src="https://www.youtube.com/embed/1DSMKghws4Q"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />

      <CloseButton onClick={onClose}>
        <Icon name="close" />
      </CloseButton>
    </VideoIframeWrapper>
  );
};
