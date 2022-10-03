function CanadaCheeseConsumption() {
  //public properites---------------------
  this.name = "Canada Cheese Consumption: 2021";
  this.id = "canada-cheese-consumption";

  //private varaibles------------------------
  const percentageData = [];
  const waffles = [];
  let waffle;

  //methods----------------------------------
  this.preload = function () {
    const self = this;
    this.data = loadTable(
      "./data/extension-data/canada-cheese-consumption.csv",
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
    //get month data
    this.monthsOriginal = this.data.columns;
    this.months = [...this.monthsOriginal];
    this.months.splice(0, 1);
    //get cheese type data
    this.cheeseTypes = this.data.getColumn("Commodity");
    this.cheeseTypes.splice(8, 1);

    const cheeseTotals = this.data.getRows()[8].arr;
    cheeseTotals.splice(0, 1);

    //organize original data into a 2D array and transfer original data to percentage
    for (let i = 0; i < this.months.length; i++) {
      let origialArr = this.data.getColumn(i + 1);
      origialArr.pop();
      let precentageDataEach = origialArr.map(function (element) {
        return Math.round((element / cheeseTotals[i]) * 100) / 100;
      });
      percentageData.push(precentageDataEach);
    }
  };

  this.draw = function () {
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    }
    //draw waffles and arrange them on the canvas
    const waffleDown = 2;
    const waffleAcross = Math.ceil(this.months.length / 2);
    for (let i = 0; i < waffleDown; i++) {
      for (let j = 0; j < waffleAcross; j++) {
        let index = i * waffleAcross + j;
        if (index > this.months.length - 1) {
          break;
        }
        let waffleX = 50 + 200 * j;
        let waffleY = 50 + 200 * i;
        //create new waffle object
        waffle = new Waffle(
          waffleX,
          waffleY,
          150,
          150,
          10,
          10,
          this.cheeseTypes,
          percentageData[index],
          this.months[index]
        );
        waffle.draw();
        waffle.mouseOver();
      }
    }
  };
}
