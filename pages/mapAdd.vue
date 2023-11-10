<template>
    <v-container>
        <v-row>
            <v-col>
                <v-carousel hide-delimiters>
                    <v-carousel-item v-for="(a, i) in store.airBalloons" :key="i">
                        <v-card class="text-center">

                            <v-card-title> <v-img width="200" class="mx-auto" :src="a.image"></v-img> </v-card-title>

                            <v-card-subtitle> Conditions </v-card-subtitle>

                            <v-card-text>
                                <v-icon>mdi-thermometer</v-icon> : {{ a.conditions.temp[0] }}&deg;C to {{
                                    a.conditions.temp[1] }}&deg;C
                            </v-card-text>
                            <v-card-text>
                                <v-icon>mdi-water</v-icon> : {{ a.conditions.humidity[0] }}% to {{
                                    a.conditions.humidity[1] }}%
                            </v-card-text>
                            <v-card-text>
                                <v-icon>mdi-speedometer</v-icon> : {{ a.conditions.windSpeed[0] }}km/h to {{
                                    a.conditions.windSpeed[1] }}km/h
                            </v-card-text>

                            <v-card-actions class="justify-center">
                                <v-btn rounded variant="outlined" @click="airBalloon = a"> select </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-carousel-item>
                </v-carousel>

            </v-col>
            <v-col>
                <v-card>
                    <v-card-text>
                        <v-row justify="center">
                            {{ markerLocation }}
                        </v-row>
                        <v-row justify="center">
                            <v-card >
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
                            <MapboxMap map-id="mapAdd" style="position: relative; height: 60vh;" :options="{
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
                                    " :lnglat="[0, 0]" @dragend="(m) => {
        const lngLat = m.getLngLat();
        markerLocation = [lngLat.lng, lngLat.lat]
        getWeather(markerLocation)

    }
        ">
                                    <template #marker>
                                        <img :src="airBalloon.image" width="50">

                                    </template>

                                </MapboxDefaultMarker>

                            </MapboxMap>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-img width="500" class="mx-auto" v-show="weatherLayer !== ''"
                                    :src="`/Maps/InfoLayers/${weatherLayer}.png`">

                                </v-img>
                            </v-col>

                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="blue" class="mx-auto" @click="flyAirballon()">
                            Go
                        </v-btn>
                    </v-card-actions>
                </v-card>

            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>

const store = useMainStore()

const mapRef = useMapboxRef("mapAdd");



const markerLocation = ref([])
const weatherLayer = ref("")
const infoAirballon = ref({
    temp: 0,
    wind: 0,
    humidity: 0,
    speed: 0,
})
const airBalloon = ref({
    id: "1",
    image: "/Globos/1.png",
    conditions: {
        temp: [0, 50],
        humidity: [0, 70],
        windSpeed: [0, 35],
    },
})

const weatherLayers = ref([
    { name: "temperature-layer", icon: "thermometer", image: "https://api.tomorrow.io/v4/map/tile/0/0/0/temperature/now.png?apikey=cUSumbZehbp65Zm5Kywfn4JLY762ZgOE" },
    { name: "humidity-layer", icon: "water", image: "https://api.tomorrow.io/v4/map/tile/0/0/0/humidity/now.png?apikey=cUSumbZehbp65Zm5Kywfn4JLY762ZgOE" },
    { name: "wind-layer", icon: "wind-power", image: "https://api.tomorrow.io/v4/map/tile/0/0/0/windSpeed/now.png?apikey=cUSumbZehbp65Zm5Kywfn4JLY762ZgOE" }

])


useMapboxBeforeLoad("mapAdd", async (map) => {
    map.on('style.load', () => {
        map.setFog({}) // Set the default atmosphere style
    })

})
useMapbox("mapAdd", (map) => {

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


function wintdeg(deg) {
    let arr = [0, 45, 90, 135, 180, 225, 270, 315]
    return arr[Math.round(((deg + 180) % 360) / 45)]
}


async function getWeather(location) {
    try {
        const { data } = await useFetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${location[1]}&lon=${location[0]}&appid=704e6c6ad29a17b1a787bd035c725346&units=metric`
        );

        // Update the infoAirballon object properties
        infoAirballon.value.temp = data.value.main.temp;
        infoAirballon.value.humidity = data.value.main.humidity;
        infoAirballon.value.speed = data.value.wind.speed * 3.6;
        infoAirballon.value.wind = wintdeg(data.value.wind.deg);
        infoAirballon.value.rain = data.value.rain;
    } catch (error) {
        console.log(error)
    }
}

async function flyAirballon() {
    try {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts"
        });
        const { data } = await useFetch('/airballoon', {
            method: "POST", body: {
                owner: accounts[0],
                airballoonId: airBalloon.value.id,
                point: markerLocation.value,
                kilometers: 0,
                step: infoAirballon.value.speed / 3600,
                state: true,
                route: [[markerLocation.value, markerLocation.value]],
            }
        })
        store.setAirBalloon(data);
        await navigateTo('/mapView')
        alert("Airballoon put to flight successfully")
    } catch (error) {
        alert(error.message)
    }

}

</script>

<style></style>