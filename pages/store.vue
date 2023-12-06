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
        <v-dialog v-model="dialog">
            <AirBalloonCard :airBalloon="airBalloon" />
        </v-dialog>
    </v-container>
</template>

<script setup>

/* 
import Web3 from 'web3';
const web3 = new Web3(window.ethereum)

const contract = new web3.eth.Contract(abi.default, "");
await contract.methods
          .buyNFT(NFT.id)
          .send({ from: this.userAccount, value: value }); */

const store = useMainStore()
const supabase = useSupabaseClient()

const dialog = ref(false)

const airBalloon = ref({})


async function mintAirBalloon() {
    try {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts"
        });

        airBalloon.value = store.airBalloons[Math.floor(Math.random() * 6)]

        dialog.value = true
        const { data, error } = await supabase
            .from("airballoons")
            .insert({
                owner: accounts[0],
                airballoonId: airBalloon.value.id,
            })
            .select()
        alert("Airballoon minted")
        dialog.value = false
        await navigateTo('/mapAdd') 
    } catch (error) {
        alert(error)
    }
}




</script>
