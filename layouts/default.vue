<template>
  <v-app>
    <v-app-bar color="transparent" scroll-behavior="hide" flat>

      <v-spacer />
      <v-btn v-show="!loged" variant="outlined" rounded @click="login()" size="small">
        <v-icon color="grey" class="pr-2"> mdi-airballoon </v-icon>
        LOGIN
      </v-btn>
      <v-btn v-show="loged" icon>
        <v-icon color="grey"> mdi-airballoon </v-icon>
      </v-btn>
      <v-menu bottom min-width="200px" rounded offset-y>
        <template>
          <v-btn icon>
            <v-icon color="grey" class="pr-2"> mdi-airballoon </v-icon>
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
      <v-spacer />
    </v-app-bar>
    <v-main>
      <slot />
    </v-main>
   <!--  <v-bottom-navigation :elevation="0"  grow>
      <v-btn value="world">
        <v-icon>mdi-earth</v-icon>

        <span>World</span>
      </v-btn>

      <v-btn value="nearby">
        <v-icon>mdi-map-marker</v-icon>

        <span>Nearby</span>
      </v-btn>
    </v-bottom-navigation> -->
  </v-app>
</template>

<script setup>

const loged = ref(false)

async function login() {
  if (!window.ethereum) {
    alert("MetaMask not installed  :(");
  } else {
    let accounts = await window.ethereum.request({
      method: "eth_requestAccounts"
    });
    loged.value = true
    console.log(accounts)
  }
}

</script>
