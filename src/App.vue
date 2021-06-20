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
    </v-app-bar>

    <v-navigation-drawer
        v-if="isLoggedIn()"
        style="padding-top: 70px"
        absolute
        permanent
        expand-on-hover
        right width="230" class="fill-height">
      <v-list nav dense>

        <v-list-item>
          <v-list-item-avatar>
            <v-avatar color="success" size="30">
              <div style="color: white; font-weight: bold">
                {{ getUser().firstName.substring(0, 1) }}
              </div>
            </v-avatar>
          </v-list-item-avatar>
          <v-list-item-title>{{ getUser().firstName }} {{ getUser().lastName }}</v-list-item-title>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item link to="/timetable" v-if="!isAdmin()">
          <v-list-item-icon>
            <v-icon>mdi-calendar-month</v-icon>
          </v-list-item-icon>
          <v-list-item-title>My Timetable</v-list-item-title>
        </v-list-item>

        <v-list-item link to="/timetable/admin" v-if="isAdmin()">
          <v-list-item-icon>
            <v-icon>mdi-calendar-month</v-icon>
          </v-list-item-icon>
          <v-list-item-title>My Timetable</v-list-item-title>
        </v-list-item>

        <v-list-item link to="/courses/public" v-if="shouldDisplayPublicCourses()">
          <v-list-item-icon>
            <v-icon>mdi-school-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Public Courses</v-list-item-title>
        </v-list-item>

        <v-list-item link to="/profile">
          <v-list-item-icon>
            <v-icon>mdi-card-account-details-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>My Profile</v-list-item-title>
        </v-list-item>

        <v-list-item link @click="logout">
          <v-list-item-icon>
            <v-icon>mdi-account-remove</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>

      </v-list>
    </v-navigation-drawer>

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
    isLoggedIn() {
      return localStorage.getItem('token') !== null;
    },
    logout() {
      localStorage.clear();
      this.$router.push("/");
    },
    getUser() {
      return JSON.parse(localStorage.getItem('user'));
    },
    shouldDisplayPublicCourses() {
      return this.getUser().role === 'STUDENT' || this.getUser().role === 'EXTERNAL_USER';
    },
    isAdmin() {
      return this.getUser().role === 'ADMIN';
    }
  }
};
</script>