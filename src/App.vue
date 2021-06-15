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
             to="/login"
             v-if="!isLoggedIn()">
        <v-icon>mdi-account-key</v-icon>
        Login
      </v-btn>

      <v-btn color="white"
             elevation="4"
             depressed small
             style="margin-left: 20px;"
             to="/register"
             v-if="!isLoggedIn()">
        <v-icon>mdi-account-plus</v-icon>
        Register
      </v-btn>

      <div v-if="isLoggedIn()"
      style="font-size: 14px; font-style: italic">
        Hello, {{ this.getUserName() }}
      </div>

      <v-btn color="white"
             elevation="4"
             depressed small
             style="margin-left: 20px;"
             @click="logout()"
             v-if="isLoggedIn()">
        <v-icon>mdi-account-remove</v-icon>
        Logout
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

  data() {
    return {}
  },

  methods: {
    logout() {
      localStorage.clear();
      this.$router.push("/");
    },
    isLoggedIn() {
      return localStorage.getItem('token') !== null;
    },
    getUserName() {
      let user = localStorage.getItem('user');
      if (user === null) {
        return null;
      }
      return JSON.parse(user).firstName;
    }
  }
};
</script>