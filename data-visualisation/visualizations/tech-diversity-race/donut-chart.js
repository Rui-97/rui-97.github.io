function DonutChart(x, y, diameter) {
  //public properites---------------------
  this.x = x;
  this.y = y;
  this.diameter = diameter;
  this.labelSpace = 30;

  //methods----------------------------------
  this.get_radians = function (data) {
    const total = sum(data);
    let radians = [];

    for (let i = 0; i < data.length; i++) {
      radians.push((data[i] / total) * TWO_PI);
    }

    return radians;
  };

  // check whether the mouse is hover over the donut chart and return boolean value
  this.isMouseOnDOnut = () => {
    let d = dist(mouseX, mouseY, this.x, this.y);
    if (d > this.diameter / 3 && d < this.diameter / 2) {
      return true;
    }
  };

  this.getCategoryIndex = (data) => {
    let mouseRadians;
    if (mouseY < this.y) {
      mouseRadians = Math.atan2(mouseY - this.y, mouseX - this.x) + Math.PI * 2;
    } else {
      mouseRadians = Math.atan2(mouseY - this.y, mouseX - this.x);
    }

    const categoryRadiansArr = this.get_radians(data);
    let accumulativeCategoryRadians = 0;
    for (let i = 0; i < data.length; i++) {
      accumulativeCategoryRadians += categoryRadiansArr[i];
      if (mouseRadians <= accumulativeCategoryRadians) {
        return i;
      }
    }
  };
  //-------------------------

  this.draw = function (data, labels, colours, title) {
    // Test that data is not empty and that each input array is the
    // same length.
    if (data.length == 0) {
      alert("Data has length zero!");
    } else if (
      ![labels, colours].every((array) => {
        return array.length == data.length;
      })
    ) {
      alert(`Data (length: ${data.length})
Labels (length: ${labels.length})
Colours (length: ${colours.length})
Arrays must be the same length!`);
    }

    // https://p5js.org/examples/form-pie-chart.html

    let angles = this.get_radians(data);
    let lastAngle = 0;
    let colour;

    for (let i = 0; i < data.length; i++) {
      //draw each arc with correct color and radians
      if (colours) {
        colour = colours[i];
      } else {
        colour = map(i, 0, data.length, 0, 255);
      }

      fill(colour);
      stroke(0);
      strokeWeight(1);

      //draw arc: arc() is a build in JS method
      arc(
        this.x,
        this.y,
        this.diameter,
        this.diameter,
        lastAngle,
        lastAngle + angles[i] + 0.001
      ); // Hack for 0!

      //draw labels
      if (labels) {
        this.makeLegendItem(labels[i], i, colour);
      }

      lastAngle += angles[i];
    }
    // draw inside circle
    fill(255);
    stroke(0);
    strokeWeight(1);
    ellipse(this.x, this.y, (this.diameter / 3) * 2);

    if (title) {
      noStroke();
      textAlign("center", "center");
      textSize(20);
      text(title, this.x, this.y - this.diameter * 0.6);
    }

    //draw text showen in circle
    fill(0);
    let contentInCircle;
    if (this.isMouseOnDOnut()) {
      contentInCircle = data[this.getCategoryIndex(data)].toFixed(2) + "%";
    } else {
      contentInCircle = "hover to get the percentage";
    }
    text(contentInCircle, this.x, this.y);
  };

  this.makeLegendItem = function (label, i, colour) {
    let x = this.x + 50 + this.diameter / 2;
    let y = this.y + this.labelSpace * i - this.diameter / 3;
    let boxWidth = this.labelSpace / 2;
    let boxHeight = this.labelSpace / 2;

    fill(colour);
    rect(x, y, boxWidth, boxHeight);

    fill("black");
    noStroke();
    textAlign("left", "center");
    textSize(12);
    text(label, x + boxWidth + 10, y + boxWidth / 2);
  };
}
