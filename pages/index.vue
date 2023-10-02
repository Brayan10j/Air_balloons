<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card width="500" v-show="showInfo" class="mx-auto">
          <v-row>
            <v-col>
              <v-icon>mdi-water</v-icon>
              {{ infoAirballon.humidity }} %
            </v-col>
            <v-col>
              <v-icon>mdi-arrow-up-bold mdi-rotate-{{ infoAirballon.wind }}</v-icon>
              {{ infoAirballon.speed.toFixed(2) }} km/h
            </v-col>
            <v-col>
              <v-icon>mdi-thermometer</v-icon>
              {{ infoAirballon.temp }} &deg;C
              <v-icon v-show="(infoAirballon.rain /= undefined)">mdi-weather-pouring</v-icon>
            </v-col>
          </v-row>
        </v-card>
        <br />
        <v-container id="map" fluid fill-heigh style="height: 80vh" />
        <br />
        <v-btn color="blue" @click="seeAll()"> See all</v-btn>
      </v-col>
      <v-col>
        <v-row>
          <v-col>
            <v-card class="mx-auto">
              <v-card-text>
                <v-row>
                  <v-col v-for="(item, index) in airBallons" :key="index">
                    <v-card color="white" @click="chooseAirBallon(item.image)">
                      <v-sheet color="white" rounded class="mx-auto" height="80" width="80"><v-img class="mx-auto"
                          :src="item.image"> </v-img></v-sheet>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-btn color="blue" class="mx-auto" @click="flyAirballon()">
                  Go
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-table height="320px" fixed-header>
              <thead>
                <tr>
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
                  <td><v-avatar :image="item.image"></v-avatar></td>
                  <td>{{ item.kilometers }}
                  </td>
                  <td>{{ item.state ? 'Live' : 'Crash' }}</td>
                  <td><v-icon @click="seeAirballon(item)" color="blue">mdi-eye</v-icon></td>
                </tr>
              </tbody>
            </v-table>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-dialog v-model="dialogReanudate" persistent max-width="500">
      <v-card>
        <v-card-title> Your airballon was disrupted , reanudate? </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialogReanudate = false">
            Disagree
          </v-btn>
          <v-btn color="green darken-1" text @click="reanudate()">
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { cellToLatLng } from "h3-js"


export default {
  data: () => ({
    dialogReanudate: false,
    locationAirballon: [0, 0],
    hexStart: '',
    markerInit: {},
    popup: {},
    map: {},
    coordinates: [],
    lands: [],
    userAirBallons: [],
    routeBefore: {},
    point: {},
    imageAirBallon: '/Globos/1.png',
    kilometers: 0,
    airBallons: [
      {
        image: '/Globos/1.png',
      },
      {
        image: '/Globos/2.png',
      },
      {
        image: '/Globos/3.png',
      },
      {
        image: '/Globos/4.png',
      },
      {
        image: '/Globos/5.png',
      },
      {
        image: '/Globos/6.png',
      },
    ],
    showInfo: false,
    infoAirballon: {
      temp: 0,
      wind: 0,
      humidity: 0,
      speed: 0,
    },
  }),
  computed: {
    /* filterLands: function () {
      return (
        this.lands
          //.filter((l) => h3.h3GetResolution(l.hexID) == 9)
          .filter((l) => this.$store.state.userInfo.address === l.owner)
          .map((l) => l.hexID)
      )
    }, */
    pointUserAirballoons: function () {
      return this.userAirBallons.map((a) => a.point)
    },
  },
  methods: {
    onDragEnd() {
      const lngLat = this.markerInit.getLngLat();

      //this.map.setLayoutProperty('point', 'visibility', 'none')
      this.locationAirballon = [lngLat.lng, lngLat.lat]
      /* this.popup = new mapboxgl.Popup()
        .setLngLat({ lon: lngLat.lng, lat: lngLat.lat })
        .setHTML(`<img heigth="50" width="50" src=${this.imageAirBallon}><img>`)
        .addTo(this.map); */
      //this.point.features[0].geometry.coordinates = [lngLat.lng, lngLat.lat]
      //this.map.getSource('point').setData(this.point)
      //this.map.setLayoutProperty('point', 'visibility', 'visible')
    },
    seeAll() {
      let points = {
        type: 'FeatureCollection',
        features: [
          /* {
            'type': 'Feature',
            'geometry': {
              'type': 'Point',
              'coordinates': [40, -10]
            },
            'properties': {
              'image-name': 'popup-debug',
              'name': 'Line 1\nLine 2\nLine 3'
            }
          }, */
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'MultiPoint',
              coordinates: this.pointUserAirballoons,
            },
          },
        ],
      }
      this.map.setLayoutProperty('point', 'visibility', 'none')
      this.map.setLayoutProperty('point', 'visibility', 'visible')
      this.map.getSource('point').setData(points)
    },
    wintdeg(deg) {
      let arr = [0, 45, 90, 135, 180, 225, 270, 315]
      return arr[Math.round(((deg + 180) % 360) / 45)]
    },
    async seeAirballon(item) {
      if (this.userAirBallons.includes(item)) {
        console.log("crash")
      }
      this.markerInit.remove();
      this.showInfo = true
      console.log(JSON.parse(JSON.stringify(item.route)))
      try {
        const { data } = await useFetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${item.point[1]}&lon=${item.point[0]}&appid=704e6c6ad29a17b1a787bd035c725346&units=metric`
        )
        this.infoAirballon.temp = data.value.main.temp
        this.infoAirballon.humidity = data.value.main.humidity
        this.infoAirballon.speed = data.value.wind.speed * 3.6
        this.infoAirballon.wind = this.wintdeg(data.value.wind.deg)
        this.infoAirballon.rain = data.value.rain
        this.map.jumpTo({
          center: item.point,
          zoom: 1,
        })
        this.map.setLayoutProperty('point', 'visibility', 'none')
        this.map.loadImage(item.image, (error, image) => {
          if (error) throw error

          // Add the image to the map style.
          this.map.updateImage('airBallon', image)
        })
        this.map.setLayoutProperty('point', 'visibility', 'visible')
        this.point.features[0].geometry.coordinates = item.point
        this.routeBefore.features[0].geometry.coordinates = JSON.parse(JSON.stringify(item.route)).concat([
          item.point,
        ])
        this.map.getSource('point').setData(this.point)
        this.map.getSource('routeBefore').setData(this.routeBefore)
        //this.map.setLayoutProperty('routeBefore', 'visibility', 'visible')
      } catch (error) {
        console.log(error)
      }
    },

    setMarker() {

      const { lng, lat } = this.map.getCenter();
      this.markerInit = new mapboxgl.Marker({

        draggable: true
      })
        .setPopup(new mapboxgl.Popup().setHTML(`<img heigth="50" width="50" src=${this.imageAirBallon}><img>`))
        .setLngLat([lng, lat])
        .addTo(this.map)
        .togglePopup();

      this.markerInit.on('dragend', this.onDragEnd);

    },
    chooseAirBallon(imageIn) {
      this.markerInit.remove()
      this.imageAirBallon = imageIn
      this.setMarker()


      this.map.setLayoutProperty('point', 'visibility', 'none')
      this.map.loadImage(imageIn, (error, image) => {
        if (error) throw error

        // Add the image to the map style.
        this.map.updateImage('airBallon', image)
      })
      this.map.setLayoutProperty('point', 'visibility', 'visible')
    },
    async reanudate(id) {
      try {

        this.dialogReanudate = false
      } catch (error) {
        alert(error.message)
        this.dialogReanudate = false
      }
    },
    async flyAirballon() {

      const { data } = await useFetch('/airballoon', {
        method: "POST", body: {
          owner: "0x",
          image: this.imageAirBallon,
          point: this.locationAirballon,
          kilometers: 0,
          state: true,
          route: [this.locationAirballon],
        }
      })
      this.markerInit.remove()
    },
  },
  async mounted() {
    const supabase = useSupabaseClient()

    setInterval(async () => {
      let { data, error } = await supabase
        .from('airballoons')
        .select('*')
      this.userAirBallons = data
    }, 1000);



    //update poll

    /*  const airballoons = supabase.channel('custom-all-channel')
       .on(
         'postgres_changes',
         { event: '*', schema: 'public', table: 'airballoons' },
         async (payload) => {
           /* let { data, error } = await supabase
             .from('airballoons')
             .select('*')
           this.userAirBallons = data 
           //console.log('Change received!', payload)
         }
       )
       .subscribe()
  */

    mapboxgl.accessToken =
      'pk.eyJ1Ijoic3Rvcm1ibGF4IiwiYSI6ImNrb2Z6a2F3bzBib3gyb3BucDV5eG1maXoifQ.BgKgtZQJa5m1xOXGNuJfjw'

    this.map = new mapboxgl.Map({
      container: 'map',
      center: [0, 0],
      style: 'mapbox://styles/mapbox/satellite-streets-v11',
      zoom: 1,
      projection: 'globe',
      attributionControl: false,
    })

    this.setMarker()



    /*  const geolocate = new mapboxgl.GeolocateControl({
       positionOptions: {
         enableHighAccuracy: true
       },
       trackUserLocation: true
     });
     // Add the control to the map.
     this.map.addControl(geolocate);
     // Set an event listener that fires
     // when a geolocate event occurs.
     geolocate.on('geolocate', () => {
       console.log('A geolocate event has occurred.');
     }); */

    // A simple line from origin to current destination.
    this.point = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: [],
          },
        },
      ],
    }

    let points = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'MultiPoint',
            coordinates: [],
          },
        },
      ],
    }
    this.routeBefore = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [],
          },
        },
      ],
    }

    // A single point that animates along the route.
    // Coordinates are initially set to origin.

    this.map.on('style.load', () => {
      this.map.setFog({}) // Set the default atmosphere style
    })


    this.map.on('load', () => {
      this.map.loadImage('/Globos/3.png', (error, image) => {
        if (error) throw error

        // Add the image to the map style.
        this.map.addImage('airBallon', image)
      })
      this.map.addSource('routeBefore', {
        type: 'geojson',
        data: this.routeBefore,
      })

      this.map.addSource('point', {
        type: 'geojson',
        data: this.point,
      })

      this.map.addLayer({
        id: 'route',
        source: 'routeBefore',
        type: 'line',
        paint: {
          'line-width': 2,
          'line-color': '#007cbf',
        },
        maxzoom: 14,
      })

      this.map.addLayer({
        id: 'point',
        source: 'point',
        type: 'symbol',
        layout: {
          'icon-image': 'airBallon',
          'icon-size': 0.1,
          'icon-rotation-alignment': 'map',
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
        },
        maxzoom: 14,
      })
      this.map.on('idle', () => {
        this.map.resize()
      })
    })



  },
}
</script>

<style></style>


