<template>
    <v-table fixed-header height="50vh">
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

                <td><v-avatar :image="`/Globos/${item.id}.png`"></v-avatar></td>
                <td>
                    <ConditionsChips :item="item" />
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
const contract = useContractNFTs()

const airBalloons = ref([])

async function selectAirBalloon(item) {

    store.setInfoAirBalloon(item)

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
        const res = await contract.methods.balanceOfBatch(
            Array(6).fill(accounts[0]),
            [1, 2, 3, 4, 5, 6]
        ).call();
        if (res.length == 0) {
            await navigateTo("/store")
        } else {
            airBalloons.value = res.map((n) => Number(n)).flatMap((quantity, i) => Array(quantity).fill(store.airBalloons[i]));
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