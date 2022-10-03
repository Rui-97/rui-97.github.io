const TechCompanyRanking = function () {
  this.name = "Top 10 Tech Companies: 2011-2019";
  this.id = "top-10-tech-companies-2011-2019";
  //a container element for all the chart elements
  this.container;
  this.companyDataSets = [];
  this.currentDataSetIndex = 0;
  this.timerStart;
  this.timeEnd;

  // Remove the svg element from DOM when the next menu click is made
  this.destroy = function () {
    this.container.remove();
  };
  this.setup = function () {
    //when the visualization is selected, remove the canvas element from DOM, if canvas exists.
    const elementToBeRemoved = document.getElementsByTagName("canvas")[0];
    if (elementToBeRemoved !== undefined) {
      elementToBeRemoved.remove();
    }

    // basic settings of chart
    this.chartSettings = {
      chartWidth: 800,
      chartHeight: 600,
      padding: 55,
      titlePadding: 5,
      columnPadding: 0.3,
      ticksInXAxis: 6,
      duration: 4500,
    };
    this.chartSettings.innerWidth =
      this.chartSettings.chartWidth - this.chartSettings.padding * 2;
    this.chartSettings.innerHeight =
      this.chartSettings.chartHeight - this.chartSettings.padding * 2;
    this.elapsedTime = this.chartSettings.duration;

    //create a container for all the chart elements using D3
    this.container = d3
      .select("#app")
      .append("div")
      .attr("id", "content-container");
    //create paly button and instruction
    this.button = d3
      .select("#content-container")
      .append("button")
      .attr("id", "instruction")
      .text("Play");
    this.instrction = d3
      .select("#content-container")
      .append("span")
      .text("Click the play button to start the animation");
    //create svg element
    this.svg = d3
      .select("#content-container")
      .append("svg")
      .attr("id", "bar-chart-race")
      .attr("width", this.chartSettings.chartWidth)
      .attr("height", this.chartSettings.chartHeight);
    //create a g element inside the svg
    this.chartContainer = d3
      .select("svg")
      .append("g")
      .attr("class", "chart-container")
      .attr(
        "transform",
        `translate(${this.chartSettings.padding} ${this.chartSettings.padding})`
      );
    //create container elements for x-axis, y-axis,and columns-----------
    //set headnote
    this.chartHeadnote = d3
      .select(".chart-container")
      .append("text")
      .attr("class", "headnote")
      .attr("x", this.chartSettings.chartWidth / 2)
      .attr("y", -this.chartSettings.padding / 2)
      .text("Value in $M");
    this.xAxisContainer = d3
      .select(".chart-container")
      .append("g")
      .attr("class", "x-axis");
    this.yAxisContaier = d3
      .select(".chart-container")
      .append("g")
      .attr("class", "y-axis");
    this.columnsContainer = d3
      .select(".chart-container")
      .append("g")
      .attr("class", "columns");
    this.year = d3
      .select(".chart-container")
      .append("text")
      .attr("class", "current-year")
      .attr(
        "transform",
        `translate(${
          this.chartSettings.innerWidth - this.chartSettings.padding * 3
        } ${this.chartSettings.innerHeight - this.chartSettings.padding})`
      );

    //set up the range of x-axis
    this.xAxisScale = d3
      .scaleLinear()
      .range([0, this.chartSettings.innerWidth]);
    //set up the range of y-axis
    this.yAxisScale = d3
      .scaleBand()
      .range([0, this.chartSettings.innerHeight])
      .padding(this.chartSettings.columnPadding);

    this.addDataSets(techCompanyDataSet);
    //click play button to render
    d3.select("button").on("click", function () {
      render();
    });
  };

  this.draw = function () {};

  this.drawChart = function (dataEachYear, transition) {
    const { year: currentYear, dataSet } = dataEachYear;
    //destructuring some properties from chartSetting object
    const { innerHeight, ticksInXAxis, titlePadding } = this.chartSettings;
    //sort companies' value in desending order
    const dataSetDescendingOrder = dataSet.sort(
      ({ value: firstValue }, { value: secondValue }) =>
        secondValue - firstValue
    );
    // set the current year which will showen in the right-button
    this.year.text(currentYear);
    //set domain for x-axis and y-aixs based on the data set
    this.xAxisScale.domain([0, dataSetDescendingOrder[0].value]);
    this.yAxisScale.domain(
      dataSetDescendingOrder.map(({ company }) => company)
    );
    //apply transition method for making animation
    this.xAxisContainer
      .transition(transition)
      .call(
        d3.axisTop(this.xAxisScale).ticks(ticksInXAxis).tickSize(-innerHeight)
      );
    this.yAxisContaier
      .transition(transition)
      .call(d3.axisLeft(this.yAxisScale).tickSize(0));

    //bind data to the html elements
    const barGroups = this.chartContainer
      .select(".columns")
      .selectAll("g.column-container")
      .data(dataSetDescendingOrder, ({ company }) => company);

    // ENTER SECTION ----------------------------------------------------------------------------
    // create elements in the DOM, and set up initial settings for the first time appearance
    // add g elements into the DOM
    const barGroupsEnter = barGroups
      .enter()
      .append("g")
      .attr("class", "column-container")
      .attr("transform", `translate(0,${innerHeight})`);
    // add rect elements where the bars will be drawn later
    barGroupsEnter
      .append("rect")
      .attr("class", "column-rect")
      .attr("width", 0)
      .attr(
        "height",
        this.yAxisScale.step() * (1 - this.chartSettings.columnPadding)
      );
    // add text elements where the names of the company will be shown latter
    barGroupsEnter
      .append("text")
      .attr("class", "column-title")
      .attr("x", -titlePadding)
      .attr(
        "y",
        ((1 - this.chartSettings.columnPadding) * this.yAxisScale.step()) / 2
      )
      .text(({ company }) => company);
    //add text elements where the value of the company will be showen
    barGroupsEnter
      .append("text")
      .attr("class", "column-value")
      .attr("x", titlePadding)
      .attr(
        "y",
        (this.yAxisScale.step() * (1 - this.chartSettings.columnPadding)) / 2
      )
      .text(0);
    // UPDATE SECTION---------------------------------------------------------
    //connect enter section with update section
    const barUpdate = barGroupsEnter.merge(barGroups);

    barUpdate
      .transition(transition)
      .attr(
        "transform",
        ({ company }) => `translate(0,${this.yAxisScale(company)})`
      )
      .attr("fill", "normal");
    // update rectangles(bars)
    barUpdate
      .select(".column-rect")
      .transition(transition)
      .attr("width", ({ value }) => this.xAxisScale(value));
    //update bar title(company name)
    barUpdate
      .select(".column-title")
      .transition(transition)
      .attr("x", ({ value }) => this.xAxisScale(value) - titlePadding);
    // update value
    const duration = this.chartSettings.duration;
    barUpdate
      .select(".column-value")
      .transition(transition)
      .attr("x", ({ value }) => this.xAxisScale(value) + titlePadding)
      //create custom interpolations
      .tween("text", function ({ value }) {
        const interpolateStartValue =
          this.elapsedTime === duration
            ? this.currentValue || 0
            : +this.innerHTML;

        const interpolate = d3.interpolate(interpolateStartValue, value);
        this.currentValue = value;

        return function (t) {
          d3.select(this).text(Math.ceil(interpolate(t)));
        };
      });
    //EXIT SECTION---------------------------------------------------
    //remove data points that don't need from DOM
    const barExit = barGroups.exit();
    barExit
      .transition(transition)
      .attr("transform", `translate(0,${innerHeight})`)
      .on("end", function () {
        d3.select(this).attr("fill", "none");
      });
    barExit.select(".column-rect").transition(transition).attr("width", 0);
    barExit.select(".column-title").transition(transition).attr("x", 0);
    barExit
      .select(".column-value")
      .transition(transition)
      .attr("x", titlePadding)
      .tween("text", function () {
        const interpolate = d3.interpolate(this.currentValue, 0);
        this.currentValue = 0;

        return function (t) {
          d3.select(this).text(Math.ceil(interpolate(t)));
        };
      });
  };
  this.addDataSet = function (eachYearDataSet) {
    this.companyDataSets.push(eachYearDataSet);
  };
  this.addDataSets = function (dataSets) {
    this.companyDataSets.push.apply(this.companyDataSets, dataSets);
  };
  const self = this;
  async function render(index = 0) {
    self.currentDataSetIndex = index;
    self.timerStart = d3.now();
    const chartTransition = self.chartContainer
      .transition()
      .duration(self.elapsedTime)
      .ease(d3.easeLinear)
      .on("end", () => {
        if (index < self.companyDataSets.length) {
          self.elapsedTime = self.chartSettings.duration;
          render(index + 1);
        } else {
          d3.select("button").text("Play");
        }
      });

    if (index < self.companyDataSets.length) {
      self.drawChart(self.companyDataSets[index], chartTransition);
    }
  }
};
