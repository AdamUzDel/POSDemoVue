import { createApp } from "vue"
import { createPinia } from "pinia"
import ElementPlus from "element-plus"
import "element-plus/dist/index.css"
import * as ElementPlusIconsVue from "@element-plus/icons-vue"
import App from "./App.vue"
import router from "./router"

// Create Vue application instance
const app = createApp(App)

// Register Pinia store
app.use(createPinia())

// Register Vue Router
app.use(router)

// Register Element Plus UI library
app.use(ElementPlus)

// Register all Element Plus icons globally
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// Mount the application
app.mount("#app")
