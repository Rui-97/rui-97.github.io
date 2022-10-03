function Bar(dataValues, years, months, chartPosX, chartPosY, sliderVal) {
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
  //width for each bar
  const w = 0.2;
  //gap beween two bars
  const gap = (width - this.chartPosX / 4) / dataValues.length - w;
  const heightMax = map(this.sliderVal, 0, 100, 100, 250);

  //methods----------------------------------
  this.draw = function () {
    for (let i = 0; i < this.dataValues.length; i++) {
      let h = map(this.dataValues[i], minCO2, maxCO2, 0, heightMax);
      let point1X = (w + gap) * i + width / 8;
      let point1Y = height - this.chartPosY / 2;
      let point2X = point1X;
      let point2Y = point1Y - h;

      if (i % 12 === 0) {
        //draw years
        noStroke();
        textAlign(CENTER);
        textSize(10);
        text(this.years[i], point1X, point1Y + 10);
        //draw lines
        stroke(245, 64, 64);
        strokeWeight(1);
      } else {
        stroke(0);
        strokeWeight(w);
      }
      line(point1X, point1Y, point2X, point2Y);
      //draw points
      fill(0);
      circle(point2X, point2Y, 2);
      //connection lines
      let p1X = point2X;
      let p1Y = point2Y;
      if (i < this.dataValues.length) {
        let p2X = (w + gap) * (i + 1) + width / 8;
        let p2Y =
          point1Y - map(this.dataValues[i + 1], minCO2, maxCO2, 0, heightMax);
        stroke(245, 64, 64);
        strokeWeight(0.8);
        line(p1X, p1Y, p2X, p2Y);
      }
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
      let pointX = (w + gap) * i + width / 8;
      let pointY =
        height -
        this.chartPosY / 2 -
        map(this.dataValues[i], minCO2, maxCO2, 0, heightMax);
      let dis = dist(mouseX, mouseY, pointX, pointY);

      if (dis < 3) {
        //highlight data point
        fill(245, 64, 64);
        circle(pointX, pointY, 6);

        // draw text
        textAlign(CENTER);
        textSize(15);
        noStroke();
        fill(0);
        let textContent = `${this.years[i]} ${this.months[i]}`;
        text(textContent, this.chartPosX, this.chartPosY / 4);
        textSize(25);
        fill(245, 64, 64);
        text(this.dataValues[i], this.chartPosX, this.chartPosY / 4 + 30);
      }
    }
  };
}
