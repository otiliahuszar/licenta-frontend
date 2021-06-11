<template>
  <v-container>
    <h1 style="text-align: center;">Login</h1>
    <v-col sm="4" offset="4">
      <v-form v-model="loginForm">
        <v-text-field
            v-model="firstName"
            :rules="nameRules"
            :counter="10"
            label="First name"
            required
        ></v-text-field>
      </v-form>
    </v-col>
  </v-container>
</template>

<script>
  export default {
    name: "Login",
    data() {
      return {}
    },
    methods: {}
  }
</script>

<style scoped>

</style>