<template>
  <v-app>
    <v-app-bar app color="success">
      <div class="d-flex align-center" style="width: 400px">
        <v-img
            alt="Logo"
            class="shrink mr-2"
            contain
            :src="require('./assets/logo.png')"
            transition="scale-transition"
            style="width: 50px"
        ></v-img>

        <div style="padding-left: 5px; font-weight: bold; font-size: 20px">
          Timetable Manager
        </div>
      </div>

      <v-spacer></v-spacer>

      <v-btn color="white"
             elevation="4"
             depressed small
             style="margin-left: 20px;"
             to="/login">
        <v-icon>mdi-account-key</v-icon>
        Login
      </v-btn>

      <v-btn color="white"
             elevation="4"
             depressed small
             style="margin-left: 20px;"
             to="/register">
        <v-icon>mdi-account-plus</v-icon>
        Register
      </v-btn>

    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

    export default {
        name: 'App',

        data: () => ({}),
    };
</script>