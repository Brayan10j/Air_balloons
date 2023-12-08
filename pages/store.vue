<template>
    <v-container>
        <v-row>
            <v-col cols="12" class="text-center"> <v-btn rounded class="mx-auto justify-center" variant="elevated"
                    color="primary" @click="mintAirBalloon()">
                    MINT
                </v-btn></v-col>
            <v-col v-for="(a, i) in store.airBalloons" :key="i" lg="4" xl="2">
                <AirBalloonCard :airBalloon="a" />
            </v-col>
        </v-row>
        <v-dialog v-model="dialog" persistent>
            <AirBalloonCard :airBalloon="airBalloon" />
        </v-dialog>
    </v-container>
</template>

<script setup>

const store = useMainStore()
const contract = useContractNFTs()
const dialog = ref(false)
const airBalloon = ref({})

async function mintAirBalloon() {
    try {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts"
        });
        airBalloon.value = store.airBalloons[Math.floor(Math.random() * 6)]
        dialog.value = true
        await contract.methods
            .mint(accounts[0], airBalloon.value.id, 1, [])
            .send({ from: accounts[0] });
        alert("Airballoon minted")
        dialog.value = false
        await navigateTo('/mapAdd')
    } catch (error) {
        alert(error)
    }
}

</script>
