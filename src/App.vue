<template>
  <v-app>
    <v-app-bar app color="success">
      <div class="d-flex align-center" style="width: 300px">
        <v-img
            alt="Logo"
            class="shrink mr-2"
            contain
            :src="require('./assets/logo.png')"
            transition="scale-transition"
            style="width: 50px"
        ></v-img>

        <v-app-bar-title style="padding-left: 10px; font-weight: bold">
          Timetable Manager
        </v-app-bar-title>
      </div>

      <v-spacer></v-spacer>

      <v-btn color="white"
             elevation="4"
             depressed small
             style="margin-left: 10px;"
             to="/login">
        <v-icon>mdi-magnify-close</v-icon>
        Login
      </v-btn>

      <v-btn color="white"
             elevation="4"
             depressed small
             style="margin-left: 10px;"
             to="/login">
        <v-icon>mdi-magnify-close</v-icon>
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