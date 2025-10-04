import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";

// 引入 Bootstrap CSS 和 JS
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// 引入 GSAP
import { gsap } from "gsap";

// 將 GSAP 設為全局可用
window.gsap = gsap;

const app = createApp(App);
app.use(createPinia());
app.mount("#app");
