<template>
    <v-card class="mx-auto text-center" width="200">
        <v-card-title>
            <v-img width="100" class="mx-auto" :src="props.airBalloon.image" contain></v-img>
        </v-card-title>
        <v-card-subtitle> Conditions </v-card-subtitle>
        <v-card-text>
            <ConditionsChips :item="props.airBalloon" />
        </v-card-text>
    </v-card>
</template>

<script setup>
const props = defineProps(["airBalloon"])

</script>