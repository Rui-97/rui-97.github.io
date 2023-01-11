const Engine = Matter.Engine;
const Composite = Matter.Composite;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Constraint = Matter.Constraint;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;

let engine;
let propeller;
let boxes = [];
let birds = [];
let colors = [];
let ground;
let slingshotBird, slingshotConstraint;
let angle = 0;
let angleSpeed = 0;
let canvas;
let timerVal = 60;
////////////////////////////////////////////////////////////
function setup() {
  canvas = createCanvas(1000, 600);

  engine = Engine.create(); // create an engine

  setupGround();

  setupPropeller();

  setupTower();

  setupSlingshot();

  setupMouseInteraction();

  setupTimer();
}
////////////////////////////////////////////////////////////
function draw() {
  background(0);

  Engine.update(engine);

  drawGround();

  drawPropeller();

  drawTower();

  drawBirds();

  drawSlingshot();

  drawTimer();

  checkGameEnd();
}
////////////////////////////////////////////////////////////
//use arrow keys to control propeller
function keyPressed() {
  if (keyCode == LEFT_ARROW) {
    // Increment the angle speed by 0.01
    angleSpeed += 0.01;
  } else if (keyCode == RIGHT_ARROW) {
    // Decrement the angle speed by 0.01
    if (angleSpeed <= 0) {
      angleSpeed = 0;
    } else {
      angleSpeed -= 0.01;
    }
  }
}
////////////////////////////////////////////////////////////
function keyTyped() {
  //if 'b' is pressed, create a new bird to use with propeller
  if (key === "b") {
    setupBird();
  }

  //if 'r' is pressed, reset the slingshot
  if (key === "r") {
    removeFromWorld(slingshotBird);
    removeFromWorld(slingshotConstraint);
    setupSlingshot();
  }
}
//**********************************************************************
//  FUNCTIONS FOR TURNING INTO A GAME
//**********************************************************************
////////////////////////////////////////////////////////////
function setupTimer() {
  //Call the callback function every second
  setInterval(() => {
    if (timerVal > 0) {
      //Decrease timer value by 1
      timerVal--;
    }
  }, 1000);
}
function drawTimer() {
  textAlign(CENTER);
  fill(255);
  if (timerVal >= 0) {
    //Draw timer on the screen
    textSize(30);
    text(`${timerVal}s`, 50, 50);
  }
}
function allBoxesOffScreen() {
  return boxes.length === 0;
}
function checkGameEnd() {
  //Draw ending info and stop the code in draw() from executing,
  //if all boxes are off the screen or if run out of time
  if (allBoxesOffScreen() || timerVal === 0) {
    drawEndingInfo();
    noLoop();
  }
}
function drawEndingInfo() {
  textSize(60);
  textAlign(CENTER);
  fill(255);
  if (allBoxesOffScreen()) {
    text("CONGRATS!", width / 2, height / 2 - 50);
    text("YOU WIN THE GAME", width / 2, height / 2 + 50);
  }
  if (timerVal === 0) {
    text("GAME OVER", width / 2, height / 2);
  }
}

//**********************************************************************
//  HELPER FUNCTIONS - DO NOT WRITE BELOW THIS line
//**********************************************************************

//if mouse is released destroy slingshot constraint so that
//slingshot bird can fly off
function mouseReleased() {
  setTimeout(() => {
    slingshotConstraint.bodyB = null;
    slingshotConstraint.pointA = { x: 0, y: 0 };
  }, 100);
}
////////////////////////////////////////////////////////////
//tells you if a body is off-screen
function isOffScreen(body) {
  const pos = body.position;
  return pos.y > height || pos.x < 0 || pos.x > width;
}
////////////////////////////////////////////////////////////
//removes a body from the physics world
function removeFromWorld(body) {
  Composite.remove(engine.world, body);
}
////////////////////////////////////////////////////////////
function drawVertices(vertices) {
  beginShape();
  for (let i = 0; i < vertices.length; i++) {
    vertex(vertices[i].x, vertices[i].y);
  }
  endShape(CLOSE);
}
////////////////////////////////////////////////////////////
function drawConstraint(constraint) {
  push();
  let offsetA = constraint.pointA;
  let posA = { x: 0, y: 0 };
  if (constraint.bodyA) {
    posA = constraint.bodyA.position;
  }
  let offsetB = constraint.pointB;
  let posB = { x: 0, y: 0 };
  if (constraint.bodyB) {
    posB = constraint.bodyB.position;
  }
  strokeWeight(5);
  stroke(255);
  line(
    posA.x + offsetA.x,
    posA.y + offsetA.y,
    posB.x + offsetB.x,
    posB.y + offsetB.y
  );
  pop();
}
