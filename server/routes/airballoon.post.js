import { serverSupabaseClient } from "#supabase/server";
import * as turf from "@turf/turf";
import axios from "axios";

const airBallons = [
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
];

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event);
  const body = await readBody(event);
  const { data, error } = await supabase
    .from("airballoons")
    .upsert(body)
    .select();
  if (error) console.log(error);
  async function loadRoute(airBallon) {
    try {
      let infoWeather = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${airBallon.point[1]}&lon=${airBallon.point[0]}&appid=704e6c6ad29a17b1a787bd035c725346&units=metric`
      );
      let windSpeed = infoWeather.data.wind.speed * 3.6;
      const test = airBallons[parseInt(airBallon.airballoonId) - 1];

      if (
        infoWeather.data.main.temp < test.conditions.temp[0] ||
        infoWeather.data.main.temp > test.conditions.temp[1] ||
        infoWeather.data.main.humidity < test.conditions.humidity[0] ||
        infoWeather.data.main.humidity > test.conditions.humidity[1] ||
        windSpeed < test.conditions.windSpeed[0] ||
        windSpeed > test.conditions.windSpeed[1]
      ) {
        airBallon.state = false;
        await supabase.from("airballoons").upsert(airBallon);
      } else {
        let destination = turf.destination(
          airBallon.point,
          1,
          infoWeather.data.wind.deg - 180
        );

        const airBallonLongitude = airBallon.point[0];

        destination.geometry.coordinates[0] =
          ((destination.geometry.coordinates[0] + 540) % 360) - 180;

        const longitudeDiff = Math.abs(
          destination.geometry.coordinates[0] - airBallonLongitude
        );
        const lon = airBallonLongitude < 0 ? -180.0 : 180.0;

        if (longitudeDiff > 180) {
          const route1 = [
            airBallon.point,
            [lon, destination.geometry.coordinates[1]],
          ];
          const route2 = [
            [-lon, destination.geometry.coordinates[1]],
            destination.geometry.coordinates,
          ];
          airBallon.route.push(route1, route2);
        } else {
          airBallon.route.push([
            airBallon.point,
            destination.geometry.coordinates,
          ]);
        }

        const steps = 3600 / windSpeed;
        airBallon.point = destination.geometry.coordinates;

        let line = turf.multiLineString(airBallon.route);
        airBallon.kilometers = turf.length(line);
        airBallon.step = windSpeed / 3600;

        
        setTimeout(async () => {
          await supabase.from("airballoons").upsert(airBallon);
          loadRoute(airBallon);
        }, steps * 1000);
      }
    } catch (error) {
      console.log(error);
      await supabase.from("airballoons").upsert(airBallon);
    }
  }
  loadRoute(data[0]);
  return data;
});
