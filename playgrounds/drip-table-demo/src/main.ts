import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { DripTable, DripForm } from '../../../packages/index';
import zhCn from 'element-plus/es/locale/lang/zh-cn';

const app = createApp(App);
app.use(ElementPlus);
app.use(DripTable, { locale: zhCn });
app.use(DripForm);
app.mount('#app');