<template>
    <v-container>
        <v-row>
            <v-btn rounded class="mx-auto" variant="elevated" color="primary" @click="mintAirBalloon()"> MINT
            </v-btn>
        </v-row>
        <v-row>
            <v-col v-for="(a, i) in store.airBalloons" :key="i">
                <v-card class="mx-auto text-center" width="200">
                    <v-card-title>
                        <v-img width="100" class="mx-auto" :src="a.image" contain></v-img>
                    </v-card-title>
                    <v-card-subtitle> Conditions </v-card-subtitle>
                    <v-card-text class="text-center justify-center">
                        <v-chip-group class="justify-center">
                            <v-chip>
                                <v-icon>mdi-thermometer</v-icon>
                                {{ a.conditions.temp[0] }} to {{
                                    a.conditions.temp[1] }} &deg;C
                            </v-chip>

                            <v-chip>
                                <v-icon>mdi-water</v-icon>
                                {{ a.conditions.humidity[0] }} to {{
                                    a.conditions.humidity[1] }} %
                            </v-chip>
                            <v-chip>
                                <v-icon>mdi-speedometer</v-icon>
                                {{ a.conditions.windSpeed[0] }} to {{
                                    a.conditions.windSpeed[1] }} km/h
                            </v-chip>
                        </v-chip-group>
                    </v-card-text>
                </v-card>
            </v-col>

        </v-row>

    </v-container>
</template>

<script setup>

const store = useMainStore()
const supabase = useSupabaseClient()


async function mintAirBalloon() {
    try {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts"
        });
        
        const airBalloon =  store.airBalloons[Math.floor(Math.random() * 6)]
        const { data, error } = await supabase
            .from("airballoons")
            .insert({
                owner: accounts[0],
                airballoonId: airBalloon.id,
            })
            .select()
        alert("Airballoon minted")
        await navigateTo('/mapAdd')
    } catch (error) {
        alert(error)
    }
}




</script>
