<template>
    <v-container>
        <v-row>
            <v-col>
                <MapboxMap map-id="mapT" style="position: relative; height: 70vh;" :options="{
                    style: 'mapbox://styles/mapbox/satellite-streets-v11', // style URL
                    center: [0, 0], // starting position
                    zoom: 0.1, // starting zoom
                    projection: 'globe',
                    attributionControl: false,
                    renderWorldCopies: false
                }">

                    <MapboxSource source-id="allPoints" :source="{
                        type: 'geojson',
                        data: dataSource
                    }" />
                    <MapboxLayer :layer="{
                        source: 'allPoints',
                        id: 'allPoints',
                        type: 'symbol',
                        layout: {
                            'icon-image': ['get', 'image-name'], 'icon-size': 0.1, 'icon-rotation-alignment': 'map'
                            , 'icon-allow-overlap': true, 'icon-ignore-placement': true,
                        },
                    }" />
                </MapboxMap>
            </v-col>
            <v-col>
                <v-card>
                    <v-card-title>
                        Tournament details </v-card-title>
                    <v-card-text>
                        <v-toolbar> <v-toolbar-title>{{ tournament.name }} </v-toolbar-title> <v-spacer> </v-spacer>
                            Reward :
                            <v-chip class="mr-2" color="green"> {{
                                tournament.value *
                                tournament.participants.length }}</v-chip>

                        </v-toolbar>

                        <v-card-subtitle v-if="winnerTournament !== undefined">
                            FINISHED
                            <br>

                            Winner : {{ winnerTournament.airBalloon.owner }}

                        </v-card-subtitle>

                        <v-card-actions class="justify-center" v-show="winnerTournament !== undefined"> <v-btn
                                variant="outlined" @click="claimTournament()">
                                claim
                            </v-btn> </v-card-actions>

                    </v-card-text>

                    <v-card-text>
                        Live Airballoons
                        <TableAll :data="winners" />
                        Collapse Airballoons
                        <component :is="TableAll" :data="losers" />

                    </v-card-text>
                </v-card>
            </v-col>

        </v-row>


    </v-container>
</template>

<script setup>

import { TableAll } from '#components'
const supabase = useSupabaseClient()
const store = useMainStore()
const route = useRoute()

const dataSource = ref({
    type: 'FeatureCollection',
    features: [],
})

const winners = ref([])
const winnerTournament = ref(undefined)
const losers = ref([])
const intervals = ref([])
const tournament = ref({
    participants: []
})



function setIntervals() {
    intervals.value.forEach(interval => clearInterval(interval));
    intervals.value = winners.value.map(a => setInterval(() => {
        a.kilometers += a.step
    }, 1000))
}

async function getAirBalloons() {
    winnerTournament.value = undefined
    let { data, error } = await supabase
        .from('airballoons')
        .select(`*`)
        .eq('tournamentID', route.query.id)

    let { data: value } = await supabase
        .from('tournaments')
        .select('*')
        .eq('id', route.query.id)



    tournament.value = value[0]

    winners.value = data.filter((t) => t.state == "LIVE")
    dataSource.value.features = winners.value.map(a => ({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: a.point
        },
        properties: {
            'image-name': `/Globos/${a.airballoonId}.png`,
        }
    }));

    useMapbox("mapT", (map) => {
        map.getSource('allPoints').setData(dataSource.value)
    })
    if (winners.value.length == 1) {
        winnerTournament.value = {
            airBalloon: winners.value[0],
            state: true
        }
    }
    losers.value = data.filter((t) => t.state == "COLLAPSE")

    setIntervals()
}

useMapboxBeforeLoad("mapT", async (map) => {
    map.on('style.load', () => {
        map.setFog({}) // Set the default atmosphere style
    })
    store.airBalloons.map((a, i) => {
        map.loadImage(`/Globos/${i + 1}.png`, (error, image) => {
            if (error) throw error

            // Add the image to the map styl
            map.addImage(`/Globos/${i + 1}.png`, image)
        })
    })

})

async function claimTournament() {
    try {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts"
        });
        if (winnerTournament.value.airBalloon.owner == accounts[0]) {
            await supabase
                .from('tournaments')
                .delete()
                .eq('id', route.query.id)
            alert("you are the winner , congratulations !!")
            await navigateTo('/tournaments')
        } else {
            alert("you are't the winner")
        }
    } catch (error) {
        alert(error)
    }

}





onActivated(async () => {
    await getAirBalloons()
})

onDeactivated(() => {
    intervals.value.forEach(interval => clearInterval(interval));
})




</script>

