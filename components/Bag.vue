<template>
    <v-table fixed-header height="50vh" w>
        <thead>
            <tr>

                <th class="text-left">
                    Air-balloon
                </th>
                <th class="text-center">
                    Conditions
                </th>
                <th class="text-left">
                    Actions
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in airBalloons" :key="item.id">

                <td><v-avatar :image="`/Globos/${item.info.id}.png`"></v-avatar></td>
                <td>
                    <ConditionsChips :item="item.info" />
                </td>
                <td>
                    <v-btn size="small" color="primary" @click="selectAirBalloon(item)">
                        Fly
                    </v-btn>
                </td>
            </tr>
        </tbody>
    </v-table>
</template>

<script setup>

const store = useMainStore()
const supabase = useSupabaseClient()

const airBalloons = ref([])

async function selectAirBalloon(item) {
    //airBalloon.value = item
    store.setInfoAirBalloon(item.info)
    store.setAirBalloon(item.airBalloon);
    useMapbox("mapAdd", (map) => {
        const { lng, lat } = map.getCenter();
        useMapboxMarker("marker", (marker) => {
            marker.setLngLat([lng, lat])
        })
    })
}

async function getAirBalloons() {
    try {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts"
        });
        let { data, error } = await supabase
            .from('airballoons')
            .select('*')
            .eq("owner", accounts[0])
            .is('state', null)

        if (data.length == 0) {
            await navigateTo("/store")
        } else {
            airBalloons.value = data.map(a => {
                return { airBalloon: a, info: store.airBalloons[parseInt(a.airballoonId) - 1] }
            })
            //store.setInfoAirBalloon(store.airBalloons[parseInt(data[0].airballoonId) - 1])
        }


    } catch (error) {
        alert(error.message)
    }

}

onActivated(async () => {
    await getAirBalloons()
})


</script>