function PayGapByJob2017() {
  // Name for the visualisation to appear in the menu bar.
  this.name = "Pay gap by job: 2017";

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = "pay-gap-by-job-2017";

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function () {
    const self = this;
    this.data = loadTable(
      "./data/pay-gap/occupation-hourly-pay-by-gender-2017.csv",
      "csv",
      "header",
      // Callback function to set the value
      // this.loaded to true.
      function (table) {
        self.loaded = true;
      }
    );
  };

  this.setup = function () {
    const c = createCanvas(1024, 576);
    c.parent("app");
    // set up layout
    this.layout = {
      leftMargin: 120,
      rightMargin: 20,
      topMargin: 100,
      buttonMargin: 20,
    };
    //get job(x-aixs) number
    this.jobTypeNum = this.data.getNum(this.data.getRowCount() - 1, 0);
    //get lable(job type) name for each x-aixs
    this.jobTypeName = [];
    for (let i = 1; i <= this.data.getColumn("job_type").length; i++) {
      let currentJobName = this.data.getColumn("job_type")[i];
      let previousJobName = this.data.getColumn("job_type")[i - 1];
      if (currentJobName !== previousJobName) {
        this.jobTypeName.push(previousJobName);
      }
    }

    //get job subtype number
    this.jobSubtypeNum = [];
    let count = 0;
    for (let i = 1; i <= this.data.getColumn("job_type").length; i++) {
      let currentJobName = this.data.getColumn("job_type")[i];
      let previousJobName = this.data.getColumn("job_type")[i - 1];
      if (currentJobName === previousJobName) {
        count++;
      } else {
        this.jobSubtypeNum.push(count + 1);
        count = 0;
      }
    }
    // organize job subtype name data and pay gap data in to 2D arrays
    const self = this;
    const jobSubtypeNameData = this.data.getColumn("job_subtype");
    this.jobSubtypeName = [];
    this.gapNum = [];
    this.gapData = this.data.getColumn("pay_gap");
    let start = 0;

    this.jobSubtypeNum.forEach(function (value) {
      let nameElementInArray = [];
      let gapElementInArray = [];
      for (let i = start; i < start + value; i++) {
        nameElementInArray.push(jobSubtypeNameData[i]);
        gapElementInArray.push(self.gapData[i]);
      }
      start += value;
      self.jobSubtypeName.push(nameElementInArray);
      self.gapNum.push(gapElementInArray);
    });

    // create a new bubble object
    this.payGapBubbleChart = new BubbleChart(
      this.layout,
      this.jobTypeNum,
      this.jobSubtypeNum,
      this.jobTypeName,
      this.jobSubtypeName,
      this.gapNum,
      this.gapData
    );
  };

  this.draw = function () {
    // draw bubble chart
    this.payGapBubbleChart.draw();
    //check if mouse is over a bubble
    this.payGapBubbleChart.checkMouseOver();
  };
}
