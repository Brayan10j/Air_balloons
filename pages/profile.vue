<template>
    <v-container>
        <v-row>
            <v-col>
                NFTs
                <Bag />
            </v-col>
            <v-col>
                Flights
                <TableAll :data="items" />
            </v-col>
        </v-row>
    </v-container>
</template>


<script setup>

const supabase = useSupabaseClient()
const items = ref([])


const intervals = ref([])


function setIntervals() {
    intervals.value.forEach(interval => clearInterval(interval));
    intervals.value = items.value.map(a => setInterval(() => {
        a.kilometers += a.step
    }, 1000))
}

async function getAirBalloons() {
    try {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts"
        });

        let { data, error } = await supabase
            .from('airballoons')
            .select('*')
            .eq('owner', accounts[0])

        // filter records module

        items.value = data.sort((a, b) => b.kilometers - a.kilometers)

        setIntervals()
    } catch (error) {
        alert(error.message)
    }


}

await getAirBalloons()

onActivated(async () => {
    await getAirBalloons()
})

onDeactivated(() => {
    intervals.value.forEach(interval => clearInterval(interval));
})
</script>