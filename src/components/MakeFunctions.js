import * as Tone from "tone";

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

export { makeGrid, makeTracks, makePlayer };
