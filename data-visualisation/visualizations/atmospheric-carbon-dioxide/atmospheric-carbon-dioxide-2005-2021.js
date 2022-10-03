function AtmosphericCO2() {
  //public properites---------------------
  this.name = `Atmospheric CO${"2".sub()}: 2005-2021`;
  this.id = "atmospheric-CO2-2005-2021";

  //private varaibles------------------------
  let years = [];
  let months = [];
  let co2s = [];
  let button;
  let slider;
  let isCircleShown = true;

  //methods----------------------------------
  this.preload = function () {
    const self = this;
    this.data = loadTable(
      "./data/extension-data/co2.csv",
      "csv",
      "header",
      function (table) {
        self.loaded = true;
      }
    );
  };
  // method for creating a button element
  this.button = function () {
    button = createButton("SWITCH CHART");
    button.position(750, height - 50);
    button.size(150);
    button.mousePressed(this.clickHander);
  };
  // button click handler
  this.clickHander = function () {
    isCircleShown = !isCircleShown;
  };
  // method for creating a slider element
  this.slider = function () {
    slider = createSlider(0, 100, 50);
    slider.position(735, height - 70);
    slider.size(200);
  };
  //remove the button and slider when the next click is made.
  this.destroy = function () {
    button.remove();
    slider.remove();
  };

  this.setup = function () {
    const c = createCanvas(1024, 576, 100);
    c.parent("app");
    //get basic info of the data
    this.numRows = this.data.getRowCount();
    this.numCols = this.data.getColumnCount();
    //load data
    for (let i = 0; i < this.numRows; i++) {
      years[i] = this.data.getNum(i, 0);
      months[i] = this.data.getString(i, 1);
      co2s[i] = this.data.getNum(i, 2);
    }
    //create button and slide
    this.button();
    this.slider();
  };

  this.draw = function () {
    background(240);
    // if the isCircleShown is true, create a circle chart object and draw a circle
    // if the isCircleShown is false, create a bar chart onject and draw a bar
    if (isCircleShown) {
      this.co2Circle = new CircleChart(
        co2s,
        years,
        months,
        width / 2,
        height / 2,
        slider.value()
      );
      this.co2Circle.draw();
      this.co2Circle.mouseOver();
    } else {
      this.co2Bar = new Bar(
        co2s,
        years,
        months,
        width - 100,
        height / 2,
        slider.value()
      );
      this.co2Bar.draw();
      this.co2Bar.mouseOver();
    }
  };
}
