import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login/Login'
import Register from '../components/Register/Register'
import Blog from '../components/Blog/Blog'
import Myblog from '../components/Myblog/Myblog'
import Changepsw from '../components/Changepsw/Changepsw'
import Reg from '../components/Reg'
import Admin from '../components/Admin/Admin'
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: '',
      component: Login
    },
    {
      path: '/Reg',
      name: 'Reg',
      component: Reg
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/Register',
      name: 'Register',
      component: Register
    },
    {
      path: '/Blog',
      name: 'Blog',
      component: Blog
    },
    {
      path: '/Changepsw',
      name: 'Changepsw',
      component: Changepsw
    },
    {
      path: '/Myblog',
      name: 'Myblog',
      component: Myblog
    },
    {
      path: '/Admin',
      name: 'Admin',
      component: Admin
    }
  ]
})
