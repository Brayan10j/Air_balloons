import { serverSupabaseClient } from "#supabase/server";
import * as turf from "@turf/turf";
import axios from "axios";

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event);
  const body = await readBody(event);
  const { data, error } = await supabase
    .from("airballoons")
    .insert([body])
    .select();
  if (error) console.log(error);
  async function loadRoute(airBallon) {
    let routeTemp = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [],
          },
        },
      ],
    };
    let infoWeather = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${airBallon.point[1]}&lon=${airBallon.point[0]}&appid=704e6c6ad29a17b1a787bd035c725346&units=metric`
    );
    let destination = turf.destination(
      airBallon.point,
      1,
      infoWeather.data.wind.deg - 180
    );
    let speed = infoWeather.data.wind.speed * 3.6;
    let newDestination = destination.geometry.coordinates;
    let counter = 0;
    routeTemp.features[0].geometry.coordinates = [
      airBallon.point,
      newDestination,
    ];

    const lineDistance = turf.length(routeTemp.features[0]);
  
    const arc = [];

    let steps = (lineDistance / speed) * 3600;
    console.log(steps)
    
    for (let i = 0; i <= steps; i ++) {
      const disXseg =  lineDistance / steps

      const segment = turf.along(routeTemp.features[0], i * disXseg);
      arc.push(segment.geometry.coordinates);
    }
    routeTemp.features[0].geometry.coordinates = arc;
    

    async function animate() {
      try {
        if (counter >= steps) {
          airBallon.route.push(airBallon.point);
          loadRoute(airBallon);
          // Realizar la inserción en la base de datos después de cada iteración
        } else {
          airBallon.point = routeTemp.features[0].geometry.coordinates[counter];
          let routeTemp2 = airBallon.route.concat([airBallon.point]);
          let line = turf.lineString(routeTemp2);
          airBallon.kilometers = turf.length(line);
          counter++;
          setTimeout(animate, 1000);
        }
        airBallon.state = true;
        const { data, error } = await supabase
          .from("airballoons")
          .upsert(airBallon)
          .select();

        // Llamar a la próxima iteración después de un segundo
        
      } catch (error) {
        console.log(error);
        airBallon.state = false;
      }
    }
    animate();
  }
  loadRoute(data[0]);
  return data;
});
