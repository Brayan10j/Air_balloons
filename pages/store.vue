<template>
    <v-container>
        <v-row>
            <v-col v-for="(a, i) in store.airBalloons" :key="i">
                <v-card class="mx-auto text-center"  width="200">
                    <v-card-title>
                        <v-img width="100" class="mx-auto" :src="a.image" contain></v-img>
                    </v-card-title>
                    <v-card-subtitle> Conditions </v-card-subtitle>
                    <v-card-text>
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

                    <v-card-actions class="justify-center">
                        <v-btn rounded variant="outlined" @click="mintAirBalloon(a)"> select
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>

const store = useMainStore()


async function mintAirBalloon(item) {
    try {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts"
        });
        const supabase = useSupabaseClient()
        const { data, error } = await supabase
            .from("airballoons")
            .insert({
                owner: accounts[0],
                airballoonId: item.id,
            })
            .select()
        alert("Airballoon minted")
        await navigateTo('/mapAdd')
    } catch (error) {
        alert(error)
    }
}




</script>
