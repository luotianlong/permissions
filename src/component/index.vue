<template>
    <div>
    <div id="index">
        <div class="banner"></div>
        <div class="nav">
            <ul>
                <v-touch tag="li" v-for="(item,index) in config.navList" :key="item.id" v-if="item.isShow" @pressup.prevent="routerPush(item,index)" @tap.prevent="routerPush(item,index)">
                    <div class="text">{{item.name}}</div>
                    <div class="icon-box" :style="{backgroundColor: item.iconBgColor}"><i class="iconfont" :class="item.iconfont"></i></div>
                </v-touch>
            </ul>
        </div>
        <tds-login-modal v-if="config.tdsLoginShow" :setConfig="config.tdsLoginModal" @getCode="getCodeDeal" @submit="submitDeal"></tds-login-modal>
    </div>
</div>
</template>

<script scoped>
    var initData = function () {
        return {
            data: {},
            config: {
                navList: [{
                    name: '我的权限管理',
                    iconfont: 'icon-yonghu_shezhi',
                    iconBgColor: '#FFC835',
                    isShow: false,
                    path: '/myPermissionMgmt/myPermissionMgmt'
                }, {
                    name: '申请记录',
                    iconfont: 'icon-biaodan',
                    iconBgColor: '#4DA9EB',
                    isShow: false,
                    path: '/applyRecord/applyRecord'
                }, {
                    name: '代为权限申请',
                    iconfont: 'icon-shenhe',
                    iconBgColor: '#80C269',
                    isShow: false,
                    path: '/applyPermission/applyPermission?ProxyApply=true'
                }, {
                    name: '权限申请审核',
                    iconfont: 'icon-icon7',
                    iconBgColor: '#17C295',
                    isShow: false,
                    path: '/applyPermissionAudit/applyPermissionAudit'
                }, {
                    name: '员工权限管理',
                    iconfont: 'icon-tuandui',
                    iconBgColor: '#8F82BC',
                    isShow: false,
                    path: '/permissionControl/permissionControl'
                }, {
                    name: '权限管理配置',
                    iconfont: 'icon-manager',
                    iconBgColor: '#448ACA',
                    isShow: false,
                    path: '/permissionMgmtConfig/permissionMgmtConfig'
                }],
                tdsLoginShow: false, // 登录框是否展示
                tdsLoginModal: {
                    getCodeBtnText: '获取短信验证码',
                    submitBtnText: '绑定TDS业支端账号',
                    prompt: '',
                    warn: '注：账号绑定不可更改，请绑定本人TDS业支端账号。'
                }, // 登录配置
                msgType: 1, // 验证码类型 1-短信 2-语音
                ddAuthCode: '', // 钉钉免登授权码
                corpId: 0, // 企业ID
            }
        }
    };
    export default {
        data() {
            return new initData();
        },
        activated: function () {
            let self = this;
            Bestone.ui.pageInit({
                setTitle: '权限管理首页',
                reviewCallBack: function () {
                    // 获取钉钉配置信息
                    let timeStamp = new Date().getTime();
                    Bestone.ui.loadingFrame({
                        timestamp: timeStamp
                    });

                    // backlalala
                    if(Bestone.util.isDev()) {
                        Bestone.util.ajax({
                            url: 'api/DingTalk/TestHole',
                            data: JSON.stringify({}),
                            showLoad: false,
                            success: function (ajaxData) {
                                ajaxData = ajaxData.data;

                                // 写入用户信息
                                Bestone.user.id = ajaxData.UserId; // id
                                Bestone.user.user = ajaxData.AccountName; // 账号
                                Bestone.user.name = ajaxData.UserName; // 姓名
                                Bestone.user.branchId = ajaxData.BranchId; // 所在公司id
                                Bestone.user.branchName = ajaxData.BranchName; // 所在公司名称

                                // 写入sessionStorage
                                sessionStorage.user = JSON.stringify({
                                    id: ajaxData.UserId, // id
                                    user: ajaxData.AccountName, // 账号
                                    name: ajaxData.UserName, // 姓名
                                    branchId: ajaxData.BranchId, // 所在公司id
                                    branchName: ajaxData.BranchName // 所在公司名称
                                })

                                // 获取token
                                Bestone.util.getToken({
                                    showLoad: false,
                                    success: function () {
                                        // 获取用户可用模块
                                        Bestone.util.ajax({
                                            url: 'api/UserManage/GetUserModule',
                                            showLoad: false,
                                            data: JSON.stringify({
                                                UserId: Bestone.user.id
                                            }),
                                            success: function (ajaxData) {
                                                $.each(ajaxData.data, function (k, v) {
                                                    self.config.navList[v - 1].isShow = true;
                                                })
                                            },
                                            complete: function (XMLHttpRequest, status) {
                                                Bestone.ui.hideLoadingFrame({
                                                    timestamp: timeStamp
                                                });
                                            }
                                        });
                                    }
                                });
                            },
                            complete: function (XMLHttpRequest, status) {
                                if (status != 'success') {
                                    Bestone.ui.hideLoadingFrame({
                                        timestamp: timeStamp
                                    });
                                }
                            }
                        });
                    }
                }
            });
        },
        deactivated: function () {
            var self = this;
            // 回退时清除数据
            Bestone.util.resetData(function () {
                self.data = initData().data;
                self.config = initData().config;
            });
        },
        mounted: function () {

        },
        methods: {
            routerPush: function (item, index) {
                Bestone.util.vueJump({path: item.path});
            },
            // 获取验证码
            getCodeDeal: function (accountName) {
                let self = this;
                Bestone.util.ajax({
                    url: 'api/DingTalk/SendMessage',
                    data: JSON.stringify({
                        accountName: accountName,
                        msgType: self.config.msgType, // 1-短信 2-语音
                        businessType: 1, // 1-登陆 2-代办申请授权
                    }),
                    success: function (ajaxData) {
                        let phone = ajaxData.data.PhoneNum;
                        let omitPhone = phone.substr(0,4) + '****' +  phone.substr(phone.length-3,phone.length);
                        let typeText = '';
                        if(self.config.msgType === 1) {
                            typeText = '文字短信'
                        }else {
                            typeText = '语音口令'
                        }
                        self.config.tdsLoginModal.prompt = '你的手机' + omitPhone + '将会收到一条' + typeText + '，请注意查收！'
                    },
                    fail: function () {
                        self.config.msgType = 2;
                        self.config.tdsLoginModal.getCodeBtnText = '发送语音口令';
                    }
                });
            },
            // 提交
            submitDeal: function (obj) {
                let self = this;

                dd.ready(function () {
                    //获取免登授权码
                    dd.runtime.permission.requestAuthCode({
                        corpId: self.config.corpId,
                        onSuccess: function (result) {
                            self.config.ddAuthCode = result.code;

                            Bestone.util.ajax({
                                url: 'api/DingTalk/AuthLogin?dingCode=' + self.config.ddAuthCode,
                                data: JSON.stringify({
                                    accountName: obj.accountVal,
                                    code: obj.verifyCode
                                }),
                                success: function (ajaxData) {
                                    ajaxData = ajaxData.data;
                                    self.config.tdsLoginShow = false;

                                    // 写入用户信息
                                    Bestone.user.id = ajaxData.UserId; // id
                                    Bestone.user.user = ajaxData.AccountName; // 账号
                                    Bestone.user.name = ajaxData.UserName; // 姓名
                                    Bestone.user.branchId = ajaxData.BranchId; // 所在公司id
                                    Bestone.user.branchName = ajaxData.BranchName; // 所在公司名称

                                    // 写入sessionStorage
                                    sessionStorage.user = JSON.stringify({
                                        id: ajaxData.UserId, // id
                                        user: ajaxData.AccountName, // 账号
                                        name: ajaxData.UserName, // 姓名
                                        branchId: ajaxData.BranchId, // 所在公司id
                                        branchName: ajaxData.BranchName // 所在公司名称
                                    })

                                    // 获取token
                                    Bestone.util.getToken({
                                        success: function () {
                                            // 获取用户可用模块
                                            Bestone.util.ajax({
                                                url: 'api/UserManage/GetUserModule',
                                                data: JSON.stringify({
                                                    UserId: Bestone.user.id
                                                }),
                                                success: function (ajaxData) {
                                                    $.each(ajaxData.data, function (k, v) {
                                                        self.config.navList[v - 1].isShow = true;
                                                    })
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        },
                        onFail: function (err) {
                            Bestone.ui.message({
                                content: '获取授权码失败，请退出页面重新进入'
                            })
                        }
                    });
                });
            },
        }
    }
</script>

<style lang="scss" scoped>
    #index {
        & > .banner {
            width: 100%;
            height: 155px;
            background-image: url("~images/index_banner.jpg");
            background-position: center;
            background-repeat: no-repeat;
            background-size: 100% 100%;
            background-color: #4D9971;
            @media screen and (min-width: 540px) {
                height: 240px;
            }
            @media screen and (max-width: 540px) {
                height: 240px;
            }
            @media screen and (max-width: 480px) {
                height: 215px;
            }
            @media screen and (max-width: 425px) {
                height: 190px;
            }
            @media screen and (max-width: 375px) {
                height: 155px;
            }
            @media screen and (max-width: 320px) {
                height: 120px;
            }
        }
        & > .nav {
            background-color: #fff;
            margin-top: 10px;
            padding: 15px 10px 3px;
            & > ul {
                overflow: hidden;
                & > li {
                    width: 48%;
                    float: left;
                    height: 50px;
                    line-height: 50px;
                    color: #404040;
                    text-align: center;
                    margin-bottom: 12px;
                    border-radius: 5px;
                    cursor: pointer;
                    position: relative;
                    height: 50px;
                    border: solid 1px #ddd;
                    border-radius: 5px;
                    line-height: 50px;
                    user-select: none;
                    &:nth-child(2n) {
                        float: right;
                    }
                    & > .text {
                        padding-right: 40px;
                        font-size: 16px;
                        height: 50px;
                        overflow: hidden;
                        @media screen and (max-width: 320px) {
                            font-size: 14px;
                        }
                    }
                    & > .icon-box {
                        position: absolute;
                        top: -1px;
                        right: -1px;
                        border-bottom-right-radius: 5px;
                        border-top-right-radius: 5px;
                        width: 40px;
                        height: 52px;
                        & > i {
                            color: #fff;
                            font-size: 20px;
                        }
                    }
                    &:active {
                        background-color: #eee;
                    }
                }
            }
        }
    }
</style>
