import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Timetable from '../views/Timetable.vue';
import TimetableManagement from '../views/TimetableManagement.vue';
import PublicCourses from "../views/PublicCourses";
import UserProfile from "../views/UserProfile";

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/timetable',
        name: 'Timetable',
        component: Timetable
    },
    {
        path: '/timetable/admin',
        name: 'Timetable Management',
        component: TimetableManagement
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    {
        path: '/courses/public',
        name: 'Public Courses',
        component: PublicCourses
    },
    {
        path: '/profile',
        name: 'User Profile',
        component: UserProfile
    }
];

const router = new VueRouter({
    mode: 'history',
    routes
});

export default router;
