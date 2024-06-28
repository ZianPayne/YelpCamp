mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: "map",
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 4
})