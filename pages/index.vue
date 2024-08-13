<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card min-width="300">
          <v-card-text>
            <MapboxMap map-id="map" style="position: relative; height: 70vh;" :options="mapOptions">

              <MapboxSource source-id="allPoints" :source="geoJsonSource" />
              <MapboxLayer :layer="mapLayer" />
            </MapboxMap>
          </v-card-text>

        </v-card>

      </v-col>
      <v-col>
        <TableAll :data="userAirBallons" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>

const supabase = useSupabaseClient()
const store = useMainStore()

const userAirBallons = ref([])
const intervals = ref([])

const mapOptions = {
  style: 'mapbox://styles/mapbox/satellite-streets-v11',
  center: [0, 0],
  zoom: 0.1,
  projection: 'globe',
  attributionControl: false,
  renderWorldCopies: false,
}

const dataSource = ref({
  type: 'FeatureCollection',
  features: [],
})

const geoJsonSource = {
  type: 'geojson',
  data: dataSource.value,
}

const mapLayer = {
  source: 'allPoints',
  id: 'allPoints',
  type: 'symbol',
  layout: {
    'icon-image': ['get', 'image-name'],
    'icon-size': 0.1,
    'icon-rotation-alignment': 'map',
    'icon-allow-overlap': true,
    'icon-ignore-placement': true,
  },
}

function updateIntervals() {
  intervals.value.forEach(clearInterval)
  intervals.value = userAirBallons.value
    .filter(balloon => balloon.state === 'LIVE')
    .map(balloon =>
      setInterval(() => {
        balloon.kilometers += balloon.step
      }, 1000)
    )
}

async function fetchAirBalloons() {
  const { data, error } = await supabase
    .from('airballoons')
    .select('*')
    .is('tournamentID', null)
    .not('state', 'is', null)
    .not('state', 'eq', 'STOPPED')

  if (!error) {
    userAirBallons.value = data.filter(t => t.state === 'LIVE').sort((a, b) => b.kilometers - a.kilometers)
    dataSource.value.features = userAirBallons.value.map(a => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: a.point,
      },
      properties: {
        'image-name': `/Globos/${a.airballoonId}.png`,
      },
    }))
    updateIntervals()
  }
}

await fetchAirBalloons()

supabase.channel('custom-all-channel')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'airballoons' },
    async (payload) => {
      if (payload.eventType === 'UPDATE') {
        const index = userAirBallons.value.findIndex(item => item.id === payload.new.id)
        if (index !== -1) {
          userAirBallons.value[index] = payload.new
        } else {
          await fetchAirBalloons()
        }
      } else {
        await fetchAirBalloons()
      }
      updateIntervals()
    }
  )
  .subscribe()

  useMapboxBeforeLoad('map', (map) => {
  map.on('style.load', () => {
    map.setFog({})
  })

  store.airBalloons.forEach((_, index) => {
    const imgSrc = `/Globos/${index + 1}.png`
    map.loadImage(imgSrc, (error, image) => {
      if (!error) {
        map.addImage(imgSrc, image)
      }
    })
  })
})

onActivated(fetchAirBalloons)


/* onDeactivated(() => {
  intervals.value.forEach(interval => clearInterval(interval));
}) */

</script>