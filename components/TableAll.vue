<template>
    <v-table fixed-header height="70vh">
        <thead>
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
                <th class="text-left">
                    Actions
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in props.data" :key="item.id">
                <td>{{ item.id }} </td>
                <td><v-avatar :image="`/Globos/${item.airballoonId}.png`"></v-avatar></td>
                <td>{{ item.kilometers.toFixed(4) }}
                </td>
                <td>{{ item.state}}</td>
                <td><v-menu>
                        <template v-slot:activator="{ props }">
                            <v-btn icon="mdi-dots-vertical" v-bind="props" size="small" variant="flat"></v-btn>
                        </template>

                        <v-list>
                            <v-list-item @click="viewAirBalloon(item)">
                                view
                            </v-list-item>
                            <v-list-item v-show="item.state == 'COLLAPSE' && item.tournamentID == null" @click="deleteAirBalloon(item)">
                                delete
                            </v-list-item>
                        </v-list>
                    </v-menu><!-- <v-icon @click="seeAirballon(item)" color="blue">mdi-eye</v-icon> 
                <v-btn v-show="!item.state && item.tournamentID == null" @click="deleteAirBalloon(item)"><v-icon color="red">mdi-delete</v-icon> </v-btn> -->
                </td>
            </tr>
        </tbody>
    </v-table>
</template>
    
<script setup>

const store = useMainStore()
const props = defineProps(["data"])

async function viewAirBalloon(item) {
    try {
        const weather = await useWeather(item.point)
        store.setInfoWheather(weather)
        store.setAirBalloon(item);
        useMapbox("mapView", (map) => {
            map.jumpTo({
                center: item.point,
                zoom: 3,
            });
        })
        useMapboxMarker("markerView", marker => {
            marker.setLngLat(item.point)
        });
        await navigateTo('/mapView')

    } catch (error) {
        alert(error)
    }

}

async function deleteAirBalloon(item) {
    try {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts"
        });
        if (accounts[0] == item.owner) {
            const supabase = useSupabaseClient()
            const { error } = await supabase
                .from('airballoons')
                .delete()
                .eq('id', item.id)
        } else {
            alert("You aren't the owner")
        }
    } catch (error) {
        alert(error)
    }

}

</script>