function BubbleChart(
  layout,
  labelNum,
  sublableNumArr,
  labelContent,
  sublabelContent,
  data,
  originalData
) {
  //public properites---------------------
  this.layout = layout;
  this.labelContent = labelContent;
  this.sublabelContent = sublabelContent;
  this.data = data;
  this.originalData = originalData;

  //private varaibles------------------------
  const pad =
    (height - (this.layout.topMargin + this.layout.buttonMargin)) /
    (labelNum - 1);
  //pltNum (sub)for each xAxis
  const plot = {
    num: sublableNumArr,
    width: 200,
    height: 5,
  };
  const initialPoints = {
    x1: this.layout.leftMargin,
    y1: this.layout.topMargin,
    x2: width - this.layout.rightMargin,
    y2: this.layout.topMargin,
  };

  //methods----------------------------------
  this.draw = function () {
    for (let i = 0; i < labelNum; i++) {
      //draw xAxis
      line(
        initialPoints.x1,
        initialPoints.y1 + i * pad,
        initialPoints.x2,
        initialPoints.y2 + i * pad
      );
      //labels for each x-aixs
      fill(0);
      noStroke();
      textSize(12);
      text(
        this.labelContent[i],
        initialPoints.x1 - 100,
        initialPoints.y1 + i * pad - 20,
        100,
        50
      );

      for (let j = 0; j < plot.num[i]; j++) {
        //draw plots
        stroke(0);
        line(
          initialPoints.x1 + plot.width * j + 60,
          initialPoints.y1 + i * pad,
          initialPoints.x1 + plot.width * j + 60,
          initialPoints.y1 + i * pad - plot.height
        );
        //draw sub-labels
        textAlign(CENTER);
        textSize(8);
        noStroke();
        fill(0);
        text(
          this.sublabelContent[i][j],
          initialPoints.x1 + plot.width * j,
          initialPoints.y1 + i * pad + 2,
          150,
          20
        );
        //draw bubbles
        //find the max and min value of the data
        const absOriginalData = this.originalData.map((element) => {
          return Math.abs(element);
        });
        const max = Math.max(...absOriginalData);
        const min = Math.min(...absOriginalData);

        let diameter = map(Math.abs(this.data[i][j]), min, max, 5, 35);
        let transparency = map(Math.abs(this.data[i][j]), min, max, 1, 255);
        stroke(0);
        //the change of diameter and transparency is based on data
        if (this.data[i][j] >= 0) {
          fill(255, 0, 0, transparency);
        } else {
          fill(0, 255, 0, transparency);
        }

        ellipse(
          initialPoints.x1 + plot.width * j + 60,
          initialPoints.y1 + i * pad - 20,
          diameter
        );
      }
    }
  };

  // check if mouse is over a bubble
  this.checkMouseOver = function () {
    for (let i = 0; i < labelNum; i++) {
      for (let j = 0; j < plot.num[i]; j++) {
        let bubbleX = initialPoints.x1 + plot.width * j + 60;
        let bubbleY = initialPoints.y1 + i * pad - 20;
        let dataShowen = Math.round(this.data[i][j] * 100) / 100;
        let dis = dist(mouseX, mouseY, bubbleX, bubbleY);
        //if mouse is over a bubble, draw a label that shows the data
        if (dis < 35) {
          fill(0, 0, 255, 50);
          stroke(0);
          rect(mouseX, mouseY, 80, 30);
          fill(0);
          textSize(12);
          text(dataShowen, mouseX, mouseY + 3, 80, 30);
        }
      }
    }
  };
}
