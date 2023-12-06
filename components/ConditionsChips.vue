<template>
    <v-chip-group class="justify-center">
        <v-chip size="x-small" prepend-icon="mdi-thermometer">
            {{ props.item.conditions.temp[0] }}  to  {{
                props.item.conditions.temp[1] }} &deg;C
        </v-chip>
        <v-chip size="x-small" prepend-icon="mdi-water">
             {{ props.item.conditions.humidity[0] }}  to  {{
                props.item.conditions.humidity[1] }} %
        </v-chip>
        <v-chip size="x-small" prepend-icon="mdi-speedometer">
            {{ props.item.conditions.windSpeed[0] }}  to  {{
                props.item.conditions.windSpeed[1] }} km/h
        </v-chip>
    </v-chip-group>
</template>

<script setup>
const props = defineProps(["item"])

</script>