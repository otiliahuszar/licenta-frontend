import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import VueResource from "vue-resource";

Vue.config.productionTip = false;
Vue.use(VueResource);

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app');

Vue.http.interceptors.push((request, next) => {
    next((response) => {
        if (response.status === 401) {
            localStorage.clear();
            router.push('/login');
        }
        return response
    })
});