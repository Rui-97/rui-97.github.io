const USVaccination = function () {
  this.name = "U.S. COVID-19 Vaccine Rates by State";
  this.id = "COVID-19-vaccine-rates-by-state";
  this.mapDiv;

  this.setup = function () {
    //when the visualization is selected, remove the canvas element from DOM, if canvas exists.
    const elementToBeRemoved = document.getElementsByTagName("canvas")[0];
    if (elementToBeRemoved !== undefined) {
      elementToBeRemoved.remove();
    }
    //Create a div element with the id map inside the app div element.
    this.mapDiv = createDiv();
    this.mapDiv.id("map");
    this.mapDiv.parent("app");
    //call createMap method.
    this.createMap();
  };
  // Remove the map div element from DOM when the next menu click is made.
  this.destroy = function () {
    this.mapDiv.remove();
  };
  this.draw = function () {};
  this.createMap = function () {
    // set up map using Leaflet libary.
    const mapboxAccessToken =
      "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw";
    const map = L.map("map").setView([37.8, -96], 4);
    const tiles = L.tileLayer(
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=" +
        mapboxAccessToken,
      {
        id: "mapbox/light-v9",
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        tileSize: 512,
        zoomOffset: -1,
      }
    ).addTo(map);

    //add geographic data of each state of U.S. to map
    L.geoJson(vaccinationData).addTo(map);

    // control that shows state info on hover
    let information = L.control();
    information.onAdd = function (map) {
      // create a div with a class "info"
      this._div = L.DomUtil.create("div", "info");
      this.update();
      return this._div;
    };
    information.update = function (props) {
      this._div.innerHTML =
        "<h4>US COVID-19 Vaccine Rates(fully vaccinated)</h4>" +
        (props
          ? "<b>" + props.name + "</b><br />" + props.vaccineRate + "%"
          : "Hover over a state");
    };

    information.addTo(map);

    //create a function that returns a color based on the vaccine rate:
    function getColor(rate) {
      return rate > 80
        ? "#061c12"
        : rate > 75
        ? "#004529"
        : rate > 70
        ? "#006837"
        : rate > 65
        ? "#238443"
        : rate > 60
        ? "#41ab5d"
        : rate > 55
        ? "#78c679"
        : rate > 50
        ? "#addd8e"
        : rate > 45
        ? "#d9f0a3"
        : rate > 40
        ? "#f7fcb9"
        : "#ffffe5";
    }
    // create a styling function for GeoJSON layer so that its fillColor depends on vaccineRate
    function styleMap(feature) {
      return {
        weight: 2,
        opacity: 1,
        color: "white",
        dashArray: "3",
        fillOpacity: 0.8,
        fillColor: getColor(feature.properties.vaccineRate),
      };
    }
    L.geoJson(vaccinationData, { style: styleMap }).addTo(map);

    //event listener for layer mouseover event
    function highlightFeature(e) {
      let layer = e.target;

      layer.setStyle({
        weight: 5,
        color: "#666",
        dashArray: "",
        fillOpacity: 0.7,
      });

      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
      }
      information.update(layer.feature.properties);
    }

    let geojson;
    //event listener for layer mouseout event
    function resetHighlight(e) {
      geojson.resetStyle(e.target);
      information.update();
    }
    //event listener for layer mouseclick event that zooms to the target state
    function zoomToFeature(e) {
      map.fitBounds(e.target.getBounds());
    }

    //add the listeners on our state layers
    function onEachFeature(feature, layer) {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature,
      });
    }

    geojson = L.geoJson(vaccinationData, {
      style: styleMap,
      onEachFeature: onEachFeature,
    }).addTo(map);

    //show the legend on the bottomright of the map
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function (map) {
      var div = L.DomUtil.create("div", "info legend");
      var grades = [0, 40, 45, 50, 55, 60, 65, 70, 75, 80];
      var labels = [];
      var from, to;

      for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
          '<i style="background:' +
            getColor(from + 1) +
            '"></i> ' +
            from +
            (to ? "&ndash;" + to : "+")
        );
      }

      div.innerHTML = labels.join("<br>");
      return div;
    };

    legend.addTo(map);
  };
};
