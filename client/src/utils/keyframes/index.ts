import { keyframes } from 'styled-components';

export const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

export const fadeOut = keyframes`
  0% { opacity: 1; }
  100% { opacity: 0; }
`;

export const modalIn = keyframes`
  0% { 
    transform: translateY(100px);
    opacity: 0;
  }
  100% { 
    transform: translateY(0); 
    opacity: 1;
  }
`;

export const drawerIn = keyframes`
  0% { 
    transform: translateX(480px);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  100% { 
    transform: translateY(0); 
    opacity: 1;
  }
`;

export const drawerOut = keyframes`
  0% { 
    transform: translateX(0);
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% { 
    transform: translateX(480px);
    opacity: 0;
  }
`;

export const slideIn = keyframes`
  0% { 
    opacity: 0; 
    transform: translateY(-20px); 
  }
  100% { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

export const slideOut = keyframes`
  0% { 
    opacity: 1; 
    transform: translateY(0px); 
  }
  100% { 
    opacity: 0; 
    transform: translateY(-20px); 
  }
`;

export const slideInNoFade = keyframes`
  0% { 
    opacity: 1;
    transform: translateY(-48px); 
  }
  100% { 
    opacity: 1;
    transform: translateY(0); 
  }
`;

export const slideInBottom = keyframes`
  0% { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  100% { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

export const slideOutBottom = keyframes`
  0% { 
    opacity: 1; 
    transform: translateY(0); 
  }
  100% { 
    opacity: 0; 
    transform: translateY(20px); 
  }
`;

export const slideInLeft = keyframes`
  0% { 
    opacity: 0; 
    transform: translateX(-60px); 
  }
  100% { 
    opacity: 1; 
    transform: translateX(0); 
  }
`;

export const messageIn = keyframes`
  0% { 
    opacity: 0; 
    transform: translateY(-44px); 
  }
  100% { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

export const messageOut = (height = 48) => keyframes`
  0% { 
    opacity: 1; 
    transform: translateY(0); 
    /* height: auto; */
  }
  100% { 
    opacity: 0; 
    transform: translateY(-48px); 
    // Height + margin
    margin-top: -${height + 8}px;
  }
`;

export const flashingAnimation = keyframes`
  0% { 
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
`;

export const skeletonAnimation = keyframes`
  0% { 
    opacity: 1;
  }
  50% {
    opacity: .7;
  }
  100% {
    opacity: 1;
  }
`;

export const dropDownIn = keyframes`
  0% { 
    opacity: 0;
    transform: translateY(-4px); 
  }
  50%{
    opacity: 1;
  }
  100% { 
    transform: translateY(0px); 
  }
`;

export const dropDownOut = keyframes`
  0% { 
    opacity: 1;
    transform: translateY(0); 
  }
  100% { 
    opacity: 0;
    transform: translateY(-4px); 
  }
`;

export const topLoader = keyframes`
	0% {
    width: 0%;
    left: 0%;
  }
  10% {
    width: 0%;
    left: 0%;
  }
  50% {
    width: 100%;
    left: 0%;
  }
  90% {
    width: 100%;
    left: 100%;
  }
  100% {
    width: 100%;
    left: 100%;
  }
`;

export const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const scaleIn = keyframes`
  0% { 
    opacity: 0; 
    transform: scale(0); 
  }
  100% { 
    opacity: 1; 
    transform: scale(1); 
  }
`;

export const numberSlideIn = keyframes`
  0% { 
    opacity: 0; 
    transform: translateY(-16px); 
  }
  100% { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

export const launchIconSlide = keyframes`
  0% { 
    transform: translatex(-8px);
    opacity: 0;
  }
  100% { 
    transform: translatex(0); 
    opacity: 1;
  }
`;
