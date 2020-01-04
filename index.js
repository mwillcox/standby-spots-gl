mapboxgl.accessToken =
  "pk.eyJ1IjoibWF3aWxsY294IiwiYSI6ImNqMDc5c3BhZzAwNjIzMmxmOGplbWo3bzkifQ.oDeFG1rRfc-aL9ST6LOPcQ";
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/outdoors-v11",
  center: [-122.425017345697, 37.7764970894399],
  zoom: 11
});

fetch("./data.geojson")
  .then(response => response.json())
  .then(json => {
    map.on('load', function (e) {
      map.addLayer({
        "id": "locations",
        "type": "symbol",
        "source": {
          "type": "geojson",
          "data": json
        },
        "layout": {
          "icon-image": "park-11",
          "icon-allow-overlap": true,
        }
      });
      var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      });
      /** TODO:
       * Make it on click
       * Add clusters
       * Add more info to tooltip
       * Refactor code into JS file 
       * Put on Github
       * Add list view
       * Fix method of fetching JSON
      **/
      map.on('click', 'locations', function(e) {
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
  });