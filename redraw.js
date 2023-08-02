// based on https://monome.org/docs/norns/grid-recipes/#simple-redraw
//
// all keys are set up as switches, so only one can be lit at a time.
// press a new one, it lights up as the previous selection goes out.

import MonomeGrid from "monome-grid";

//
let grid;
let gridDirty = false;
let show = [0, 0];
let brightness = 15;

// one liner for 8x16 array
let gridData = Array(8)
  .fill()
  .map(() => Array(16).fill(0));

const redrawClock = () => {
  if (gridDirty) {
    gridRedraw();
    gridDirty = false;
  }
};

const gridRedraw = () => {
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 16; x++) {
      if (x == show[0] && y == show[1]) {
        gridData[y][x] = brightness;
      } else {
        gridData[y][x] = 0;
      }
    }
  }
  grid.refresh(gridData);
};

const gridKey = (x, y, s) => {
  if (s == 1) {
    show = [x, y];
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
