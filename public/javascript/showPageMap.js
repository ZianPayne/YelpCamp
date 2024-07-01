mapboxgl.accessToken = mapToken;

console.log(campground);

const map = new mapboxgl.Map({
    container: "show-page-map",
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [campground.geometry.coordinates[0], campground.geometry.coordinates[1]],
    zoom: 8
});

map.addControl(new mapboxgl.NavigationControl());

const marker = new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h4>${campground.title}</h4><p>${campground.location}</p>`
            )
    )
    .addTo(map);
