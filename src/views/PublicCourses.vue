<template>
  <v-container>
    <h1 style="text-align: center">Public Courses</h1>
    <br/>
    <v-sheet height="64">
      <v-toolbar flat>
        <v-select v-model="input.institution"
                  :items="dropdowns.institutions"
                  :hint="input.institution.name"
                  persistent-hint
                  item-value="id" item-text="internalId"
                  label="Institution"
                  return-object single-line
                  style="padding-right: 20px; max-width: 240px"
                  @change="searchForInstitution()"
        ></v-select>
        <v-text-field v-model="input.title"
                      label="Title"
                      return-object single-line
                      style="padding-right: 20px; max-width: 240px"
                      @blur="searchPublicCourses()"
        ></v-text-field>
        <v-text-field v-model="input.description"
                      label="Description"
                      return-object single-line
                      style="padding-right: 20px; max-width: 240px"
                      @blur="searchPublicCourses()"
        ></v-text-field>
        <v-btn text small color="grey darken-2"
               @click="clearDropdownsAndSearch()">
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </v-toolbar>
    </v-sheet>
    <br/>
    <v-sheet height="64">
      <v-toolbar flat>
        <v-select v-if="Object.keys(input.institution).length !== 0"
                  v-model="input.specialization"
                  :items="dropdowns.specializations"
                  :hint="input.specialization.name"
                  persistent-hint
                  item-value="id" item-text="internalId"
                  label="Specialization"
                  return-object single-line
                  style="padding-right: 20px; max-width: 240px"
                  @change="searchPublicCourses()"
        ></v-select>
        <v-select v-if="Object.keys(input.institution).length !== 0"
                  v-model="input.subject"
                  :items="dropdowns.subjects"
                  persistent-hint
                  item-value="id" item-text="name"
                  label="Subject"
                  return-object single-line
                  style="padding-right: 20px; max-width: 240px"
                  @change="searchPublicCourses()"
        ></v-select>
        <v-select v-if="Object.keys(input.institution).length !== 0"
                  v-model="input.teacher"
                  :items="dropdowns.teachers"
                  item-value="id" item-text="name"
                  label="Teacher"
                  return-object single-line
                  style="padding-right: 20px; max-width: 240px"
                  @change="searchPublicCourses()"
        ></v-select>
      </v-toolbar>
    </v-sheet>
    <br/>

    <v-data-table
        :headers="headers"
        :items="courses"
        :items-per-page="10"
        class="elevation-5"
    >
      <template v-slot:item.date="{ item }">
        {{ item.date }} ({{ item.startHour }}-{{ item.endHour }})
      </template>
      <template v-slot:item.enroll="{ item }">
        <v-btn
            @click.stop="selectedCourse = item, enrollDialog = true"
            v-if="!item.enrolled"
            small depressed color="success">
          Enroll
        </v-btn>
        <input
            v-if="item.enrolled"
            type="checkbox"
            checked="checked"
            disabled
            style="width: 15px; height: 15px; margin-left: 30px; margin-top: 8px">
      </template>
    </v-data-table>

    <v-dialog
        v-model="enrollDialog"
        persistent
        max-width="500px">
      <v-card>
        <v-card-title class="text-h5">
          Course enrollment
        </v-card-title>
        <v-card-text>
          Are you sure you want to enroll to the following course?
          <div v-if="selectedCourse.title" style="padding-top: 10px">
            <b>Title: </b>{{ selectedCourse.title }}
          </div>
          <div v-if="selectedCourse.teacher">
            <b>Teacher: </b>{{ selectedCourse.teacher.name }}
          </div>
          <div v-if="selectedCourse.date" style="padding-bottom: 10px">
            <b>Date: </b>{{ selectedCourse.date }}, {{ selectedCourse.startHour }}-{{ selectedCourse.endHour }}
          </div>
          Accepting the enrollment will add the course to your timetable.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" text @click="enrollDialog = false">
            No
          </v-btn>
          <v-btn color="success" text @click="enrollToCourse()">
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: "PublicCourses",

  data() {
    return {
      input: {
        institution: {},
        specialization: {},
        subject: {},
        teacher: {},
        title: null,
        description: null
      },
      dropdowns: {
        institutions: [],
        specializations: [],
        subjects: [],
        teachers: []
      },
      enrollDialog: false,
      selectedCourse: {},
      courses: [],
      headers: [
        {text: 'Institution', value: 'institution.internalId'},
        {text: 'Specialization', value: 'specialization.internalId'},
        {text: 'Subject', value: 'subject.name'},
        {text: 'Teacher', value: 'teacher.name'},
        {text: 'Date', value: 'date'},
        {text: 'Title', value: 'title'},
        {text: 'Description', value: 'description'},
        {text: 'Enroll', value: 'enroll'}

      ]
    }
  },

  methods: {
    searchPublicCourses() {
      this.$http.get('/api/courses/public',
          {
            params: {
              institutionId: this.input.institution.id,
              specializationId: this.input.specialization.id,
              subjectId: this.input.subject.id,
              teacherId: this.input.teacher.id,
              title: this.input.title,
              description: this.input.description
            },
            headers: {
              'Authorization': localStorage.getItem('token')
            }
          })
          .then(response => this.courses = response.data)
    },

    getInstitutions() {
      this.$http.get('/api/common/institutions',
          {
            headers: {
              'Authorization': localStorage.getItem('token')
            }
          })
          .then(response => this.dropdowns.institutions = response.data)
    },

    getSpecializations() {
      this.$http.get('/api/common/specializations?institutionId=' + this.input.institution.id,
          {
            headers: {
              'Authorization': localStorage.getItem('token')
            }
          })
          .then(response => this.dropdowns.specializations = response.data)
    },

    getSubjects() {
      this.$http.get('/api/common/subjects?institutionId=' + this.input.institution.id,
          {
            headers: {
              'Authorization': localStorage.getItem('token')
            }
          })
          .then(response => this.dropdowns.subjects = response.data)
    },

    getTeachers() {
      this.$http.get('/api/common/teachers?institutionId=' + this.input.institution.id,
          {
            headers: {
              'Authorization': localStorage.getItem('token')
            }
          })
          .then(response => this.dropdowns.teachers = response.data)
    },

    clearDropdowns() {
      this.input.institution = {};
      this.input.specialization = {};
      this.input.subject = {};
      this.input.teacher = {};
      this.input.title = null;
      this.input.description = null;
    },

    clearDropdownsAndSearch() {
      this.clearDropdowns();
      this.searchPublicCourses();
    },

    searchForInstitution() {
      this.getSpecializations();
      this.getSubjects();
      this.getTeachers();
      this.searchPublicCourses();
    },

    enrollToCourse() {
      this.$http.post('/api/courses/' + this.selectedCourse.id + '/enroll', {},
          {
            headers: {
              'Authorization': localStorage.getItem('token')
            }
          })
          .then(() => this.$router.push("/timetable"))
    }
  },

  beforeMount() {
    this.getInstitutions();
    this.searchPublicCourses();
  }
}
</script>

<style scoped>

</style>