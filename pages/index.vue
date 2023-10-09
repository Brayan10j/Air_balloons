<template>
  <v-container>
    <v-row justify="center" align="center">

      <v-col> <v-btn block class="mx-auto" @click="seeAll()"> <v-icon>mdi-earth</v-icon> </v-btn> </v-col>
    </v-row>
    <v-row>

      <v-col cols="12">
        <v-card>
          <v-card-text>
            <v-row>
              <v-col cols="2" v-for="(item, index) in airBallons" :key="index">
                <v-card color="white">
                  <v-img class="mx-auto" width="50" @click="showAirBallon(item)" :src="item.image"> </v-img>
                </v-card>
              </v-col>
            </v-row>
            <v-row>
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
                    <!--  <v-icon v-show="(infoAirballon.rain /= undefined)">mdi-weather-pouring</v-icon> -->
                  </v-col>
                </v-row>
              </v-card>
            </v-row>
            <v-row>
              <v-container id="map" fluid style="height: 55vh">

              </v-container>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn color="blue" class="mx-auto" @click="flyAirballon()">
              Go
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <!--  <v-col>
       
        <v-btn color="blue" @click="seeAll()"> See all</v-btn>
      </v-col> -->
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
              <td><v-avatar :image="`/Globos/${item.airballoonId}.png`"></v-avatar></td>
              <td>{{ item.kilometers.toFixed(2) }}
              </td>
              <td>{{ item.state ? 'Live' : 'Crash' }}</td>
              <td><v-icon @click="seeAirballon(item)" color="blue">mdi-eye</v-icon></td>
            </tr>
          </tbody>
        </v-table>
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
    <v-dialog v-model="dialogAirballoon" max-width="300">
      <v-card class="text-center">

        <v-card-title> <v-img width="200" class="mx-auto" :src="airballoon.image"></v-img> </v-card-title>

        <v-card-subtitle> Conditions </v-card-subtitle>

        <v-card-text>
          <v-icon>mdi-thermometer</v-icon> : {{ airballoon.conditions.temp[0] }}&deg;C to {{
            airballoon.conditions.temp[1] }}&deg;C
        </v-card-text>
        <v-card-text>
          <v-icon>mdi-water</v-icon> : {{ airballoon.conditions.humidity[0] }}% to {{
            airballoon.conditions.humidity[1] }}%
        </v-card-text>
        <v-card-text>
          <v-icon>mdi-speedometer</v-icon> : {{ airballoon.conditions.windSpeed[0] }}km/h to {{
            airballoon.conditions.windSpeed[1] }}km/h
        </v-card-text>

        <v-card-actions class="justify-center">
          <v-btn rounded variant="outlined" @click="chooseAirballoon()"> select </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { cellToLatLng } from "h3-js"


export default {
  data: () => ({
    dialogAirballoon: false,
    dialogReanudate: false,
    locationAirballon: [0, 0],
    hexStart: '',
    markerInit: {},
    genesisArray: [],
    popup: {},
    map: {},
    coordinates: [],
    lands: [],
    userAirBallons: [],
    routeBefore: {},
    point: {},
    airballoon: {
      id: "1",
      image: '/Globos/1.png',
      conditions: {
        temp: [0, 50],
        humidity: [0, 70],
        windSpeed: [0, 35]
      }
    },
    kilometers: 0,
    airBallons: [
      {
        id: "1",
        image: '/Globos/1.png',
        conditions: {
          temp: [0, 50],
          humidity: [0, 70],
          windSpeed: [0, 35]
        }
      },
      {
        id: "2", image: '/Globos/2.png',
        conditions: {
          temp: [-100, 0],
          humidity: [50, 100],
          windSpeed: [0, 50]
        }
      },
      {
        id: "3", image: '/Globos/3.png',
        conditions: {
          temp: [0, 20],
          humidity: [50, 100],
          windSpeed: [0, 50]
        }
      },
      {
        id: "4", image: '/Globos/4.png',
        conditions: {
          temp: [20, 50],
          humidity: [0, 50],
          windSpeed: [0, 100]
        }
      },
      {
        id: "5", image: '/Globos/5.png',
        conditions: {
          temp: [-100, 100],
          humidity: [0, 100],
          windSpeed: [0, 30]
        }
      },
      {
        id: "6", image: '/Globos/6.png',
        conditions: {
          temp: [-100, 100],
          humidity: [0, 100],
          windSpeed: [40, 120]
        }
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
      this.markerInit.remove();
      const arrayFeatures = this.userAirBallons.map((a) => {
        return {
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': a.point
          },
          'properties': {
            'image-name': a.image,
          }
        }
      })
      let points = {
        type: 'FeatureCollection',
        features: arrayFeatures,
      }
      this.map.setLayoutProperty('point', 'visibility', 'none')
      this.map.setLayoutProperty('allPoints', 'visibility', 'none')
      this.map.getSource('allPoints').setData(points)
      this.map.setLayoutProperty('allPoints', 'visibility', 'visible')
    },
    wintdeg(deg) {
      let arr = [0, 45, 90, 135, 180, 225, 270, 315]
      return arr[Math.round(((deg + 180) % 360) / 45)]
    },
    async seeAirballon(item) {

      this.markerInit.remove();
      this.showInfo = true
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
        this.map.setLayoutProperty('allPoints', 'visibility', 'none')


        this.map.loadImage(`/Globos/${item.airballoonId}.png`, (error, image) => {
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
        this.map.setLayoutProperty('route', 'visibility', 'visible')
        let x = this.genesisArray.find((a) => a.id == item.id)
        if (x.kilometers == item.kilometers) {
          this.reanudate(item)

        }
      } catch (error) {
        console.log(error)
      }
    },

    setMarker() {
      this.map.setLayoutProperty('point', 'visibility', 'none')
      this.map.setLayoutProperty('route', 'visibility', 'none')
      const { lng, lat } = this.map.getCenter();
      const el = document.createElement('div');
      el.style.backgroundImage = `url(${this.airballoon.image})`;
      el.style.width = `50px`;
      el.style.height = `50px`;
      el.style.backgroundSize = '100%';
      this.markerInit = new mapboxgl.Marker({
        element: el,
        draggable: true
      })
        .setLngLat([lng, lat])
        .addTo(this.map)
      this.markerInit.on('dragend', this.onDragEnd);

    },
    showAirBallon(item) {

      this.dialogAirballoon = true
      this.airballoon = item


      /* 
            this.map.setLayoutProperty('point', 'visibility', 'none')
            this.map.loadImage(imageIn, (error, image) => {
              if (error) throw error
      
              // Add the image to the map style.
              this.map.updateImage('airBallon', image)
            })
            this.map.setLayoutProperty('point', 'visibility', 'visible') */
    },

    chooseAirballoon() {
      this.dialogAirballoon = false
      this.markerInit.remove()
      this.setMarker()
    },

    changeCapa() {

    },

    async reanudate(item) {
      try {
        const { data } = await useFetch('/airballoon', {
          method: "POST", body: item
        })
      } catch (error) {
        alert(error.message)
      }
    },
    async flyAirballon() {

      const { data } = await useFetch('/airballoon', {
        method: "POST", body: {
          owner: "0x",
          airballoonId: this.airballoon.id,
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

    let { data, error } = await supabase
      .from('airballoons')
      .select('*')
    this.genesisArray = data

    setInterval(async () => {
      let { data, error } = await supabase
        .from('airballoons')
        .select('*')
      this.userAirBallons = data
    }, 3000);



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
      renderWorldCopies: false
    })

    this.airBallons.map((a, i) => {
      this.map.loadImage(`/Globos/${i + 1}.png`, (error, image) => {
        if (error) throw error

        // Add the image to the map styl
        this.map.addImage(`/Globos/${i + 1}.png`, image)
      })
    })

    await this.map.loadImage(`/Globos/1.png`, (error, image) => {
      if (error) throw error

      // Add the image to the map style.
      this.map.addImage(`airBallon`, image)
    }
    )

    class CustomControl {
      constructor(idLayer, icon) {
        this.idLayer = idLayer;
        this.icon = icon;
      }
      onAdd(map) {
        this._map = map;
        this._container = document.createElement('div');
        this._container.className = "mapboxgl-ctrl mapboxgl-ctrl-group text-black ";
        this._container.innerHTML = `<button class="mapboxgl-ctrl-icon mdi mdi-${this.icon}" ></button>`;
        this._container.addEventListener("contextmenu", (e) => e.preventDefault());
        this._container.addEventListener("click", () => { map.setLayoutProperty(this.idLayer, 'visibility', map.getLayoutProperty(this.idLayer, 'visibility') == "none" ? "visible" : "none") });
        return this._container;
      }

      onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
      }
    }

    this.map.addControl(new CustomControl('temperature-layer', "thermometer"), "top-right");
    this.map.addControl(new CustomControl('humidity-layer', "water"), "top-right");
    this.map.addControl(new CustomControl('wind-layer', "wind-power"), "top-right");

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
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': []
          },
        }
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


    this.map.on('load', async () => {

      this.map.addLayer({
        id: 'temperature-layer',
        type: 'raster',
        source: {
          type: 'raster',
          tiles: [
            "https://tile.openweathermap.org/map/temp_new/0/0/0.png?appid=704e6c6ad29a17b1a787bd035c725346"
          ],
          tileSize: 1024,
          maxzoom: 0,
          minzoom: 0,
        },
        layout: {
          "visibility": "none"
        },
        paint: {
          "raster-saturation": 0.5,
          //"visibility": "none"
        }
      });

      this.map.addLayer({
        id: 'humidity-layer',
        type: 'raster',
        source: {
          type: 'raster',
          tiles: [
            "https://api.tomorrow.io/v4/map/tile/0/0/0/humidity/now.png?apikey=cUSumbZehbp65Zm5Kywfn4JLY762ZgOE"
          ],
          tileSize: 1024,
          maxzoom: 0,
          minzoom: 0,
        },
        layout: {
          "visibility": "none"
        },
        paint: {
          //"raster-saturation": 0.5,
          //"visibility": "none"
        }
      });

      this.map.addLayer({
        id: 'wind-layer',
        type: 'raster',
        source: {
          type: 'raster',
          tiles: [
            "https://tile.openweathermap.org/map/wind_new/0/0/0.png?appid=704e6c6ad29a17b1a787bd035c725346"
          ],
          tileSize: 1024,
          maxzoom: 0,
          minzoom: 0,
        },
        layout: {
          "visibility": "none"
        },
        paint: {
          "raster-saturation": 0.6,
          //"visibility": "none"
        }
      });

      this.map.addSource('routeBefore', {
        type: 'geojson',
        data: this.routeBefore,
      })

      this.map.addSource('point', {
        type: 'geojson',
        data: this.point,
      })

      this.map.addSource('allPoints', {
        type: 'geojson',
        data: points,
      })

      this.map.addLayer({
        id: 'allPoints',
        source: 'allPoints',
        type: 'symbol',
        layout: {
          'icon-image': ["get", "image-name"],
          'icon-size': 0.1,
          'icon-rotation-alignment': 'map',
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
        },
        maxzoom: 14,
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
      this.setMarker()
      this.map.on('idle', () => {
        this.map.resize()
      })
    })



  },
}
</script>

<style></style>


