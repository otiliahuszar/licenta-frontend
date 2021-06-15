<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container>
    <h1 style="text-align: center;">Timetable Management</h1>
    <v-row style="margin-top: 20px">

      <v-col sm="4" cols="12" style="padding-right: 30px">
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

          <div v-if="createTimetableError !== null"
               style="margin-top: 40px; color: red">
            Fix the following error(s) and retry: <br/><br/>
            {{ this.createTimetableError }}
            <ul v-if="this.csvErrors !== []">
              <li v-for="error in csvErrors" :key="error">
                {{ error }}
              </li>
            </ul>
          </div>
        </v-form>
        <div v-if="createTimetableError === null" style="text-align: center">
          <br/>
          <v-img
              alt="Logo"
              class="shrink mr-2"
              contain
              :src="require('../assets/logo.png')"
              transition="scale-transition"
              style="height: 200px"
          ></v-img>
        </div>
      </v-col>

      <v-col sm="8" cols="12">
        <div v-if="this.initialSearchIsEmpty"
             style="text-align: center; font-size: 26px; padding-top: 80px">
          No courses exist for your institution!<br/>Create some using the form on the left.
        </div>

        <div v-if="!this.initialSearchIsEmpty">
          <v-row class="fill-height">
            <v-col>
              <v-sheet height="64">
                <v-toolbar flat>
                  <v-btn outlined class="mr-4" color="grey darken-2"
                         @click="calendar.focus = ''">
                    Today
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn fab text small color="grey darken-2"
                         @click="$refs.calendar.prev()">
                    <v-icon>
                      mdi-chevron-left
                    </v-icon>
                  </v-btn>
                  <v-toolbar-title v-if="$refs.calendar">
                    {{ $refs.calendar.title }}
                  </v-toolbar-title>
                  <v-btn fab text small color="grey darken-2"
                         @click="$refs.calendar.next()">
                    <v-icon>
                      mdi-chevron-right
                    </v-icon>
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-menu bottom right>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn outlined color="grey darken-2"
                             v-bind="attrs" v-on="on">
                        <span>{{ calendar.type }}</span>
                        <v-icon right>mdi-menu-down</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item @click="calendar.type = 'day'">
                        <v-list-item-title>Day</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="calendar.type = 'week'">
                        <v-list-item-title>Week</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="calendar.type = 'month'">
                        <v-list-item-title>Month</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-toolbar>
              </v-sheet>

              <v-sheet height="64">
                <v-toolbar flat>
                  <v-select v-model="input.specialization"
                            :items="dropdowns.specializations"
                            item-value="id" item-text="name"
                            label="Specialization"
                            return-object single-line
                            style="padding-right: 20px; max-width: 240px"
                            @change="searchCourses"
                  ></v-select>
                  <v-select v-model="input.subject"
                            :items="dropdowns.subjects"
                            item-value="id" item-text="name"
                            label="Subject"
                            return-object single-line
                            style="padding-right: 20px; max-width: 240px"
                            @change="searchCourses"
                  ></v-select>
                  <v-select v-model="input.teacher"
                            :items="dropdowns.teachers"
                            item-value="id" item-text="name"
                            label="Teacher"
                            return-object single-line
                            style="max-width: 240px"
                            @change="searchCourses"
                  ></v-select>
                  <v-btn text small color="grey darken-2"
                         @click="clearDropdownsAndSearch()">
                    <v-icon>
                      mdi-close
                    </v-icon>
                  </v-btn>
                </v-toolbar>
              </v-sheet>

              <v-sheet height="600">
                <v-calendar
                    ref="calendar"
                    v-model="calendar.focus"
                    color="success"
                    :events="timetable"
                    :type="calendar.type"
                    :weekdays="calendar.weekday"
                    :event-overlap-mode="calendar.mode"
                    @click:more="viewDay"
                    @click:date="viewDay"
                    @change="searchCalendarCourses"
                ></v-calendar>
              </v-sheet>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
export default {
  name: "TimetableManagement",

  data() {
    return {
      initialSearchIsEmpty: null,
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
      startDateMenu: false,
      endDateMenu: false,
      input: {
        semesterStart: null,
        semesterEnd: null,
        timetableFile: null,
        specialization: {id: null, name: null},
        subject: {id: null, name: null},
        teacher: {id: null, name: null},
        start: null,
        end: null
      },
      start: '2021-06-01T00:00:00',
      end: '2021-06-30T23:59:59',
      createTimetableError: null,
      csvErrors: [],
      timetable: [],
      calendar: {
        weekday: [1, 2, 3, 4, 5, 6, 0],
        type: 'month',
        mode: 'column',
        focus: '',
        colorMappings: {},
        otherColors: ['grey', 'blue-grey', 'brown', 'pink', 'indigo', 'purple', 'deep-purple', 'light-blue',
          'cyan', 'green', 'lime', 'yellow', 'amber', 'light-green', 'orange', 'teal', 'red', 'blue darken-3',
          'blue lighten-2', 'cyan lighten-1']
      },
      dropdowns: {
        specializations: [],
        subjects: [],
        teachers: []
      }
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
          .then(() => {
            this.createTimetableError = null;
            this.csvErrors = [];
            this.$router.go(0);
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

    searchCalendarCourses({start, end}) {
      this.input.start = new Date(`${start.date}T00:00:00`);
      this.input.end = new Date(`${end.date}T23:59:59`);
      this.searchCourses()
    },

    searchCourses() {
      this.$http.get('/api/courses',
          {
            params: {
              specializationId: this.input.specialization.id,
              subjectId: this.input.subject.id,
              teacherId: this.input.teacher.id,
              start: this.input.start,
              end: this.input.end,
            },
            headers: {
              'Authorization': localStorage.getItem('token')
            }
          })
          .then(response => {
            this.timetable = [];
            let t = response.data;
            for (let i = 0; i < t.length; i++) {
              let course = t[i];
              course["name"] = course.specialization.internalId + ' - ' + course.subject.internalId + ', ' + course.teacher.name;
              course["start"] = course.date + ' ' + course.startHour + ':00';
              course["end"] = course.date + ' ' + course.endHour + ':00';
              course["color"] = this.getColor(course.specialization.internalId);
              this.timetable.push(course);
            }
            if (this.initialSearchIsEmpty === null) {
              this.initialSearchIsEmpty = (this.timetable.length === 0);
            }
          })
    },

    getColor(spec) {
      let mapping = this.calendar.colorMappings[spec];

      if (mapping !== null && mapping !== undefined) {
        return mapping;
      }
      let color = this.calendar.otherColors.pop();
      this.calendar.colorMappings[spec] = color;
      return color;
    },

    viewDay({date}) {
      this.calendar.focus = date
      this.calendar.type = 'day'
    },

    getSpecializations() {
      this.$http.get('/api/common/specializations',
          {
            headers: {
              'Authorization': localStorage.getItem('token')
            }
          })
          .then(response => this.dropdowns.specializations = response.data)
    },

    getSubjects() {
      this.$http.get('/api/common/subjects',
          {
            headers: {
              'Authorization': localStorage.getItem('token')
            }
          })
          .then(response => this.dropdowns.subjects = response.data)
    },

    getTeachers() {
      this.$http.get('/api/common/teachers',
          {
            headers: {
              'Authorization': localStorage.getItem('token')
            }
          })
          .then(response => this.dropdowns.teachers = response.data)
    },

    clearDropdownsAndSearch() {
      this.clearDropdowns();
      this.searchCourses();
    },

    clearDropdowns() {
      this.input.specialization = {id: null, name: null};
      this.input.subject = {id: null, name: null};
      this.input.teacher = {id: null, name: null};
    }
  },

  beforeMount() {
    this.clearDropdowns();
    this.searchCalendarCourses({
      start: this.start,
      end: this.end
    });
    this.getSpecializations();
    this.getSubjects();
    this.getTeachers();
  }
}
</script>

<style scoped>

</style>