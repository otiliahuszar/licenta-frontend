<template>
  <v-container>
    <h1 style="text-align: center;">My Timetable</h1>
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
                      style="padding-right: 20px; max-width: 240px"
                      @change="searchCourses"
            ></v-select>
            <v-select v-model="input.isPublic"
                      v-if="this.userRole !== 'EXTERNAL_USER'"
                      :items="dropdowns.isPublic"
                      label="Is Public"
                      return-object single-line
                      style="padding-right: 20px; max-width: 240px"
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

        <v-alert v-if="alert" type="success"
                 dense text outlined
                 transition="fade-transition">
          {{ this.alertText }}
        </v-alert>
        <v-sheet height="600">
          <v-calendar
              ref="calendar"
              v-model="calendar.focus"
              color="success"
              :events="timetable"
              :type="calendar.type"
              :weekdays="calendar.weekday"
              :event-overlap-mode="calendar.mode"
              @click:event="displayCourse"
              @click:more="viewDay"
              @click:date="viewDay"
              @change="searchCalendarCourses"
          ></v-calendar>
          <v-menu
              v-model="viewCourse.selectedOpen"
              :close-on-content-click="false"
              :activator="viewCourse.selectedCourse"
              max-width="800"
              offset-y>
            <v-card
                color="grey lighten-4"
                min-width="350px">
              <v-toolbar :color="viewCourse.selectedEvent.color" height="50">
                <v-toolbar-title
                    v-html="viewCourse.selectedEvent.name"
                    style="color: white; font-size: 16px; font-weight: bold"
                ></v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon v-if="isTeacher()" @click.stop="displayEditDialog()">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon v-if="isTeacher()" @click.stop="viewCourse.editMultipleDialog = true">
                  <v-icon>mdi-pencil-plus</v-icon>
                </v-btn>
              </v-toolbar>
              <v-card-text>
                <div v-if="viewCourse.selectedEvent.specialization">
                  <b>Specialization: </b>{{ viewCourse.selectedEvent.specialization.name }}
                  ({{ viewCourse.selectedEvent.specialization.internalId }})
                </div>
                <div v-if="viewCourse.selectedEvent.subject">
                  <b>Subject: </b>{{ viewCourse.selectedEvent.subject.name }}
                  ({{ viewCourse.selectedEvent.subject.internalId }})
                </div>
                <div v-if="viewCourse.selectedEvent.teacher && isStudent()">
                  <b>Teacher: </b>{{ viewCourse.selectedEvent.teacher.name }}
                  ({{ viewCourse.selectedEvent.teacher.internalId }})
                </div>
                <div v-if="viewCourse.selectedEvent.date">
                  <b>Date: </b>{{ viewCourse.selectedEvent.date }}
                  ({{ viewCourse.selectedEvent.startHour }}-{{ viewCourse.selectedEvent.endHour }})
                </div>
                <hr style="margin-top: 5px; margin-bottom: 5px"/>
                <div v-if="viewCourse.selectedEvent.title !== null">
                  <b>Title: </b>{{ viewCourse.selectedEvent.title }}
                </div>
                <div v-if="viewCourse.selectedEvent.description !== null">
                  <b>Description: </b>
                </div>
                <div class="scroll" style="max-height: 100px"
                     v-if="viewCourse.selectedEvent.description !== null">
                  {{ viewCourse.selectedEvent.description }}
                </div>
                <div v-if="viewCourse.selectedEvent.location !== null">
                  <b>Location: </b>{{ viewCourse.selectedEvent.location }}
                </div>
                <div v-if="viewCourse.selectedEvent.resources !== null">
                  <b>Resources: </b>{{ viewCourse.selectedEvent.resources }}
                </div>
                <div>
                  <b>Public: </b>{{ viewCourse.selectedEvent.isPublic }}
                </div>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text color="secondary"
                       @click="viewCourse.selectedOpen = false">
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>

          <v-dialog
              v-model="viewCourse.editDialog"
              persistent
              max-width="600px">
            <v-card>
              <v-card-title class="text-h5">
                Edit course
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-form ref="editCourseForm">
                    <v-text-field
                        v-if="viewCourse.selectedEvent.specialization !== undefined"
                        v-model="viewCourse.selectedEvent.specialization.name"
                        label="Specialization"
                        disabled dense
                    ></v-text-field>
                    <v-text-field
                        v-if="viewCourse.selectedEvent.subject !== undefined"
                        v-model="viewCourse.selectedEvent.subject.name"
                        label="Subject"
                        disabled dense
                    ></v-text-field>
                    <v-text-field
                        v-if="viewCourse.selectedEvent.fullDate !== null"
                        v-model="viewCourse.selectedEvent.fullDate"
                        label="Course date and time"
                        disabled dense
                    ></v-text-field>
                    <v-checkbox
                        v-model="editCourseInput.isPublic"
                        label="Is the Course Public?"
                    ></v-checkbox>
                    <v-text-field
                        prepend-icon="mdi-signature-text"
                        v-model="editCourseInput.title"
                        label="Title"
                        clearable
                        counter="200"
                        :rules="titleRules"
                    ></v-text-field>
                    <v-textarea
                        prepend-icon="mdi-text-box"
                        v-model="editCourseInput.description"
                        label="Description"
                        clearable
                        style="margin-top: 25px"
                        height="100"
                    ></v-textarea>
                    <v-text-field
                        prepend-icon="mdi-map-marker-radius"
                        v-model="editCourseInput.location"
                        label="Location"
                        clearable
                        counter="500"
                        :rules="locationRules"
                        hint="Physical Room or Videoconference Link"
                    ></v-text-field>
                    <v-text-field
                        prepend-icon="mdi-folder-multiple"
                        v-model="editCourseInput.resources"
                        label="Resources"
                        clearable
                        counter="500"
                        :rules="resourcesRules"
                        style="margin-top: 10px"
                    ></v-text-field>
                  </v-form>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="success" text @click="viewCourse.editDialog = false">
                  Cancel
                </v-btn>
                <v-btn color="success" text @click="editCourse()">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog
              v-model="viewCourse.editMultipleDialog"
              persistent
              max-width="600px">
            <v-card>
              <v-card-title class="text-h5">
                Edit multiple courses
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-form ref="editMultipleCourseForm">
                    <v-text-field
                        v-if="viewCourse.selectedEvent.specialization !== undefined"
                        v-model="viewCourse.selectedEvent.specialization.name"
                        label="Specialization"
                        disabled dense
                    ></v-text-field>
                    <v-text-field
                        v-if="viewCourse.selectedEvent.subject !== undefined"
                        v-model="viewCourse.selectedEvent.subject.name"
                        label="Subject"
                        disabled dense
                    ></v-text-field>
                    <v-checkbox
                        v-model="editMultipleCourseInput.allFromSpecialization"
                        label="Edit all your courses from the same specialization"
                        dense
                    ></v-checkbox>
                    <v-checkbox
                        v-model="editMultipleCourseInput.allFromSubject"
                        label="Edit all your courses from the same subject"
                        dense
                    ></v-checkbox>
                    <v-checkbox
                        v-model="editMultipleCourseInput.editIsPublic"
                        label="Edit public property"
                        dense
                    ></v-checkbox>
                    <v-checkbox
                        v-if="editMultipleCourseInput.editIsPublic"
                        v-model="editMultipleCourseInput.isPublic"
                        label="Are courses public?"
                        dense
                    ></v-checkbox>
                    <v-checkbox
                        v-model="editMultipleCourseInput.editTitle"
                        label="Edit titles"
                        dense
                    ></v-checkbox>
                    <v-text-field
                        prepend-icon="mdi-signature-text"
                        v-if="editMultipleCourseInput.editTitle"
                        v-model="editMultipleCourseInput.title"
                        label="Title"
                        clearable
                        counter="200"
                        :rules="titleRules"
                    ></v-text-field>
                    <v-checkbox
                        v-model="editMultipleCourseInput.editDescription"
                        label="Edit descriptions"
                        dense
                    ></v-checkbox>
                    <v-textarea
                        prepend-icon="mdi-text-box"
                        v-if="editMultipleCourseInput.editDescription"
                        v-model="editMultipleCourseInput.description"
                        label="Description"
                        clearable
                        style="margin-top: 25px"
                        height="100"
                    ></v-textarea>
                    <v-checkbox
                        v-model="editMultipleCourseInput.editLocation"
                        label="Edit locations"
                        dense
                    ></v-checkbox>
                    <v-text-field
                        prepend-icon="mdi-map-marker-radius"
                        v-if="editMultipleCourseInput.editLocation"
                        v-model="editMultipleCourseInput.location"
                        label="Location"
                        clearable
                        counter="500"
                        :rules="locationRules"
                        hint="Physical Room or Videoconference Link"
                    ></v-text-field>
                    <v-checkbox
                        v-model="editMultipleCourseInput.editResources"
                        label="Edit resources"
                        dense
                    ></v-checkbox>
                    <v-text-field
                        prepend-icon="mdi-folder-multiple"
                        v-if="editMultipleCourseInput.editResources"
                        v-model="editMultipleCourseInput.resources"
                        label="Resources"
                        clearable
                        counter="500"
                        :rules="resourcesRules"
                        style="margin-top: 10px"
                    ></v-text-field>
                  </v-form>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="success" text @click="viewCourse.editMultipleDialog = false">
                  Cancel
                </v-btn>
                <v-btn color="success" text @click="editMultipleCourses()">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

        </v-sheet>
        <v-overlay :value="viewCourse.selectedOpen"></v-overlay>
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
        end: null,
        isPublic: null
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
        teachers: [],
        isPublic: ['Yes', 'No']
      },
      userRole: null,
      viewCourse: {
        selectedCourse: null,
        selectedEvent: {},
        selectedOpen: false,
        editDialog: false,
        editMultipleDialog: false
      },
      editCourseInput: {},
      titleRules: [
        v => !!v || 'Title is required',
        v => !!v && v.length <= 200 || 'Title must be less than 200 characters',
      ],
      locationRules: [
        v => !!v || 'Location is required',
        v => !!v && v.length <= 500 || 'Location must be less than 500 characters'
      ],
      resourcesRules: [
        v => !!v || 'Resources are required',
        v => !!v && v.length <= 500 || 'Resources must be less than 500 characters'
      ],
      editMultipleCourseInput: {
        allFromSubject: false,
        allFromSpecialization: false,
        editTitle: false,
        editDescription: false,
        editLocation: false,
        editResources: false,
        editIsPublic: false
      },
      alert: false,
      alertText: null
    }
  },

  methods: {
    searchCalendarCourses({start, end}) {
      this.input.start = start.date;
      this.input.end = end.date;
      this.searchCourses();
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
              isPublic: this.input.isPublic
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
      this.input.isPublic = null;
      this.alert = false;
    },

    isTeacher() {
      return this.userRole === 'TEACHER';
    },

    isStudent() {
      return this.userRole === 'STUDENT' || this.userRole === 'EXTERNAL_USER';
    },

    clearDropdownsAndSearch() {
      this.clearDropdowns();
      this.searchCourses();
    },

    displayCourse({nativeEvent, event}) {
      const open = () => {
        this.viewCourse.selectedEvent = event;
        this.viewCourse.selectedEvent.fullDate = this.getFullDate(event);
        this.viewCourse.selectedCourse = nativeEvent.target;
        requestAnimationFrame(() =>
            requestAnimationFrame(() => this.viewCourse.selectedOpen = true))
      }

      if (this.viewCourse.selectedOpen) {
        this.viewCourse.selectedOpen = false
        requestAnimationFrame(() =>
            requestAnimationFrame(() => open()))
      } else {
        open()
      }
      nativeEvent.stopPropagation()
    },

    displayEditDialog() {
      this.viewCourse.editDialog = true;

      let course = this.viewCourse.selectedEvent;
      this.editCourseInput = {
        date: course.date,
        startHour: course.startHour,
        endHour: course.endHour,
        title: course.title,
        description: course.description,
        location: course.location,
        resources: course.resources,
        isPublic: course.isPublic
      }
    },

    getFullDate(course) {
      return course.date + ' (' + course.startHour + ':00 - ' + course.endHour + ':00)';
    },

    editCourse() {
      if (!this.$refs.editCourseForm.validate()) {
        return;
      }
      let courseId = this.viewCourse.selectedEvent.id;
      this.$http.put('/api/courses/' + courseId, this.editCourseInput,
          {
            headers: {
              'Authorization': localStorage.getItem('token')
            }
          })
          .then(() => {
            this.alert = true;
            this.hideAlert();
            this.alertText = 'Successfully updated the course';
            this.viewCourse.editDialog = false;
            this.updateCurrentCourse(this.editCourseInput)
          });
    },

    editMultipleCourses() {
      if (!this.$refs.editMultipleCourseForm.validate()) {
        return;
      }
      let courseId = this.viewCourse.selectedEvent.id;
      this.$http.put('/api/courses/' + courseId + '/multiple', this.editMultipleCourseInput,
          {
            headers: {
              'Authorization': localStorage.getItem('token')
            }
          })
          .then(response => {
            this.searchCourses();
            this.alert = true;
            this.hideAlert();
            this.alertText = 'Successfully updated ' + response.data + ' course(s)';
            this.viewCourse.editMultipleDialog = false;
            this.updateCurrentCourse(this.editMultipleCourseInput);
            this.resetEditMultipleCourseInput();
          });
    },

    resetEditMultipleCourseInput() {
      this.editMultipleCourseInput = {
        allFromSubject: false,
        allFromSpecialization: false,
        editTitle: false,
        editDescription: false,
        editLocation: false,
        editResources: false,
        editIsPublic: false
      }
    },

    updateCurrentCourse(c) {
      let course = this.viewCourse.selectedEvent;
      course.title = c.title;
      course.description = c.description;
      course.location = c.location;
      course.resources = c.resources;
      course.isPublic = c.isPublic;
    },

    hideAlert() {
      window.setInterval(() => {
        this.alert = false;
      }, 5000)
    }
  },

  beforeMount() {
    this.editCourseInput = {};
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
div.scroll {
  overflow-x: hidden;
  overflow-y: auto;
  text-align: justify;
}
</style>