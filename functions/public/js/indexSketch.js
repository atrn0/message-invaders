const SHOT_PAUSE = 300,
  PLAYER_INVINCIBLE = 60 * 2 - 20,
  MOVE_INTERVAL = 30;

let invaders = [],
  chars = [],
  message = [];
let bullets = [],
  invaderBullets = [];

let invaderImg, imvader2Img, spaceshipImg, bullet2Img, barrierImg;
let invaderFont,
  canvas,
  canvasColor = 'rgb(39, 39, 41)',
  scale,
  charSize,
  canvasSize,
  maxMessageLength = 36;

let frameCount = 0;
messageColor = 'white';

function preload() {
  invaderImg = loadImage("imgs/invader.png");
  invader2Img = loadImage("imgs/invader2.png");
}

function setup() {
  canvasSize = Math.min(windowWidth, windowHeight) * 0.9;
  canvas = createCanvas(canvasSize, canvasSize * 0.25);
  scale = canvasSize / 190;
  charSize = scale * 14;
  canvas.parent('message-invader');
  noSmooth();
  textFont("PixelMplus10-Regular");

  //create invaders
  let invWidth = scale * invaderImg.width,
    invHeight = scale * invaderImg.height;

  let x = 0,
    y = scale * 10,
    yidx = 0;
  for (let i = 0; i < maxMessageLength; ++i) {
    invaders.push(new Invader(x, y, invWidth, invHeight, (yidx % 2 == 0) ? invaderImg : invader2Img, i));
    x += scale * 5 + invWidth;
    if ((i + 1) % (maxMessageLength / 3) == 0) {
      y += scale * 5 + invHeight;
      yidx++;
      x = 0;
    }
  }
}

function draw() {
  // draw
  background(canvasColor);

  for (let invader of invaders) {
    let invIdx = invader.index;
    if (message[invIdx]) {
      textAlign(LEFT, CENTER);
      textSize(charSize);
      fill(messageColor);
      text(message[invIdx], invader.left(), invader.upper());
    } else {
      invader.draw();
    }
  }

}