import {createApp} from 'vue'
import App from './App.vue'
import "./styles.scss"
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar"
import RelativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(calendar)
dayjs.extend(RelativeTime)

createApp(App).mount('#app')
