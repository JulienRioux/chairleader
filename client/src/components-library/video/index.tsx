import { UnstyledButton } from 'components-library/button';
import { Icon } from 'components-library/icon';
import { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';

const ControlsBtn = styled(UnstyledButton)<{ $playing: boolean }>`
  color: ${(p) => p.theme.color.buttonText};
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  font-size: 60px;
  opacity: ${(p) => (p.$playing ? 0 : 1)};
  transition: 0.2s;
  background: ${(p) => p.theme.color.primary};
  border-radius: 50%;
  box-shadow: 0 8px 10px 4px ${(p) => p.theme.color.black}11;
  padding: 8px;
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
  box-shadow: 0 8px 10px 4px ${(p) => p.theme.color.text}11;
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

export const Video = ({ src }: { src: string }) => {
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
      <VideoComponent ref={videoRef} controls>
        <source src={src} type="video/mp4" />
      </VideoComponent>
    );
  }

  return (
    <VideoWrapper
      onClick={() => handleControlClick(playing ? 'pause' : 'play')}
    >
      <VideoComponent ref={videoRef}>
        <source src={src} type="video/mp4" />
      </VideoComponent>
      <ControlsBtnWrapper>
        <ControlsBtn $playing={playing}>
          <Icon name={playing ? 'pause' : 'play_arrow'} />
        </ControlsBtn>

        <FullscreensBtn onClick={toggleFullScreen} $playing={playing}>
          <Icon name="fullscreen" />
        </FullscreensBtn>
      </ControlsBtnWrapper>
    </VideoWrapper>
  );
};
