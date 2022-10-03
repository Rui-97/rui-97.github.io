function Waffle(
  x,
  y,
  width,
  height,
  boxesAcross,
  boxesDown,
  categoryNames,
  valuePercetages,
  label
) {
  //public properites---------------------
  this.waffleX = x;
  this.waffleY = y;
  this.waffleWidth = width;
  this.waffleHeight = height;
  this.boxesAcross = boxesAcross;
  this.boxesDown = boxesDown;
  this.categoryNames = categoryNames;
  this.valuePercetages = valuePercetages;
  this.label = label;

  //private varaibles------------------------
  const colors = [
    "crimson",
    "aquamarine",
    "coral",
    "cornflowerblue",
    "darkorchid",
    "darkseagreen",
    "darkorange",
    "deeppink",
    "gold",
    "pink",
  ];
  // calculate box number for each category
  const totalBoxNum = this.boxesAcross * this.boxesDown;
  const countValues = this.valuePercetages.map(function (element) {
    return Math.round(totalBoxNum * element);
  });
  const categories = [];
  const boxes = [];
  // push objects with certain properties of each category in to the categories array
  for (let i = 0; i < this.categoryNames.length; i++) {
    categories.push({
      name: this.categoryNames[i],
      count: countValues[i],
      color: colors[i % colors.length],
    });
  }

  //methods----------------------------------
  // add each box as an object into the 2D array.
  this.addBoxes = function () {
    let currentCategory;
    let currentCategoryBox;
    let currentCategoryIndex = 0;
    let boxCount = 0;
    let boxX = this.waffleX;
    let boxY = this.waffleY;

    //calculate the width and height for each box
    const boxWidth = this.waffleWidth / this.boxesAcross;
    const boxHeight = this.waffleHeight / this.boxesDown;
    for (let i = 0; i < this.boxesDown; i++) {
      boxes.push([]);
      for (let j = 0; j < this.boxesAcross; j++) {
        boxX = this.waffleX + boxWidth * j;
        boxY = this.waffleY + boxHeight * i;
        currentCategory = categories[currentCategoryIndex];
        // create a new box object using the Box constructor
        boxes[i].push(
          new Box(boxX, boxY, boxWidth, boxHeight, currentCategory)
        );
        boxCount++;
        if (boxCount === categories[currentCategoryIndex].count) {
          currentCategoryIndex++;
          boxCount = 0;
        }
      }
    }
  };
  // call addBoxes method
  this.addBoxes();

  this.draw = function () {
    // draw boxes
    for (let i = 0; i < boxes.length; i++) {
      for (let j = 0; j < boxes[i].length; j++) {
        boxes[i][j].draw();
      }
    }
    //draw months
    const textX = this.waffleX + this.waffleWidth / 2;
    const textY = this.waffleY + this.waffleHeight + 20;
    textAlign(CENTER);
    textSize(15);
    fill(0);
    text(this.label, textX, textY);
  };

  // check whether mouse is over a box.
  this.mouseOver = function () {
    for (let i = 0; i < boxes.length; i++) {
      for (let j = 0; j < boxes[i].length; j++) {
        let currentBox = boxes[i][j];
        //if mouse hovers over the box, draw a label that shows the data
        if (currentBox.isMouseOver(mouseX, mouseY)) {
          push();
          stroke(0);
          fill(255);
          rect(mouseX, mouseY, 80, 40);
          textSize(12);
          fill(0);
          text(currentBox.category, mouseX, mouseY + 3, 80, 30);
          pop();
        }
      }
    }
  };
}
