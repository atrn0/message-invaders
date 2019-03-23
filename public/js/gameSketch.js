const SHOT_PAUSE = 300,
  PLAYER_INVINCIBLE = 60 * 2 - 20,
  MOVE_INTERVAL = 30;

let invaders = [],
  chars = [];
let bullets = [],
  invaderBullets = [];
let player;
let lButton, cButton, rButton;

let invaderImg, imvader2Img, spaceshipImg, bullet2Img, barrierImg, lButtonImg, cButtonImg, rButtonImg;
let invaderFont,
  canvas,
  canvasColor = 'rgb(39, 39, 41)',
  scale,
  charSize;

let frameCount = 0,
  messageColor = 'white';

let message = Array.from(document.getElementsByName("message")[0].getAttribute("value"));

function preload() {
  invaderImg = loadImage("imgs/invader.png");
  invader2Img = loadImage("imgs/invader2.png");
  spaceshipImg = loadImage("imgs/spaceship.png");
  bulletImg = loadImage("imgs/bullet.png");
  lButtonImg = loadImage("imgs/lButton.png")
  cButtonImg = loadImage("imgs/cButton.png")
  rButtonImg = loadImage("imgs/rButton.png")
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight * 0.84);
  scale = Math.min(windowWidth, windowHeight) / 100;
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
  for (let i = 0; i < message.length; ++i) {
    invaders.push(new Invader(x, y, invWidth, invHeight, (yidx % 2 == 0) ? invaderImg : invader2Img, i));
    x += scale * 5 + invWidth;
    if (x >= width - invWidth * 1.5) {
      y += scale * 5 + invHeight;
      yidx++;
      x = 0;
    }
  }

  // create player
  player = new Player((width - spaceshipImg.width * scale) / 2, height - (25 * scale - cButtonImg.height * scale) / 2 - cButtonImg.height * scale - spaceshipImg.height * scale * 1.2, spaceshipImg.width * scale, spaceshipImg.height * scale, spaceshipImg);


  // create buttons
  lButton = new Button((width - lButtonImg.width * 3 * scale) / 4, height - (25 * scale - lButtonImg.height * scale) / 2 - lButtonImg.height * scale, lButtonImg.width * scale, lButtonImg.height * scale, lButtonImg);

  cButton = new Button((width - cButtonImg.width * scale) / 2, height - (25 * scale - cButtonImg.height * scale) / 2 - cButtonImg.height * scale, cButtonImg.width * scale, cButtonImg.height * scale, cButtonImg);

  rButton = new Button(width - rButtonImg.width * scale - (width - rButtonImg.width * 3 * scale) / 4, height - (25 * scale - rButtonImg.height * scale) / 2 - rButtonImg.height * scale, rButtonImg.width * scale, rButtonImg.height * scale, rButtonImg);
}

function draw() {
  frameCount++;

  // logic
  if (keyIsDown(LEFT_ARROW) || mouseIsPressed && lButton.isPressed()) {
    player.move(-scale);
  } else if (keyIsDown(RIGHT_ARROW) || mouseIsPressed && rButton.isPressed()) {
    player.move(scale);
  }
  if (keyIsDown(UP_ARROW) || mouseIsPressed && cButton.isPressed()) {
    player.shoot();
  }

  for (let invader of invaders) {
    invader.update(frameCount);
    bullets.forEach(bullet => {
      if (bullet.intersects(invader)) {
        bullet.deadMarked = true;
        invader.deadMarked = true;
      }
    })
  }

  for (let bullet of bullets) {
    bullet.update();
  }

  player.update();

  for (let char of chars) {
    char.update(frameCount);
  }

  for (let bullet of invaderBullets) {
    bullet.update();
    if (player.intersects(bullet)) {
      bullet.deadMarked = true;
      player.invincible = true;
    }
  }

  if (invaders.some(invader => invader.right() > width || invader.left() < 0) || chars.some(char => char.right() > width || char.left() < 0)) {
    invaders.forEach(invader => {
      invader.pos.add(p5.Vector.mult(invader.vel, -1));
      invader.vel.x = -invader.vel.x;
    })
    chars.forEach(char => {
      char.pos.add(p5.Vector.mult(char.vel, -1));
      char.vel.x = -char.vel.x;
    })
  }

  // draw
  background(canvasColor);

  for (let invader of invaders) {
    invader.draw();

    if (invader.deadMarked) {
      chars.push(new Message(invader.left(), invader.upper(), invader.width(), charSize, message[invader.index], invader.vel, messageColor));
    }
  }
  for (let char of chars) {
    char.render();
  }

  player.draw();
  lButton.draw();
  cButton.draw();
  rButton.draw();
  for (let bullet of bullets) {
    bullet.draw();
  }
  for (let bullet of invaderBullets) {
    bullet.draw();
  }

  // delete bulletsor invaders
  bullets = bullets.filter(bullet => !bullet.deadMarked && bullet.lower() >= 0);
  invaderBullets = invaderBullets.filter(bullet => !bullet.deadMarked && bullet.upper() <= height);
  invaders = invaders.filter(invader => !invader.deadMarked);

  // ending
  if (invaders.length == 0) {
    window.setTimeout(ending, 2000);
  }
}

function createBullet(x, y) {
  bulletPrefab = new Sprite(x, y, bulletImg.width * scale, bulletImg.height * scale, bulletImg);
  bulletPrefab.vel = createVector(0, -scale * 2);

  bulletPrefab.update = function () {
    this.pos.add(this.vel);
  }
  return bulletPrefab;
}

function ending() {
  let buttons = document.querySelector("#buttons");
  buttons.style.display = "flex";
}

const sign = n => n > 0 ? 1 : n === 0 ? 0 : -1;