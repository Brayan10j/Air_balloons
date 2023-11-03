<template>
    <v-container>
        <v-toolbar title="Application">
            <v-spacer></v-spacer>
            <v-btn @click="dialogCreate = true">
                Create
            </v-btn>

        </v-toolbar>
        <v-table fixed-header>
            <thead>
                <tr>
                    <!--    <th class="text-left">
                Id
              </th> -->
                    <th class="text-left">
                        Name
                    </th>
                    <!-- <th class="text-left">
                        Description
                    </th> -->
                    <th class="text-left">
                        Participants
                    </th>
                    <th class="text-left">
                        Value
                    </th>
                    <th class="text-left">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in tournaments" :key="item.id">
                    <!-- <td>{{ item.id }} </td> -->
                    <td>{{ item.name }}</td>
                    <td>{{ item.participants.length }} / {{ item.maxParticipants }}</td>
                    <td>{{ item.value }}</td>
                    <td>
                        <v-btn v-show="item.participants.length < item.maxParticipants" @click="() => {
                            diaglogMapSelect = true
                            selectTournament = item
                            markerLocation = [0, 0]
                        }"> <v-icon>mdi-plus</v-icon> </v-btn>
                        <v-btn v-show="item.participants.length == item.maxParticipants && !item.started"
                            @click="startTournament(item)"> Start </v-btn>
                        <v-btn v-show="item.started" @click="viewTournament(item)"> View </v-btn>
                    </td>
                    <td>

                    </td>
                </tr>
            </tbody>
        </v-table>
        <v-dialog v-model="dialogViewTournament">
            <v-card>
                <v-card-title>
                    Tournament details </v-card-title>
                <v-card-subtitle v-show="winnerTournament.state" class="text-right">
                    Winner : {{ winnerTournament.airBalloon.id }} <v-btn variant="outlined" @click="claimTournament()">
                        claim
                    </v-btn>
                </v-card-subtitle>
                <v-card-text>
                    <v-table fixed-header>
                        <thead>

                            <tr>
                                Live Airballoons
                            </tr>
                            <tr>
                                <th class="text-left">
                                    Id
                                </th>
                                <th class="text-left">
                                    Air-balloon
                                </th>
                                <th class="text-left">
                                    State
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in winners" :key="item.id">
                                <td>{{ item.id }} </td>
                                <td><v-avatar :image="`/Globos/${item.airballoonId}.png`"></v-avatar></td>
                                <td>{{ item.state ? 'Live' : 'Crash' }}</td>

                            </tr>
                        </tbody>
                    </v-table>
                    <v-table fixed-header>
                        <thead>
                            <tr>
                                Crash Airballoons
                            </tr>
                            <tr>
                                <th class="text-left">
                                    Id
                                </th>
                                <th class="text-left">
                                    Air-balloon
                                </th>
                                <th class="text-left">
                                    State
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in losers" :key="item.id">
                                <td>{{ item.id }} </td>
                                <td><v-avatar :image="`/Globos/${item.airballoonId}.png`"></v-avatar></td>
                                <td>{{ item.state ? 'Live' : 'Crash' }}</td>

                            </tr>
                        </tbody>
                    </v-table>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogCreate">
            <v-card>
                <v-card-text>
                    <v-text-field v-model="selectTournament.name" label="name"></v-text-field>
                    <v-text-field v-model="selectTournament.maxParticipants" type="number"
                        label="participants"></v-text-field>
                    <v-text-field v-model="selectTournament.value" prefix="$" type="number" label="value"></v-text-field>

                </v-card-text>
                <v-card-actions class="justify-center">
                    <v-btn @click="createTournament()">
                        Create
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="diaglogMapSelect">
            <v-card class="text-center mx-auto" max-width="500">
                <v-card-title>
                    Location Air-balloon
                </v-card-title>
                <v-card-subtitle>
                    {{ markerLocation }}
                </v-card-subtitle>

                <v-card-text>
                    <MapboxMap map-id="mapSelect" :options="{
                        style: 'mapbox://styles/mapbox/satellite-streets-v11', // style URL
                        center: [0, 0], // starting position
                        zoom: 0.2, // starting zoom
                        projection: 'globe',
                        attributionControl: false,
                        renderWorldCopies: false
                    }" style="position: relative ; height: 300px; width: 260px;">


                        <MapboxDefaultMarker marker-id="marker1" :options="{
                            draggable: true,
                        }" :lnglat="[0, 0]" @dragend="(m) => {
    const lngLat = m.getLngLat();
    markerLocation = [lngLat.lng, lngLat.lat]
}">
                        </MapboxDefaultMarker>

                    </MapboxMap>
                </v-card-text>
                <v-card-actions class="justify-center">
                    <v-btn @click="addParticipant()" variant="outlined">
                        Select location
                    </v-btn>
                </v-card-actions>
            </v-card>

        </v-dialog>
    </v-container>
</template>

<script setup>

const store = useMainStore()
const supabase = useSupabaseClient()



const tournaments = ref([])
const winners = ref([])
const winnerTournament = ref({
    state: false,
    airBalloon: {}
})
const losers = ref([])
let { data, error } = await supabase
    .from('tournaments')
    .select('*')

tournaments.value = data

const tournamentsChannel = supabase.channel('custom-all-channel')
    .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tournaments' },
        async (payload) => {
            let { data, error } = await supabase
                .from('tournaments')
                .select('*')

            tournaments.value = data
        }
    )
    .subscribe()

const dialogCreate = ref(false)
const diaglogMapSelect = ref(false)
const dialogViewTournament = ref(false)
const markerLocation = ref([])
const selectTournament = ref({
    name: "",
    participants: [],
    maxParticipants: 10,
    value: 10,
    started: false,
})
const airBalloon = ref({})



async function addParticipant() {
    try {
        if (selectTournament.value.participants.length < selectTournament.value.maxParticipants) {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts"
            });
            airBalloon.value = store.airBalloons[Math.floor(Math.random() * 6)]
            selectTournament.value.participants.push({
                owner: accounts[0],
                airballoonId: airBalloon.value.id,
                point: markerLocation.value,
                kilometers: 0,
                step: 0,
                state: true,
                route: [[markerLocation.value, markerLocation.value]],
                tournamentID: selectTournament.value.id
            })
            await supabase
                .from('tournaments')
                .upsert(selectTournament.value)
            diaglogMapSelect.value = false
        }
    } catch (error) {
        alert(error)
    }



}

async function createTournament() {
    await supabase
        .from('tournaments')
        .insert([selectTournament.value])
        .select()
    dialogCreate.value = false
}

async function claimTournament() {
    const { error } = await supabase
        .from('tournaments')
        .delete()
        .eq('id', selectTournament.value.id)
    dialogViewTournament.value = false
}

async function viewTournament(tournament) {
    selectTournament.value = tournament
    let { data, error } = await supabase
        .from('airballoons')
        .select('*')
        .eq('tournamentID', tournament.id)

    winners.value = data.filter((t) => t.state)
    if (winners.value.length == 1) {
        winnerTournament.value.airBalloon = winners.value[0]
        winnerTournament.value.state = true
    }
    losers.value = data.filter((t) => !t.state)
    dialogViewTournament.value = true
}

async function startTournament(item) {
    try {
        await useFetch('/tournaments/startTournament', {
            method: "POST", body: item
        })
    } catch (error) {
        alert(error.message)
    }
}
</script>