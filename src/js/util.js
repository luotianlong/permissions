import $ from "jquery";
import Vue from 'vue';

window.Bestone = window.Bestone || {};
Bestone.isPash = 1; // 进入页面状态 1-前进，2-后退
Bestone.pageHistory = []; // 页面历史访问记录
Bestone.user = {
    id: 0, // id
    user: '', // 账号
    name: '', // 姓名
    branchId: 0, // 所在公司id
    branchName: '' // 所在公司名称
};
Bestone.mgmtLimitData = []; // 管理范围数据
Bestone.applyData = {
    RoleId: 0, // 选择的部门
    ProxyApplyUserAccount: '', // 代为申请人账号
    ProxyApplyUserName: '', // 代为申请人姓名
    ProxyApplyUserId: 0, // 代为申请人id
    ProxyApplyBranchId: 0, // 代为申请人机构id
    ProxyApplyBranchName: '', // 代为申请人机构名称
    ApplyDesc: '', // 申请描述
    MenuArr: [] // 菜单列表数据
}; // 申请权限全局数据
Bestone.devUrl = '192.168.6.94:8080';

/**
 * 枚举变量
 * @type {Object}
 */
var Vars = {};
$.extend(Vars, {
    examinStatus: {
        100: '一级审核',
        101: '二级审核',
        200: '审核通过',
        300: '审核驳回',
    }, // 审核状态
    logStatus: {
        1: '申请权限',
        2: '一级审核审核完成',
        3: '一级审核审核驳回',
        4: '二级审核审核完成',
        5: '二级审核审核驳回',
        6: '配置权限审核日志',
        7: '移除权限审核日志',
        8: '配置权限管理配置日志',
        9: '移除权限管理配置日志',
        10: '配置管理员配置日志',
        11: '移除管理员配置权限',
        12: '配置管理部门日志',
        13: '移除员工所有权限日志',
        14: '移除员工菜单权限日志',
        15: '移除员工指定权限日志',
        16: '修改管理部门日志'
    }
});

/**
 * 常用工具方法
 * @type {Object}
 */
var Utils = {};
$.extend(Utils, {
    reg: (function () {
        var Reg = {};

        // 通用正则
        $.extend(Reg, {
            'num': /^\d+$/, //数字
            //'money': /^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/, //非负金额（可为0）
            //'zmoney': /^(?:[1,9]+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/, //非负金额（大于0）
            'znum': /^[1-9](\d+)?$/, //  大于0的数字
            'positive': /^[0-9](\d+)?$/, //  正整数
            'float': /^[-]{0,1}(\d+)[\.]+(\d+)$/, //浮点数
            'email': /^\w{1,16}([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, //邮箱
            'chinese': /^[\u4E00-\u9FA5]+$/, //仅汉字
            'char': /^[A-Za-z]+$/, //仅仅是字母
            'charn': /^[A-Za-z0-9]+$/, //数字加字母
            'idCard': /^\d{15}$|^\d{18}$|^\d{17}[xX]$/, //身份证
            'qq': /^[1-9]\d{4,15}$/, //QQ
            'areacode': /^(0[1,2]{1}\d{1})$|^(0[3-9]{1}\d{2})$/, //区号
            'tel': /^\d{7,8}$/, // 固话格式
            'mobile': /^((\+86)|(\(\+86\)))?-?(13|14|15|18|17)[0-9]{9}$/, //验证手机号码
            'telephone': /^((\+86)|(\(\+86\)))?-?(((0[1,2]{1}\d{1})?-?\d{8})|((0[3-9]{1}\d{2})?-?\d{7,8}))$/, //验证固定电话
            'phone': /^((\+86)|(\(\+86\)))?-?(13|14|15|18|17)[0-9]{9}$|^((\+86)|(\(\+86\)))?-?(((0[1,2]{1}\d{1})?-?\d{8})|((0[3-9]{1}\d{2})?-?\d{7,8}))$/, //手机号码和固定电话
            'url': /^((http|https|ftp):\/\/)?(\w(\:\w)?@)?([0-9a-z_-]+\.)*?([a-z0-9-]+\.[a-z]{2,6}(\.[a-z]{2})?(\:[0-9]{2,6})?)((\/[^?#<>\/\\*":]*)+(\?[^#]*)?(#.*)?)?$/,
            'zipcode': /^\d{6}$/, //验证邮编
            'zeroFloatBai': /^([0-9]\d?(\.\d{1,2})?|100)$/, //大于0小于100整数（包括两位小数）
            'money': /^\d{0,10}(?:\.\d{1,2})$/, //银行帐号
            'card': /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, //身份证
            'bankCard': /^[A-Za-z0-9-]+$/, //银行帐号
            'cmoney': /^\d{0,8}(?:\.\d{1,2})?$/, //小于
            'website': /(((file|gopher|news|nntp|telnet|http|ftp|https|ftps|sftp):\/\/)|(www\.))+(([a-zA-Z0-9\._-]+\.[a-zA-Z]{2,6})|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(\/[a-zA-Z0-9\&amp;%_\./-~-]*)?$/, //网址
            'numaddchar': /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{2,})$/, // 必须为数字和字母组合，数字和字母同时存在
            'loginPwd': /^.{6,16}$/, // /^(?![^a-zA-Z]+$)(?!\D+$).{6,16}$/, // 至少有数字和字母 6~16 位 验证登录密码
        });

        return Reg;
    })(),
    // vue单页跳转
    vueJump: function (options, vueThis) {
        var options = $.extend({
            path: '/404', // 跳转地址，默认404
            query: {}
        }, options || {});
        if (!options.path) options.path = '/404'; // 如果为空跳到404

        Bestone.isPash = 1; // 1-是，2-不是

        // 跳转页面带时间戳
        options.query.timeStamp = new Date().getTime();
        Bestone.ui.loadingFrame({
            text: '加载中',
            delayShowTime: 1000
        });
        window.app.$router.push({
            path: options.path,
            query: options.query
        });
    },
    // 获取地址栏参数
    query: function () {
        return window.app.$route.query;
    },
    // 离开页面时重置数据
    resetData: function (callback) {
        if (Bestone.isPash == 2) {
            callback();
        }
    },
    // 申请权限、管理范围状态处理
    textStatusDeal: function (str) {
        if(typeof(str)!='string') return;
        // 去掉最后一个逗号
        if(str.substring(str.length-1)===',') {
            str = str.substring(0,str.length-1);
        }
        var arr = str.split(',');
        var text = '';
        // 如果没有，返回全部
        if(str.length===0) {
            text = '全部';
        }else {
            if (arr.length == 1) {
                text = arr[0];
            } else if (arr.length > 1) {
                text = arr[0] + '等';
            }
        }

        return text;
    },
    // 树形结构数据提取列表名（用于搜索定位）
    getTreeViewDataForSearch: function (options) {
        var options = $.extend({
            data: [], // 树形结构数据
            name: 'MenuName', // 树形结构数据每列数据名称
            id: 'id',
            childKey: 'ChildList', // 子级键名
        }, options || {});

        if (!options.data || options.data.length == 0) return; // 如果data数据不匹配则终止
        var resultArr = [];

        // 递归
        function recursive(data) {
            $.each(data, function (k, v) {
                resultArr.push({
                    name: v[options.name],
                    id: v[options.id]
                });
                if (!!v[options.childKey]) { // 如果有子级
                    recursive(v[options.childKey]);
                }
            });
        }

        recursive(options.data);
        return resultArr;
    },
    // 异步请求
    ajax: function (options) {
        var options = $.extend({
            url: '', // 请求地址
            data: {}, // 请求参数
            type: 'GET',
            dataType: 'json',
            timeout: 60000, // 超时时间设置，单位毫秒
            showLoad: true, // 是否展示加载框
            isShowErrorMes: true, // 是否显示错误信息
            success: function (data) {
            }, // 成功回调
            fail: function (data) {
            }, // 请求成功，但code不为200和301时回调
            error: function (data) {
            }, // 失败回调
            complete: function (XMLHttpRequest, status) {
            }, // 完成回调
        }, options);

        if (!options.url) return;

        // 加载框
        var timestampVal = new Date().getTime();
        if (!!options.showLoad) {
            Bestone.ui.loadingFrame({
                timestamp: timestampVal
            });
        }

        $.ajax({
            url: Bestone.basePath + options.url + '.json',
            // headers: {
            //     token: sessionStorage.token,
            //     userid: Bestone.user.id,
            // },
            // data: options.data,
            type: options.type,
            // dataType: options.dataType,
            // timeout: options.timeout,
            // contentType: 'application/json',
            cache: false,
            // crossDomain: true,
            success: function (data) {
                if (data.code == 200) {
                    options.success(data);
                }else if(data.code == 301) { // token失效
                    Bestone.util.getToken();
                    Bestone.ui.message({
                        content: data.msg
                    });
                }else {
                    options.fail(data);
                    if(options.isShowErrorMes) {
                        Bestone.ui.message({
                            content: data.msg
                        });
                    }
                }
            },
            error: function () {
                options.error();
                Bestone.ui.message({
                    content: '请求失败'
                });
            },
            complete: function (XMLHttpRequest, status) {
                if (status == 'timeout') {
                    Bestone.ui.message({
                        content: '请求超时'
                    });
                }
                ;
                options.complete(XMLHttpRequest, status);
                if (!!options.showLoad) {
                    Bestone.ui.hideLoadingFrame({
                        timestamp: timestampVal
                    });
                }
            }
        });
    },
    // 滚动加载高度判断回调（scroll事件每次跳转页面会全部清除）
    scrollRefresh: function (options) {
        var options = $.extend({
            gapBottom: 80, // 距离底部多少px开始回调
            callback: function (height) {
            },
        }, options);

        // 滚动加载
        var $window = $(window);
        var $document = $(document);
        $window.scroll(function () {
            var gapHeight = $document.height() - $document.scrollTop() - $window.height();
            if (gapHeight <= 80) {
                options.callback(gapHeight);
            }
        });
    },
    // 重置申请权限数据
    resetApplyData: function () {
        // Proxy为申请人
        Bestone.applyData = {
            RoleId: 0, // 选择的部门
            ProxyApplyUserAccount: '', // 账号
            ProxyApplyUserName: '', // 姓名
            ProxyApplyUserId: 0, // id
            ProxyApplyBranchId: 0, // 机构id
            ProxyApplyBranchName: '', // 机构名称
            ApplyDesc: '', // 申请描述
            MenuArr: [] // 菜单列表数据
        };
    },
    // 获取token
    getToken: function (options) {
        var options = $.extend({
            showLoad: true,
            success: function () {
            },
        }, options);

        Bestone.util.ajax({
            url: 'api/DingTalk/GetUserToken',
            showLoad: options.showLoad,
            data: JSON.stringify({
                Key: Bestone.merchantKey, // 商户key
                UserId: Bestone.user.id,
                isRefreshToken: true,
            }),
            success: function (ajaxData) {
                sessionStorage.token = ajaxData.data.token;
                options.success();
            }
        });
    },
    // 浏览器信息
    navigator: function (options) {
        var options = $.extend({
            checkType: '', // Android-是否为安卓，iOS-是否为iOS
        }, options);

        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

        if(options.checkType == 'Android') {
            return isAndroid;
        }else if(options.checkType == 'iOS') {
            return isiOS;
        }
    },
    // 用于开发
    isDev: function (options) {
        if(location.host==Bestone.devUrl) {
            return true;
        }else {
            return false;
        }
    }
});

/**
 * 样式
 * @type {Object}
 */
var UI = {};
$.extend(UI, {
    // 页面初始化
    pageInit: function (options) {
        var options = $.extend({
            setTitle: 'TDS权限管理',
            reviewCallBack: function () {
            } // 仅在打开页面时回调，返回不会触发
        }, options || {});

        Bestone.ui.hideLoadingFrame({
            all: true
        });
        $(window).unbind('scroll');
        Bestone.ui.ddSetRight();
        // 判断页面是否已访问过（防止刷新页面后退时不进入reviewCallBack，导致页面不加载数据）
        var isHasHistory = false; // 是否有历史访问数据
        function checkPageHistory() {
            var nowPathname = window.location.pathname;
            var isHas = false; // 是否有历史访问数据
            $.each(Bestone.pageHistory, function (k, v) {
                if (v.pathname === nowPathname) {
                    isHas = true;
                }
            })
            Bestone.pageHistory.push({
                pathname: nowPathname
            });
            return isHas;
        };
        isHasHistory = checkPageHistory();
        if (Bestone.isPash == 1 || !isHasHistory) {
            options.reviewCallBack();
        }
        Bestone.isPash = 2; // 进入页面时重置isPash状态
        Bestone.ui.setTitle({
            title: options.setTitle
        });
    },
    // 设置title
    setTitle: function (options) {
        var options = $.extend({
            title: 'TDS权限管理',
        }, options || {});

        document.title = options.title;

        // 钉钉设置
        // dd.ready(function () {
        //     dd.biz.navigation.setTitle({
        //         "title": options.title
        //     })
        // });
        // 长时间不操作，dd.config配置会失效，导致不进入dd.ready，故提出来写
        dd.biz.navigation.setTitle({
            "title": options.title
        })
    },
    // 钉钉设置nav右侧
    ddSetRight: function (options) {
        var options = $.extend({
            control: false,
            show: false,
            text: '',
            onSuccess: function () {
            },
            onFail: function () {
            }
        }, options || {});

        // dd.ready(function () {
        //     dd.biz.navigation.setRight({
        //         "control": options.control,
        //         "show": options.show,
        //         "text": options.text,
        //         onSuccess: function (result) {
        //             options.onSuccess();
        //         },
        //         onFail: function () {
        //             options.onFail();
        //         }
        //     })
        // });
        // 长时间不操作，dd.config配置会失效，导致不进入dd.ready，故提出来写
        dd.biz.navigation.setRight({
            "control": options.control,
            "show": options.show,
            "text": options.text,
            onSuccess: function (result) {
                options.onSuccess();
            },
            onFail: function () {
                options.onFail();
            }
        })
    },
    // 加载框
    loadingFrame: function (options) {
        var options = $.extend({
            el: 'body',
            text: '加载中', // 加载文字
            showIcon: true, // 是否展示图标
            delayShowTime: 0, // 延迟显示时间（毫秒）
            timestamp: '1314'
        }, options || {});

        var View = {
            init: function () {
                let _this = this;
                _this.render();
            },
            render: function () {
                let _this = this;
                let style = `
                    <style>
                        .time${options.timestamp} .line-scale-pulse-out-rapid {
                            text-align: center;
                        }
                        @-webkit-keyframes line-scale-pulse-out-rapid {
                            0% {
                                -webkit-transform: scaley(1);
                                transform: scaley(1);
                            }
    
                            80% {
                                -webkit-transform: scaley(0.3);
                                transform: scaley(0.3);
                            }
    
                            90% {
                                -webkit-transform: scaley(1);
                                transform: scaley(1);
                            }
                        }
    
                        @keyframes line-scale-pulse-out-rapid {
                            0% {
                                -webkit-transform: scaley(1);
                                transform: scaley(1);
                            }
    
                            80% {
                                -webkit-transform: scaley(0.3);
                                transform: scaley(0.3);
                            }
    
                            90% {
                                -webkit-transform: scaley(1);
                                transform: scaley(1);
                            }
                        }
    
                        .time${options.timestamp} .line-scale-pulse-out-rapid > div {
                            background-color: #fff;
                            width: 3px;
                            height: 28px;
                            border-radius: 2px;
                            margin: 2px;
                            -webkit-animation-fill-mode: both;
                            animation-fill-mode: both;
                            display: inline-block;
                            -webkit-animation: line-scale-pulse-out-rapid 0.9s 0s infinite cubic-bezier(.11, .49, .38, .78);
                            animation: line-scale-pulse-out-rapid 0.9s 0s infinite cubic-bezier(.11, .49, .38, .78);
                        }
                        .time${options.timestamp} .line-scale-pulse-out-rapid > div:nth-child(2), .time${options.timestamp} .line-scale-pulse-out-rapid > div:nth-child(4) {
                            -webkit-animation-delay: 0.25s !important;
                            animation-delay: 0.25s !important;
                        }
                        .time${options.timestamp} .line-scale-pulse-out-rapid > div:nth-child(1), .time${options.timestamp} .line-scale-pulse-out-rapid > div:nth-child(5) {
                            -webkit-animation-delay: 0.5s !important;
                            animation-delay: 0.5s !important;
                        }
                    </style>
                `;

                $(options.el).append('<div class="ui ui-loading-frame time' + options.timestamp + '"><loading-frame></loading-frame></div>');
                Vue.component('loading-frame', {
                    template: `
                    <div v-show="isShow" class="content">
                        <div class="icon-content">
                            <div class="loader-inner line-scale-pulse-out-rapid">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>
                        <p v-if="options.text.length>0" class="text">{{options.text}}</p>
                    </div>
                    `,
                    data: function () {
                        return {
                            options: options,
                            isShow: false
                        };
                    },
                    mounted: function () {
                        var self = this;

                        $(`.ui.ui-loading-frame.time${options.timestamp}`).append(style);
                        setTimeout(function () {
                            self.isShow = true;
                        }, self.options.delayShowTime);
                    }
                });

                // 实例化
                new Vue({
                    el: '.ui-loading-frame.time' + options.timestamp,
                    data: {},
                });
            }
        };

        View.init();
    },
    // 隐藏加载框
    hideLoadingFrame: function (options) {
        var options = $.extend({
            el: 'body',
            timestamp: '1314',
            all: false // 是否清除所有加载框
        }, options || {});

        var View = {
            init: function () {
                let _this = this;
                _this.render();
            },
            render: function () {
                let _this = this;

                $(options.el + ' .ui.ui-loading-frame.time' + options.timestamp).remove();
                if(options.all) {
                    $(options.el + ' .ui.ui-loading-frame').remove();
                }
            }
        };

        View.init();
    },
    // 搜索组件（2017.07.18-弃用）
    searchBox: function (options) {
        var options = $.extend({
            el: '.search', // 父级元素
            placeholder: '', // 输入框展示的的placeholder
            searchVal: '', // 初始输入值
            searchValChange: function (str) {
            }, // 输入值改变回调
            searchBack: function (str) {
            }, // 搜索回调
        }, options || {});

        var View = {
            init: function () {
                let _this = this;
                _this.render();
            },
            render: function () {
                let _this = this;

                $(options.el).html('<search-box></search-box>');
                Vue.component('search-box', {
                    template: `
                    <form @submit.prevent="search" action>
                        <div class="ui ui-search">
                            <div class="input-content">
                                <input type="text" v-model="options.searchVal" :placeholder="options.placeholder" ref="searchVal" name="searchVal" />
                            </div>
                            <v-touch tag="a" class="search-btn" @tap="search" @pressup="search">
                                <i class="iconfont icon-sousuo"></i>
                            </v-touch>
                        </div>
                    </form>
                    `,
                    data: function () {
                        return {
                            options: options,
                        };
                    },
                    computed: {},
                    mounted: function () {

                    },
                    watch: {
                        options: {
                            handler: function (val, oldval) {
                                options.searchValChange(this.$refs.searchVal.value);
                            },
                            deep: true
                        }
                    },
                    methods: {
                        search: function () {
                            let self = this;
                            options.searchBack(self.options.searchVal);
                        }
                    }
                });

                // 实例化
                new Vue({
                    el: options.el,
                    data: {},
                });
            }
        };

        View.init();
    },
    // 消息提示框
    message: function (options) {
        var options = $.extend({
            el: 'body', // 父级元素
            content: '', // 消息内容
            notOper: false, // 是否禁止其他操作
        }, options || {});

        if (options.el.length <= 0) return;

        var View = {
            init: function () {
                let _this = this;
                _this.render();
            },
            render: function () {
                let _this = this;

                var timestamp = new Date().getTime();
                $(options.el).append('<div class="ui ui-message time' + timestamp + '"><message></message></div>');
                Vue.component('message', {
                    template: `
                        <transition name="fade">
                            <div v-show="isShow" class="vue-box">
                                <div v-if="options.notOper" class="bg-box"></div>
                                <div class="box">
                                    <div class="content">{{options.content}}</div>
                                </div>
                            </div>
                        </transition>
                    `,
                    data: function () {
                        return {
                            options: options,
                            isShow: false
                        };
                    },
                    computed: {},
                    mounted: function () {
                        var self = this;
                        self.isShow = true;
                        setTimeout(function () {
                            self.isShow = false;
                            setTimeout(function () {
                                $('.ui.ui-message.time' + timestamp).remove();
                            }, 500);
                        }, 1500);
                    },
                    methods: {}
                });

                // 实例化
                new Vue({
                    el: '.ui.ui-message.time' + timestamp,
                    data: {},
                });
            }
        };

        View.init();
    },
    // 对话框
    modal: function (options) {
        var options = $.extend({
            el: 'body', // 父级元素
            content: '', // 消息内容
            showConfirm: true,
            showCancel: true,
            confirmText: '确定',
            cancelText: '取消',
            confirmCallBack: function () {
            }, // 点击确定按钮回调
        }, options || {});

        if (options.el.length <= 0) return;

        var View = {
            init: function () {
                let _this = this;
                _this.render();
            },
            render: function () {
                let _this = this;

                var timestamp = new Date().getTime();
                $(options.el).append('<div class="ui ui-modal time' + timestamp + '"><modal-box></modal-box></div>');
                Vue.component('modal-box', {
                    template: `
                        <div class="box">
                            <div class="content" v-html="options.content"></div>
                            <div class="bottom-btn" v-if="options.showConfirm || options.showCancel" :class="(options.showConfirm && options.showCancel) ? '' : 'one-btn'">
                                <v-touch tag="a" v-if="options.showConfirm" class="confirm-btn" @pressup.prevent="clickConfirm" @tap.prevent="clickConfirm">{{options.confirmText}}</v-touch>
                                <v-touch tag="a" v-if="options.showCancel" class="cancel-btn" @pressup.prevent="clickCancel" @tap.prevent="clickCancel">{{options.cancelText}}</v-touch>
                            </div>
                        </div>
                    `,
                    data: function () {
                        return {
                            options: options
                        };
                    },
                    computed: {},
                    mounted: function () {
                        var $modal = $('.ui.ui-modal.time' + timestamp);
                        var height = $modal.find('.box').height();
                        $modal.find('.box').css('margin-top', -height / 2 + 'px');
                    },
                    methods: {
                        clickConfirm: function () {
                            var $modal = $('.ui.ui-modal.time' + timestamp);
                            options.confirmCallBack($modal);
                        },
                        clickCancel: function () {
                            var $modal = $('.ui.ui-modal.time' + timestamp);
                            $modal.remove();
                        }
                    }
                });

                // 实例化
                new Vue({
                    el: '.ui.ui-modal.time' + timestamp,
                    data: {},
                });
            }
        };

        View.init();
    }
});

// 添加到全局调用 不做模块返回
window.Bestone = window.Bestone || {};
$.extend(window.Bestone, {
    vars: Vars,
    util: Utils,
    ui: UI
});