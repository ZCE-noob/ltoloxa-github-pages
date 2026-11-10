let x, y;
let angle = 0;
let speed = 2;

let bodyR, bodyG, bodyB;
let gillR, gillG, gillB;

let lightFrames = 0;
let isOverheated = false;

let starveFrames = 0;
let maxStarveFrames = 1200;
let isDead = false;

let foodX = [];
let foodY = [];
let trailX = [];
let trailY = [];

let bubbleX = [100, 250, 400, 550, 700];
let bubbleY = [400, 300, 500, 200, 450];

let lightR = 100;
let boxR = 70;

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent('sketch-holder'); 
  x = width / 2;
  y = height / 2;
  
  randomizeColor();
}

function draw() {
  background(15, 25, 45);
  
  drawBubbles();
  updateLtoloxa();
  
  if (!isDead) {
    drawTrail();
  }
  
  drawFood();
  
  push();
  translate(x, y);
  rotate(angle);
  if (isDead) {
    drawSkeleton();
  } else {
    drawCreature();
  }
  pop();
  
  drawFlashlight();
}

function randomizeColor() {
  bodyR = floor(random(80, 255));
  bodyG = floor(random(80, 255));
  bodyB = floor(random(80, 255));

  gillR = floor(random(100, 255));
  gillG = floor(random(50, 255));
  gillB = floor(random(100, 255));
}

function drawCreature() {
  let wiggle = sin(frameCount * 0.15) * 4;
  
  let curBodyR = isOverheated ? 255 : bodyR;
  let curBodyG = isOverheated ? 30 : bodyG;
  let curBodyB = isOverheated ? 30 : bodyB;

  let curGillR = isOverheated ? 255 : gillR;
  let curGillG = isOverheated ? 100 : gillG;
  let curGillB = isOverheated ? 0 : gillB;

  drawLeg(-10, -14, curBodyR, curBodyG, curBodyB);
  drawLeg(-10, 6, curBodyR, curBodyG, curBodyB);
  drawLeg(8, -14, curBodyR, curBodyG, curBodyB);
  drawLeg(8, 6, curBodyR, curBodyG, curBodyB);
  
  drawBody(wiggle, curBodyR, curBodyG, curBodyB);
  
  drawFeeler(10, -8, 5, -20, curGillR, curGillG, curGillB);
  drawFeeler(13, -8, 13, -22, curGillR, curGillG, curGillB);
  drawFeeler(16, -8, 21, -20, curGillR, curGillG, curGillB);
  drawFeeler(10, 8, 5, 20, curGillR, curGillG, curGillB);
  drawFeeler(13, 8, 13, 22, curGillR, curGillG, curGillB);
  drawFeeler(16, 8, 21, 20, curGillR, curGillG, curGillB);
  
  drawEyes();
}

function drawSkeleton() {
  let boneColor = color(220, 225, 230);
  let wiggle = sin(frameCount * 0.05) * 2;
  
  stroke(boneColor);
  strokeWeight(2);
  line(-40, 0, 20, 0);
  
  line(10, -6, 10, 6);
  line(0, -8, 0, 8);
  line(-10, -8, -10, 8);
  line(-20, -7, -20, 7);
  line(-30, -5, -30, 5);
  
  line(-40, 0, -55, wiggle);
  line(-55, wiggle, -68, wiggle * 1.5);

  line(8, -5, 12, -13);
  line(8, 5, 12, 13);
  line(-10, -5, -12, -13);
  line(-10, 5, -12, 13);
  
  noFill();
  stroke(boneColor);
  ellipse(15, 0, 22, 18);
  
  fill(15, 25, 45);
  noStroke();
  circle(18, -5, 4);
  circle(18, 5, 4);
  
  stroke(180, 190, 200);
  strokeWeight(1.5);
  line(10, -8, 4, -18);
  line(13, -8, 12, -20);
  line(16, -8, 20, -18);
  line(10, 8, 4, 18);
  line(13, 8, 12, 20);
  line(16, 8, 20, 18);
}

function drawBody(w, r, g, b) {
  noStroke();
  fill(r, g, b);
  ellipse(-5, 0, 45, 22);
  ellipse(15, 0, 24, 22);
  ellipse(-32, w, 28, 10);
}

function drawLeg(lx, ly, r, g, b) {
  noStroke();
  fill(r, g, b);
  rect(lx, ly, 5, 8, 2);
}

function drawFeeler(x1, y1, x2, y2, r, g, b) {
  stroke(r, g, b);
  strokeWeight(2);
  line(x1, y1, x2, y2);
  
  noStroke();
  fill(r, g, b);
  circle(x2, y2, 4);
}

function drawEyes() {
  noStroke();
  fill(20);
  circle(18, -6, 3);
  circle(18, 6, 3);
}

function drawBubbles() {
  noFill();
  stroke(200, 240, 255, 100);
  strokeWeight(1);
  for (let i = 0; i < bubbleX.length; i++) {
    circle(bubbleX[i], bubbleY[i], 8);
    bubbleY[i] = bubbleY[i] - 1;
    if (bubbleY[i] < 0) {
      bubbleY[i] = height;
    }
  }
}

function updateLtoloxa() {
  if (isDead) {
    if (y < height - boxR) {
      y = y + 0.5;
    }
    return;
  }

  starveFrames = starveFrames + 1;
  if (starveFrames >= maxStarveFrames) {
    isDead = true;
  }

  let dMouse = dist(mouseX, mouseY, x, y);
  if (dMouse < lightR) {
    lightFrames = lightFrames + 1;
  } else {
    if (lightFrames > 0) {
      lightFrames = lightFrames - 1;
    }
  }
  isOverheated = (lightFrames >= 300);

  let safeFoodIndex = -1;
  for (let i = 0; i < foodX.length; i++) {
    let dFoodLight = dist(mouseX, mouseY, foodX[i], foodY[i]);
    if (dFoodLight >= lightR) {
      safeFoodIndex = i;
      break;
    }
  }

  let targetAngle = angle;
  let moveSpeed = speed;

  if (dMouse < lightR) {
    targetAngle = atan2(y - mouseY, x - mouseX);
    moveSpeed = speed * (isOverheated ? 3.5 : 2.5);
  } else if (safeFoodIndex != -1) {
    let targetX = foodX[safeFoodIndex];
    let targetY = foodY[safeFoodIndex];
    let dFood = dist(x, y, targetX, targetY);
    targetAngle = atan2(targetY - y, targetX - x);
    moveSpeed = speed * 1.2;
    
    if (dFood < 15) {
      foodX.splice(safeFoodIndex, 1);
      foodY.splice(safeFoodIndex, 1);
      randomizeColor();
      starveFrames = 0;
    }
  } else {
    if (random(1) < 0.02) {
      targetAngle = targetAngle + random(-0.5, 0.5);
    }
    moveSpeed = speed * 0.5;
  }

  let diff = targetAngle - angle;
  while (diff < -PI) diff = diff + TWO_PI;
  while (diff > PI) diff = diff - TWO_PI;
  angle = angle + diff * 0.1;

  x = x + cos(angle) * moveSpeed;
  y = y + sin(angle) * moveSpeed;

  if (x < boxR) {
    x = boxR;
    if (cos(angle) < 0) angle = atan2(sin(angle), -cos(angle));
  } else if (x > width - boxR) {
    x = width - boxR;
    if (cos(angle) > 0) angle = atan2(sin(angle), -cos(angle));
  }

  if (y < boxR) {
    y = boxR;
    if (sin(angle) < 0) angle = atan2(-sin(angle), cos(angle));
  } else if (y > height - boxR) {
    y = height - boxR;
    if (sin(angle) > 0) angle = atan2(-sin(angle), cos(angle));
  }

  trailX.push(x);
  trailY.push(y);
  if (trailX.length > 15) {
    trailX.shift();
    trailY.shift();
  }
}

function drawTrail() {
  noStroke();
  let curR = isOverheated ? 255 : bodyR;
  let curG = isOverheated ? 30 : bodyG;
  let curB = isOverheated ? 30 : bodyB;
  fill(curR, curG, curB, 80);
  for (let i = 0; i < trailX.length; i++) {
    let sz = i * 0.6;
    circle(trailX[i], trailY[i], sz);
  }
}

function drawFood() {
  for (let i = 0; i < foodX.length; i++) {
    push();
    translate(foodX[i], foodY[i]);
    
    noStroke();
    fill(255, 130, 110);
    ellipse(3, -2, 10, 9);
    ellipse(0, 2, 9, 8);
    ellipse(-3, 6, 8, 7);
    ellipse(-5, 10, 6, 5);
    
    fill(255, 90, 80);
    triangle(-5, 10, -10, 14, -5, 15);
    triangle(-5, 10, -2, 15, -5, 15);
    
    stroke(255, 210, 200);
    strokeWeight(1);
    noFill();
    arc(3, -2, 8, 6, -HALF_PI, HALF_PI);
    arc(0, 2, 7, 5, -HALF_PI, HALF_PI);
    arc(-3, 6, 6, 4, -HALF_PI, HALF_PI);
    
    pop();
  }
}

function drawFlashlight() {
  noStroke();
  fill(255, 255, 180, 35);
  circle(mouseX, mouseY, lightR * 2.2);
  fill(255, 255, 220, 75);
  circle(mouseX, mouseY, lightR * 2);

  noFill();
  stroke(255, 255, 200, 140);
  strokeWeight(1.5);
  circle(mouseX, mouseY, lightR * 2);
}

function mousePressed() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height && foodX.length < 5) {
    foodX.push(mouseX);
    foodY.push(mouseY);
  }
}

function resetLtoloxa() {
  x = width / 2;
  y = height / 2;
  angle = 0;
  lightFrames = 0;
  isOverheated = false;
  starveFrames = 0;
  isDead = false;
  foodX = [];
  foodY = [];
  trailX = [];
  trailY = [];
  randomizeColor();
}
