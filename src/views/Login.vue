<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container>
    <h1 style="text-align: center;">Login</h1>
    <v-col sm="4" offset="4">

      <v-form ref="form">
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
            label="Password"
            :type="showPass ? 'text' : 'password'"
            :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPass = !showPass"
        ></v-text-field>

        <div style="text-align: center">
          <div v-if="loginFormError != null" style="margin-top: 20px; color: red">
            Invalid credentials, try again
          </div>

          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="success"
                     elevation="4" large
                     @click="ldapLogin"
                     style="margin-top: 20px; width: 230px;"
                     v-bind="attrs"
                     v-on="on">
                Log in using LDAP
              </v-btn>
            </template>
            <span>Use this option if you had an account <br/>created by your institution</span>
          </v-tooltip>

          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="success"
                     elevation="4" large
                     @click="dbLogin"
                     style="margin-top: 20px; width: 230px;"
                     v-bind="attrs"
                     v-on="on">
                Log in as External User
              </v-btn>
            </template>
            <span>Use this option if you created the <br/>account by yourself</span>
          </v-tooltip>
        </div>
      </v-form>
    </v-col>
  </v-container>
</template>

<script>
  export default {
    name: "Login",
    data() {
      return {
        loginFormError: null,
        showPass: false,
        input: {
          username: null,
          password: null
        }
      }
    },
    methods: {
      dbLogin() {
        this.login('/api/auth/login')
      },
      ldapLogin() {
        this.login('/api/auth/login/ldap')
      },

      login(path) {
        if (!this.$refs.form.validate()) {
          return;
        }
        this.$http.post(path, {
          username: this.input.username,
          password: this.input.password
        })
            .then(response => {
              localStorage.setItem('token', response.data.token);
              localStorage.setItem('user', JSON.stringify(response.data.user))
            })
            .then(() => this.$router.push('/timetable/admin'))
            .catch(error => this.loginFormError = error.body.message)
      }
    }
  }
</script>

<style scoped>

</style>