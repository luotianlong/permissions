import Vue from 'vue';
import VueRouter from "vue-router";
import VueResource from 'vue-resource';
import VueTouch from 'vue-touch';
import $ from "jquery";
window.$ = $;
import VueRouterArr from "./vue_router_arr";
import './js/util';
import './js/common';
import '!style-loader!css-loader!sass-loader!postcss-loader!./scss/common.scss';
import '!style-loader!css-loader!./font/iconfont.css';

// 引入公用组件
import searchBox from './component/common/search-box.vue';
import treeView from './component/common/tree-view.vue';
import treeViewRecursion from './component/common/tree-view-recursion.vue';
import tdsLoginModal from './component/common/tds-login-modal.vue';
import selectBox from './component/common/select-box.vue';
import modalBox from './component/common/modal-box.vue';
// 注册全局组件
Vue.component('search-box', searchBox);
Vue.component('tree-view', treeView);
Vue.component('tree-view-recursion', treeViewRecursion);
Vue.component('tds-login-modal', tdsLoginModal);
Vue.component('select-box', selectBox);
Vue.component('modal-box', modalBox);

Vue.use(VueTouch, {name: 'v-touch'});
Vue.use(VueRouter);
Vue.use(VueResource);

// 创建一个路由器实例
// 并且配置路由规则
const router = new VueRouter({
    mode: 'history', // history模式
    scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { x: 0, y: 0 }
        }
    },
    base: __dirname,
    routes: VueRouterArr
})

// 创建一个事件中心，相当于中转站，可以用它来传递事件和接收事件.
const hub = new Vue();
window.hub = hub;

// 路由器会创建一个 App 实例，并且挂载到选择符 #app 匹配的元素上。
const app = new Vue({
    router: router,
    data () {
        return {
            transitionName: 'slide-left'
        }
    },
    methods: {
        clickApp: function (e) {
            hub.$emit('clickApp',e); //Hub触发事件
        }
    },
    watch: {
        '$route' (to, from) {
            const toDepth = to.query.timeStamp || 0;
            const fromDepth = from.query.timeStamp || 0;
            this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
        }
    }
}).$mount('#app');
window.app = app;
