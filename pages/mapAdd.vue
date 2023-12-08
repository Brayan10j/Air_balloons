<template>
    <v-container>
        <v-overlay :model-value="overlay" class="align-center justify-center">
            <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
        </v-overlay>
        <v-row>
            <v-col class="text-center">
                <Bag />
            </v-col>
            <v-col v-show="store.airBalloon">
                <v-card min-width="300">
                    <MapAdd :id-map="'mapAdd'" />
                </v-card>
            </v-col>
            <v-col cols="12" v-show="store.airBalloon">
                <v-btn color="blue" class="mx-auto" @click="flyAirballon()" block>
                    Go
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>

const store = useMainStore()
const supabase = useSupabaseClient()
const route = useRoute()

const contract = useContractNFTs()

const overlay = ref(false)


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

        if (route.query.idTournament) {

            overlay.value = true
            await contract.methods
                .burn(accounts[0], store.airBalloon.id, 1)
                .send({ from: accounts[0] });
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
            overlay.value = false
            await navigateTo('/tournaments')
        } else {
            overlay.value = true
            await contract.methods
                .burn(accounts[0], store.airBalloon.id, 1)
                .send({ from: accounts[0] });
            const { data } = await useFetch('/airballoon', {
                method: "POST", body: {
                    owner: accounts[0],
                    airballoonId: store.airBalloon.id,
                    point: store.InfoWheather.location,
                    step: store.InfoWheather.speed / 3600,
                    state: 'LIVE',
                    route: [[store.InfoWheather.location, store.InfoWheather.location]],
                }
            })
            //REVISAR EL NULLL
            store.setAirBalloon(data);
            alert("Airballoon put to flight successfully")
            overlay.value = false
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
        overlay.value = false
    }



}

onActivated(async () => {
    store.setInfoAirBalloon(undefined);
})

</script>

<style></style>