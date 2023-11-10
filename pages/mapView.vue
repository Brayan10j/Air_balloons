<template>
    <v-card>
        <v-card-text>
            <v-row justify="center">
                {{ store.airBalloonSelected.point }}
            </v-row>
            <v-row justify="center">
                <v-card>
                    <v-row class="text-center">
                        <v-col>
                            <v-icon>mdi-water</v-icon>
                            {{ infoAirballon.humidity }} %
                        </v-col>
                        <v-col>
                            <v-icon>mdi-arrow-up-bold mdi-rotate-{{ infoAirballon.wind }}</v-icon>
                            {{ infoAirballon.speed.toFixed(2) }} km/h
                        </v-col>
                        <v-col>
                            <v-icon>mdi-thermometer</v-icon>
                            {{ infoAirballon.temp }} &deg;C
                            <!--  <v-icon v-show="(infoAirballon.rain /= undefined)">mdi-weather-pouring</v-icon> -->
                        </v-col>
                    </v-row>
                </v-card>
            </v-row>
            <v-row>
                <MapboxMap map-id="mapView" style="position: relative; height: 80vh;" :options="{
                    style: 'mapbox://styles/mapbox/satellite-streets-v11', // style URL
                    center: [0, 0], // starting position
                    zoom: 1, // starting zoom
                    projection: 'globe',
                    attributionControl: false,
                    renderWorldCopies: false
                }">
                    <MapboxDefaultMarker marker-id="markerView" :lnglat="store.airBalloonSelected.point">
                        <template #marker>
                            <img :src="`/Globos/${store.airBalloonSelected.airballoonId}.png`" width="80">

                        </template>

                    </MapboxDefaultMarker>
                    <MapboxSource source-id="route" :source="{
                        type: 'geojson',
                        data: {
                            type: 'Feature',
                            geometry: {
                                type: 'MultiLineString',
                                coordinates: store.airBalloonSelected.route,
                            },
                        }
                    }" />

                    <!-- <MapboxSource source-id="point" :source="{
                        type: 'geojson',
                        data: {
                            type: 'Feature',
                            properties: {},
                            geometry: {
                                type: 'Point',
                                coordinates: store.airBalloonSelected.point,
                            },
                        }
                    }" /> -->

                    <MapboxLayer :layer="{
                        id: 'route',
                        source: 'route',
                        type: 'line',
                        paint: {
                            'line-width': 4,
                            'line-color': '#007cbf',
                        },
                    }" />
                    <!--    <MapboxLayer :layer="{
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
                    }" /> -->
                </MapboxMap>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup>

const store = useMainStore()


const infoAirballon = ref({
    temp: 0,
    wind: 0,
    humidity: 0,
    speed: 0,
})

/* let x = useWeather(store.airBalloonSelected.point)

console.log("esto") */


useMapboxBeforeLoad("mapView", async (map) => {
    map.on('style.load', () => {
        map.setFog({}) // Set the default atmosphere style
    })
    /*  map.loadImage(`/Globos/1.png`, (error, image) => {
         if (error) {
             console.log(error)
         }
         map.addImage(`airBalloon`, image)
     }
     )  */

})

</script>