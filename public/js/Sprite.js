class Sprite {
  // initiarize
  constructor(x, y, width, height, img) {
    this.pos = createVector(x, y);
    this.size = createVector(width, height);
    this.img = img;
  }

  corner1() {
    return this.pos;
  }
  corner2() {
    return p5.Vector.add(this.pos, this.size);
  }
  width() {
    return this.size.x;
  }
  height() {
    return this.size.y;
  }
  left() {
    return this.pos.x;
  }
  right() {
    return this.width() + this.left();
  }
  upper() {
    return this.pos.y;
  }
  lower() {
    return this.height() + this.upper();
  }

  intersects(other) {
    return !(this.right() < other.left() || other.right() < this.left() || this.lower() < other.upper() || other.lower() < this.upper());
  }

  draw() {
    push();
    image(this.img, this.left(), this.upper(), this.width(), this.height());
    pop();
  }
}

class Invader extends Sprite {
  constructor(x, y, width, height, img, index) {
    super(x, y, width, height, img);
    this.vel = createVector(scale, 0);
    this.timeToshoot = floor(random(0, SHOT_PAUSE * 5))
    this.index = index;
  }

  update(frameCount) {
    if (frameCount % MOVE_INTERVAL < 1) {
      this.pos.add(this.vel);
    }
    this.timeToshoot--;
    if (this.timeToshoot < 1) {
      let bullet = createBullet(this.left() + this.width() / 2, this.lower());
      bullet.vel.mult(-0.9);
      invaderBullets.push(bullet);
      this.timeToshoot = SHOT_PAUSE;
    }
  }
}

class Player extends Sprite {
  constructor(x, y, width, height, img) {
    super(x, y, width, height, img);
    this.vel = createVector(scale / 2, 0);
    this.timeBetweenShots = 20;
    this.shootCooldown = 0;
    this.invincibleCounter = 0;
    this.visible = true;
  }

  update() {
    this.shootCooldown--;
    this.invincibleCounter--;
    this.visible = this.invincible ? frameCount % 20 >= 10 : true;
  }

  move(dir) {
    this.pos.add(p5.Vector.mult(this.vel, sign(dir)));
  }

  shoot() {
    if (this.shootCooldown <= 0) {
      let bullet = createBullet(this.left() + this.width() / 2, this.upper());
      bullets.push(bullet);
      this.shootCooldown = this.timeBetweenShots;
    }
  }

  get invincible() {
    return this.invincibleCounter > 0;
  }
  set invincible(inv) {
    this.invincibleCounter = inv ? PLAYER_INVINCIBLE : 0;
  }

  draw() {
    if (!this.visible) return;
    else super.draw();
  }
}

class Button extends Sprite {
  constructor(x, y, width, height, img) {
    super(x, y, width, height, img);
  }

  isPressed() {
    return this.left() <= mouseX && mouseX <= this.right() && this.upper() <= mouseY && mouseY <= this.lower();
  }
}

class Message extends Sprite {
  constructor(x, y, width, height, char, vel, color) {
    super(x, y, width, height);
    this.vel = vel;
    this.char = char;
    this.color = color;
  }

  render() {
    textAlign(LEFT, CENTER);
    textSize(this.height());
    fill(this.color);
    text(this.char, this.left(), this.upper());
  }

  update(frameCount) {
    if (frameCount % MOVE_INTERVAL < 1) {
      this.pos.add(this.vel);
    }
  }
}