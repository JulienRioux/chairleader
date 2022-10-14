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

const VideoWrapper = styled.div`
  position: relative;
  cursor: pointer;

  :hover {
    ${ControlsBtn} {
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
      </ControlsBtnWrapper>
    </VideoWrapper>
  );
};
