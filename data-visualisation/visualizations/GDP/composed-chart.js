function ComposedChart(
  layout,
  minNum,
  maxNum,
  xLabels,
  organizedData,
  headers
) {
  //public properties------------
  this.layout = layout;
  this.minNum = minNum;
  this.maxNum = maxNum;
  this.xLabels = xLabels;
  this.organizedData = organizedData;
  this.headers = headers;

  //private variables----------------
  const xTickStep =
    (this.layout.rightMargin - this.layout.leftMargin) /
    (this.layout.numXTickLabels + 1);
  const yAxisHeight = this.layout.bottomMargin - this.layout.topMargin;
  // get the heights of each bar
  const barHeights = this.organizedData.GDPs.map((GDP) => {
    return map(GDP, this.minNum, this.maxNum, 0, yAxisHeight);
  });
  // the heights for each line point
  const linePointHeights = this.organizedData.growths.map((growth) => {
    return map(growth, this.minNum, this.maxNum, 0, yAxisHeight);
  });
  // the heights for each area point
  const areaPointHeights = this.organizedData.GDPPerCaps.map((GDPPerCap) => {
    return map(GDPPerCap, this.minNum, this.maxNum, 0, yAxisHeight);
  });

  //methods------------------------------------
  this.mapNumberToHeight = function (value) {
    return map(
      value,
      this.minNum,
      this.maxNum,
      this.layout.bottomMargin,
      this.layout.topMargin
    );
  };

  this.draw = function () {
    noStroke();
    // draw axis
    drawAxis(this.layout, (colour = 0));
    // Draw all axis tick labels and grid lines
    textSize(16);
    textAlign("center", "center");
    drawYAxisTickLabels(
      this.minNum,
      this.maxNum,
      this.layout,
      this.mapNumberToHeight.bind(this),
      0
    );

    textAlign("center", "center");

    for (let i = 1; i <= this.layout.numXTickLabels; i++) {
      const x = this.layout.leftMargin + i * xTickStep;
      //draw labels
      fill(0);
      noStroke();
      text(
        this.xLabels[i - 1],
        x,
        this.layout.bottomMargin + this.layout.marginSize / 2
      );
      //draw ticks
      line(x, this.layout.bottomMargin, x, this.layout.bottomMargin - 5);

      //draw bars for GDP
      const barWidth = 30;
      fill(68, 29, 145);
      noStroke();
      rect(
        x - barWidth / 2,
        this.layout.bottomMargin - barHeights[i - 1],
        barWidth,
        barHeights[i - 1]
      );

      //draw points for GDP growth
      fill(255);
      stroke(255, 0, 0);
      ellipse(x, this.layout.bottomMargin - linePointHeights[i - 1], 8);

      //draw points for GDP per capita
      noStroke();
      fill(255, 0, 0);
      ellipse(x, this.layout.bottomMargin - areaPointHeights[i - 1], 8);
    }

    //draw lines for GDP growth
    for (let i = 0; i < linePointHeights.length - 1; i++) {
      let startPointX = this.layout.leftMargin + (i + 1) * xTickStep;
      let startPointY = this.layout.bottomMargin - linePointHeights[i];
      let endPointX = this.layout.leftMargin + (i + 2) * xTickStep;
      let endPointY = this.layout.bottomMargin - linePointHeights[i + 1];
      stroke(255, 0, 0);
      line(startPointX, startPointY, endPointX, endPointY);
    }
    //draw area line for GDP per capita
    stroke(207, 207, 207, 100);
    fill(68, 29, 145, 70);
    beginShape();
    vertex(this.layout.leftMargin + xTickStep, this.layout.bottomMargin);
    vertex(
      this.layout.leftMargin + xTickStep,
      this.layout.bottomMargin - areaPointHeights[0]
    );
    vertex(
      this.layout.leftMargin + xTickStep,
      this.layout.bottomMargin - areaPointHeights[0]
    );
    vertex(
      this.layout.leftMargin + 2 * xTickStep,
      this.layout.bottomMargin - areaPointHeights[1]
    );
    vertex(
      this.layout.leftMargin + 3 * xTickStep,
      this.layout.bottomMargin - areaPointHeights[2]
    );
    vertex(
      this.layout.leftMargin + 4 * xTickStep,
      this.layout.bottomMargin - areaPointHeights[3]
    );
    vertex(
      this.layout.leftMargin + 5 * xTickStep,
      this.layout.bottomMargin - areaPointHeights[4]
    );
    vertex(this.layout.leftMargin + 5 * xTickStep, this.layout.bottomMargin);
    endShape();
    //draw chart explainers
    //bar
    const explainerXBase = this.layout.leftMargin + 150;
    const explainerYBase = height - (this.layout.marginSize / 3) * 2;
    //GDP
    fill(68, 29, 145);
    rect(explainerXBase, explainerYBase - 10, 15, 20);
    //per capita
    stroke(100);
    line(
      explainerXBase + 180,
      explainerYBase,
      explainerXBase + 220,
      explainerYBase
    );
    fill(255, 0, 0);
    noStroke();
    ellipse(explainerXBase + 200, explainerYBase, 7);
    //growth
    stroke(255, 0, 0);
    line(
      explainerXBase + 400,
      explainerYBase,
      explainerXBase + 440,
      explainerYBase
    );
    fill(255);
    ellipse(explainerXBase + 420, explainerYBase, 6);

    //draw text
    textAlign(LEFT);
    fill(0);
    stroke(0);
    textSize(12);
    text(this.headers[1], explainerXBase + 25, explainerYBase);
    text(this.headers[2], explainerXBase + 230, explainerYBase);
    text(this.headers[3], explainerXBase + 445, explainerYBase);
  };

  //moseOver function
  this.mouseOver = function () {
    for (let i = 1; i <= this.layout.numXTickLabels; i++) {
      let midLineX = this.layout.leftMargin + i * xTickStep;
      let xStrart = midLineX - 15;
      let xEnd = xStrart + 30;
      //check if mouse is over the mid-line of each bar
      if (
        mouseX >= xStrart &&
        mouseX <= xEnd &&
        mouseY >= this.layout.topMargin &&
        mouseY <= this.layout.bottomMargin
      ) {
        //draw mid-point line
        stroke(150);
        line(
          midLineX,
          this.layout.topMargin,
          midLineX,
          this.layout.bottomMargin
        );
        //draw text
        const containerWidth = 110;
        const containerHeight = 80;
        if (
          mouseY >= this.layout.topMargin &&
          mouseY <= this.layout.bottomMargin - containerHeight
        ) {
          //draw text container
          fill(255);
          stroke(0);
          rect(midLineX + 15, mouseY, containerWidth, containerHeight);
          //draw text in side the container
          textSize(9);
          stroke(0);
          noFill();
          // assign label content using template literals
          let GDPContent = `GDP(Trillion): ${this.organizedData.GDPs[i - 1]}`;
          text(GDPContent, midLineX + 20, mouseY + 20);

          let perCapitaContent = `GDP Per Capita(k): ${
            this.organizedData.GDPPerCaps[i - 1]
          }`;
          text(perCapitaContent, midLineX + 20, mouseY + 40);

          let growthContent = `Growth(%): ${this.organizedData.growths[i - 1]}`;
          text(growthContent, midLineX + 20, mouseY + 60);
        }
      }
    }
  };
}
