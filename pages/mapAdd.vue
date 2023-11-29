<template>
    <v-container>
        <v-row>
            <v-col>
                <v-table fixed-header>
                    <thead>
                        <tr>

                            <th class="text-left">
                                Air-balloon
                            </th>
                            <th class="text-left">
                                Humidity %
                            </th>
                            <th class="text-left">
                                Temperature &deg;C
                            </th>
                            <th class="text-left">
                                Speed Km/h
                            </th>
                            <th class="text-left">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in airBalloons" :key="item.id">

                            <td><v-avatar :image="`/Globos/${item.info.id}.png`"></v-avatar></td>
                            <td>{{ item.info.conditions.humidity }}
                            </td>
                            <td>{{ item.info.conditions.temp }}
                            </td>
                            <td>{{ item.info.conditions.windSpeed }}
                            </td>
                            <td>
                                <v-btn size="small" color="primary" @click="selectAirBalloon(item)">
                                    Fly
                                </v-btn>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </v-col>
            <!-- <v-col>
                <v-row>
                    <v-col v-for="(a, i) in store.airBalloons" :key="i">
                        <v-card class="text-center" flat>
                            <v-card-title>
                                <v-img width="150" class="mx-auto" :src="a.image" contain></v-img>
                            </v-card-title>
                            <v-card-subtitle> Conditions </v-card-subtitle>
                            <v-card-text>
                                <v-chip-group class="justify-center">
                                    <v-chip>
                                        <v-icon>mdi-thermometer</v-icon>
                                        {{ a.conditions.temp[0] }} to {{
                                            a.conditions.temp[1] }} &deg;C
                                    </v-chip>

                                    <v-chip>
                                        <v-icon>mdi-water</v-icon>
                                        {{ a.conditions.humidity[0] }} to {{
                                            a.conditions.humidity[1] }} %
                                    </v-chip>
                                    <v-chip>
                                        <v-icon>mdi-speedometer</v-icon>
                                        {{ a.conditions.windSpeed[0] }} to {{
                                            a.conditions.windSpeed[1] }} km/h
                                    </v-chip>
                                </v-chip-group>
                            </v-card-text>

                            <v-card-actions class="justify-center">
                                <v-btn rounded variant="outlined" @click="store.setInfoAirBalloon(a)"> select
                                </v-btn>
                            </v-card-actions>
                        </v-card>


                    </v-col>
                </v-row> 
            </v-col>-->


            <v-col>
                <v-card min-width="300">
                    <MapAdd :id-map="'mapAdd'" />
                    <v-card-actions v-show="airBalloon !== null">
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
const supabase = useSupabaseClient()

const airBalloon = ref(null)

const airBalloons = ref([])


async function selectAirBalloon(item) {
    airBalloon.value = item
    store.setInfoAirBalloon(item.info)
    useMapbox("mapAdd", (map) => {
        const { lng, lat } = map.getCenter();
        useMapboxMarker("marker",  (marker) => {
            marker.setLngLat([lng, lat])
        })
    })
}

async function getAirBalloons() {
    try {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts"
        });
        let { data, error } = await supabase
            .from('airballoons')
            .select('*')
            .eq("owner", accounts[0])
            .is('state', null)

        if (data.length == 0) {
            await navigateTo('/store')
        } else {
            airBalloons.value = data.map(a => {
                return { airBalloon: a, info: store.airBalloons[parseInt(a.airballoonId) - 1] }
            })
        }

    } catch (error) {
        alert(error.message)
    }

}



useMapboxBeforeLoad("mapAdd", async (map) => {
    map.on('style.load', () => {
        map.setFog({}) // Set the default atmosphere style
    })

})

async function flyAirballon() {
    try {

        airBalloon.value.airBalloon.point = store.InfoWheather.location
        airBalloon.value.airBalloon.step = store.InfoWheather.speed / 3600
        airBalloon.value.airBalloon.state = 'LIVE'
        airBalloon.value.airBalloon.route = [[store.InfoWheather.location, store.InfoWheather.location]]

        const { data } = await useFetch('/airballoon', {
            method: "POST", body: airBalloon.value.airBalloon
        })

        alert("Airballoon put to flight successfully")
        store.setAirBalloon(data);
        airBalloon.value = null
        //store.setInfoWheather(await useWeather(store.InfoWheather.location))
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

onActivated(async () => {
    await getAirBalloons()
})

</script>

<style></style>