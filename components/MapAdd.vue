<template>
    <v-card>
        <v-card-text>
            <v-row justify="center">
                {{ store.InfoWheather.location }}
            </v-row>
            <v-row justify="center">
                <v-card>
                    <v-row class="text-center">
                        <v-col>
                            <v-icon>mdi-water</v-icon>
                            {{ store.InfoWheather.humidity }} %
                        </v-col>
                        <v-col>
                            <v-icon>mdi-arrow-up-bold mdi-rotate-{{ store.InfoWheather.wind }}</v-icon>
                            {{ store.InfoWheather.speed.toFixed(2) }} km/h
                        </v-col>
                        <v-col>
                            <v-icon>mdi-thermometer</v-icon>
                            {{ store.InfoWheather.temp }} &deg;C
                            <!--  <v-icon v-show="(infoAirballon.rain /= undefined)">mdi-weather-pouring</v-icon> -->
                        </v-col>
                    </v-row>
                </v-card>
            </v-row>
            <v-row>
                <MapboxMap :map-id="idMap" style="position: relative; height: 40vh;" :options="{
                    style: 'mapbox://styles/mapbox/satellite-streets-v11', // style URL
                    center: [0, 0], // starting position
                    zoom: 1, // starting zoom
                    projection: 'globe',
                    attributionControl: false,
                    renderWorldCopies: false
                }">
                    <MapboxDefaultMarker marker-id="marker" :options="{
                        draggable: true,
                    }
                        " :lnglat="[0, 0]" @dragend="async (m) => {
        const lngLat = m.getLngLat();
        store.setInfoWheather(await useWeather([lngLat.lng, lngLat.lat]))

    }
        ">
                        <template #marker>
                            <img :src="`/Globos/${store.airBalloon.id}.png`" width="50">

                        </template>

                    </MapboxDefaultMarker>

                </MapboxMap>
            </v-row>
            <v-row>
                <v-col>
                    <v-img class="mx-auto" v-show="weatherLayer !== ''" :src="`/Maps/InfoLayers/${weatherLayer}.png`">

                    </v-img>
                </v-col>

            </v-row>
        </v-card-text>
    </v-card>
</template>


<script setup>

const props = defineProps(["idMap"])

const store = useMainStore()

const weatherLayer = ref("")

const weatherLayers = ref([
    { name: "temperature-layer", icon: "thermometer", image: "https://api.tomorrow.io/v4/map/tile/0/0/0/temperature/now.png?apikey=cUSumbZehbp65Zm5Kywfn4JLY762ZgOE" },
    { name: "humidity-layer", icon: "water", image: "https://api.tomorrow.io/v4/map/tile/0/0/0/humidity/now.png?apikey=cUSumbZehbp65Zm5Kywfn4JLY762ZgOE" },
    { name: "wind-layer", icon: "wind-power", image: "https://api.tomorrow.io/v4/map/tile/0/0/0/windSpeed/now.png?apikey=cUSumbZehbp65Zm5Kywfn4JLY762ZgOE" }

])

useMapboxBeforeLoad(props.idMap, async (map) => {
    map.on('style.load', () => {
        map.setFog({}) // Set the default atmosphere style
    })

})

useMapbox(props.idMap, (map) => {

    weatherLayers.value.forEach((l) => {
        const control = defineMapboxControl((_map) => {
            let container = document.createElement('div');
            container.id = l.name;
            container.className = "mapboxgl-ctrl mapboxgl-ctrl-group text-black ";
            container.innerHTML = `<button class="mapboxgl-ctrl-icon mdi mdi-${l.icon}" ></button>`;
            container.addEventListener("contextmenu", (e) => e.preventDefault());
            container.addEventListener("click", () => {
                weatherLayers.value.forEach((l2) => {
                    if (l2.name == l.name) {
                        if (map.getLayoutProperty(l.name, 'visibility') == 'none') {
                            weatherLayer.value = l.name
                            map.setLayoutProperty(l.name, 'visibility', 'visible')
                        }
                        else {
                            weatherLayer.value = ""
                            map.setLayoutProperty(l.name, 'visibility', 'none')
                        }
                    } else {
                        map.setLayoutProperty(l2.name, 'visibility', 'none')
                    }
                })
            });
            return container;


        }, (map) => { })
        map.addControl(control, "top-right");
        map.addLayer({
            id: l.name,
            type: 'raster',
            source: {
                type: 'raster',
                tiles: [l.image
                ],
                tileSize: 1024,
                maxzoom: 0,
                minzoom: 0,
            },
            layout: {
                "visibility": "none"
            },
            paint: {
                //"raster-saturation": 0.2,
                "raster-opacity": 0.8
                //"visibility": "none"
            }
        });
    })




})

</script>