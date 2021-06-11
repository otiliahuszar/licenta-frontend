<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container>
    <h1 style="text-align: center;">Timetable Management</h1>
    <v-row style="margin-top: 20px">

      <v-col sm="4" style="padding-right: 30px">
        <h3>Create timetable:</h3>
        <v-form ref="form">
          <v-menu ref="startMenu" v-model="startDateMenu"
                  :close-on-content-click="true"
                  transition="scale-transition"
                  offset-y min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="input.semesterStart"
                            label="Semester start date"
                            prepend-icon="mdi-calendar"
                            readonly clearable
                            v-bind="attrs" v-on="on"
                            :rules="startDateRules"
                            :close-on-content-click="true"
                            style="margin-top: 15px"
              ></v-text-field>
            </template>
            <v-date-picker v-model="input.semesterStart" color="success" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="success"
                     @click="startDateMenu = false">
                Cancel
              </v-btn>
            </v-date-picker>
          </v-menu>

          <v-menu ref="endMenu" v-model="endDateMenu"
                  :close-on-content-click="true"
                  transition="scale-transition"
                  offset-y min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="input.semesterEnd"
                            label="Semester end date"
                            prepend-icon="mdi-calendar"
                            readonly clearable
                            v-bind="attrs" v-on="on"
                            :rules="endDateRules"
                            style="margin-top: 15px"
              ></v-text-field>
            </template>
            <v-date-picker v-model="input.semesterEnd" color="success" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="success"
                     @click="endDateMenu = false">
                Cancel
              </v-btn>
            </v-date-picker>
          </v-menu>

          <v-file-input
              show-size
              v-model="input.timetableFile"
              :rules="fileRules"
              truncate-length="30"
              label="Timetable in CSV format"
              style="margin-top: 15px"
          ></v-file-input>

          <div style="text-align: center">
            <v-btn color="success"
                   elevation="4" large
                   @click="createTimetable"
                   style="margin-top: 20px;">
              Create timetable
            </v-btn>
          </div>

          <div v-if="this.createTimetableError !== null"
               style="margin-top: 40px; color: red">
            Fix the following error(s) and retry: <br/><br/>
            {{ this.createTimetableError}}
            <ul v-if="this.csvErrors !== []">
              <li v-for="error in csvErrors" :key="error">
                {{ error }}
              </li>
            </ul>
          </div>
        </v-form>
      </v-col>

      <v-col sm="8" style="border: 1pt solid red;">
        #TODO insert timetable view<br/>
        {{this.timetable}}
      </v-col>

    </v-row>

  </v-container>
</template>

<script>
  export default {
    name: "TimetableManagement",

    data() {
      return {
        startDateRules: [
          v => !!v || 'Date is required',
          v => !!v && (v > new Date().toISOString().substr(0, 10)) || 'Date must be in the future'
        ],
        endDateRules: [
          v => !!v || 'Date is required',
          v => !!v && (v > new Date().toISOString().substr(0, 10)) || 'Date must be in the future',
          v => !!v && !!this.input.semesterStart && (v > this.input.semesterStart) || 'Start date must be before end date'
        ],
        fileRules: [
          v => !!v || 'File is required',
        ],
        input: {
          semesterStart: null,
          semesterEnd: null,
          timetableFile: null
        },
        startDateMenu: false,
        endDateMenu: false,
        timetable: null,
        createTimetableError: null,
        csvErrors: []
      }
    },

    methods: {
      createTimetable() {
        if (!this.$refs.form.validate()) {
          return;
        }
        this.readFile(this.input.timetableFile)
            .then(file => this.$http.post('/api/timetable', file,
                {
                  params: {
                    semesterStart: this.input.semesterStart,
                    semesterEnd: this.input.semesterEnd
                  },
                  headers: {
                    'Authorization': localStorage.getItem('token')
                  }
                }))
            .then(response => {
              this.timetable = response.data;
              this.createTimetableError = null;
              this.csvErrors = [];
            })
            .catch(error => {
              this.createTimetableError = error.body.message;
              this.csvErrors = error.body.errors;
            })
      },
      readFile(file) {
        return new Promise((resolve, reject) => {
          let fr = new FileReader();
          fr.readAsArrayBuffer(file);

          fr.onloadend = event => {
            let arrayBuffer = event.target.result;
            let base64String = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
            resolve(base64String);
          };
          fr.onerror = reject;
        })
      },
    }
  }
</script>

<style scoped>

</style>