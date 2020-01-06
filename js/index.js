// Create the mapbox canvas
mapboxgl.accessToken =
  "pk.eyJ1IjoibWF3aWxsY294IiwiYSI6ImNqMDc5c3BhZzAwNjIzMmxmOGplbWo3bzkifQ.oDeFG1rRfc-aL9ST6LOPcQ";
let map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/outdoors-v11",
  center: [-122.425017345697, 37.7764970894399],
  zoom: 11
});

// When the map has loaded, add data, markers, and popup functionality
map.on('load', function (e) {
  // Adding just the geojson data
  map.addSource('locations', {
    type: 'geojson',
    data: './data/locations.geojson',
    cluster: true,
    clusterMaxZoom: 11, // Max zoom to cluster points on
    clusterRadius: 10 // Radius of each cluster when clustering points (defaults to 50)
  });
  
  // Adding points to the map for each type of location
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
        13, 5
      ],
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff'
    }
  });

  let popup = new mapboxgl.Popup({
    closeButton: true,
    closeOnClick: false
  });
  
  // Generate a popup with more info for the clicked location
  map.on('click', 'unclustered-point', function(e) {
    
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = 'pointer';
    
    let coordinates = e.features[0].geometry.coordinates.slice();
    let properties = e.features[0].properties;
    
    let innerContent = '';
    switch(properties.type) {
      case 'Park':
        innerContent = `<b>${properties.name}</b><br/>${properties.address}<br/>${properties.description}`;
        break;
      case 'Parklet':
        innerContent = `<b>${properties.name}</b><br/>${properties.address}`;
        break;
      case 'Privately Owned Public Open Space':
        innerContent = `<b>${properties.type}</b><br/>${properties.name}<br/>${properties.description}`
        break;
    }

    let content = `<div class='location-popup'>${innerContent}</div>`;
    
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
    
    // Zoom map to focus on clicked locations
    flyToLocation(e.features[0]);
  });
});

// Focuses the map on a location
function flyToLocation(currentFeature) {
  map.flyTo({
    center: currentFeature.geometry.coordinates,
    zoom: 13
  });
}

// Info button logic
var modal = document.getElementById("infoModal");
var btn = document.getElementById("infoBtn");
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}