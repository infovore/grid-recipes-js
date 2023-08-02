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

const redrawClock = () => {
  if (gridDirty) {
    gridRedraw();
    gridDirty = false;
  }
};

const gridRedraw = () => {
  // one liner for making a 8x16 array
  let gridData = Array(8).fill().map(() => Array(16).fill(0));

  gridData = gridData.map(( cols, y ) => 
    cols.map((_led,x) => 
      (x == show[0] && y == show[1]) ? brightness : 0
    )
  )
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
