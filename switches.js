// based on https://monome.org/docs/norns/grid-recipes/#switches
//
// foundation for a step sequencer – 16 columns of switches, stealing vertically.

import MonomeGrid from "monome-grid";

const ROWS = 8;
const COLS = 16;

let grid;
let gridDirty = false;
// since we want rows to steal from each other, we only set up unique indices for columns
let switches = Array(COLS).fill(7)

const main = async () => {
  grid = await MonomeGrid();
  gridDirty = true;
  setInterval(redrawClock, 1000 / 30);
  grid.key(gridKey);
};

const redrawClock = () => {
  if (gridDirty) {
    gridRedraw();
    gridDirty = false;
  }
};

const gridRedraw = () => {
  let gridData = Array(ROWS).fill().map(() => Array(COLS).fill(0));

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

main();
