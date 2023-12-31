import { defineStore } from "pinia";

export const useMainStore = defineStore("main", {
  state: () => ({
    count: 1000,
    intervalID: "",
    InfoWheather: {
      location: [0, 0],
      temp: 0,
      wind: 0,
      humidity: 0,
      speed: 0,
    },

    airBalloon: undefined,
    airBalloonSelected: undefined,
    airBalloons: [
      {
        id: "1",
        image: "/Globos/1.png",
        conditions: {
          temp: [0, 50],
          humidity: [0, 70],
          windSpeed: [0, 35],
        },
      },
      {
        id: "2",
        image: "/Globos/2.png",
        conditions: {
          temp: [-100, 0],
          humidity: [50, 100],
          windSpeed: [0, 50],
        },
      },
      {
        id: "3",
        image: "/Globos/3.png",
        conditions: {
          temp: [0, 20],
          humidity: [50, 100],
          windSpeed: [0, 50],
        },
      },
      {
        id: "4",
        image: "/Globos/4.png",
        conditions: {
          temp: [20, 50],
          humidity: [0, 50],
          windSpeed: [0, 100],
        },
      },
      {
        id: "5",
        image: "/Globos/5.png",
        conditions: {
          temp: [-100, 100],
          humidity: [0, 100],
          windSpeed: [0, 30],
        },
      },
      {
        id: "6",
        image: "/Globos/6.png",
        conditions: {
          temp: [-100, 100],
          humidity: [0, 100],
          windSpeed: [40, 120],
        },
      },
    ],
  }),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  actions: {
    setAirBalloon(item) {
      clearInterval(this.intervalID);
      this.airBalloonSelected = item;
      if (this.airBalloonSelected !== undefined) {
        this.airBalloon =
          this.airBalloons[parseInt(this.airBalloonSelected.airballoonId) - 1];
        if (this.airBalloonSelected.state == "LIVE") {
          this.intervalID = setInterval(() => {
            this.airBalloonSelected.kilometers += this.airBalloonSelected.step;
          }, 1000);
        }
      }
    },
    setInfoWheather(item) {
      this.InfoWheather = item;
    },
    setInfoAirBalloon(item) {
      this.airBalloon = item;
    },
  },
});
