<template>
  <v-app>
    <v-app-bar color="transparent" elevate-on-scroll flat>
      <v-spacer />
      <v-btn v-show="!loged" outlined rounded @click="login()">
        <v-icon color="grey" class="pr-2"> mdi-airballoon </v-icon>
        LOGIN
      </v-btn>
      <v-menu bottom min-width="200px" rounded offset-y>
        <template >
          <v-btn v-show="loged" icon x-large >
            <v-avatar color="transparent">
              <v-icon> mdi-account-circle </v-icon>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <div class="mx-auto text-center">
            <v-avatar color="transparent">
              <v-icon> mdi-account-circle </v-icon>
            </v-avatar>
            <!--  <p class="text-caption mt-1" v-if="loged">
                                {{
                                    $store.state.userInfo.address.slice(0, 5) +
                                    "..." +
                                    $store.state.userInfo.address.slice(-3)
                                }}
                            </p> -->
            <!-- <v-chip color="#bc1fdb" v-if="$store.state.userInfo">
                {{ $store.state.userInfo.pass.name }}
              </v-chip> -->
            <v-divider class="my-3"></v-divider>
            <v-btn depressed rounded text to="/myLands"> Lands </v-btn>
            <v-divider class="my-3"></v-divider>
            <v-btn depressed rounded text to="/collectibles">
              Collectibles
            </v-btn>
            <v-divider class="my-3"></v-divider>
            <v-btn depressed rounded text @click="logout"> Disconnect </v-btn>
          </div>

        </v-card>
      </v-menu>
    </v-app-bar>
    <v-main>
      <slot />
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      clipped: false,
      overlay: false,
      drawer: false,
      fixed: false,
      loged: true,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire',
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js',
    }
  },
  methods: {
    logout() {
      this.$store.commit('LOGIN', false)
    },
  },
}
</script>
