<template>
  <v-container>
    <h1 style="text-align: center;">Register</h1>
    <v-col sm="4" offset="4">

      <v-form v-if="!registerFormSubmitted" ref="form">
        <v-text-field
            class="text-field"
            v-model="input.firstName"
            :rules="nameRules"
            :counter="20"
            label="First name"
            clearable
        ></v-text-field>
        <v-text-field
            class="text-field"
            v-model="input.lastName"
            :rules="nameRules"
            :counter="20"
            label="Last name"
            clearable
        ></v-text-field>
        <v-text-field
            class="text-field"
            v-model="input.email"
            :rules="emailRules"
            label="Email"
            clearable
        ></v-text-field>
        <v-text-field
            class="text-field"
            v-model="input.username"
            :rules="usernameRules"
            label="Username"
            clearable
        ></v-text-field>
        <v-text-field
            class="text-field"
            v-model="input.password"
            :rules="passwordRules"
            label="Password"
            counter
            :type="showPass ? 'text' : 'password'"
            :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPass = !showPass"
        ></v-text-field>
        <v-text-field
            class="text-field"
            v-model="input.passwordConf"
            :rules="passwordRules"
            label="Confirm password"
            counter
            :type="showPass2 ? 'text' : 'password'"
            :append-icon="showPass2 ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPass2 = !showPass2"
        ></v-text-field>

        <div style="text-align: center">
          <div v-if="registerFormError != null" style="margin-top: 20px; color: red">
            {{ this.registerFormError}}
          </div>

          <v-btn color="success"
                 elevation="4" large
                 @click="register"
                 style="margin-top: 20px;">
            Create user
          </v-btn>
        </div>
      </v-form>

      <div v-if="registerFormSubmitted" style="text-align: center; margin-top: 20px">
        <h3>Your user was created, you can continue by logging in</h3>
        <v-btn color="success"
               elevation="4" large
               to="/login"
               style="margin-top: 20px;">
          Login
        </v-btn>
      </div>
    </v-col>
  </v-container>
</template>

<script>
  export default {
    name: "Register",

    data() {
      return {
        registerFormSubmitted: false,
        registerFormError: null,
        showPass: false,
        showPass2: false,
        input: {
          firstName: null,
          lastName: null,
          email: null,
          username: null,
          password: null,
          passwordConf: null
        },
        nameRules: [
          v => !!v || 'Name is required',
          v => !!v && v.length <= 20 || 'Name must be less than 20 characters',
        ],
        emailRules: [
          v => !!v || 'E-mail is required',
          v => !!v && /.+@.+/.test(v) || 'E-mail must be valid',
        ],
        usernameRules: [
          v => !!v || 'Username is required'
        ],
        passwordRules: [
          v => !!v || 'Password is required',
          v => !!v && v.length >= 8 || 'Password must be longer than 8 characters',
          v => !!v && !!this.input.password && v === this.input.password || 'Passwords don\'t match'
        ],
      }
    },

    methods: {
      register() {
        if (!this.$refs.form.validate()) {
          return;
        }
        this.$http.post('/api/users', {
          firstName: this.input.firstName,
          lastName: this.input.lastName,
          email: this.input.email,
          password: this.input.password,
          username: this.input.username
        })
            .then(() => this.registerFormSubmitted = true)
            .catch(error => this.registerFormError = error.body.message)
      }
    }
  }
</script>

<style scoped>
  .text-field {
    margin-top: 15px;
  }
</style>