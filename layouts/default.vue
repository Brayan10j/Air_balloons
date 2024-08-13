<template>
  <v-app>
    <v-app-bar color="transparent" scroll-behavior="hide" flat>
      <v-spacer />
      <v-btn
        v-if="unlogged"
        @click="login()"
        rounded
        variant="outlined"
        size="small"
        class="mr-2"
      >
        Log in
      </v-btn>
      <v-btn v-else rounded to="/profile">
        <v-icon color="grey">mdi-account</v-icon>
        {{ formattedUser }}
      </v-btn>
    </v-app-bar>
    <v-main>
      <slot />
    </v-main>
    <v-bottom-navigation grow>
      <v-btn to="/"> <v-icon>mdi-home</v-icon> </v-btn>
      <v-btn to="/store"> <v-icon>mdi-store</v-icon> </v-btn>
      <v-btn to="/mapAdd">
        <v-icon>mdi-bag-personal-outline</v-icon>
      </v-btn>
      <v-btn to="/tournaments">
        <v-icon>mdi-trophy-variant-outline</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script setup>

const unlogged = ref(true);
const user = ref("");

const formattedUser = computed(() => {
  return user.value
    ? `${user.value.slice(0, 5)}...${user.value.slice(-3)}`
    : "";
});

async function login() {
  if (!window.ethereum) {
    alert("MetaMask not installed :(");
    return;
  }

  try {
    await useConnectWeb3(); 
    unlogged.value = false;
    user.value = window.ethereum.selectedAddress;
  } catch (error) {
    alert("Login failed!");
    unlogged.value = true;
  }
}

onMounted(() => {
  login();
});
</script>
