function CircleChart(
  dataValues,
  years,
  months,
  chartPosX,
  chartPosY,
  sliderVal
) {
  //public properites---------------------
  this.dataValues = dataValues;
  this.years = years;
  this.months = months;
  this.chartPosX = chartPosX;
  this.chartPosY = chartPosY;
  this.sliderVal = sliderVal;

  //private varaibles------------------------
  //get the max and min CO2 value
  const maxCO2 = Math.max(...this.dataValues);
  const minCO2 = Math.min(...this.dataValues);
  const radius = width / 4 - 100;
  const angle = 360 / dataValues.length;
  const sizeMax = map(this.sliderVal, 0, 100, 70, 150);

  //get basic position info
  let sizes = [];
  let pointsX = [];
  let pointsY = [];
  let circleX = [];
  let circleY = [];

  for (let i = 0; i < this.dataValues.length; i++) {
    sizes[i] = map(this.dataValues[i], minCO2, maxCO2, 0, sizeMax);
    pointsX[i] = (sizes[i] + radius) * cos(radians(angle * i)) + this.chartPosX;
    pointsY[i] = (sizes[i] + radius) * sin(radians(angle * i)) + this.chartPosY;
    circleX[i] = radius * cos(radians(angle * i)) + this.chartPosX;
    circleY[i] = radius * sin(radians(angle * i)) + this.chartPosY;
  }

  //methods----------------------------------
  this.draw = function () {
    for (let i = 0; i < this.dataValues.length; i++) {
      let isMouseOver = false;
      let dateContent;
      let dataContent;
      //draw the data points
      fill(245, 64, 64);
      noStroke();
      circle(pointsX[i], pointsY[i], 4);

      //draw the lines
      //draw the first month of each year with red
      if (i % 12 === 0) {
        stroke(245, 64, 64);
        strokeWeight(1.2);
      } else {
        stroke(0);
        strokeWeight(0.4);
      }
      line(circleX[i], circleY[i], pointsX[i], pointsY[i]);
      //draw instruction
      noStroke();
      textAlign(CENTER);
      textSize(10);
      fill(0);
      text(
        "Hover over the data point to get detailed information",
        width / 2,
        10
      );
    }
  };

  this.mouseOver = function () {
    for (let i = 0; i < this.dataValues.length; i++) {
      let dis = dist(mouseX, mouseY, pointsX[i], pointsY[i]);
      if (dis < 3) {
        //highlight data point
        fill(0, 0, 255);
        circle(pointsX[i], pointsY[i], 6);
        circle(pointsX[i], pointsY[i], 6);
        // draw text showing in the circle
        textAlign(CENTER);
        textSize(15);
        fill(0);
        let dateContent = `${this.years[i]} ${this.months[i]}`;
        text(dateContent, this.chartPosX, this.chartPosY);

        textSize(25);
        fill(245, 64, 64);
        text(this.dataValues[i], this.chartPosX, this.chartPosY + 30);
      }
    }
  };
}
