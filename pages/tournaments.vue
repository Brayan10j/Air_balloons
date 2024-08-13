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
                        Total accumulated
                    </th>
                    <th class="text-left">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr borderColor="red" v-for="  item   in   tournaments  " :key="item.id">
                    <!-- <td>{{ item.id }} </td> -->
                    <td> <v-icon size="small"
                            :color="item.participants.length < item.maxParticipants ? 'green' : item.participants.length == item.maxParticipants && item.started ? 'yellow' : 'red'">mdi-circle</v-icon>
                        {{ item.name }}</td>
                    <td>{{ item.participants.length }} / {{ item.maxParticipants }}</td>
                    <td>{{ item.value }}</td>
                    <td>{{ item.participants.length * item.value }}</td>

                    <td>
                        <v-btn v-show="item.participants.length < item.maxParticipants" @click="async () => {
                            await navigateTo({
                                path: '/mapAdd',
                                query: {
                                    idTournament: item.id,
                                }
                            }, { replace: true })
                        }
                            "> <v-icon>mdi-plus</v-icon> </v-btn>
                        <v-btn v-show="item.started" @click="viewTournament(item)"> View </v-btn>
                    </td>
                </tr>
            </tbody>
        </v-table>
        <v-dialog v-model="dialogCreate">
            <v-card>
                <v-card-text>
                    <v-text-field v-model="selectTournament.name" label="name"
                        :rules="[value => !!value || 'value required']"></v-text-field>
                    <v-text-field v-model="selectTournament.maxParticipants" type="number"
                        :rules="[value => !!value && value > 1 || 'must be greater than 1']"
                        label="participants"></v-text-field>
                    <v-text-field v-model="selectTournament.value" prefix="$" type="number" label="value" suffix="USD"
                        :rules="[value => !!value && value > 0 || 'must be greater than 0']"></v-text-field>

                </v-card-text>
                <v-card-actions class="justify-center">
                    <v-btn @click="createTournament()" variant="elevated" color="primary">
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

let { data, error } = await supabase
    .from('tournaments')
    .select('*')

tournaments.value = data

supabase.channel('custom-all-channel')
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
                step: store.InfoWheather.speed / 3600,
                state: 'LIVE',
                route: [[store.InfoWheather.location, store.InfoWheather.location]],
                tournamentID: selectTournament.value.id
            })
            await supabase
                .from('tournaments')
                .upsert(selectTournament.value)

            diaglogMapSelect.value = false

            if (selectTournament.value.participants.length == selectTournament.value.maxParticipants) {
                await useFetch('/tournaments/startTournament', {
                    method: "POST", body: selectTournament.value
                })
                alert('Tournament started')
            }

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



async function viewTournament(tournament) {

    await navigateTo({
        path: '/tournamentView',
        query: {
            id: tournament.id,
        }
    }, { replace: true })

}

</script>