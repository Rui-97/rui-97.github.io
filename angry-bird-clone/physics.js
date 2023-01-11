////////////////////////////////////////////////////////////////
function setupGround() {
  ground = Bodies.rectangle(500, 600, 1000, 40, {
    isStatic: true,
    angle: 0,
  });
  Composite.add(engine.world, [ground]);
}

////////////////////////////////////////////////////////////////
function drawGround() {
  push();
  fill(128);
  drawVertices(ground.vertices);
  pop();
}
////////////////////////////////////////////////////////////////
function setupPropeller() {
  //Create propeller body
  propeller = Bodies.rectangle(150, 480, 200, 15, {
    isStatic: true,
    angle: angle,
  });
  //Add the propeller to the world
  Composite.add(engine.world, propeller);
}
////////////////////////////////////////////////////////////////
//updates and draws the propeller
function drawPropeller() {
  push();
  fill(255);
  Body.setAngle(propeller, angle);
  Body.setAngularVelocity(propeller, angleSpeed);
  angle += angleSpeed;
  drawVertices(propeller.vertices);
  pop();
}
////////////////////////////////////////////////////////////////
function setupBird() {
  const bird = Bodies.circle(mouseX, mouseY, 20, {
    friction: 0,
    restitution: 0.95,
  });
  Matter.Body.setMass(bird, bird.mass * 10);
  Composite.add(engine.world, bird);
  birds.push(bird);
}
////////////////////////////////////////////////////////////////
function drawBirds() {
  push();
  fill(255, 0, 0);
  for (let i = 0; i < birds.length; i++) {
    //Draw birds
    drawVertices(birds[i].vertices);
    if (isOffScreen(birds[i])) {
      //Remove the bird from the world
      removeFromWorld(birds[i]);
      //Remove the bird from the birds array
      birds.splice(i, 1);
      i--;
    }
  }
  pop();
}
////////////////////////////////////////////////////////////////
//creates a tower of boxes
function setupTower() {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 6; j++) {
      const box = Bodies.rectangle(700 + i * 80, 140 + j * 80, 80, 80);

      //Push the box into the boxes array
      boxes.push(box);
      //Add the box into the world
      Composite.add(engine.world, box);
      //Push a random shades of green into the colors array
      colors.push(random(50, 255));
    }
  }
}
////////////////////////////////////////////////////////////////
//draws tower of boxes
function drawTower() {
  push();
  noStroke();
  for (let i = 0; i < boxes.length; i++) {
    //Draw boxes
    fill(0, colors[i], 0);
    drawVertices(boxes[i].vertices);
    if (isOffScreen(boxes[i])) {
      //Remove the box from the world
      removeFromWorld(boxes[i]);
      //Remove the box from the birds array
      boxes.splice(i, 1);
      i--;
    }
  }
  pop();
}
////////////////////////////////////////////////////////////////
function setupSlingshot() {
  //Set up sling shot bird
  slingshotBird = Bodies.circle(200, 200, 20, {
    friction: 0,
    restitution: 0.95,
  });
  Matter.Body.setMass(slingshotBird, slingshotBird.mass * 10);
  Composite.add(engine.world, slingshotBird);

  //Set up sling shot constraint
  slingshotConstraint = Constraint.create({
    pointA: { x: 200, y: 160 },
    bodyB: slingshotBird,
    pointB: { x: 0, y: 0 },
    stiffness: 0.01,
    damping: 0.0001,
  });
  Composite.add(engine.world, slingshotConstraint);
}
////////////////////////////////////////////////////////////////
//draws slingshot bird and its constraint
function drawSlingshot() {
  push();
  fill(255, 200, 0);
  drawVertices(slingshotBird.vertices);
  drawConstraint(slingshotConstraint);
  pop();
}
/////////////////////////////////////////////////////////////////
function setupMouseInteraction() {
  const mouse = Mouse.create(canvas.elt);
  const mouseParams = {
    mouse: mouse,
    constraint: { stiffness: 0.05 },
  };
  mouseConstraint = MouseConstraint.create(engine, mouseParams);
  mouseConstraint.mouse.pixelRatio = pixelDensity();
  Composite.add(engine.world, mouseConstraint);
}
