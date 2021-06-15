<template>
  <v-container>
    <h1 style="text-align: center;">Timetable</h1>
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
                      v-if="isTeacher()"
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
                      v-if="isStudent()"
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
  </v-container>
</template>

<script>
export default {
  name: "Timetable",

  data() {
    return {
      input: {
        specialization: {id: null, name: null},
        subject: {id: null, name: null},
        teacher: {id: null, name: null},
        start: null,
        end: null
      },
      start: '2021-06-01T00:00:00',
      end: '2021-06-30T23:59:59',
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
      },
      userRole: null
    }
  },

  methods: {
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
              if (this.isTeacher()) {
                this.timetable.push(this.buildCourseForTeacher(course));
              } else {
                this.timetable.push(this.buildCourseForStudent(course));
              }
            }
          })
    },

    buildCourseForTeacher(course) {
      course["name"] = course.specialization.internalId + ' - ' + course.subject.internalId;
      course["start"] = course.date + ' ' + course.startHour + ':00';
      course["end"] = course.date + ' ' + course.endHour + ':00';
      course["color"] = this.getColor(course.subject.internalId);
      return course;
    },

    buildCourseForStudent(course) {
      course["name"] = course.subject.internalId + ' - ' + course.teacher.name;
      course["start"] = course.date + ' ' + course.startHour + ':00';
      course["end"] = course.date + ' ' + course.endHour + ':00';
      course["color"] = this.getColor(course.subject.internalId);
      return course;
    },

    getColor(subj) {
      let mapping = this.calendar.colorMappings[subj];

      if (mapping !== null && mapping !== undefined) {
        return mapping;
      }
      let color = this.calendar.otherColors.pop();
      this.calendar.colorMappings[subj] = color;
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

    clearDropdowns() {
      this.input.specialization = {id: null, name: null};
      this.input.subject = {id: null, name: null};
      this.input.teacher = {id: null, name: null};
    },

    isTeacher() {
      return this.userRole === 'TEACHER';
    },

    isStudent() {
      return this.userRole === 'STUDENT';
    },

    clearDropdownsAndSearch() {
      this.clearDropdowns();
      this.searchCourses();
    },
  },

  beforeMount() {
    this.userRole = JSON.parse(localStorage.getItem('user')).role;
    this.clearDropdowns();
    this.searchCalendarCourses({
      start: this.start,
      end: this.end
    });
    this.getSubjects();

    if (this.isStudent()) this.getTeachers();
    if (this.isTeacher()) this.getSpecializations();
  }
}
</script>

<style scoped>

</style>