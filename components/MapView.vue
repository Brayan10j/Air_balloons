<template>
    <MapboxMap map-id="map" style="position: relative; height: 80vh;" :options="{
        style: 'mapbox://styles/mapbox/satellite-streets-v11', // style URL
        center: [0, 0], // starting position
        zoom: 1, // starting zoom
        projection: 'globe',
        attributionControl: false,
        renderWorldCopies: false
    }">
        <MapboxSource source-id="route" :source="{
            type: 'geojson',
            data: {
                type: 'Feature',
                geometry: {
                    type: 'MultiLineString',
                    coordinates: [],
                },
            }
        }" />

        <MapboxSource source-id="point" :source="{
            type: 'geojson',
            data: {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'Point',
                    coordinates: [0,0],
                },
            }
        }" />

        <MapboxLayer :layer="{
            id: 'route',
            source: 'route',
            type: 'line',
            paint: {
                'line-width': 4,
                'line-color': '#007cbf',
            },
        }" />
        <MapboxLayer :layer="{
            id: 'point',
            source: 'point',
            type: 'symbol',
            layout: {
                'icon-image': 'airBalloon',
                'icon-size': 0.1,
                'icon-rotation-alignment': 'map',
                'icon-allow-overlap': true,
                'icon-ignore-placement': true,
            },
        }" />
    </MapboxMap>
</template>


<script setup>
const props = defineProps({
    airBalloon: {}
})


useMapboxBeforeLoad("map", async (map) => {
    map.loadImage(`/Globos/1.png`, (error, image) => {
        if (error) {
            console.log(error)
        }
        map.addImage(`airBalloon`, image)
    }
    )

})


</script>