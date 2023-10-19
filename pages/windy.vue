<!-- <template>
    <div id="map"></div>
</template>

<script setup>
/// leaflef
  const options = {
    // Required: API key
    key: 'xQynAjF5qlXjhzTdm0EOSyB8kKHauefJ', // REPLACE WITH YOUR KEY !!!

       // Put additional console output
       verbose: true, 

    // Optional: Initial state of the map
    lat: 50.4,
    lon: 14.3,
    zoom: 5,
};

</script>

<style>
#map { height: 180px; }

</style> -->

<template>
    <div style="height:100vh; width:100vw">
      <LMap
        ref="map"
        :zoom="zoom"
        :center="[47.21322, -1.559482]"
      >
        <LTileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
          layer-type="base"
          name="OpenStreetMap"
        />
      </LMap>
    </div>
  </template>
  

  
  <script setup>
  import { ref } from 'vue'
  //const L = await import('leaflet')
  //console.log(L )
  const zoom = ref(6)


// Initialize Windy API
/* windyInit(options, windyAPI => {
    // windyAPI is ready, and contain 'map', 'store',
    // 'picker' and other usefull stuff
    const { map } = windyAPI;

    console.log(map) 
    // .map is instance of Leaflet map

}); */

  </script>
  
  <style>
  body {
    margin: 0;
  }
  </style>