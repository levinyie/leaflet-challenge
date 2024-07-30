//Store API as url
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


d3.json(url).then(function(data) {
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  //Color based on Depth
  function getColor(depth) {
    if (depth < 10) {
      return "lightgreen";
    } 
      else if (depth < 30) {
      return "limegreen";
    } 
      else if (depth < 50) {
      return "yellow";
    } 
      else if (depth < 70) {
      return "orange";
    } 
      else if (depth < 90) {
      return "crimson";
    } 
      else {
      return "red";
    }
  }

  //Popup for Features for each point
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
  }

  //Layer and run onEachFeature for each data point
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, {
        radius: feature.properties.mag * 5,
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    },
    onEachFeature: onEachFeature
  });

  createMap(earthquakes);
}

function createMap(earthquakes) {
  //Base Layers
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  //baseMaps object
  var baseMaps = {
    "Street Map": street,
  };

  //overlayMaps holds Overlays
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  //Create "map"
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [street, earthquakes]
  });

  //Layer control
  L.control.layers(baseMaps, overlayMaps,{
    collapsed: false
  }).addTo(myMap);
}