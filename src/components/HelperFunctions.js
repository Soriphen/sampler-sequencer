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

/* This is a helper function specifically to fix the issue 
for when a trackChannel prop is deleted, 
leaving the wrong key name for all props. 
Basically, every trackChannel prop gets a renamed key that coincides with their "index value" so to speak.
For example, {track0: Channel, track2: Channel, track3: Channel} 
becomes {track0: Channel, track1: Channel, track2: Channel} */
function renameKeys(obj) {
  const keyValues = Object.keys(obj).map((key, index) => {
    const newKey = "track" + index || key;
    return { [newKey]: obj[key] };
  });
  return Object.assign({}, ...keyValues);
}

export { handleUpdate, renameKeys };
