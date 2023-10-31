<template>
    <v-container>
        <MapboxMap map-id="map" :options="{
            style: 'mapbox://styles/mapbox/satellite-streets-v11', // style URL
            center: [0, 0], // starting position
            zoom: 1, // starting zoom
            projection: 'globe',
            attributionControl: false,
            renderWorldCopies: false
        }">


            <MapboxDefaultMarker marker-id="marker1" :options="{
                draggable: true,
            }" :lnglat="[0, 0]"></MapboxDefaultMarker>

        </MapboxMap>
    </v-container>
</template>
<script setup>


/* const markerRef = defineMapboxMarker("marker1", { draggable: true }, "markerCustom", (marker) => {
    marker.setLngLat([5, 5])

}) */

/* useMapbox("map", (map) => {
    const el = document.createElement('div');
    el.style.backgroundImage = `url('/Globos/1.png')`;
    el.style.width = `50px`;
    el.style.height = `50px`;
    el.style.backgroundSize = '100%';
    new mapboxgl.Marker({
        element: el,
        draggable: true
    })
        .setLngLat([5, 5])
        .addTo(map)
}) */



/* mapboxgl.accessToken =
    'pk.eyJ1Ijoic3Rvcm1ibGF4IiwiYSI6ImNrb2Z6a2F3bzBib3gyb3BucDV5eG1maXoifQ.BgKgtZQJa5m1xOXGNuJfjw'

const map = new mapboxgl.Map({
    container: 'map',
    center: [0, 0],
    style: 'mapbox://styles/mapbox/satellite-streets-v11',
    zoom: 1,
    projection: 'globe',
    attributionControl: false,
    renderWorldCopies: false
}) */
</script>