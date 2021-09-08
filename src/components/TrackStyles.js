import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faPlay,
  faStop,
  faPlus,
  faMinus
} from "@fortawesome/free-solid-svg-icons";
import styled, { css, keyframes } from "styled-components";

const StopIcon = <FontAwesomeIcon icon={faStop} />;
const PlayIcon = <FontAwesomeIcon icon={faPlay} />;
const RightArrow = <FontAwesomeIcon icon={faArrowRight} />;
const LeftArrow = <FontAwesomeIcon icon={faArrowLeft} />;
const PlusIcon = <FontAwesomeIcon icon={faPlus} />;
const MinusIcon = <FontAwesomeIcon icon={faMinus} />;

const TrackBtnContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  ${(props) =>
    props.isTrackOrMute &&
    css`
      .btn {
        width: 100px;
        height: 40px;

        &::before {
          content: "";
          width: 140px;
          height: 140px;
          position: absolute;
          top: 170%;
          left: -10%;
          border-radius: 45%;

          animation: ${spin} 10s linear infinite;
        }
      }
    `}
`;

const spin = keyframes`
  0% {
    transform: translate(-50%, -75%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -75%) rotate(360deg);
  }
`;

const TrackBtnStyle = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  ${(props) => props.borderColor}

  ${(props) => {
    if (props.isTrackOrMute) {
      return `
        overflow: hidden;
        &::before {
          background-color: #dedddf;
        }
        &::after {
          content: "${props.trackKey}";
          color: #dedddf;
          z-index: 1;
          font-weight: 700;
          font-size: 15px;
          position: absolute;
          bottom: 0;
          right: 10%;
        }
        ${props.isActive && `${props.trackSelectColor}`}
      `;
    } else {
      return `
        &::after {
          content: "";
          height: ${props.isActive ? "6px" : "3px"};
          width: ${props.isActive ? "23px" : "4px"};
          position: absolute;
          left: 104%;
          background-color: ${props.inputColor || "black"};
          transition: width 0.25s ease, height 0.08s ease;
        }
        &::before {
          content: "";
          height: 6px;
          width: 7px;
          position: absolute;
          left: -22%;
          background-color: ${props.inputColor || "black"};
        }
        &:hover::after {
          height: 3px;
          width: ${props.isActive ? "23px" : "7px"};
        }
      `;
    }
  }}
`;

const TrackInfoPane = styled.div`
  display: flex;
`;

const TrackInfoStyle = styled.div`
  display: flex;
  border-radius: 4px;
  color: #dedddf;
  width: 100%;
`;

const RemoveButton = styled.button`
  border: none;
  display: flex;
  color: #dedddf;
  width: 50px;
  height: 40px;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  background: linear-gradient(145deg, #313131, #292929);
  box-shadow: 2px 2px 2px #2e2e2e, -2px -2px 2px #2e2e2e;

  &:hover {
    background: linear-gradient(145deg, #211e21, #1c191c);
    box-shadow: 1px 1px 2px #1f1c1f, -1px -1px 2px #1f1c1f;
  }
`;

export {
  TrackBtnContainer,
  TrackBtnStyle,
  TrackInfoPane,
  TrackInfoStyle,
  RemoveButton,
  StopIcon,
  PlayIcon,
  RightArrow,
  LeftArrow,
  PlusIcon,
  MinusIcon
};
