// based on https://monome.org/docs/norns/grid-recipes/#momentary-keys
//
// classic earthsea-style interaction. press a key and it lights up as it’s held. release to extinguish.
// 
// the difference between this snippet and the ‘simple redraw’ is that the state of every key is being independently tracked. this means that the state of each key won’t influence the others – instead of only one lit key at a time, you can press many keys at once and they’ll all light up.

import MonomeGrid from "monome-grid";

const ROWS = 8;
const COLS = 16;

let grid;
let gridDirty = false;
let brightness = 15;

const emptyGridArray = (x=COLS, y=ROWS, data=0) => {
  return Array(y).fill().map(() => Array(x).fill(data));
}

let momentaryKeys = emptyGridArray();

const redrawClock = () => {
  if (gridDirty) {
    gridRedraw();
    gridDirty = false;
  }
};

const gridRedraw = () => {
  let gridData = emptyGridArray();
  gridData = gridData.map(( cols, y ) => 
    cols.map((led,x) => 
      momentaryKeys[y][x] ? brightness : 0
    )
  )
  grid.refresh(gridData);
};

const gridKey = (x, y, s) => {
  momentaryKeys[y][x] = s;
  gridDirty = true;
};

const main = async () => {
  grid = await MonomeGrid();
  gridDirty = true;
  setInterval(redrawClock, 1000 / 30);
  grid.key(gridKey);
};

main();
