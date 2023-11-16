<template>
  <v-container>
    <v-row>
      <v-col md="6">
        <v-card>
          <v-card-text>
            <MapboxMap map-id="map" style="position: relative; height: 70vh;" :options="{
              style: 'mapbox://styles/mapbox/satellite-streets-v11', // style URL
              center: [0, 0], // starting position
              zoom: 0.1, // starting zoom
              projection: 'globe',
              attributionControl: false,
              renderWorldCopies: false
            }">

              <MapboxSource source-id="allPoints" :source="{
                type: 'geojson',
                data: dataSource
              }" />
              <MapboxLayer :layer="{
                source: 'allPoints',
                id: 'allPoints',
                type: 'symbol',
                layout: {
                  'icon-image': ['get', 'image-name'], 'icon-size': 0.1, 'icon-rotation-alignment': 'map'
                  , 'icon-allow-overlap': true, 'icon-ignore-placement': true,
                },

              }" />
            </MapboxMap>
          </v-card-text>

        </v-card>

      </v-col>
      <v-col md="6">
        <TableAll :data="userAirBallons" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>

const supabase = useSupabaseClient()
const store = useMainStore()


const dataSource = ref({
  type: 'FeatureCollection',
  features: [],
})
const userAirBallons = ref([])
const intervals = ref([])



function setIntervals() {
  intervals.value.forEach(interval => clearInterval(interval));
  intervals.value = userAirBallons.value
    .filter(a1 => a1.state).map(a => setInterval(() => {
      a.kilometers += a.step
    }, 1000))
}

async function getAirBalloons() {
  let { data, error } = await supabase
    .from('airballoons')
    .select('*')
    .is('tournamentID', null)

  userAirBallons.value = data.sort((a, b) => b.kilometers - a.kilometers)

  setIntervals()
}

await getAirBalloons()



supabase.channel('custom-all-channel')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'airballoons' },
    async (payload) => {
      if (payload.eventType == "UPDATE") {
        userAirBallons.value = userAirBallons.value.map(objeto =>
          objeto.id === payload.new.id ? payload.new : objeto
        );
        setIntervals()

      } else {
        await getAirBalloons()
      }

    }
  )
  .subscribe()

useMapboxBeforeLoad("map", async (map) => {
  map.on('style.load', () => {
    map.setFog({}) // Set the default atmosphere style
  })
  store.airBalloons.map((a, i) => {
    map.loadImage(`/Globos/${i + 1}.png`, (error, image) => {
      if (error) throw error

      // Add the image to the map styl
      map.addImage(`/Globos/${i + 1}.png`, image)
    })
  })

  dataSource.value.features = userAirBallons.value.filter((t) => t.state).map(a => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: a.point
    },
    properties: {
      'image-name': `/Globos/${a.airballoonId}.png`,
    }
  }));

})

onActivated(async () => {
  await getAirBalloons()
})

onDeactivated(() => {
  intervals.value.forEach(interval => clearInterval(interval));
})

</script>