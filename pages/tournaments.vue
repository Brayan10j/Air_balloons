<template>
    <v-container>
        <v-toolbar title="Application">
            <v-spacer></v-spacer>
            <v-btn @click="() => {
                selectTournament = { name: '', participants: [], maxParticipants: 10, value: 10, started: false };
                dialogCreate = true;
            }">
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
                <tr borderColor="red" v-for="  item   in   tournaments  " :key="item.id" >
                    <!-- <td>{{ item.id }} </td> -->
                    <td> <v-icon size="small"
                            :color="item.participants.length < item.maxParticipants ? 'green' : item.participants.length == item.maxParticipants && item.started ? 'yellow' : 'red'">mdi-circle</v-icon>
                        {{ item.name }}</td>
                    <td>{{ item.participants.length }} / {{ item.maxParticipants }}</td>
                    <td>{{ item.value }}</td>
                    <td>
                        <v-btn v-show="item.participants.length < item.maxParticipants" @click="() => {
                            diaglogMapSelect = true
                            selectTournament = item
                            store.setInfoAirBalloon(store.airBalloons[Math.floor(Math.random() * 6)])
                        }
                            "> <v-icon>mdi-plus</v-icon> </v-btn>
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
                <v-card-subtitle v-show="winnerTournament !== undefined">
                    FINISHED

                </v-card-subtitle>
                <v-card-actions class="justify-center" v-show="winnerTournament !== undefined"> <v-btn variant="outlined"
                        @click="claimTournament()">
                        claim
                    </v-btn> </v-card-actions>
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
                                    Kilometers
                                </th>
                                <th class="text-left">
                                    State
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="  item   in   winners  " :key="item.id">
                                <td>{{ item.id }} </td>
                                <td><v-avatar :image="`/Globos/${item.airballoonId}.png`"></v-avatar></td>
                                <td>{{ item.kilometers.toFixed(2) }} </td>
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
                                    Kilometers
                                </th>
                                <th class="text-left">
                                    State
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="  item   in   losers  " :key="item.id">
                                <td>{{ item.id }} </td>
                                <td><v-avatar :image="`/Globos/${item.airballoonId}.png`"></v-avatar></td>
                                <td>{{ item.kilometers.toFixed(2) }} </td>
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
            <v-card class="text-center mx-auto" max-width="500" width="70%">
                <v-card-title>
                    Location Air-balloon
                </v-card-title>

                <MapAdd :id-map="'mapSelect'" />


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
const winnerTournament = ref(undefined)
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

const selectTournament = ref({
    name: "",
    participants: [],
    maxParticipants: 10,
    value: 10,
    started: false,
})



async function addParticipant() {
    try {
        if (selectTournament.value.participants.length < selectTournament.value.maxParticipants) {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts"
            });
            selectTournament.value.participants.push({
                owner: accounts[0],
                airballoonId: store.airBalloon.id,
                point: store.InfoWheather.location,
                kilometers: 0,
                step: 0,
                state: true,
                route: [[store.InfoWheather.location, store.InfoWheather.location]],
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
    try {
        await supabase
            .from('tournaments')
            .insert([selectTournament.value])
            .select()
        dialogCreate.value = false
    } catch (error) {
        alert(error)
    }

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
                .eq('id', selectTournament.value.id)
            dialogViewTournament.value = false
        } else {
            alert("you are't the winner")
        }
    } catch (error) {
        alert(error)
    }

}

async function viewTournament(tournament) {
    try {
        winnerTournament.value = undefined
        selectTournament.value = tournament
        let { data, error } = await supabase
            .from('airballoons')
            .select('*')
            .eq('tournamentID', tournament.id)

        winners.value = data.filter((t) => t.state)
        if (winners.value.length == 1) {
            winnerTournament.value = {
                airBalloon: winners.value[0],
                state: true
            }
        }
        losers.value = data.filter((t) => !t.state)
        dialogViewTournament.value = true
    } catch (error) {
        alert(error)
    }

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