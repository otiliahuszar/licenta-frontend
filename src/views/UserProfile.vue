<template>
  <v-container>
    <h1 style="text-align: center">My Profile</h1>
    <v-row style="margin-top: 30px">
      <v-col sm="2">
        <v-img
            alt="Profile"
            class="shrink mr-2"
            contain
            :src="require('../assets/profile.png')"
            transition="scale-transition"
        ></v-img>
      </v-col>
      <v-col sm="4">
        <div style="padding-top: 20px">
          <b>First name</b>
          <div style="font-size: 18px">
            {{ user.firstName }}
          </div>
        </div>

        <div style="padding-top: 20px">
          <b>Last name</b>
          <div style="font-size: 18px">
            {{ user.lastName }}
          </div>
        </div>

        <div style="padding-top: 20px">
          <b>Username</b>
          <div style="font-size: 18px">
            {{ user.username }}
          </div>
        </div>

        <div style="padding-top: 20px">
          <b>Email</b>
          <div style="font-size: 18px">
            {{ user.email }}
          </div>
        </div>
      </v-col>

      <v-col sm="2">
        <v-img
            alt="Notification"
            class="shrink mr-2"
            contain
            width="70%"
            :src="require('../assets/notification.png')"
            transition="scale-transition"
        ></v-img>
      </v-col>
      <v-col sm="4">
        <div style="padding-top: 20px">
          <b>Receive email notifications before courses</b>
          <div style="font-size: 18px">
            {{ user.receiveEmailNotificationsBeforeCourses }}
          </div>
        </div>

        <div style="padding-top: 20px" v-if="user.receiveEmailNotificationsBeforeCourses">
          <b>Minutes before course to receive notification</b>
          <div style="font-size: 18px">
            {{ user.notificationInterval }} minutes
          </div>
        </div>

        <div style="padding-top: 20px">
          <b>Receive email notifications for course updates</b>
          <div style="font-size: 18px">
            {{ user.receiveEmailNotificationsForUpdates }}
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col sm="5" cols="12"></v-col>
      <v-col sm="2" cols="12">
        <v-btn color="success"
               elevation="4" large
               width="200"
               @click.stop="displayEditDialog()"
               style="margin-top: 20px;">
          Update profile
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col sm="5"></v-col>
      <v-col sm="2">
        <v-btn color="success"
               elevation="4" large
               width="200"
               @click="changePasswordDialog = true"
               style="margin-top: 20px;">
          Change password
        </v-btn>
      </v-col>
    </v-row>
    <v-row style="padding-top: 30px">
      <v-col sm="4"></v-col>
      <v-col sm="4">
        <v-alert v-if="alert" type="success"
                 dense text outlined
                 width="400"
                 style="text-align: center"
                 transition="fade-transition">
          Password changed successfully!
        </v-alert>
      </v-col>
    </v-row>

    <v-dialog
        v-model="editUserDialog"
        persistent
        max-width="500px">
      <v-card>
        <v-card-title class="text-h5">
          Edit user profile
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="editUserForm">
              <v-text-field
                  v-model="editUserInput.firstName"
                  :rules="nameRules"
                  :counter="20"
                  label="First name"
                  clearable
              ></v-text-field>
              <v-text-field
                  v-model="editUserInput.lastName"
                  :rules="nameRules"
                  :counter="20"
                  label="Last name"
                  clearable
              ></v-text-field>
              <v-text-field
                  v-model="editUserInput.username"
                  label="Username"
                  disabled
              ></v-text-field>
              <v-text-field
                  v-model="editUserInput.email"
                  :rules="emailRules"
                  label="Email"
                  clearable
              ></v-text-field>
              <v-checkbox
                  v-model="editUserInput.receiveEmailNotificationsBeforeCourses"
                  label="Receive email notifications before courses"
              ></v-checkbox>
              <v-text-field
                  v-if="editUserInput.receiveEmailNotificationsBeforeCourses"
                  v-model="editUserInput.notificationInterval"
                  type="number"
                  :rules="minuteRules"
                  label="Notification interval"
                  hint="Minutes before the course to receive notifications"
                  persistent-hint
                  clearable
              ></v-text-field>
              <v-checkbox
                  v-model="editUserInput.receiveEmailNotificationsForUpdates"
                  label="Receive email notification for course updates"
              ></v-checkbox>
            </v-form>
            <div v-if="editUserError != null" style="margin-top: 20px; color: red">
              {{ this.editUserError }}
            </div>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" text @click="editUserDialog = false">
            Cancel
          </v-btn>
          <v-btn color="success" text @click="editUser()">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
        v-model="changePasswordDialog"
        persistent
        max-width="500px">
      <v-card>
        <v-card-title class="text-h5">
          Change password
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="changePasswordForm">
              <v-text-field
                  v-model="changePasswordInput.oldPassword"
                  :rules="passwordRules"
                  label="Old password"
                  counter
                  :type="showPass ? 'text' : 'password'"
                  :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPass = !showPass"
              ></v-text-field>
              <v-text-field
                  v-model="changePasswordInput.newPassword"
                  :rules="passwordRules"
                  label="New password"
                  counter
                  :type="showPass2 ? 'text' : 'password'"
                  :append-icon="showPass2 ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPass2 = !showPass2"
              ></v-text-field>
            </v-form>
            <div v-if="changePasswordError != null" style="margin-top: 20px; color: red">
              {{ this.changePasswordError }}
            </div>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" text @click="editUserDialog = false">
            Cancel
          </v-btn>
          <v-btn color="success" text @click="changePassword()">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: "UserProfile",

  data() {
    return {
      alert: false,
      showPass: false,
      showPass2: false,
      user: {},
      editUserInput: {},
      editUserDialog: false,
      editUserError: null,
      changePasswordInput: {},
      changePasswordDialog: false,
      changePasswordError: null,
      nameRules: [
        v => !!v || 'Name is required',
        v => !!v && v.length <= 20 || 'Name must be less than 20 characters',
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => !!v && /.+@.+/.test(v) || 'E-mail must be valid',
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => !!v && v.length >= 8 || 'Password must be longer than 8 characters'
      ],
      minuteRules: [
        v => !!v || 'Number of minutes is required',
        v => !!v && v >= 0 && v <= 120 || 'Number of minutes must be greater than 0 and less than 60'
      ],

    }
  },

  methods: {
    displayEditDialog() {
      this.editUserDialog = true;

      this.editUserInput = {
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        username: this.user.username,
        receiveEmailNotificationsBeforeCourses: this.user.receiveEmailNotificationsBeforeCourses,
        notificationInterval: this.user.receiveEmailNotificationsBeforeCourses ? this.user.notificationInterval : null,
        receiveEmailNotificationsForUpdates: this.user.receiveEmailNotificationsForUpdates
      }
    },

    editUser() {
      if (!this.$refs.editUserForm.validate()) {
        return;
      }
      this.$http.put('/api/users/' + this.user.id, this.editUserInput,
          {
            headers: {
              'Authorization': localStorage.getItem('token')
            }
          })
          .then(() => this.$router.go(0))
          .catch(error => this.editUserError = error.body.message)
    },

    changePassword() {
      if (!this.$refs.changePasswordForm.validate()) {
        return;
      }
      this.$http.put('/api/users/' + this.user.id + "/password", this.changePasswordInput,
          {
            headers: {
              'Authorization': localStorage.getItem('token')
            }
          })
          .then(() => {
            this.changePasswordDialog = false;
            this.alert = true;
            this.hideAlert();
            this.changePasswordInput = {};
          })
          .catch(error => this.changePasswordError = error.body.message)
    },

    getUser() {
      this.$http.get('/api/users/' + JSON.parse(localStorage.getItem('user')).id,
          {
            headers: {
              'Authorization': localStorage.getItem('token')
            }
          })
          .then(response => this.user = response.data);
    },

    hideAlert() {
      window.setInterval(() => {
        this.alert = false;
      }, 5000)
    },
  },

  beforeMount() {
    this.editUserInput = {}
    this.getUser();
  }
}
</script>

<style scoped>

</style>