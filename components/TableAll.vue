<template>
    <v-table fixed-header height="70vh">
        <thead>
            <tr>
                <th class="text-left">Id</th>
                <th class="text-left">Air-balloon</th>
                <th class="text-left">Kilometers</th>
                <th class="text-left">State</th>
                <th class="text-left">Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in data" :key="item.id">
                <td>{{ item.id }}</td>
                <td>
                    <v-avatar :image="`/Globos/${item.airballoonId}.png`"></v-avatar>
                </td>
                <td>{{ item.kilometers.toFixed(4) }}</td>
                <td>{{ item.state }}</td>
                <td>
                    <v-menu>
                        <template v-slot:activator="{ props }">
                            <v-btn icon="mdi-dots-vertical" v-bind="props" size="small" variant="flat"></v-btn>
                        </template>
                        <v-list>
                            <v-list-item @click="viewAirBalloon(item)">
                                View
                            </v-list-item>
                            <v-list-item v-if="canDeleteAirBalloon(item)" @click="deleteAirBalloon(item)">
                                Delete
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </td>
            </tr>
        </tbody>
    </v-table>
</template>

<script setup>

const props = defineProps(['data']);
const store = useMainStore();

const canDeleteAirBalloon = (item) => item.state === 'COLLAPSE' && !item.tournamentID;

async function viewAirBalloon(item) {
    try {
        const weather = await useWeather(item.point);
        store.setInfoWheather(weather);
        store.setAirBalloon(item);
        useMapbox('mapView', (map) => {
            map.jumpTo({
                center: item.point,
                zoom: 3,
            });
        });
        useMapboxMarker('markerView', (marker) => {
            marker.setLngLat(item.point);
        });
        await navigateTo('/mapView');
    } catch (error) {
        console.error('Error viewing air balloon:', error);
        alert('Failed to view the air balloon. Please try again.');
    }
}

async function deleteAirBalloon(item) {
    try {
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
        });
        if (accounts[0] === item.owner) {
            const supabase = useSupabaseClient();
            const { error } = await supabase
                .from('airballoons')
                .delete()
                .eq('id', item.id);
            if (error) {
                throw new Error('Failed to delete the air balloon.');
            }
            alert('Air balloon deleted successfully.');
        } else {
            alert("You aren't the owner");
        }
    } catch (error) {
        console.error('Error deleting air balloon:', error);
        alert('Failed to delete the air balloon. Please check if you are the owner.');
    }
}
</script>

<style scoped>
/* Añade cualquier estilo personalizado aquí */
</style>
