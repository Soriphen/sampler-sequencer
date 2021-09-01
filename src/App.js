import "./sass/styles.scss";
import React, { useState, useRef } from "react";
import classNames from "classnames";
import * as Tone from "tone";
import {
  bass1,
  bd1,
  bd2,
  bd3,
  bd4,
  bd5,
  bd6,
  bd7,
  bd8,
  bd9,
  bd10,
  perc1,
  perc2,
  perc3,
  patt1,
  patt2,
  patt3,
  patt4
} from "./assets/rseq-sounds/index";
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
import Visualizer from "./components/Visualizer";
import { DropdownButton, ModalBody } from "react-bootstrap";
import Repeatable from "react-repeatable";

/************* Styles Beginning *************/

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

/************* Styles End *************/

/************* Grid, Track, and Players Function Beginnning *************/

// This creates an information grid for each button on the sequencer to have their own info like whether they are active or not
function makeGrid(samples) {
  const grid = [];
  for (let i = 0; i < 32; i++) {
    let column = samples.map((val) => {
      return {
        sample: val.sample,
        isActive: false,
        group: val.group,
        name: val.name
      };
    });
    grid.push(column);
  }
  return grid;
}

function makeTracks(samples, isActive = false) {
  let column = samples.map((val) => {
    return {
      isActive: isActive,
      group: val.group,
      name: val.name
    };
  });
  return column;
}

function makePlayer(sample) {
  const player = new Tone.Player(sample);
  return player;
}

const sampleRef = {
  bass: { BS1: bass1 },
  bd: {
    BD1: bd1,
    BD2: bd2,
    BD3: bd3,
    BD4: bd4,
    BD5: bd5,
    BD6: bd6,
    BD7: bd7,
    BD8: bd8,
    BD9: bd9,
    BD10: bd10
  },
  perc: { PC1: perc1, PC2: perc2, PC3: perc3 },
  patt: { PT1: patt1, PT2: patt2, PT3: patt3, PT4: patt4 }
};

/************* Grid, Track, and Players Function End *************/

/************* Buttons Components Beginning *************/

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
          style={{ width: "500px" }}
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

/************* Buttons Components End *************/

function handleUpdate(tracks, grid, tracksSelect, tracksMute, trackClicked) {
  let newGrid, newTrackActive, newTracksMute;
  newGrid = grid.map((column) =>
    column.map((cell, cellIndex) => {
      let cellCopy = { ...cell };
      if (cellIndex === trackClicked) {
        cellCopy.sample = tracks.current[trackClicked].sample;
        cellCopy.name = tracks.current[trackClicked].name;
        cellCopy.group = tracks.current[trackClicked].group;
      }
      return cellCopy;
    })
  );
  newTrackActive = tracksSelect.map((track) => {
    let trackCopy = { ...track };
    if (trackCopy.isActive) {
      trackCopy.name = tracks.current[trackClicked].name;
      trackCopy.group = tracks.current[trackClicked].group;
    }
    return trackCopy;
  });
  newTracksMute = tracksMute.map((track, trackIndex) => {
    let trackCopy = { ...track };
    if (trackIndex === trackClicked) {
      trackCopy.name = tracks.current[trackClicked].name;
      trackCopy.group = tracks.current[trackClicked].group;
    }
    return trackCopy;
  });

  return {
    newGrid,
    newTrackActive,
    newTracksMute
  };
}

export default function App() {
  const [title, setTitle] = useState("Untitled 1");

  const wave = useRef();
  if (!wave.current) wave.current = new Tone.Waveform();

  const trackChannels = useRef();
  if (!trackChannels.current)
    trackChannels.current = {
      track0: new Tone.Channel().toDestination().connect(wave.current), // This will connect the output of each track into wave in order to turn the audio into a Waveform object to extract its sample data for p5.js later on
      track1: new Tone.Channel().toDestination().connect(wave.current),
      track2: new Tone.Channel().toDestination().connect(wave.current),
      track3: new Tone.Channel().toDestination().connect(wave.current),
      track4: new Tone.Channel().toDestination().connect(wave.current)
    };

  const tracks = useRef();
  if (!tracks.current)
    tracks.current = [
      // I might have to use this for tracks instead of a sample bank
      {
        group: "bass",
        sample: makePlayer(sampleRef.bass.BS1).connect(
          trackChannels.current.track0
        ),
        name: Object.keys(sampleRef.bass)[0]
      },
      {
        group: "bd",
        sample: makePlayer(sampleRef.bd.BD1).connect(
          trackChannels.current.track1
        ),
        name: Object.keys(sampleRef.bd)[0]
      },
      {
        group: "bd",
        sample: makePlayer(sampleRef.bd.BD2).connect(
          trackChannels.current.track2
        ),
        name: Object.keys(sampleRef.bd)[1]
      },
      {
        group: "perc",
        sample: makePlayer(sampleRef.perc.PC1).connect(
          trackChannels.current.track3
        ),
        name: Object.keys(sampleRef.perc)[0]
      },
      {
        group: "patt",
        sample: makePlayer(sampleRef.patt.PT1).connect(
          trackChannels.current.track4
        ),
        name: Object.keys(sampleRef.patt)[0]
      }
    ];
  const [grid, setGrid] = useState(makeGrid(tracks.current));
  const [tracksMute, setTracksMute] = useState(
    makeTracks(tracks.current, true)
  );
  const [tracksSelect, setTracksSelect] = useState(
    makeTracks(tracks.current, false)
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentColumn, setCurrentColumn] = useState(null);
  const sequencer = useRef(null);
  const [steps, setSteps] = useState(32); // I will eventually implement a feature to extend the amount of bars in the sequencer using this state
  const seqSteps = Array(steps)
    .fill(null)
    .map((v, i) => i); // Creates an empty array with an array length of 16 and fills it with null to have something inside to map over and replace with an index number
  let emptySeq = Array(steps)
    .fill(null)
    .map((v, i) => []);
  /* We initialize the sequence to be an empty array with the variable "steps" amount of empty arrays inside so that
  we can have the sequencer still run even if there are no pads pressed */
  let sequence = useRef(emptySeq);
  const [bpm, setBpm] = useState(Tone.Transport.bpm.value);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  // This is for the track buttons' styled components to have their colours dynamically consistent
  const handleInputColor = (group) => {
    if (group === "bass") {
      return "#dd0044";
    } else if (group === "bd") {
      return "#0074c6";
    } else if (group === "perc") {
      return "#dd4d00";
    } else if (group === "patt") {
      return "#008300";
    } else {
      return "black";
    }
  };

  const handleTrackSelectColor = (group) => {
    if (group === "bass") {
      return "box-shadow: 9px 9px 18px #e03e6e, -9px -9px 18px #f8447a;";
    } else if (group === "bd") {
      return "box-shadow:  9px 9px 18px #4598d4, -9px -9px 18px #4da8ea;";
    } else if (group === "perc") {
      return "box-shadow:  9px 9px 18px #db753f, -9px -9px 18px #f28145;";
    } else if (group === "patt") {
      return "box-shadow:  9px 9px 18px #33b233, -9px -9px 18px #39c439;";
    } else {
      return "black";
    }
  };

  const handleBorderColor = (group) => {
    if (group === "bass") {
      return "box-shadow: 1px 1px 2px #d10040, -1px -1px 2px #ff0056;";
    } else if (group === "bd") {
      return "box-shadow: 1px 1px 2px #006ebb, -1px -1px 2px #0094fd;";
    } else if (group === "perc") {
      return "box-shadow: 1px 1px 2px #d14900, -1px -1px 2px #ff6300;";
    } else if (group === "patt") {
      return "box-shadow: 1px 1px 2px #007c00, -1px -1px 2px #00a800;";
    } else {
      return "black";
    }
  };

  const handleTrackClick = (trackClicked, group) => {
    let resetTrackActive = tracksSelect.map((track, trackIndex) => {
      let trackCopy = { ...track };
      if (trackCopy.isActive) {
        trackCopy.isActive = false;
      }
      return trackCopy;
    });
    let newTracksSelect = resetTrackActive.map((track, trackIndex) => {
      let trackCopy = { ...track };
      if (trackIndex === trackClicked) {
        trackCopy.isActive = !track.isActive;
      }
      return trackCopy;
    });
    setTracksSelect(newTracksSelect);
  };

  const handleSampleLeft = (name, group, trackClicked) => {
    let newGrid, newTrackActive, newTracksMute, update;
    const keys = Object.keys(sampleRef[group]);
    const values = Object.values(sampleRef[group]);

    if (keys.indexOf(name) > -1 && keys.indexOf(name) - 1 > -1) {
      tracks.current[trackClicked] = {
        group: group,
        sample: makePlayer(values[keys.indexOf(name) - 1]).connect(
          trackChannels.current["track" + trackClicked]
        ),
        name: keys[keys.indexOf(name) - 1]
      };

      update = handleUpdate(
        tracks,
        grid,
        tracksSelect,
        tracksMute,
        trackClicked
      );
      newGrid = update.newGrid;
      newTrackActive = update.newTrackActive;
      newTracksMute = update.newTracksMute;
    } else {
      tracks.current[trackClicked] = {
        group: group,
        sample: makePlayer(values[keys.length - 1]).connect(
          trackChannels.current["track" + trackClicked]
        ),
        name: keys[keys.length - 1]
      };

      update = handleUpdate(
        tracks,
        grid,
        tracksSelect,
        tracksMute,
        trackClicked
      );
      newGrid = update.newGrid;
      newTrackActive = update.newTrackActive;
      newTracksMute = update.newTracksMute;
    }

    // Updates the sequence to be used for Tone.Sequence with the new sample from the updated grid
    sequence.current = []; // I might have to turn this all into a function since the lines of code below are used more than once in this program
    newGrid.map((column) => {
      let active = [];
      column.map((cell) => {
        return cell.isActive && active.push(cell.sample);
      });
      return sequence.current.push(active);
    });

    setGrid(newGrid);
    setTracksSelect(newTrackActive);
    setTracksMute(newTracksMute);
  };

  const handleSampleRight = (name, group, trackClicked) => {
    let newGrid, newTrackActive, newTracksMute, update;
    const keys = Object.keys(sampleRef[group]);
    const values = Object.values(sampleRef[group]);

    if (keys.indexOf(name) > -1 && keys.indexOf(name) + 1 < keys.length) {
      tracks.current[trackClicked] = {
        group: group,
        sample: makePlayer(values[keys.indexOf(name) + 1]).connect(
          trackChannels.current["track" + trackClicked]
        ),
        name: keys[keys.indexOf(name) + 1]
      };

      update = handleUpdate(
        tracks,
        grid,
        tracksSelect,
        tracksMute,
        trackClicked
      );
      newGrid = update.newGrid;
      newTrackActive = update.newTrackActive;
      newTracksMute = update.newTracksMute;
    } else {
      // This handles the case when you reach the end of the available samples to cycle through, in which the sample selection will be reset to the first sample
      tracks.current[trackClicked] = {
        group: group,
        sample: makePlayer(values[0]).connect(
          trackChannels.current["track" + trackClicked]
        ),
        name: keys[0]
      };

      update = handleUpdate(
        tracks,
        grid,
        tracksSelect,
        tracksMute,
        trackClicked
      );
      newGrid = update.newGrid;
      newTrackActive = update.newTrackActive;
      newTracksMute = update.newTracksMute;
    }

    // Updates the sequence to be used for Tone.Sequence with the new sample from the updated grid
    sequence.current = []; // I might have to turn this all into a function since the lines of code below are used more than once in this program
    newGrid.map((column) => {
      let active = [];
      column.map((cell) => {
        return cell.isActive && active.push(cell.sample);
      });
      return sequence.current.push(active);
    });

    setGrid(newGrid);
    setTracksSelect(newTrackActive);
    setTracksMute(newTracksMute);
  };

  const handleTrackMute = (trackClicked, group) => {
    /* A copy of tracksMute is needed because we can't simply set tracks[trackClicked].isActive to its opposite value
    as the state won't be saved and rendered, we would have to use setState, and when we use setState
    we would have to make sure that we are providing a full copy of the tracks array with all updated objects inside returned */
    let newTracksMute = tracksMute.map((track, trackIndex) => {
      // This updates the cell info for each button to reflect whether they are muted or not
      let trackCopy = { ...track };
      if (trackIndex === trackClicked) {
        trackCopy.isActive = !track.isActive;
      }
      return trackCopy;
    });
    trackChannels.current["track" + trackClicked].mute = !trackChannels.current[
      "track" + trackClicked
    ].mute;
    setTracksMute(newTracksMute);
  };

  // This is to switch a clicked sample's isActive property to true or false
  const handleSampleClick = (columnClicked, sampleClicked, group) => {
    /* A copy of grid is necessary because if we do setGrid then it will overwrite 
    the grid with just a value. We have to make sure grid is still kept while 
    doing setGrid, so in that case we would need a copy of grid with the updated 
    work done on it and then setGrid will have that inside */
    let newGrid = grid.map((column, columnIndex) =>
      column.map((cell, cellIndex) => {
        let cellCopy = { ...cell };
        if (columnIndex === columnClicked && cellIndex === sampleClicked) {
          cellCopy.isActive = !cell.isActive;
        }
        return cellCopy;
      })
    );
    sequence.current = [];
    newGrid.map((column) => {
      let active = [];
      column.map((cell) => {
        return cell.isActive && active.push(cell.sample);
      });
      return sequence.current.push(active);
    });
    setGrid(newGrid);
  };

  const handleGroupSelect = (selectedGroup, trackClicked) => {
    let newGrid, newTrackActive, newTracksMute, update;

    tracks.current[trackClicked] = {
      group: selectedGroup,
      sample: makePlayer(Object.values(sampleRef[selectedGroup])[0]).connect(
        trackChannels.current["track" + trackClicked]
      ),
      name: Object.keys(sampleRef[selectedGroup])[0]
    };

    update = handleUpdate(tracks, grid, tracksSelect, tracksMute, trackClicked);
    newGrid = update.newGrid;
    newTrackActive = update.newTrackActive;
    newTracksMute = update.newTracksMute;

    sequence.current = []; // I might have to turn this all into a function since the lines of code below are used more than once in this program
    newGrid.map((column) => {
      let active = [];
      column.map((cell) => {
        return cell.isActive && active.push(cell.sample);
      });
      return sequence.current.push(active);
    });

    setGrid(newGrid);
    setTracksSelect(newTrackActive);
    setTracksMute(newTracksMute);
  };

  const handleAddTrack = () => {
    let newGrid, newTrackActive, newTracksMute;
    // This adds a new channel to trackChannels
    trackChannels.current[
      "track" + Object.keys(trackChannels.current).length
    ] = new Tone.Channel().toDestination().connect(wave.current);
    // This adds a new track
    tracks.current.push({
      group: "bd",
      sample: makePlayer(sampleRef.bd.BD1).connect(
        trackChannels.current[
          "track" + (Object.keys(trackChannels.current).length - 1)
        ]
      ),
      name: Object.keys(sampleRef.bd)[0]
    });
    // This adds the 16 new cells for the new track
    newGrid = grid.map((column) => {
      let newColumn = [...column];
      newColumn.push({
        group: "bd",
        sample: makePlayer(sampleRef.bd.BD1).connect(
          trackChannels.current[
            "track" + (Object.keys(trackChannels.current).length - 1)
          ]
        ),
        name: Object.keys(sampleRef.bd)[0]
      });
      return newColumn;
    });
    // This adds a new tracksSelect object for the new Track in order for it to open up its additional controls when clicked
    newTrackActive = [...tracksSelect];
    newTrackActive.push({
      isActive: false,
      group: "bd",
      name: Object.keys(sampleRef.bd)[0]
    });
    // This adds a new tracksMute object for the new Track in order for it to have a mute function
    newTracksMute = [...tracksMute];
    newTracksMute.push({
      isActive: true,
      group: "bd",
      name: Object.keys(sampleRef.bd)[0]
    });

    setGrid(newGrid);
    setTracksSelect(newTrackActive);
    setTracksMute(newTracksMute);
  };

  const handleRemoveTrack = (trackClicked) => {
    let newGrid, newTrackActive, newTracksMute;
    // This removes the selected channel from trackChannels
    delete trackChannels.current["track" + trackClicked];
    // This removes the track
    tracks.current.splice(trackClicked, 1);
    // This adds the 16 new cells for the new track
    newGrid = grid.map((column) => {
      let newColumn = [...column];
      newColumn.splice(trackClicked, 1);
      return newColumn;
    });
    // This adds a new tracksSelect object
    newTrackActive = [...tracksSelect];
    newTrackActive.splice(trackClicked, 1);
    // This removes a new tracksMute object on the selected track
    newTracksMute = [...tracksMute];
    newTracksMute.splice(trackClicked, 1);

    sequence.current = [];
    newGrid.map((column) => {
      let active = [];
      column.map((cell) => {
        return cell.isActive && active.push(cell.sample);
      });
      return sequence.current.push(active);
    });

    setGrid(newGrid);
    setTracksSelect(newTrackActive);
    setTracksMute(newTracksMute);
  };

  const handleBpm = (addOrSub) => {
    if (addOrSub) {
      if (bpm < 999) {
        setBpm((prevState) => prevState + 1);
      }
    } else {
      if (bpm > 0) {
        setBpm((prevState) => prevState - 1);
      }
    }
    Tone.Transport.bpm.value = bpm;
  };

  const playMusic = async () => {
    if (isPlaying) {
      setIsPlaying(false);
      setCurrentColumn(null);
      await Tone.Transport.stop();
      await sequencer.current.stop();
      await sequencer.current.clear();
      await sequencer.current.dispose();
      return;
    }
    sequencer.current = new Tone.Sequence(
      (time, columnIndex) => {
        setCurrentColumn(columnIndex);
        sequence.current[columnIndex].forEach((v) => {
          return v.start(time, 0);
        });
      },
      seqSteps,
      "16n"
    );
    setIsPlaying(true);
    await Tone.start();
    await Tone.Transport.start();
    await sequencer.current.start();
  };

  return (
    <div className="App">
      <div id="sequencer">
        <div id="upper-control-bar">
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            style={{ fontWeight: "700" }}
            onChange={handleTitleChange}
          />
          <button
            className="d-flex justify-content-center align-items-center btn btn-secondary"
            id={"play-button"}
            onClick={() => playMusic()}
          >
            {isPlaying ? StopIcon : PlayIcon}
          </button>
          <div id="bpm-container">
            <p className="m-0" id={"bpm-title"}>
              BPM {bpm}
            </p>
            <div id={"inc-dec-bpm-container"}>
              <RepeatableBtn
                minusOrPlus={false}
                onClick={handleBpm}
                className={"btn btn-dark btn-sm"}
                id={"decrease-bpm"}
              >
                {MinusIcon}
              </RepeatableBtn>
              <RepeatableBtn
                minusOrPlus={true}
                onClick={handleBpm}
                className={"btn btn-dark btn-sm"}
                id={"increase-bpm"}
              >
                {PlusIcon}
              </RepeatableBtn>
            </div>
          </div>
        </div>
        <div id="sample-container">
          <TrackBtnContainer isTrackOrMute={true}>
            {tracksSelect.map(({ sample, isActive, group }, trackIndex) => (
              <TrackSelectButton
                sample={sample}
                group={group}
                isActive={isActive}
                inputColor={handleInputColor}
                trackSelectColor={handleTrackSelectColor}
                borderColor={handleBorderColor}
                onClick={() => handleTrackClick(trackIndex, group)}
                key={group + "-track" + trackIndex}
                trackKey={trackIndex + 1}
                handleRemoveTrack={handleRemoveTrack}
                trackIndex={trackIndex}
              />
            ))}
          </TrackBtnContainer>
          <TrackBtnContainer className="me-3">
            {tracksMute.map(({ sample, isActive, group }, trackIndex) => (
              <TrackMuteButton
                sample={sample}
                group={group}
                isActive={isActive}
                inputColor={handleInputColor}
                borderColor={handleBorderColor}
                onClick={() => handleTrackMute(trackIndex, group)}
                key={group + "-mute" + trackIndex}
              />
            ))}
          </TrackBtnContainer>
          {grid.map((column, columnIndex) => (
            <div
              className={classNames("sample-column", {
                "sample-column--active": currentColumn === columnIndex
              })}
              key={"sample-column" + columnIndex}
            >
              {column.map(({ sample, isActive, group }, sampleIndex) => (
                <SampleButton
                  sample={sample}
                  group={group}
                  isActive={isActive}
                  onClick={() =>
                    handleSampleClick(columnIndex, sampleIndex, group)
                  }
                  key={group + "-sample" + sampleIndex}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="d-grid gap-2">
          <button
            className="d-flex justify-content-center align-items-center btn btn-secondary"
            id="add-track-button"
            onClick={() => handleAddTrack()}
          >
            {PlusIcon}
          </button>
        </div>
        <TrackInfoPane>
          {tracksSelect.map(({ isActive, group, name }, trackIndex) => (
            <TrackInfo
              name={name}
              isActive={isActive}
              group={group}
              inputColor={handleInputColor}
              key={group + trackIndex}
              trackKey={trackIndex + 1}
              wave={wave}
              sampleLeft={() => handleSampleLeft(name, group, trackIndex)}
              sampleRight={() => handleSampleRight(name, group, trackIndex)}
              handleGroupSelect={handleGroupSelect}
              trackIndex={trackIndex}
            ></TrackInfo>
          ))}
        </TrackInfoPane>
      </div>
    </div>
  );
}
