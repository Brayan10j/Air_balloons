<template>
    <v-container>

        <v-card>
            <v-card-title>
                Tournament details </v-card-title>
            <v-card-subtitle v-show="winnerTournament !== undefined">
                FINISHED

            </v-card-subtitle>
            <v-card-actions class="justify-center" v-show="winnerTournament !== undefined"> <v-btn variant="outlined"
                    @click="claimTournament()">
                    claim
                </v-btn> </v-card-actions>
            <v-card-text>
                Live Airballoons
                <TableAll :data="winners" />
                Crash Airballoons
                <component :is="TableAll" :data="losers" />

            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup>

import { TableAll } from '#components'
const supabase = useSupabaseClient()
const store = useMainStore()
const route = useRoute()

const winners = ref([])
const winnerTournament = ref(undefined)
const losers = ref([])
const intervals = ref([])



function setIntervals() {
    intervals.value.forEach(interval => clearInterval(interval));
    intervals.value = winners.value.map(a => setInterval(() => {
        a.kilometers += a.step
    }, 1000))
}

async function getAirBalloons() {
    let { data, error } = await supabase
        .from('airballoons')
        .select('*')
        .eq('tournamentID', route.query.id)

    winners.value = data.filter((t) => t.state)
    if (winners.value.length == 1) {
        winnerTournament.value = {
            airBalloon: winners.value[0],
            state: true
        }
    }
    losers.value = data.filter((t) => !t.state)

    setIntervals()
}

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

