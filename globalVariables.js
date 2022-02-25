const CANVAS_HEIGHT = 655;
const CANVAS_WIDTH = 900;

// physics
const GRAVITY = 4;

let LAYER_SPEED = 0;
const LAYER_SPEED_DEFAULT = 8;

const BASE_HEIGHT = 55; //height of the ground from the bottom of the canvas.
const TIME_PER_FRAME = 1000 / 45; //idk why but '45' gives me frame rate at 30 fps

// these should not be global variables, will put them somewhere more appropriate
let HERO_SPRITE_HEIGHT = 88;

// number of frames per spriteSheet
// run -> 8
// idle -> 6
