// based on https://monome.org/docs/norns/grid-recipes/#meters
//
// 16 vertical meters, touch in a column to select the meter and its height

import MonomeGrid from "monome-grid";

const ROWS = 8;
const COLS = 16;

let grid;
let gridDirty = false;

const emptyGridArray = (x=COLS, y=ROWS, data=0) => {
  return Array(y).fill().map(() => Array(x).fill(data));
}

let meters = {
  heights: Array(COLS).fill(0),
  selected: 0
}

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
  let gridData = emptyGridArray();
  meters.heights.forEach((height,x) => {
    // we have to use ROWS-1 because js arrays are 0-indexed
    // ie, the grid has EIGHT rows, their indices are 0-7
    for(let y = ROWS-1; y >= ROWS-height; y--) {
      gridData[y][x] = (meters.selected == x) ? 15 : 7
    }
  })
  gridData[7][meters.selected] = 15;
  grid.refresh(gridData);
};

const gridKey = (x, y, s) => {
  if(s) {
    meters.selected = x
    meters.heights[x] = ROWS - y
  }
  gridDirty = true;
};

main();
