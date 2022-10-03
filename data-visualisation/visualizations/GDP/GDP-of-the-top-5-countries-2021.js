function GDP() {
  this.name = "GDP of the Top 5 Countries: 2021";
  this.id = "GDP-2021";

  const marginSize = 40;
  this.layout = {
    marginSize: 40,
    leftMargin: marginSize * 2,
    rightMargin: width - marginSize,
    topMargin: marginSize,
    bottomMargin: height - marginSize * 2,
    pad: 10,

    plotWidth: function () {
      return this.rightMargin - this.leftMargin;
    },
    plotHeight: function () {
      return this.bottomMargin - this.topMargin;
    },

    grid: true,
    numXTickLabels: 5,
    numYTickLabels: 14,
  };

  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function () {
    var self = this;
    this.data = loadTable(
      "./data/extension-data/GDP-of-the-top-5-Countries-in-2021.csv",
      "csv",
      "header",
      function (table) {
        self.loaded = true;
      }
    );
  };

  this.setup = function () {
    const c = createCanvas(1024, 576);
    c.parent("app");
    //find the min and max number in data
    this.minNum = 0;
    this.maxNum = Math.ceil(max(this.data.getColumn("GDP Per Capita(k)")));

    //an array stores country names(x-axis lables)
    this.xLabels = this.data.getColumn("Country");
    const self = this;
    this.organizedData = {
      GDPs: self.data.getColumn("GDP(Trillion)"),
      growths: self.data.getColumn("Growth(%)"),
      GDPPerCaps: self.data.getColumn("GDP Per Capita(k)"),
    };
    //header array
    this.headers = this.data.columns;
    //creat a new composed chart
    this.GDPComposedChart = new ComposedChart(
      this.layout,
      this.minNum,
      this.maxNum,
      this.xLabels,
      this.organizedData,
      this.headers
    );
  };

  this.draw = function () {
    //draw composed chart
    this.GDPComposedChart.draw();
    //check if mouse is over
    this.GDPComposedChart.mouseOver();
  };
}
