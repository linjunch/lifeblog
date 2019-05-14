// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import './css/reset.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './icon/iconfont.css'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

Vue.use(MintUI);
Vue.use(ElementUI);
import { MessageBox } from 'mint-ui';

import {
  Pagination,
  Autocomplete,
  Input,
  Radio,
  Button,
  Table,
  TableColumn,
  Form,
  FormItem,
  Icon,
  Row,
  Col,
  Collapse,
  CollapseItem,
  Container,
  Loading,
  Message,
} from 'element-ui';

Vue.use(Pagination);
Vue.use(Autocomplete);
Vue.use(Input);
Vue.use(Radio);
Vue.use(Button);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Icon);
Vue.use(Row);
Vue.use(Col);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Container);

Vue.use(Loading.directive);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$message = Message;

Vue.prototype.$axios = axios;
Vue.prototype.$msgbox = MessageBox;
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
