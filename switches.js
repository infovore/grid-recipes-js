// based on https://monome.org/docs/norns/grid-recipes/#switches
//
// foundation for a step sequencer – 16 columns of switches, stealing vertically.

import MonomeGrid from "monome-grid";

let grid;
let gridDirty = false;
// since we want rows to steal from each other, we only set up unique indices for columns
let switches = Array(16).fill(7)

const redrawClock = () => {
  if (gridDirty) {
    gridRedraw();
    gridDirty = false;
  }
};

const gridRedraw = () => {
  let gridData = Array(8).fill().map(() => Array(16).fill(0));

  // forEach iterator has the signature (value, index)
  // which neatly maps to our (y,x)
  switches.forEach((y,x) => {
    gridData[y][x] = 15
  })

  grid.refresh(gridData);
};

const gridKey = (x, y, s) => {
  if (s == 1) {
    switches[x] = y
    gridDirty = true;
  }
};

const main = async () => {
  grid = await MonomeGrid();
  gridDirty = true;
  setInterval(redrawClock, 1000 / 30);
  grid.key(gridKey);
};

main();
