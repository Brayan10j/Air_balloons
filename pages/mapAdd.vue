<template>
    <v-container>
        <v-row>
            <v-col>
                <Bag />
            </v-col>
            <v-col>
                <v-card min-width="300">
                    <MapAdd :id-map="'mapAdd'" />
                </v-card>
            </v-col>
        </v-row>
        <v-btn color="blue" class="mx-auto" @click="flyAirballon()">
            Go
        </v-btn>
    </v-container>
</template>

<script setup>



const store = useMainStore()
const supabase = useSupabaseClient()
const route = useRoute()


useMapboxBeforeLoad("mapAdd", async (map) => {
    map.on('style.load', () => {
        map.setFog({}) // Set the default atmosphere style
    })
})

async function flyAirballon() {

    try {
        if (route.query.idTournament) {
            /* const accounts = await window.ethereum.request({
                method: "eth_requestAccounts"
            });
            let { data } = await supabase
                .from('tournaments')
                .select("*")
                // Filters
                .eq('id', route.query.idTournament)

            let tournament = data[0]
            tournament.participants.push({
                owner: accounts[0],
                airballoonId: store.airBalloon.id,
                point: store.InfoWheather.location,
                step: store.InfoWheather.speed / 3600,
                state: 'LIVE',
                route: [[store.InfoWheather.location, store.InfoWheather.location]],
                tournamentID: route.query.idTournament
            })
            await supabase
                .from('tournaments')
                .upsert(tournament)


            alert('Airballon added ')
            if (tournament.participants.length == tournament.maxParticipants) {
                await useFetch('/tournaments/startTournament', {
                    method: "POST", body: tournament
                })
                alert('Tournament started')
            }
            await navigateTo('/tournaments') */
        } else {
            let air = store.airBalloonSelected
            air.point = store.InfoWheather.location
            air.step = store.InfoWheather.speed / 3600
            air.state = 'LIVE'
            air.route = [[store.InfoWheather.location, store.InfoWheather.location]]

            const { data } = await useFetch('/airballoon', {
                method: "POST", body: air
            })
            //REVISAR EL NULLL
            store.setAirBalloon(data);
            alert("Airballoon put to flight successfully")
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
        }
    } catch (error) {
        alert(error.message)
    }

}

</script>

<style></style>