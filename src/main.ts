import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";

import "./styles/app.css";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue-3/dist/bootstrap-vue-3.css";

const pinia = createPinia();
const app = createApp(App);
app.use(pinia);
app.mount("#app");
