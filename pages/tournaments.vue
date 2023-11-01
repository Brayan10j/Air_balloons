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
                    <td>{{ item.title }}</td>
                    <td>{{ item.participants.length }} / {{ item.maxParticipants }}</td>
                    <td>{{ item.value }}</td>
                    <td>
                        <v-btn v-show="item.participants.length < item.maxParticipants" @click="() => {
                            diaglogMapSelect = true
                            selectTournament = item
                            markerLocation = [0, 0]
                        }"> <v-icon >mdi-plus</v-icon> </v-btn>
                        <v-btn v-show="item.participants.length == item.maxParticipants && !item.started"
                            @click="item.started = true"> Start </v-btn>
                        <v-btn v-show="item.started"> Claim </v-btn>
                    </td>
                    <td>

                    </td>
                </tr>
            </tbody>
        </v-table>
        <v-dialog v-model="dialogCreate">
            <v-card>
                <v-card-text>
                    <v-text-field label="title"></v-text-field>
                    <v-text-field type="number" label="participants"></v-text-field>
                    <v-text-field prefix="$" type="number" label="value"></v-text-field>

                </v-card-text>
                <v-card-actions class="justify-center">
                    <v-btn @click="dialogCreate = false">
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

const tournaments = ref([
    {
        title: "tournament 1",
        descripton: "last balloon in flight",
        participants: [],
        maxParticipants: 10,
        value: 10,
        started: false
    },
    {
        title: "tournament 2",
        descripton: "longest journey",
        participants: [],
        maxParticipants: 20,
        value: 5,
        started: false,
    }
])
const dialogCreate = ref(false)
const diaglogMapSelect = ref(false)
const markerLocation = ref([])
const selectTournament = ref({})
const airBalloon = ref({})



function addParticipant() {
    airBalloon.value = store.airBalloons[Math.floor(Math.random() * 6)]
    if (selectTournament.value.participants.length < selectTournament.value.maxParticipants) {
        selectTournament.value.participants.push({
            owner: "0x",
            airballoonId: airBalloon.id,
            point: [0, 0],
            kilometers: 0,
            step: 0,
            state: true,
            route: [[[0, 0], [0, 0]]],
        })
    }
    diaglogMapSelect.value = false
}
</script>