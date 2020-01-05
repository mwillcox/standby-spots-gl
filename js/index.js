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
   * Add list view
   * Adjust color based on type
  **/
map.on('load', function (e) {
  map.addSource('locations', {
    type: 'geojson',
    data: '../data/locations.geojson',
    cluster: true,
    clusterMaxZoom: 11, // Max zoom to cluster points on
    clusterRadius: 10 // Radius of each cluster when clustering points (defaults to 50)
  });
  
  map.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'locations',
    paint: {
      'circle-color': [
        'match', 
        ['get', 'type'], 
        'Park', '#ff6600',
        'Parklet', '#009900',
        'Privately Owned Public Space', '#cccc00',
        '#cccc00'
      ],
      'circle-radius': [
        'interpolate', ['linear'], ['zoom'],
        11, 6,
        13, 4,
      ],
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
    var properties = e.features[0].properties;

    // TODO: Make into case statement
    var content = `<div class='location-popup'><b>${properties.name}</b><br/>${properties.address}<br/>Type: ${properties.type}<br/>${properties.description !== undefined ? properties.description : ''}</div>`;
    
    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    
    // Populate the popup and set its coordinates
    popup
      .setLngLat(coordinates)
      .setHTML(content)
      .addTo(map);
    
    // Zoom map to focus on marker
    flyToLocation(e.features[0]);
  });
});

function flyToLocation(currentFeature) {
  map.flyTo({
    center: currentFeature.geometry.coordinates,
    zoom: 13
  });
}