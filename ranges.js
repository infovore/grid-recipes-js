// based on https://monome.org/docs/norns/grid-recipes/#ranges
//
// hold a grid key and press another in the same row to establish a range. pressing a single key will establish a new start point for the range, so long as the entire range can fit. establishing a negative range resets to 1.


import MonomeGrid from "monome-grid";

const ROWS = 8;
const COLS = 16;

let grid;
let gridDirty = false;

// no, you can't just `fill` this with the object
// because then every range is actually the same object in memory;
// this will instantiate a new object for each range
let ranges = Array(ROWS).fill().map(r => ({
  x1: 0,
  x2: 0,
  held: 0
}))

const redrawClock = () => {
  if (gridDirty) {
    gridRedraw();
    gridDirty = false;
  }
};

const gridRedraw = () => {
  let gridData = Array(ROWS).fill().map(() => Array(COLS).fill(0));

  ranges.forEach(( range, y ) => {
    for(let x = range.x1; x <= range.x2; x++) {
      gridData[y][x] = 15
    }
  })

  grid.refresh(gridData);
};

const gridKey = (x, y, s) => {
  if(s == 1) {
    ranges[y].held++;
    const difference = ranges[y].x2 - ranges[y].x1
    const original = {...ranges[y]}

    if(ranges[y].held == 1) { // if there's one key down
      ranges[y].x1 = x;
      ranges[y].x2 = x;
      if(difference > 0) { // and if there's a range
        if(x + difference < COLS) { // and if the new start point can accommodate the range...
          ranges[y].x2 = x + difference // set the range's start point to the selectedc key.
        } else { // otherwise, if there isn't enough room to move the range...
          // restore the original positions.
          ranges[y].x1 = original.x1
          ranges[y].x2 = original.x2
        }
      }
    } else if(ranges[y].held == 2) { // if there's two keys down...
      ranges[y].x2 = x // set a range endpoint
    }

    if(ranges[y].x2 < ranges[y].x1) { // if our second press is before our first
      ranges[y].x2 = ranges[y].x1 // destroy the range
    }
  } else { // key is released
    ranges[y].held = ranges[y].held - 1 // reduce held count by one
  }
  gridDirty = true;
};

const main = async () => {
  grid = await MonomeGrid();
  gridDirty = true;
  setInterval(redrawClock, 1000 / 30);
  grid.key(gridKey);
};

main();
