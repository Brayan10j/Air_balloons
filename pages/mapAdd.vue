<template>
    <v-container>
        <v-overlay :model-value="overlay" class="align-center justify-center">
            <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
        </v-overlay>
        <v-row>
            <v-col class="text-center">
                <Bag />
            </v-col>
            <v-col v-if="store.airBalloon">
                <v-card min-width="300">
                    <MapAdd :id-map="'mapAdd'" />
                </v-card>
            </v-col>
            <v-col cols="12" v-if="store.airBalloon">
                <v-btn color="blue" class="mx-auto" @click="flyAirballon" block>
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
const router = useRouter()

const { contractWithSigner } = useContractNFTs()

const overlay = ref(false)


useMapboxBeforeLoad("mapAdd", async (map) => {
    map.on('style.load', () => {
        map.setFog({}) // Set the default atmosphere style
    })
})
async function flyAirballon() {
    overlay.value = true;

    try {
        await useConnectWeb3();
        const contract = await contractWithSigner();

        const address = window.ethereum.selectedAddress;
        const airBalloonId = store.airBalloon.id;
        const location = store.InfoWheather.location;
        const speed = store.InfoWheather.speed / 3600;
        const tournamentId = route.query.idTournament;

        await contract.burn(address, airBalloonId, 1);

        if (tournamentId) {
            // Handle tournament case
            let { data: tournaments } = await supabase
                .from('tournaments')
                .select("*")
                .eq('id', tournamentId);

            let tournament = tournaments[0];
            tournament.participants.push({
                owner: address,
                airballoonId: airBalloonId,
                point: location,
                step: speed,
                state: 'LIVE',
                route: [[location, location]],
                tournamentID: tournamentId,
            });

            await supabase.from('tournaments').upsert(tournament);
            alert('Airballoon added');

            if (tournament.participants.length === tournament.maxParticipants) {
                await useFetch('/tournaments/startTournament', {
                    method: "POST",
                    body: tournament
                });
                alert('Tournament started');
            }
            router.push('/tournaments');
        } else {
            // Handle airballoon case
            const { data } = await useFetch('/airballoon', {
                method: "POST",
                body: {
                    owner: address,
                    airballoonId: airBalloonId,
                    point: location,
                    step: speed,
                    state: 'LIVE',
                    route: [[location, location]],
                }
            });
            store.setAirBalloon(data);
            alert("Airballoon put to flight successfully");

            useMapbox("mapView", map => map.jumpTo({
                center: location,
                zoom: 3
            }));
            useMapboxMarker("markerView", marker => marker.setLngLat(location));
            router.push('/mapView');
        }
    } catch (error) {
        alert(`Error: ${error.message}`);
    } finally {
        overlay.value = false;
    }
}


onActivated(async () => {
    store.setInfoAirBalloon(undefined);
})

</script>

<style></style>