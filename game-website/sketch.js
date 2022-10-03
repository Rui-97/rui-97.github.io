var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var trees_x;
var clouds;
var mountains;
var canyons;
var collectables;

var game_score;
var flagpole;
var lives;

var jumpSound;
var rewardSound;
var deadSound;

var platform;
var enemies;

const allSurfacesYPos = [];

function preload() {
  soundFormats("mp3", "wav");

  //load sounds
  jumpSound = loadSound("assets/jump.wav");
  jumpSound.setVolume(0.1);
  rewardSound = loadSound("assets/reward.wav");
  rewardSound.setVolume(0.1);
  deadSound = loadSound("assets/dead.wav");
  deadSound.setVolume(0.1);
}

function setup() {
  createCanvas(1024, 576);
  floorPos_y = (height * 3) / 4;
  //initialise lives
  lives = 3;
  startGame();
  allSurfacesYPos.push(floorPos_y);
}

function draw() {
  background(100, 155, 255); // fill the sky blue

  noStroke();
  fill(0, 155, 0);
  rect(0, floorPos_y, width, height / 4); // draw some green ground

  push();
  translate(scrollPos, 0);
  // Draw clouds.
  drawClouds();

  // Draw mountains.
  drawMountains();

  // Draw trees.
  drawTrees();

  // Draw canyons.
  for (var i = 0; i < canyons.length; i++) {
    drawCanyon(canyons[i]);
    checkCanyon(canyons[i]);
  }

  // Draw collectable items.

  for (var i = 0; i < collectables.length; i++) {
    // checkCollectable(collectables[i]);
    if (collectables[i].isFound == false) {
      drawCollectable(collectables[i]);
      checkCollectable(collectables[i]);
    }
  }
  // Draw flagpole and check wheter the character reached flag pole.
  renderFlagpole();
  if (flagpole.isReached == false) {
    checkFlagpole();
  }
  checkPlayerDie();

  // Draw platforms
  for (var i = 0; i < platform.length; i++) {
    platform[i].drawPlatform();
  }
  // Draw enemies and check whether they and the character are in contact.
  for (var i = 0; i < enemies.length; i++) {
    enemies[i].draw();

    var isOnPlatform = enemies[i].checkContact(gameChar_world_x, gameChar_y);
    if (isOnPlatform) {
      if (lives > 0) {
        lives -= 1;
        startGame();
        break;
      }
    }
  }

  pop();

  // Game over
  if (lives < 1) {
    fill(255);
    textSize(50);
    text("Game over. Press space to continue.", 100, height / 2);
    return;
  }
  // Level completed
  if (flagpole.isReached) {
    fill(255);
    textSize(50);
    text("Level complete. Press space to continue.", 100, height / 2);
    return;
  }
  // Add game score counter.
  fill(255);
  textSize(15);
  noStroke();
  text("score: " + game_score, 30, 30);
  // Draw lives tokens.
  for (var i = 0; i < lives; i++) {
    fill(255);
    textSize(15);
    text("lives:", 30, 50);
    fill(255, 0, 0);
    noStroke();
    ellipse(80 + i * 20, 45, 15);
  }

  // Draw game character.

  drawGameChar();

  // Logic to make the game character move or the background scroll.
  if (isLeft && !isPlummeting) {
    if (gameChar_x > width * 0.2) {
      gameChar_x -= 5;
    } else {
      scrollPos += 5;
    }
  }

  if (isRight && !isPlummeting) {
    if (gameChar_x < width * 0.8) {
      gameChar_x += 5;
    } else {
      scrollPos -= 5; // negative for moving against the background
    }
  }

  // Logic to make the game character rise and fall.
  if (gameChar_y < floorPos_y) {
    var isOnPlatform = false;

    //check whether the character is on a platform
    for (var i = 0; i < platform.length; i++) {
      if (platform[i].checkContact(gameChar_world_x, gameChar_y)) {
        isOnPlatform = true;
        break;
      }
    }

    if (isOnPlatform == false) {
      isFalling = true;
      gameChar_y += 2;
    }
  } else {
    isFalling = false;
  }

  // Update real position of gameChar for collision detection.
  gameChar_world_x = gameChar_x - scrollPos;
}

// ---------------------
// Key control functions
// ---------------------

function keyPressed() {
  if ((key == "a" || keyCode == 37) && gameChar_y <= floorPos_y) {
    isLeft = true;
  }
  if ((key == "d" || keyCode == 39) && gameChar_y <= floorPos_y) {
    isRight = true;
  }
  if ((key == "w" || keyCode == 32) && gameChar_y <= floorPos_y) {
    // check whether the charecter exceeds the jump limit
    const jumpLimits = allSurfacesYPos.map((surfaceYPos) => surfaceYPos - 160);

    gameChar_y -= 80;
    jumpSound.play();
  }
}

function keyReleased() {
  console.log("release" + keyCode);
  console.log("release" + key);
  if (key == "a" || keyCode == 37) {
    isLeft = false;
  }
  if (key == "d" || keyCode == 39) {
    isRight = false;
  }
}

// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar() {
  if (isLeft && isFalling) {
    //jumping-left code
    //head
    stroke(0);
    fill(255);
    ellipse(gameChar_x, gameChar_y - 50, 23);
    fill(0);
    ellipse(gameChar_x - 4, gameChar_y - 50, 3);
    line(gameChar_x - 4, gameChar_y - 50, gameChar_x - 11, gameChar_y - 50);
    //foot
    rect(gameChar_x - 15, gameChar_y - 15, 7, 11);
    quad(
      gameChar_x + 4,
      gameChar_y - 10,
      gameChar_x - 3,
      gameChar_y - 10,
      gameChar_x + 6,
      gameChar_y,
      gameChar_x + 13,
      gameChar_y
    );
    //body
    fill(224, 179, 242);
    rect(gameChar_x - 10, gameChar_y - 39, 18, 30);
    //arms
    fill(0);
    quad(
      gameChar_x + 2,
      gameChar_y - 27,
      gameChar_x + 5,
      gameChar_y - 27,
      gameChar_x - 10,
      gameChar_y - 42,
      gameChar_x - 13,
      gameChar_y - 42
    );
  } else if (isRight && isFalling) {
    //jumping-right code
    //head
    stroke(0);
    fill(255);
    ellipse(gameChar_x, gameChar_y - 50, 23);
    fill(0);
    ellipse(gameChar_x + 4, gameChar_y - 50, 3);
    line(gameChar_x + 11, gameChar_y - 50, gameChar_x + 4, gameChar_y - 50);
    //foot
    rect(gameChar_x + 6, gameChar_y - 15, 7, 11);
    quad(
      gameChar_x + 2,
      gameChar_y - 10,
      gameChar_x - 5,
      gameChar_y - 10,
      gameChar_x - 15,
      gameChar_y,
      gameChar_x - 8,
      gameChar_y
    );
    //body
    fill(224, 179, 242);
    rect(gameChar_x - 10, gameChar_y - 39, 18, 30);
    //arms
    fill(0);
    quad(
      gameChar_x - 5,
      gameChar_y - 27,
      gameChar_x - 2,
      gameChar_y - 27,
      gameChar_x + 13,
      gameChar_y - 42,
      gameChar_x + 10,
      gameChar_y - 42
    );
  } else if (isLeft) {
    //walking left code
    //head
    stroke(0);
    fill(255);
    ellipse(gameChar_x, gameChar_y - 50, 23);
    fill(0);
    ellipse(gameChar_x - 4, gameChar_y - 50, 3);
    line(gameChar_x - 4, gameChar_y - 50, gameChar_x - 11, gameChar_y - 50);
    //body
    fill(224, 179, 242);
    rect(gameChar_x - 10, gameChar_y - 39, 18, 30);
    //arms
    fill(0);
    quad(
      gameChar_x + 2,
      gameChar_y - 35,
      gameChar_x + 5,
      gameChar_y - 35,
      gameChar_x - 8,
      gameChar_y - 22,
      gameChar_x - 11,
      gameChar_y - 22
    );
    //foot
    rect(gameChar_x - 10, gameChar_y - 9, 7, 11);
    quad(
      gameChar_x + 4,
      gameChar_y - 8,
      gameChar_x - 3,
      gameChar_y - 8,
      gameChar_x + 6,
      gameChar_y + 2,
      gameChar_x + 13,
      gameChar_y + 2
    );
  } else if (isRight) {
    //walking right code
    //head
    stroke(0);
    fill(255);
    ellipse(gameChar_x, gameChar_y - 50, 23);
    fill(0);
    ellipse(gameChar_x + 4, gameChar_y - 50, 3);
    line(gameChar_x + 11, gameChar_y - 50, gameChar_x + 4, gameChar_y - 50);
    //body
    fill(224, 179, 242);
    rect(gameChar_x - 10, gameChar_y - 39, 18, 30);
    //arms
    fill(0);
    quad(
      gameChar_x - 5,
      gameChar_y - 35,
      gameChar_x - 2,
      gameChar_y - 35,
      gameChar_x + 11,
      gameChar_y - 22,
      gameChar_x + 8,
      gameChar_y - 22
    );
    //foot
    rect(gameChar_x + 1, gameChar_y - 9, 7, 11);
    quad(
      gameChar_x + 2,
      gameChar_y - 8,
      gameChar_x - 5,
      gameChar_y - 8,
      gameChar_x - 15,
      gameChar_y + 2,
      gameChar_x - 8,
      gameChar_y + 2
    );
  } else if (isFalling || isPlummeting) {
    // jumping facing forwards code
    //head
    stroke(0);
    fill(255);
    ellipse(gameChar_x, gameChar_y - 50, 23);
    fill(0);
    ellipse(gameChar_x - 6, gameChar_y - 50, 3);
    ellipse(gameChar_x + 6, gameChar_y - 50, 3);
    line(gameChar_x - 6, gameChar_y - 50, gameChar_x + 6, gameChar_y - 50);
    //body
    fill(224, 179, 242);
    rect(gameChar_x - 10, gameChar_y - 39, 18, 30);
    //arms
    fill(0);
    rect(gameChar_x - 25, gameChar_y - 39, 15, 4);
    rect(gameChar_x + 8, gameChar_y - 39, 15, 4);
    //foot
    rect(gameChar_x - 10, gameChar_y - 11, 7, 11);
    rect(gameChar_x + 1, gameChar_y - 15, 7, 11);
  } else {
    //standing front facing code
    //head
    stroke(0);
    fill(255);
    ellipse(gameChar_x, gameChar_y - 50, 23);
    fill(0);
    ellipse(gameChar_x - 6, gameChar_y - 50, 3);
    ellipse(gameChar_x + 6, gameChar_y - 50, 3);
    line(gameChar_x - 6, gameChar_y - 50, gameChar_x + 6, gameChar_y - 50);
    //body
    fill(224, 179, 242);
    rect(gameChar_x - 10, gameChar_y - 39, 18, 30);
    //arms
    fill(0);
    rect(gameChar_x - 14, gameChar_y - 39, 4, 18);
    rect(gameChar_x + 8, gameChar_y - 39, 4, 18);
    //foot
    rect(gameChar_x - 10, gameChar_y - 9, 7, 11);
    rect(gameChar_x + 1, gameChar_y - 9, 7, 11);
  }
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds() {
  for (var i = 0; i < clouds.length; i++) {
    noStroke();
    fill(255);
    ellipse(clouds[i].x_pos, clouds[i].y_pos, 40 * clouds[i].size);
    ellipse(
      clouds[i].x_pos - 20 * clouds[i].size,
      clouds[i].y_pos,
      30 * clouds[i].size
    );
    ellipse(
      clouds[i].x_pos + 20 * clouds[i].size,
      clouds[i].y_pos,
      30 * clouds[i].size
    );
  }
}

// Function to draw mountains objects.
function drawMountains() {
  for (var i = 0; i < mountains.length; i++) {
    noStroke();
    fill(158, 158, 158);
    triangle(
      mountains[i].x_pos,
      mountains[i].y_pos,
      mountains[i].x_pos + 120 * mountains[i].size,
      mountains[i].y_pos,
      mountains[i].x_pos + 60 * mountains[i].size,
      mountains[i].y_pos - 100 * mountains[i].size
    );

    fill(255);
    triangle(
      mountains[i].x_pos + 60 * mountains[i].size,
      mountains[i].y_pos - 100 * mountains[i].size,
      mountains[i].x_pos + 60 * mountains[i].size - 12 * mountains[i].size,
      mountains[i].y_pos - 100 * mountains[i].size + 20 * mountains[i].size,
      mountains[i].x_pos + 60 * mountains[i].size + 12 * mountains[i].size,
      mountains[i].y_pos - 100 * mountains[i].size + 20 * mountains[i].size
    );
  }
}

// Function to draw trees objects.
function drawTrees() {
  for (var i = 0; i < trees_x.length; i++) {
    fill(111, 84, 11);
    rect(trees_x[i] - 15, floorPos_y - 80, 30, 80);
    fill(5, 81, 23);
    triangle(
      trees_x[i],
      floorPos_y - 150,
      trees_x[i] - 50,
      floorPos_y - 80,
      trees_x[i] + 50,
      floorPos_y - 80
    );
    fill(5, 81, 23);
    triangle(
      trees_x[i],
      floorPos_y - 180,
      trees_x[i] - 50,
      floorPos_y - 120,
      trees_x[i] + 50,
      floorPos_y - 120
    );
  }
}
// Function to create platforms.
function createPlatforms(x, y, length) {
  var platform = {
    x: x,
    y: y,
    length: length,
    drawPlatform: function () {
      fill(227, 156, 14);
      noStroke();
      rect(this.x, this.y, this.length, 10, 2);
    },
    checkContact: function (gc_x, gc_y) {
      if (gc_x > this.x && gc_x < this.x + this.length) {
        var d = this.y - gc_y;
        if (d >= 0 && d < 5) {
          return true;
        }
      }
      return false;
    },
  };
  allSurfacesYPos.push(y);
  return platform;
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon) {
  noStroke();
  fill(100, 155, 255);
  rect(t_canyon.x_pos, floorPos_y, t_canyon.width, height - floorPos_y);
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon) {
  if (
    gameChar_world_x < t_canyon.x_pos + t_canyon.width &&
    gameChar_world_x > t_canyon.x_pos &&
    gameChar_y >= floorPos_y
  ) {
    isPlummeting = true;
  } else {
    isPlummeting = false;
  }
  if (isPlummeting) {
    gameChar_y += 5;
    if (gameChar_y > height - 1) {
      deadSound.play();
    }
  }
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable) {
  noStroke();
  fill(255, 0, 0);
  ellipse(t_collectable.x_pos, t_collectable.y_pos, 30 * t_collectable.size);
  stroke(0);
  strokeWeight(2 * t_collectable.size);
  line(
    t_collectable.x_pos,
    t_collectable.y_pos - 10 * t_collectable.size,
    t_collectable.x_pos + 5 * t_collectable.size,
    t_collectable.y_pos - 20 * t_collectable.size
  );
}

// Function to check character has collected an item.

function checkCollectable(t_collectable) {
  var d = dist(
    t_collectable.x_pos,
    t_collectable.y_pos,
    gameChar_world_x,
    gameChar_y
  );
  if (d < 20) {
    t_collectable.isFound = true;
    rewardSound.play();
    game_score++;
  }
}

function renderFlagpole() {
  push();
  stroke(100);
  strokeWeight(5);
  fill(0);
  line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 250);

  if (flagpole.isReached) {
    fill(255, 0, 0);
    noStroke();
    triangle(
      flagpole.x_pos,
      floorPos_y - 250,
      flagpole.x_pos,
      floorPos_y - 190,
      flagpole.x_pos + 50,
      floorPos_y - 220
    );
  } else {
    fill(255, 0, 0);
    noStroke();
    triangle(
      flagpole.x_pos,
      floorPos_y,
      flagpole.x_pos,
      floorPos_y - 60,
      flagpole.x_pos + 50,
      floorPos_y - 30
    );
  }
  pop();
}

function checkFlagpole() {
  if (abs(gameChar_world_x - flagpole.x_pos) < 20) {
    flagpole.isReached = true;
  }
}

function checkPlayerDie() {
  if (gameChar_y > height + 100 && lives > 0) {
    lives -= 1;
    startGame();
  }
}

function startGame() {
  gameChar_x = 80;
  gameChar_y = floorPos_y;

  // Variable to control the background scrolling.
  scrollPos = 0;

  // Variable to store the real position of the gameChar in the game
  // world. Needed for collision detection.
  gameChar_world_x = gameChar_x - scrollPos;

  // Boolean variables to control the movement of the game character.
  isLeft = false;
  isRight = false;
  isFalling = false;
  isPlummeting = false;

  // Initialise arrays of scenery objects.

  // Initialise trees
  trees_x = [100, 200, 400, 800, 1100, 1200, 1800, 2300, 2400];

  // Initialise clouds
  clouds = [
    {
      x_pos: 150,
      y_pos: 100,
      size: 1.5,
    },
    {
      x_pos: 300,
      y_pos: 150,
      size: 2,
    },
    {
      x_pos: 600,
      y_pos: 120,
      size: 1.5,
    },
    {
      x_pos: 850,
      y_pos: 60,
      size: 2,
    },
    {
      x_pos: 1050,
      y_pos: 60,
      size: 1.5,
    },
    {
      x_pos: 1300,
      y_pos: 100,
      size: 2,
    },
    {
      x_pos: 1500,
      y_pos: 150,
      size: 2,
    },
    {
      x_pos: 1900,
      y_pos: 120,
      size: 1.5,
    },
    {
      x_pos: 2200,
      y_pos: 60,
      size: 2,
    },
    {
      x_pos: 2500,
      y_pos: 60,
      size: 1.5,
    },
    {
      x_pos: 2600,
      y_pos: 100,
      size: 2,
    },
  ];

  // Initialise mountains
  mountains = [
    {
      x_pos: 400,
      y_pos: floorPos_y,
      size: 2,
    },
    {
      x_pos: 950,
      y_pos: floorPos_y,
      size: 2.5,
    },
    {
      x_pos: 850,
      y_pos: floorPos_y,
      size: 1.5,
    },
    {
      x_pos: 1800,
      y_pos: floorPos_y,
      size: 1.8,
    },
    {
      x_pos: 1900,
      y_pos: floorPos_y,
      size: 3,
    },
  ];

  // Initialise canyons
  canyons = [
    {
      x_pos: 280,
      width: 60,
    },
    {
      x_pos: 720,
      width: 50,
    },
    {
      x_pos: 1500,
      width: 150,
    },
    {
      x_pos: 2500,
      width: 120,
    },
  ];

  // Initialise collectables
  collectables = [
    {
      x_pos: 150,
      y_pos: 415,
      size: 1.1,
      isFound: false,
    },
    {
      x_pos: 450,
      y_pos: 415,
      size: 1.1,
      isFound: false,
    },
    {
      x_pos: 600,
      y_pos: 340,
      size: 0.9,
      isFound: false,
    },
    {
      x_pos: 850,
      y_pos: 415,
      size: 1.1,
      isFound: false,
    },
    {
      x_pos: 1150,
      y_pos: 415,
      size: 1.1,
      isFound: false,
    },
    {
      x_pos: 1190,
      y_pos: 415,
      size: 1.1,
      isFound: false,
    },
    {
      x_pos: 2150,
      y_pos: 415,
      size: 1.1,
      isFound: false,
    },
    {
      x_pos: 2450,
      y_pos: 415,
      size: 1.1,
      isFound: false,
    },
  ];
  // initialise game score
  game_score = 0;
  flagpole = {
    x_pos: 2800,
    isReached: false,
  };
  //initialise platforms
  platform = [];
  platform.push(createPlatforms(550, floorPos_y - 80, 80));
  platform.push(createPlatforms(1450, floorPos_y - 80, 120));

  //initialse enemies
  enemies = [];
  enemies.push(new EnemyConstructor(580, floorPos_y - 5, 120));
  enemies.push(new EnemyConstructor(900, floorPos_y - 5, 80));
  enemies.push(new EnemyConstructor(1300, floorPos_y - 5, 150));
  enemies.push(new EnemyConstructor(2000, floorPos_y - 5, 150));
  enemies.push(new EnemyConstructor(2250, floorPos_y - 5, 100));
}

//enemy constructor function
function EnemyConstructor(x, y, range) {
  this.x = x;
  this.y = y;
  this.range = range;

  this.currentX = x;
  this.increment = 1;

  this.update = function () {
    this.currentX += this.increment;
    if (this.currentX > this.x + this.range) {
      this.increment = -1;
    } else if (this.currentX < this.x) {
      this.increment = 1;
    }
  };

  this.draw = function () {
    this.update();
    noStroke();
    fill(212, 96, 47);
    triangle(
      this.currentX,
      this.y,
      this.currentX + 30,
      this.y,
      this.currentX + 15,
      this.y - 15
    );
    fill(0);
    ellipse(this.currentX + 10, this.y - 10, 6);
    ellipse(this.currentX + 20, this.y - 10, 6);
    stroke(0);
    line(this.currentX + 12, this.y - 3, this.currentX + 18, this.y - 3);
    line(this.currentX + 10, this.y + 1, this.currentX + 10, this.y + 6);
    line(this.currentX + 5, this.y + 6, this.currentX + 10, this.y + 6);
    line(this.currentX + 20, this.y + 1, this.currentX + 20, this.y + 6);
    line(this.currentX + 25, this.y + 6, this.currentX + 20, this.y + 6);
  };

  this.checkContact = function (gc_x, gc_y) {
    var d = dist(gc_x, gc_y, this.currentX, this.y);
    if (d < 15) {
      return true;
    }
    return false;
  };
}
