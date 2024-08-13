<template>
    <v-container>
        <v-row>
            <v-col cols="12" class="text-center">
                <v-btn rounded class="mx-auto justify-center" variant="elevated" color="primary"
                    @click="mintAirBalloon">
                    MINT
                </v-btn>
            </v-col>
            <v-col v-for="(airBalloon, index) in store.airBalloons" :key="index" lg="4" xl="2">
                <AirBalloonCard :airBalloon="airBalloon" />
            </v-col>
        </v-row>
        <v-dialog v-model="dialog" persistent>
            <AirBalloonCard :airBalloon="selectedAirBalloon" />
        </v-dialog>
    </v-container>
</template>

<script setup>

const store = useMainStore()
const { contractWithSigner } = useContractNFTs()
const dialog = ref(false)
const selectedAirBalloon = ref(null);


const mintAirBalloon = async () => {
    try {
        await useConnectWeb3();
        const contract = await contractWithSigner();

        const randomIndex = Math.floor(Math.random() * store.airBalloons.length);
        selectedAirBalloon.value = store.airBalloons[randomIndex];
        dialog.value = true;

        const tx = await contract.mint(
            window.ethereum.selectedAddress,
            selectedAirBalloon.value.id,
            1,
            '0x'
        );
        await tx.wait();

        alert('Airballoon minted');
        dialog.value = false;
        router.push('/mapAdd');
    } catch (error) {
        alert('Error minting airballoon');
        console.error(error);
        dialog.value = false;
    }
};


</script>
