function TechDiversityRace() {
  // Name for the visualisation to appear in the menu bar.
  this.name = "Tech Diversity: Race";

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = "tech-diversity-race";

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function () {
    const self = this;
    this.data = loadTable(
      "./data/tech-diversity/race-2018.csv",
      "csv",
      "header",
      // Callback function to set the value
      // this.loaded to true.
      function (table) {
        self.loaded = true;
        console.log(self.loaded);
      }
    );
    console.log(this.loaded + " outside");
  };

  this.setup = function () {
    const c = createCanvas(1024, 576);
    c.parent("app");
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    }

    // Create a select DOM element.
    this.select = createSelect();
    console.log(this.select);

    // Set select position.
    this.select.position((width / 5) * 2, height / 10);

    // Fill the options with all company names.
    const iterationNums = this.data.getColumnCount();
    for (let i = 1; i < iterationNums; i++) {
      let companyName = this.data.columns[i];
      this.select.option(companyName);
    }
  };

  this.destroy = function () {
    this.select.remove();
  };

  // Create a new donut chart object.
  this.donut = new DonutChart(width / 2, height / 2, width * 0.4);

  this.draw = function () {
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    }

    // Get the value of the company we're interested in from the
    // select item.
    // Use a temporary hard-code example for now.
    const companyName = this.select.value();

    // Get the column of raw data for companyName.
    let col = this.data.getColumn(companyName);

    // Convert all data strings to numbers.
    col = stringsToNumbers(col);

    // Copy the row labels from the table (the first item of each row).
    const labels = this.data.getColumn(0);

    // Colour to use for each category.
    const colours = ["blue", "red", "green", "pink", "purple", "yellow"];

    // Make a title.
    const title = "Employee diversity at " + companyName;

    // Draw the donut chart!
    this.donut.draw(col, labels, colours, title);
  };
}
