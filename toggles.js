// based on https://monome.org/docs/norns/grid-recipes/#toggles
//
// press an unlit key and it toggles on at half-bright. hold a half-bright key to make it full-bright. hold it again to return to half-bright. press a half-bright key to toggle it off.
// 
// here, we enter state management territory. instead of defining single-state toggles for each key, we use additional gesture information to switch between two toggle states: half-bright and full-bright. this is the foundation of modified behavior.

import MonomeGrid from "monome-grid";

let grid;
let gridDirty = false;

const emptyGridArray = (x=16, y=8, data=0) => {
  return Array(y).fill().map(() => Array(x).fill(data));
}

let toggled = emptyGridArray(16,8,false);
let brightness = emptyGridArray(16,8,15);
let counter = emptyGridArray(16,8,null);

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
      toggled[y][x] ? brightness[y][x] : 0
    )
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
    }
  }
  gridDirty = true;
};

const shortPress = (x,y) => {
  if(!toggled[y][x]) {
    toggled[y][x] = true
    brightness[y][x] = 8
  } else if(toggled[y][x] && (brightness[y][x] == 8)) {
    toggled[y][x] = false
  }
  gridDirty = true;
}

const longPress = (x,y) => {
  // a long press waits for half a second
  setTimeout(() => {
    // then all this stuff happens
    if(toggled[y][x]) {
      // if it's still held down, toggle the brightness
      brightness[y][x] = (brightness[y][x] == 15) ? 8 : 15
    }
    if(counter[y][x]) {
      clearTimeout(counter[y][x])
    }
    counter[y][x] = null
    gridDirty = true;
  }, 500)
}

const main = async () => {
  grid = await MonomeGrid();
  gridDirty = true;
  setInterval(redrawClock, 1000 / 30);
  grid.key(gridKey);
};

main();
