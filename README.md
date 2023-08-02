# Grid Recipes

Porting the monome grid recipes (https://monome.org/docs/norns/grid-recipes) from Norns to Javascript.

## Installation

    npm install

## Simple Redraw

    node redraw.js

all keys are set up as switches, so only one can be lit at a time. press a new one, it lights up as the previous selection goes out. useful for state changes. use encoder 3 to change brightness level.

core concepts:

- clock-centric grid redraw
- gridDirty flag to prompt grid redraw
