// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'stylesheet',
          href: 'https://api.mapbox.com/mapbox-gl-js/v2.9.2/mapbox-gl.css',
        },
      ],
      script: [
        { src: 'https://api.mapbox.com/mapbox-gl-js/v2.10.0/mapbox-gl.js' },
        {
          src: 'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.7.0/mapbox-gl-geocoder.min.js',
        },
        { src: 'https://unpkg.com/@turf/turf@6/turf.min.js' },
        {
          src: 'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.2.2/mapbox-gl-draw.js',
        },
      ],
    },
  },
  modules: ["nuxt-vuetify", "@nuxtjs/supabase", 'nuxt3-leaflet', 'nuxt-mapbox'],
  vuetify: {
    theme: {
      defaultTheme: "dark",
    },
  },
  mapbox: {
    accessToken: 'pk.eyJ1Ijoic3Rvcm1ibGF4IiwiYSI6ImNrb2Z6a2F3bzBib3gyb3BucDV5eG1maXoifQ.BgKgtZQJa5m1xOXGNuJfjw'
  },
  supabase: {
    redirect: false
  }
  
})
