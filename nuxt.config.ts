// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  
  devtools: { enabled: true },
  app: {
    head: {
      link: [
       
      ],
      script: [
        { src: 'https://unpkg.com/@turf/turf@6/turf.min.js' },
      ],
    },
  },
  modules: ["nuxt-vuetify", "@nuxtjs/supabase", 'nuxt3-leaflet', 'nuxt-mapbox', '@pinia/nuxt'],
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
