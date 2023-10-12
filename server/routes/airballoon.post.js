import { serverSupabaseClient } from "#supabase/server";
import * as turf from "@turf/turf";
import axios from "axios";

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event);
  const body = await readBody(event);
  const { data, error } = await supabase
    .from("airballoons")
    .upsert(body)
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
    let newDestination = destination.geometry.coordinates;
    //revisar el antimeridiano

    /* if (destination.geometry.coordinates[0] > 180) {
      destination.geometry.coordinates[0] =
        (destination.geometry.coordinates[0] % 180) - 180;
      newDestination = [
        [airBallon.point, [180.0, destination.geometry.coordinates[1]]],
        [
          [-180.0, destination.geometry.coordinates[1]],
          [
            destination.geometry.coordinates[0],
            destination.geometry.coordinates[1],
          ],
        ],
      ];
    } else {
      if (destination.geometry.coordinates[0] < -180) {
        destination.geometry.coordinates[0] =
          (destination.geometry.coordinates[0] % 180) + 180;

        newDestination = [
          [airBallon.point, [180.0, destination.geometry.coordinates[1]]],
          [
            [-180.0, destination.geometry.coordinates[1]],
            [
              destination.geometry.coordinates[0],
              destination.geometry.coordinates[1],
            ],
          ],
        ];
      } else {
        newDestination = destination.geometry.coordinates; // [ 0,0]  [ [0,0], [0.0]]
      } 
    }*/
    let speed = infoWeather.data.wind.speed * 3.6;

    let counter = 0;
    routeTemp.features[0].geometry.coordinates = [
      airBallon.point,
      newDestination,
    ];

    const lineDistance = turf.length(routeTemp.features[0]);

    const arc = [];

    let steps = (lineDistance / speed) * 3600;

    for (let i = 0; i <= steps; i++) {
      const disXseg = lineDistance / steps;

      const segment = turf.along(routeTemp.features[0], i * disXseg);
      arc.push(segment.geometry.coordinates);
    }
    routeTemp.features[0].geometry.coordinates = arc;

    async function animate() {
      try {
        if (counter >= steps) {
          airBallon.route.push([airBallon.point, airBallon.point]);
          loadRoute(airBallon);
          // Realizar la inserción en la base de datos después de cada iteración
        } else {
          airBallon.route.push([airBallon.point, routeTemp.features[0].geometry.coordinates[counter]]); 
          airBallon.point = routeTemp.features[0].geometry.coordinates[counter];
          let line = turf.multiLineString(airBallon.route);
          airBallon.kilometers = turf.length(line);
          counter += 5;

          setTimeout(animate, 5000);
        }
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
