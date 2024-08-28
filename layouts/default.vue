<template>
  <v-app>
    <v-app-bar color="transparent" scroll-behavior="hide" flat>
      <v-spacer />
      <v-btn v-if="unlogged" @click="login()" rounded variant="outlined" size="small" class="mr-2">
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

// Variables reactivas
const unlogged = ref(true);
const user = ref("");

// Computed para formatear el nombre de usuario
const formattedUser = computed(() => {
  if (!user.value) return "";
  return `${user.value.slice(0, 5)}...${user.value.slice(-3)}`;
});

// Función para manejar el inicio de sesión
const login = async () => {
  try {
    await useConnectWeb3(); // Conectar con la función de Web3
    const selectedAddress = window.ethereum?.selectedAddress;

    if (selectedAddress) {
      user.value = selectedAddress;
      unlogged.value = false;
    } else {
      throw new Error("No address selected");
    }
  } catch (error) {
    console.error("Login failed:", error); // Mostrar el error en la consola para más detalle
    alert("Login failed! Please try again.");
    unlogged.value = true;
  }
};

// Llamar al inicio de sesión al montar el componente
onMounted(login);

</script>
