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
const {contract,} = useContractNFTs()
const router = useRouter()

const airBalloons = ref([])

async function selectAirBalloon(item) {
    store.setInfoAirBalloon(item);

    useMapbox("mapAdd", map => {
        const { lng, lat } = map.getCenter();
        useMapboxMarker("marker", marker => marker.setLngLat([lng, lat]));
    });
}

async function getAirBalloons() {
  try {
    await useConnectWeb3();
    const res = await contract.balanceOfBatch(
      Array(6).fill(window.ethereum.selectedAddress),
      [1, 2, 3, 4, 5, 6]
    );
    if (!res.length) {
      router.push("/store");
    } else {
      airBalloons.value = res
        .map((n, i) => Array(Number(n)).fill(store.airBalloons[i]))
        .flat();
    }
  } catch (error) {
    console.log(error)
    alert(`Error: ${error.message}`);
  }
}

onActivated(async () => {
    await getAirBalloons()
})



</script>