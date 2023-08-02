# Grid Recipes

Porting the monome grid recipes (https://monome.org/docs/norns/grid-recipes) from Norns to Javascript.

One of the big changes in this port is that instead of using norns inbuilt `clock` functions, we end up using Javascript timeouts - which are also a nice way of handling asynchronous events, and cancelling them. Similarly, callbacks are a pleasantly Javascripty way of approaching things.

One notable change is that the `monome-grid` library is very barebones: it connects to a grid via serialosc, and sets LEDs all at once. Some functionality that is built-in to the Lua `grid` object has to be implemented from scratch; I might extract these to a wrapper class or something if that becomes useful.

Stylistic notes:

- I like module-style imports
- I'm fine with arrays being cols-rows (ie: `array[y][x]`)
- I prefer functional approaches to updating data arrays (map, not for loops)
- all sketches use constants `ROWS` and `COLS` to determine the size of the grid. Set `ROWS` to 16 for your sketches to work on a 256/zero.

## TODO

- implement
  - state machine
  - meters
- demonstrate extract-to-class of richer grid object.

## Installation

    npm install

## Simple Redraw

    node redraw.js

all keys are set up as switches, so only one can be lit at a time. press a new one, it lights up as the previous selection goes out. useful for state changes. use encoder 3 to change brightness level.

core concepts:

- regular framerate grid redraw driven by `setInterval`.
- gridDirty flag to prompt grid redraw
- functional approaches to iteration (`map`)

## Momentary keys

    node momentary.js

classic earthsea-style interaction. press a key and it lights up as it’s held. release to extinguish.

the difference between this snippet and the ‘simple redraw’ is that the state of every key is being independently tracked. this means that the state of each key won’t influence the others – instead of only one lit key at a time, you can press many keys at once and they’ll all light up.

core concepts:

- establish a two-dimensional array that holds booleans for every grid key
- utilize ternary operator (see line 30)

## Toggles

    node toggles.js

press an unlit key and it toggles on at half-bright. hold a half-bright key to make it full-bright. hold it again to return to half-bright. press a half-bright key to toggle it off.

here, we enter state management territory. instead of defining single-state toggles for each key, we use additional gesture information to switch between two toggle states: half-bright and full-bright. this is the foundation of modified behavior.

core concepts:

- using timeouts to trigger events 
- clearing timeouts when they are no longer required
- using meaningful `null`s
- modifying existing states

## Switches

foundation for a step sequencer – 16 columns of switches, stealing vertically.

core concepts:

- using nested tables to segment the grid display

try this:

- add a moving playhead indicator
- incorporate a long press to modify and display an additional table of switches

## Range

hold a grid key and press another in the same row to establish a range. pressing a single key will establish a new start point for the range, so long as the entire range can fit. establishing a negative range resets to 1.

core concepts:

- using arrays of objects to track state
- using if/else conditions to define all possible interactions
- using splat operator to copy objects
