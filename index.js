// Create the mapbox canvas
mapboxgl.accessToken =
  "pk.eyJ1IjoibWF3aWxsY294IiwiYSI6ImNqMDc5c3BhZzAwNjIzMmxmOGplbWo3bzkifQ.oDeFG1rRfc-aL9ST6LOPcQ";
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/outdoors-v11",
  center: [-122.425017345697, 37.7764970894399],
  zoom: 11
});

/** TODO:
   * Add more info to tooltip
   * Add list view
   * Adjust color based on type
  **/
map.on('load', function (e) {
  map.addSource('locations', {
    type: 'geojson',
    data: './data.geojson',
    cluster: true,
    clusterMaxZoom: 11, // Max zoom to cluster points on
    clusterRadius: 10 // Radius of each cluster when clustering points (defaults to 50)
  });
  
  map.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'locations',
    paint: {
      'circle-color': '#11b4da',
      'circle-radius': 4,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff'
    }
  });

  var popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  });
  
  map.on('click', 'unclustered-point', function(e) {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = 'pointer';
    
    var coordinates = e.features[0].geometry.coordinates.slice();
    var address = e.features[0].properties.address;
    
    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    
    // Populate the popup and set its coordinates
    // based on the feature found.
    popup
      .setLngLat(coordinates)
      .setHTML(address)
      .addTo(map);
  });
});