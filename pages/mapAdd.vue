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
                                <v-btn rounded variant="outlined" @click="store.setInfoAirBalloon(a)"> select </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-carousel-item>
                </v-carousel>

            </v-col>
            <v-col>
                <v-card>               
                        <MapAdd :id-map="'mapAdd'"/>
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


useMapboxBeforeLoad("mapAdd", async (map) => {
    map.on('style.load', () => {
        map.setFog({}) // Set the default atmosphere style
    })

})

async function flyAirballon() {
    try {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts"
        });
        const { data } = await useFetch('/airballoon', {
            method: "POST", body: {
                owner: accounts[0],
                airballoonId: store.airBalloon.id,
                point: store.InfoWheather.location,
                kilometers: 0,
                step: store.InfoWheather.speed / 3600,
                state: true,
                route: [[store.InfoWheather.location, store.InfoWheather.location]],
            }
        })
        alert("Airballoon put to flight successfully")
        store.setAirBalloon(data);
        store.setInfoWheather(await useWeather(store.InfoWheather.location))
        useMapbox("mapView", (map) => {
            map.jumpTo({
                center: store.InfoWheather.location,
                zoom: 3,
            });
        })
        useMapboxMarker("markerView", marker => {
            marker.setLngLat(store.InfoWheather.location)
        });
        await navigateTo('/mapView')
    } catch (error) {
        alert(error.message)
    }

}

</script>

<style></style>