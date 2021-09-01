import React from "react";
import Sketch from "react-p5";

const style = { display: "flex", width: "100%", height: "auto" };

export default function Visualizer({ inputColor, wave }) {
  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(150, 100).parent(canvasParentRef).style("width", "100%");
  };

  const draw = (p5) => {
    p5.background(inputColor);
    p5.stroke("#dedddf");
    p5.noFill();
    p5.strokeWeight(1);

    let buffer = wave.current.getValue(); // This returns the waveform of the current time (a snapshot) as an array of values that represent the samples in the waveform (at that current time)
    let start = 0;
    /* We scan through the buffer for a point where its adjacent value is negative while the value itself is positive
    in order to have a trigger point from where p5 draws the line. Basically, have p5 always draw from the 0 point at x1 by returning the index at which the two adjacent samples intersect the zero threshold */
    for (let i = 1; i < buffer.length; i++) {
      if (buffer[i - 1] < 0 && buffer[i] >= 0) {
        start = i;
        break;
      }
    }

    let end = start + buffer.length / 2;
    for (let i = start; i < buffer.length; i++) {
      let x1 = p5.map(i - 1, start, end, 0, p5.width);
      let y1 = p5.map(buffer[i - 1], -1, 1, 0, p5.height);

      let x2 = p5.map(i, start, end, 0, p5.width);
      let y2 = p5.map(buffer[i], -1, 1, 0, p5.height);
      p5.line(x1, y1, x2, y2);
    }
  };

  return <Sketch setup={setup} draw={draw} style={style} />;
}
