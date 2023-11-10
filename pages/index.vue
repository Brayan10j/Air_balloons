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
        <v-table height="70vh" fixed-header>
          <thead>
            <tr>
              <th class="text-left">
                Id
              </th>
              <th class="text-left">
                Air-balloon
              </th>
              <th class="text-left">
                Kilometers
              </th>
              <th class="text-left">
                State
              </th>
              <th class="text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in userAirBallons" :key="item.id">
              <td>{{ item.id }} </td>
              <td><v-avatar :image="`/Globos/${item.airballoonId}.png`"></v-avatar></td>
              <td>{{ item.kilometers.toFixed(4) }}
              </td>
              <td>{{ item.state ? 'Live' : 'Crash' }}</td>
              <td><v-menu>
                  <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-dots-vertical" v-bind="props" size="small" variant="flat"></v-btn>
                  </template>

                  <v-list>
                    <v-list-item @click="viewAirBalloon(item)">
                      view
                    </v-list-item>
                    <v-list-item v-show="!item.state && item.tournamentID == null" @click="deleteAirBalloon(item)">
                      delete
                    </v-list-item>
                  </v-list>
                </v-menu><!-- <v-icon @click="seeAirballon(item)" color="blue">mdi-eye</v-icon> 
            <v-btn v-show="!item.state && item.tournamentID == null" @click="deleteAirBalloon(item)"><v-icon color="red">mdi-delete</v-icon> </v-btn> -->
              </td>
            </tr>
          </tbody>
        </v-table>
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

let { data, error } = await supabase
  .from('airballoons')
  .select('*')

userAirBallons.value = data

setIntervals()


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
        let { data, error } = await supabase
          .from('airballoons')
          .select('*')
        userAirBallons.value = data
        setIntervals()
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



  dataSource.value.features = userAirBallons.value.map(a => ({
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


async function deleteAirBalloon(item) {
  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts"
    });
    if (accounts[0] == item.owner) {
      const supabase = useSupabaseClient()
      const { error } = await supabase
        .from('airballoons')
        .delete()
        .eq('id', item.id)
    } else {
      alert("You aren't the owner")
    }
  } catch (error) {
    alert(error)
  }

}


async function viewAirBalloon(item) {
  try {
    const fechaMenosUnaHora = new Date();
    fechaMenosUnaHora.setHours(fechaMenosUnaHora.getHours() - 1);
    if (new Date(item.updated_at) < fechaMenosUnaHora && item.state) {
      await useFetch('/airballoon', {
        method: "POST", body: item
      })
    }
    store.setAirBalloon(item);
    useMapbox("mapView", (map) => {
      map.jumpTo({
        center: item.point,
        zoom: 3,
      });
    })
    useMapboxMarker("markerView", marker => {
      marker.setLngLat(item.point)
    });
    await navigateTo('/mapView')

  } catch (error) {
    alert(error)
  }

}


</script>