import {
  TrackBtnStyle,
  TrackInfoStyle,
  RemoveButton,
  RightArrow,
  LeftArrow,
  MinusIcon
} from "./TrackStyles";
import classNames from "classnames";
import Visualizer from "./Visualizer";
import { DropdownButton, ModalBody } from "react-bootstrap";
import Repeatable from "react-repeatable";

const TrackSelectButton = ({
  sample,
  isActive,
  group,
  inputColor,
  trackSelectColor,
  borderColor,
  trackKey,
  handleRemoveTrack,
  trackIndex,
  ...rest
}) => {
  return (
    <div className="d-flex align-items-center">
      <RemoveButton onClick={() => handleRemoveTrack(trackIndex)}>
        {MinusIcon}
      </RemoveButton>
      <TrackBtnStyle
        className={classNames(
          "btn btn-lg m-1",
          { "btn-danger": group === "bass" },
          { "btn-primary": group === "bd" },
          { "btn-warning": group === "perc" },
          { "btn-success": group === "patt" },
          `${group + "-track"}`
        )}
        inputColor={inputColor(group)}
        trackSelectColor={trackSelectColor(group)}
        borderColor={borderColor(group)}
        isActive={isActive}
        isTrackOrMute={true}
        trackKey={trackKey}
        {...rest}
      ></TrackBtnStyle>
    </div>
  );
};

const TrackInfo = ({
  name,
  isActive,
  group,
  inputColor,
  trackKey,
  wave,
  sampleLeft,
  sampleRight,
  handleGroupSelect,
  trackIndex
}) => {
  if (isActive) {
    return (
      <TrackInfoStyle // Takes props from TrackInfo to be passed as props to the styled-component TrackInfoStyle for dynamic styling purposes
        inputColor={inputColor(group)}
        isActive={isActive}
      >
        <div id="track-group-container">
          <TrackGroup
            handleGroupSelect={handleGroupSelect}
            name={name}
            trackKey={trackKey}
            trackIndex={trackIndex}
          ></TrackGroup>
          <div
            className="d-flex"
            style={{ flex: "1", justifyContent: "flex-end" }}
          >
            <button className="btn" id="sample-left" onClick={sampleLeft}>
              {LeftArrow}
            </button>
            <button className="btn" id="sample-right" onClick={sampleRight}>
              {RightArrow}
            </button>
          </div>
        </div>
        <Visualizer inputColor={inputColor(group)} wave={wave} />
      </TrackInfoStyle>
    );
  } else {
    return null;
  }
};

const TrackGroup = ({ handleGroupSelect, name, trackKey, trackIndex }) => {
  return (
    <>
      <DropdownButton
        id={"track-group-button"}
        title={name + " Track " + trackKey}
      >
        <ModalBody
          className="d-flex justify-content-around"
          id={"track-group-modal"}
        >
          <button
            className="btn btn-danger d-flex justify-content-center align-items-center"
            style={{ height: "40px", width: "110px" }}
            onClick={() => {
              handleGroupSelect("bass", trackIndex);
            }}
          >
            Bass
          </button>
          <button
            className="btn btn-primary d-flex justify-content-center align-items-center"
            style={{ height: "40px", width: "110px" }}
            onClick={() => {
              handleGroupSelect("bd", trackIndex);
            }}
          >
            Bass Drum
          </button>
          <button
            className="btn btn-warning d-flex justify-content-center align-items-center"
            style={{ height: "40px", width: "110px", color: "white" }}
            onClick={() => {
              handleGroupSelect("perc", trackIndex);
            }}
          >
            Percussion
          </button>
          <button
            className="btn btn-success d-flex justify-content-center align-items-center"
            style={{ height: "40px", width: "110px" }}
            onClick={() => {
              handleGroupSelect("patt", trackIndex);
            }}
          >
            Pattern
          </button>
        </ModalBody>
      </DropdownButton>
    </>
  );
};

const TrackMuteButton = ({
  isActive,
  group,
  inputColor,
  borderColor,
  ...rest
}) => {
  return (
    <TrackBtnStyle
      className={classNames(
        "btn btn-lg m-1 d-flex",
        { "btn-danger": group === "bass" },
        { "btn-primary": group === "bd" },
        { "btn-warning": group === "perc" },
        { "btn-success": group === "patt" },
        `${group + "-mute"}`
      )}
      inputColor={inputColor(group)}
      borderColor={borderColor(group)}
      isActive={isActive}
      isTrackOrMute={false}
      {...rest}
    ></TrackBtnStyle>
  );
};

const SampleButton = ({ isActive, group, ...rest }) => {
  return (
    <button
      className={classNames(
        "btn btn-lg m-1",
        { "btn-outline-danger": group === "bass" },
        { "btn-outline-primary": group === "bd" },
        { "btn-outline-warning": group === "perc" },
        { "btn-outline-success": group === "patt" },
        { "btn-danger": isActive && group === "bass" },
        { "btn-primary": isActive && group === "bd" },
        { "btn-warning": isActive && group === "perc" },
        { "btn-success": isActive && group === "patt" }
      )}
      {...rest}
    ></button>
  );
};

const RepeatableBtn = ({ onClick, minusOrPlus, ...props }) => {
  return (
    <Repeatable
      tag="button"
      type="button"
      onHold={() => {
        minusOrPlus ? onClick(true) : onClick(false);
      }}
      onRelease={() => {
        minusOrPlus ? onClick(true) : onClick(false);
      }}
      {...props}
    ></Repeatable>
  );
};

export {
  TrackSelectButton,
  TrackInfo,
  TrackMuteButton,
  SampleButton,
  RepeatableBtn
};
