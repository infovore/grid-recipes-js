// based on https://monome.org/docs/norns/grid-recipes/#state-machine
//
// press an unlit key and it toggles on at half-bright. hold a half-bright key to make it full-bright. hold it again to return to half-bright. press a half-bright key to toggle it off.
// 
// here, we enter state management territory. instead of defining single-state toggles for each key, we use additional gesture information to switch between two toggle states: half-bright and full-bright. this is the foundation of modified behavior.

import MonomeGrid from "monome-grid";

const ROWS = 8;
const COLS = 16;

let grid;
let gridDirty = false;

const emptyGridArray = (x=COLS, y=ROWS, data=0) => {
  return Array(y).fill().map(() => Array(x).fill(data));
}

let toggled = emptyGridArray(COLS,ROWS,false);
let alt = emptyGridArray(COLS,ROWS,false);
let counter = emptyGridArray(COLS,ROWS,null);

const redrawClock = () => {
  if (gridDirty) {
    gridRedraw();
    gridDirty = false;
  }
};

const gridRedraw = () => {
  let gridData = emptyGridArray();
  gridData = gridData.map(( cols, y ) => 
    cols.map((led,x) => {
      if(toggled[y][x] && !alt[y][x]) {
        return 15;
      } else if(alt[y][x]) {
        return toggled[y][x] ? 0 : 15
      }
    })
  )
  grid.refresh(gridData);
};

const gridKey = (x, y, s) => {
  if(s) {
    counter[y][x] = setTimeout(() => {
      longPress(x,y)
    }, 500)
  } else {
    if(counter[y][x]) {
      clearTimeout(counter[y][x]);
      counter[y][x] = null
      shortPress(x,y)
    } else {
      longRelease(x,y)
    }
  }
  gridDirty = true;
};

const longRelease = (x,y) => {
  alt[y][x] = false;
  gridDirty = true
}

const shortPress = (x,y) => {
  toggled[y][x] = !toggled[y][x]
  gridDirty = true;
}

const longPress = (x,y) => {
  // a long press fires after a 0.5s timeout
  alt[y][x] = true
  clearTimeout(counter[y][x])
  counter[y][x] = null
  gridDirty = true;
}

const main = async () => {
  grid = await MonomeGrid();
  gridDirty = true;
  setInterval(redrawClock, 1000 / 30);
  grid.key(gridKey);
};

main();
