<template>
    <v-container>

        <v-row>
            <v-col>
                <v-row>
                    <v-col cols="12">
                        <v-card>
                            <v-card-title>
                                Terrain weather
                            </v-card-title>
                            <v-card-text>
                                <v-row justify="center" class="text-center">
                                    <v-col>
                                        <v-icon>mdi-water</v-icon>
                                        <v-chip
                                            :color="store.InfoWheather.humidity <= store.airBalloon.conditions.humidity[0] + 5 || store.InfoWheather.humidity >= store.airBalloon.conditions.humidity[1] - 5 ? 'red' : 'green'">

                                            {{ store.InfoWheather.humidity }} %
                                        </v-chip>
                                    </v-col>
                                    <v-col>
                                        <v-icon>mdi-arrow-up-bold mdi-rotate-{{ store.InfoWheather.wind }}</v-icon>
                                        <v-chip
                                            :color="store.InfoWheather.speed <= store.airBalloon.conditions.windSpeed[0] + 5 || store.InfoWheather.speed >= store.airBalloon.conditions.windSpeed[1] - 5 ? 'red' : 'green'">

                                            {{ store.InfoWheather.speed.toFixed(2) }} km/h
                                        </v-chip>
                                        
                                        
                                    </v-col>
                                    <v-col>
                                        <v-icon>mdi-thermometer</v-icon>
                                        <v-chip
                                            :color="store.InfoWheather.temp <= store.airBalloon.conditions.temp[0] + 5 || store.InfoWheather.temp >= store.airBalloon.conditions.temp[1] - 5 ? 'red' : 'green'">

                                            {{ store.InfoWheather.temp }} &deg;C
                                        </v-chip>
                                        
                                        <!--  <v-icon v-show="(infoAirballon.rain /= undefined)">mdi-weather-pouring</v-icon> -->
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col>
                        <v-card>
                            <v-card-title>
                                Info air-balloon
                            </v-card-title>
                            <v-card-text>
                                <v-row justify="center" class="text-center">
                                   <!--  <v-col>

                                        <v-card class="text-center">
                                            <v-card-title> <v-img width="200" class="mx-auto"
                                                    :src="store.airBalloon.image"></v-img>
                                            </v-card-title>

                                            <v-card-subtitle> Conditions </v-card-subtitle>

                                            <v-card-text>
                                                <v-icon>mdi-thermometer</v-icon> : {{ store.airBalloon.conditions.temp[0]
                                                }}&deg;C to {{ store.airBalloon.conditions.temp[1] }}&deg;C

                                                <v-icon>mdi-water</v-icon> : {{ store.airBalloon.conditions.humidity[0] }}%
                                                to {{
                                                    store.airBalloon.conditions.humidity[1] }}%

                                                <v-icon>mdi-speedometer</v-icon> : {{
                                                    store.airBalloon.conditions.windSpeed[0] }}km/h to
                                                {{ store.airBalloon.conditions.windSpeed[1] }}km/h
                                            </v-card-text>
                                        </v-card>
                                    </v-col> -->
                                    <!-- <v-col>
                                        {{ store.airBalloonSelected.point }}
                                    </v-col> -->
                                    <v-col>
                                        {{ store.airBalloonSelected.kilometers.toFixed(4) }} KM
                                    </v-col>
                                    <v-col>
                                        <v-icon size="small"
                                            :color="store.airBalloonSelected.state ? 'green' : 'red'">mdi-circle</v-icon>
                                        {{ store.airBalloonSelected.state ? 'Live' : 'Crash' }}
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
            <v-col>
                <v-card>
                    <v-card-text>
                        <MapboxMap map-id="mapView" style="position: relative; height: 70vh;" :options="{
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
                    </v-card-text>
                </v-card>

            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>

const store = useMainStore()



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