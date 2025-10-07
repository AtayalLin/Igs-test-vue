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

// 引入 AOS (Animate On Scroll) 用於進場動畫
import AOS from "aos";
import "aos/dist/aos.css";

const app = createApp(App);
app.use(createPinia());
app.mount("#app");

// 初始化 AOS
if (typeof AOS !== "undefined") {
  AOS.init({ duration: 700, once: true });
}
