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

// Helper function to clear existing intervals
function clearExistingIntervals() {
  intervals.value.forEach(clearInterval)
  intervals.value = []
}

function startIntervals() {
  clearExistingIntervals()
  userAirBallons.value
    .filter(balloon => balloon.state === 'LIVE')
    .forEach(balloon => {
      const interval = setInterval(() => {
        balloon.kilometers += balloon.step
      }, 1000)
      intervals.value.push(interval)
    })
}

function updateMapFeatures() {
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
}

async function fetchAirBalloons() {
  const { data, error } = await supabase
    .from('airballoons')
    .select('*')
    .is('tournamentID', null)
    .not('state', 'is', null)
    .not('state', 'eq', 'STOPPED')

  if (error) {
    console.error('Error fetching air balloons:', error)
    return
  }

  userAirBallons.value = data.filter(t => t.state === 'LIVE').sort((a, b) => b.kilometers - a.kilometers)
  updateMapFeatures()
  startIntervals()
}




async function handleRealtimeUpdates(payload) {
  if (payload.eventType === 'UPDATE') {
    const index = userAirBallons.value.findIndex(item => item.id === payload.new.id)
    if (index !== -1) {
      userAirBallons.value[index] = payload.new
    } else {
      await fetchAirBalloons()
    }
  }
  startIntervals()
}

function subscribeToUpdates() {
  supabase.channel('custom-all-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'airballoons' },
      handleRealtimeUpdates
    )
    .subscribe()
}



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


onMounted(async () => {
  await fetchAirBalloons()
  subscribeToUpdates()
})

watch(userAirBallons, updateMapFeatures, { deep: true })

onDeactivated(clearExistingIntervals) 

</script>