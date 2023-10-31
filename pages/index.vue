<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <!--  <v-row>
              <v-col cols="2" v-for="(item, index) in airBallons" :key="index">
                <v-card color="white">
                  <v-img class="mx-auto" width="50" @click="() => {
                    dialogAirballoon = true
                    airballoon = item
                  }" :src="item.image"> </v-img>
                </v-card>
              </v-col>
            </v-row> -->
            <v-row justify="center" v-show="showCoordenates">
              {{ locationAirballon }}
            </v-row>
            <v-row justify="center">
              <v-card width="500">
                <v-row class="text-center">
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
              <v-container id="map" fluid style="height: 60vh">

              </v-container>
            </v-row>
            <v-row>
              <v-col>
                <v-img width="500" class="mx-auto" v-show="weatherLayer !== ''"
                  :src="`/Maps/InfoLayers/${weatherLayer}.png`">

                </v-img>
              </v-col>

            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn v-show="showCoordenates" color="blue" class="mx-auto" @click="flyAirballon()">
              Go
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-bottom-navigation grow>
      <v-btn @click="seeAll()"> <v-icon>mdi-earth</v-icon> </v-btn>
      <v-btn @click="dialogAdd = true"> <v-icon>mdi-plus</v-icon> </v-btn>
      <v-btn @click="dialogTable = true"> <v-icon>mdi-list-box-outline</v-icon> </v-btn>
      <v-btn @click="dialogTournaments = true"> <v-icon>mdi-trophy-variant-outline</v-icon> </v-btn>


    </v-bottom-navigation>
    <v-dialog v-model="diaglogMapSelect" scrim="blue">
      <v-card class="text-center ">
        <v-card-title>
          Location Air-balloon
        </v-card-title>
        <v-card-text>
          <MapboxMap map-id="mapSelect" :options="{
            style: 'mapbox://styles/mapbox/satellite-streets-v11', // style URL
            center: [0, 0], // starting position
            zoom: 0.2, // starting zoom
            projection: 'globe',
            attributionControl: false,
            renderWorldCopies: false
          }" style="position: relative ; height: 300px;">


            <MapboxDefaultMarker marker-id="marker1" :options="{
              draggable: true,
            }" :lnglat="[0, 0]"></MapboxDefaultMarker>

          </MapboxMap>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn variant="outlined">
            Select location
          </v-btn>
        </v-card-actions>
      </v-card>





    </v-dialog>
    <v-dialog v-model="dialogTable" min-width="300">
      <v-table height="320px" fixed-header>
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
            <td><v-icon @click="seeAirballon(item)" color="blue">mdi-eye</v-icon> <v-btn v-show="!item.state"
                @click="deleteAirBalloon(item)"><v-icon color="red">mdi-delete</v-icon> </v-btn></td>
          </tr>
        </tbody>
      </v-table>
    </v-dialog>

    <v-dialog v-model="dialogTournaments">
      <v-table fixed-header>
        <thead>
          <tr>
            <v-toolbar collapse>
              <v-spacer></v-spacer>
              <v-btn @click="dialogCreate = true">
                Create
              </v-btn>
            </v-toolbar>

          </tr>
          <tr>
            <!--    <th class="text-left">
                Id
              </th> -->
            <th class="text-left">
              Name
            </th>
            <th class="text-left">
              Description
            </th>
            <th class="text-left">
              Participants
            </th>
            <th class="text-left">
              Value
            </th>
            <th class="text-left">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in tournaments" :key="item.id">
            <!-- <td>{{ item.id }} </td> -->
            <td>{{ item.title }}</td>
            <td>{{ item.descripton }}</td>
            <td>{{ item.participants.length }} / {{ item.maxParticipants }}</td>
            <td>{{ item.value }}</td>
            <td><v-icon v-show="item.participants.length < item.maxParticipants" @click="addParticipant(item)"
                color="blue">mdi-plus</v-icon></td>
            <td>
              <v-btn color="green" v-show="item.participants.length == item.maxParticipants"> Start </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-dialog v-model="dialogCreate">
        <v-card>
          <v-card-text>
            <v-text-field label="title"></v-text-field>
            <v-text-field type="number" label="participants"></v-text-field>
            <v-text-field prefix="$" type="number" label="value"></v-text-field>

          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn @click="dialogCreate = false">
              Create
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-dialog>
    <v-dialog v-model="dialogAdd" max-width="500">
      <v-carousel hide-delimiters>
        <v-carousel-item v-for="(a, i) in airBallons" :key="i">
          <v-card class="text-center">

            <v-card-title> <v-img width="200" class="mx-auto" :src="a.image"></v-img> </v-card-title>

            <v-card-subtitle> Conditions </v-card-subtitle>

            <v-card-text>
              <v-icon>mdi-thermometer</v-icon> : {{ a.conditions.temp[0] }}&deg;C to {{
                a.conditions.temp[1] }}&deg;C
            </v-card-text>
            <v-card-text>
              <v-icon>mdi-water</v-icon> : {{ a.conditions.humidity[0] }}% to {{
                a.conditions.humidity[1] }}%
            </v-card-text>
            <v-card-text>
              <v-icon>mdi-speedometer</v-icon> : {{ a.conditions.windSpeed[0] }}km/h to {{
                a.conditions.windSpeed[1] }}km/h
            </v-card-text>

            <v-card-actions class="justify-center">
              <v-btn rounded variant="outlined" @click="chooseAirballoon(a)"> select </v-btn>
            </v-card-actions>
          </v-card>
        </v-carousel-item>
      </v-carousel>

    </v-dialog>

  </v-container>
</template>

<script>

export default {
  data: () => ({
    dialogAirballoon: false,
    dialogTable: false,
    dialogAdd: false,
    dialogTournaments: false,
    diaglogMapSelect: false,
    dialogCreate: false,
    showCoordenates: true,
    weatherLayer: "",
    intervals: [],
    locationAirballon: [0, 0],
    markerInit: {},
    map: {},
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
    infoAirballon: {
      temp: 0,
      wind: 0,
      humidity: 0,
      speed: 0,
    },
    weatherLayers: [
      { name: "temperature-layer", icon: "thermometer", image: "https://api.tomorrow.io/v4/map/tile/0/0/0/temperature/now.png?apikey=cUSumbZehbp65Zm5Kywfn4JLY762ZgOE" },
      { name: "humidity-layer", icon: "water", image: "https://api.tomorrow.io/v4/map/tile/0/0/0/humidity/now.png?apikey=cUSumbZehbp65Zm5Kywfn4JLY762ZgOE" },
      { name: "wind-layer", icon: "wind-power", image: "https://api.tomorrow.io/v4/map/tile/0/0/0/windSpeed/now.png?apikey=cUSumbZehbp65Zm5Kywfn4JLY762ZgOE" }

    ],
    tournaments: [
      {
        title: "tournament 1",
        descripton: "last balloon in flight",
        participants: [],
        maxParticipants: 10,
        value: 10
      },
      {
        title: "tournament 2",
        descripton: "longest journey",
        participants: [],
        maxParticipants: 20,
        value: 5
      }
    ]
  }),
  methods: {
    addParticipant(tournament) {
      this.diaglogMapSelect = true
      const airballoon = this.airBallons[Math.floor(Math.random() * 6)]
      if (tournament.participants.length < tournament.maxParticipants) {
        tournament.participants.push({
          owner: "0x",
          airballoonId: airballoon.id,
          point: this.locationAirballon,
          kilometers: 0,
          step: this.infoAirballon.speed / 3600,
          state: true,
          route: [[this.locationAirballon, this.locationAirballon]],
        })
      }
    },
    seeAll() {
      // Remove the markerInit layer
      this.markerInit.remove();
      this.showCoordenates = false

      // Create an array of features
      const arrayFeatures = this.userAirBallons.map(a => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: a.point
        },
        properties: {
          'image-name': `/Globos/${a.airballoonId}.png`,
        }
      }));

      // Create a FeatureCollection from the array of features
      const points = {
        type: 'FeatureCollection',
        features: arrayFeatures,
      };

      // Hide 'point' and 'allPoints' layers
      this.map.setLayoutProperty('point', 'visibility', 'none');
      this.map.setLayoutProperty('allPoints', 'visibility', 'none');
      this.map.setLayoutProperty('route', 'visibility', 'none');

      // Set the data for 'allPoints' source and make it visible
      this.map.getSource('allPoints').setData(points);
      this.map.setLayoutProperty('allPoints', 'visibility', 'visible');
    },
    wintdeg(deg) {
      let arr = [0, 45, 90, 135, 180, 225, 270, 315]
      return arr[Math.round(((deg + 180) % 360) / 45)]
    },
    async getWeather(location) {
      try {
        const { data } = await useFetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location[1]}&lon=${location[0]}&appid=704e6c6ad29a17b1a787bd035c725346&units=metric`
        );

        // Update the infoAirballon object properties
        this.infoAirballon.temp = data.value.main.temp;
        this.infoAirballon.humidity = data.value.main.humidity;
        this.infoAirballon.speed = data.value.wind.speed * 3.6;
        this.infoAirballon.wind = this.wintdeg(data.value.wind.deg);
        this.infoAirballon.rain = data.value.rain;
      } catch (error) {
        console.log(error)
      }
    },
    async seeAirballon(item) {
      // Remove the markerInit layer and show the info panel
      this.markerInit.remove();
      this.showCoordenates = false
      this.map.jumpTo({
        center: item.point,
        zoom: 1,
      });

      this.getWeather(item.point)
      this.locationAirballon = item.point

      // Center the map on the selected airballon

      // Hide 'point' and 'allPoints' layers
      this.map.setLayoutProperty('point', 'visibility', 'none');
      this.map.setLayoutProperty('allPoints', 'visibility', 'none');

      // Load and update the 'airBallon' image
      this.map.loadImage(`/Globos/${item.airballoonId}.png`, (error, image) => {
        if (error) throw error;
        this.map.updateImage('airBallon', image);
      });

      // Update point and route data sources
      this.point.geometry.coordinates = item.point;

      this.map.getSource('point').setData(this.point);
      this.routeBefore.geometry.coordinates = item.route
      this.map.getSource('routeBefore').setData(this.routeBefore);

      // Show the 'route' layer
      this.map.setLayoutProperty('route', 'visibility', 'visible');
      this.map.setLayoutProperty('point', 'visibility', 'visible');
      // Check if it needs to be resumed
      const fechaMenosUnaHora = new Date();
      fechaMenosUnaHora.setHours(fechaMenosUnaHora.getHours() - 1);
      if (new Date(item.updated_at) < fechaMenosUnaHora) {
        this.reanudate(item);
      }
      this.dialogTable = false


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
      this.markerInit.on('dragend', () => {
        const lngLat = this.markerInit.getLngLat();
        this.locationAirballon = [lngLat.lng, lngLat.lat]
        this.getWeather(this.locationAirballon)
      });
    },

    chooseAirballoon(item) {
      this.airballoon = item
      this.dialogAdd = false
      this.markerInit.remove()
      this.setMarker()
      this.showCoordenates = true
    },

    async reanudate(item) {
      try {
        await useFetch('/airballoon', {
          method: "POST", body: item
        })
      } catch (error) {
        alert(error.message)
      }
    },
    setIntervals() {
      this.intervals.forEach(interval => clearInterval(interval));
      this.intervals = this.userAirBallons
        .filter(a => a.state).map(a => setInterval(() => {
          a.kilometers += a.step
        }, 1000))
    },
    changeWheatherLayer(idLayer) {
      this.weatherLayers.forEach((l) => {
        if (l.name == idLayer) {
          if (this.map.getLayoutProperty(idLayer, 'visibility') == 'none') {
            this.weatherLayer = idLayer
            this.map.setLayoutProperty(idLayer, 'visibility', 'visible')
          }
          else {
            this.weatherLayer = ""
            this.map.setLayoutProperty(idLayer, 'visibility', 'none')
          }
        } else {
          this.map.setLayoutProperty(l.name, 'visibility', 'none')
        }
      })
    },
    async deleteAirBalloon(item) {
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

    },
    async flyAirballon() {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts"
        });
        await useFetch('/airballoon', {
          method: "POST", body: {
            owner: accounts[0],
            airballoonId: this.airballoon.id,
            point: this.locationAirballon,
            kilometers: 0,
            step: this.infoAirballon.speed / 3600,
            state: true,
            route: [[this.locationAirballon, this.locationAirballon]],
          }
        })
        this.markerInit.remove()
        this.showCoordenates = false
        this.dialogTable = true
        alert("Airballoon put to flight successfully")
      } catch (error) {
        alert(error.message)
      }


    },
  },
  async mounted() {
    const supabase = useSupabaseClient()

    let { data, error } = await supabase
      .from('airballoons')
      .select('*')
    this.userAirBallons = data

    this.setIntervals()


    const airballoons = supabase.channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'airballoons' },
        async (payload) => {
          if (payload.eventType == "UPDATE") {
            this.userAirBallons = this.userAirBallons.map(objeto =>
              objeto.id === payload.new.id ? payload.new : objeto
            );
            this.setIntervals()

          } else {
            let { data, error } = await supabase
              .from('airballoons')
              .select('*')
            this.userAirBallons = data
            this.setIntervals()
          }

        }
      )
      .subscribe()

    /* setInterval(async () => {
      let { data, error } = await supabase
        .from('airballoons')
        .select('*')
      this.userAirBallons = data
    }, 5000); */

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
      this.map.addImage(`airBallon`, image)
    }
    )

    class CustomControl {
      constructor(idLayer, icon, ctx) {
        this.idLayer = idLayer;
        this.icon = icon;
        this.ctx = ctx
      }
      onAdd(map) {
        this._map = map;
        this._container = document.createElement('div');
        this._container.id = this.idLayer;
        this._container.className = "mapboxgl-ctrl mapboxgl-ctrl-group text-black ";
        this._container.innerHTML = `<button class="mapboxgl-ctrl-icon mdi mdi-${this.icon}" ></button>`;
        this._container.addEventListener("contextmenu", (e) => e.preventDefault());
        this._container.addEventListener("click", () => {
          this.ctx.changeWheatherLayer(this.idLayer)
        });
        return this._container;
      }

      onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
      }
    }


    this.point =
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [],
      },
    };


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
      type: 'Feature',
      geometry: {
        type: 'MultiLineString',
        coordinates: [],
      },
    }

    // A single point that animates along the route.
    // Coordinates are initially set to origin.

    this.map.on('style.load', () => {
      this.map.setFog({}) // Set the default atmosphere style
    })


    this.map.on('load', async () => {

      this.weatherLayers.forEach((l) => {
        this.map.addControl(new CustomControl(l.name, l.icon, this), "top-right");
        this.map.addLayer({
          id: l.name,
          type: 'raster',
          source: {
            type: 'raster',
            tiles: [l.image
            ],
            tileSize: 1024,
            maxzoom: 0,
            minzoom: 0,
          },
          layout: {
            "visibility": "none"
          },
          paint: {
            //"raster-saturation": 0.2,
            "raster-opacity": 0.8
            //"visibility": "none"
          }
        });
      })

      this.map.addSource('routeBefore', {
        type: 'geojson',
        data: this.routeBefore,
      })

      this.map.addLayer({
        id: 'route',
        source: 'routeBefore',
        type: 'line',
        paint: {
          'line-width': 4,
          'line-color': '#007cbf',
        },
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
      })
      this.setMarker()
      /* this.map.on('idle', () => {
        this.map.resize()
      }) */
    })



  },
}
</script>

<style></style>


