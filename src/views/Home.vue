<template>
  <v-container>
    <v-row style="padding-top: 50px">
      <v-col sm="7" cols="12">
        <v-img
            alt="Home"
            class="shrink mr-2"
            contain
            :src="require('../assets/home.png')"
            transition="scale-transition"
        ></v-img>
      </v-col>
      <v-col sm="5" cols="12" style="margin-top: 200px">
        <h1>Welcome!</h1>
        <br/>
        <h4>If you are a member of an educational institution, please log in using the credentials provided
          by your institution.</h4>
        <br/>
        <h4>If you are an external user, please create an account (if you don't already have one)
          and log in using the credentials you picked.</h4>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Home"
}
</script>

<style scoped>

</style>