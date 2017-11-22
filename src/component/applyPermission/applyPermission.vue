<!-- 申请权限 -->
<template>
    <div>
        <div id="apply-permission">
            <div class="ui ui-text-list">
                <template v-if="!config.isProxy">
                    <p>申请权限账号：{{config.userInfo.user}}</p>
                    <p>姓名：{{config.userInfo.name}}</p>
                    <p>账号所属公司：{{config.userInfo.branchName}}</p>
                </template>
                <template v-if="config.isProxy">
                    <p v-if="false">申请账号：{{config.proxyUserInfo.user}}</p>
                    <p>申请人：{{config.proxyUserInfo.name}}</p>
                    <p>代办人：{{config.userInfo.name}}</p>
                </template>
            </div>
            <div class="choice-permission">
                <div class="ui ui-title">选择权限</div>
                <div class="choice-department">
                    <select-box :defaultVal="config.selectBox.defaultVal" :dropDownData="config.selectBox.dropDownData" @selectClick="selectClick"></select-box>
                </div>
            </div>
            <div class="explain-content" v-if="config.selectChoiceId !== ''">
                <div class="ui ui-icon-explain">
                    <div class="title">图例：</div>
                    <ul>
                        <li>
                            <div class="icon-content" style="background-color: #E5B626;"><i class="iconfont icon-jia"></i></div>
                            <span>按所属公司添加权限范围</span></li>
                        <li>
                            <div class="icon-content" style="background-color: #22AC38;"><i class="iconfont icon-tubiaozhizuomoban-"></i></div>
                            <span>自定义选择权限管理范围</span></li>
                    </ul>
                </div>
            </div>
            <div class="search-content" v-if="config.selectChoiceId !== ''">
                <search-box :searchVal="config.searchBox.searchVal" :placeholder="config.searchBox.placeholder" :suggest="config.searchBox.suggest" @searchClick="searchClickDeal" @searchValChange="searchValChangeDeal" @itemClick="itemClickDeal"></search-box>
            </div>
            <div class="tree-view-content" v-if="config.selectChoiceId !== ''">
                <tree-view :dataArr="data.treeView" :setConfig="config.treeView" @addDirect="addDirectDeal" @addCustom="addCustomDeal"></tree-view>
                <div v-if="data.treeView && data.treeView.length<=0" class="ui no-data" style="margin-top: 0px;">暂无数据</div>
            </div>
            <div class="explain">
                <div class="ui ui-textarea">
                    <textarea placeholder="申请权限说明（选填）" v-model="config.explainValue"></textarea>
                </div>
            </div>
            <div v-if="true" class="ui ui-bottom-btn">
                <v-touch tag="div" class="btn" @pressup.prevent="submitApply" @tap.prevent="submitApply">已选择（{{config.chose}}），下一步</v-touch>
            </div>
            <tds-login-modal v-if="config.isProxy && config.tdsLoginShow" :setConfig="config.tdsLoginModal" @getCode="getCodeDeal" @submit="submitDeal"></tds-login-modal>
        </div>
    </div>
</template>

<script scoped>
    var initData = function () {
        return {
            data: {
                treeView: []
            },
            config: {
                isProxy: false, // 是否代为申请
                tdsLoginShow: false, // 代为申请登录框是否展示
                chose: 0, // 已经选择的菜单数
                msgType: 1, // 验证码类型 1-短信 2-语音
                userInfo: {
                    user: '',
                    name: '',
                    branchName: ''
                }, // 用户信息
                proxyUserInfo: {
                    user: '',
                    name: ''
                }, // 代为申请人信息
                tdsLoginModal: {
                    getCodeBtnText: '获取短信验证码',
                    submitBtnText: '代为申请权限账号授权',
                    prompt: '',
                    warn: ''
                }, // 登录配置
                selectBox: {
                    defaultVal: '请选择部门权限',
                    dropDownData: []
                },
                searchBox: {
                    searchVal: '',
                    placeholder: '权限名称',
                    suggest: {
                        isShow: 1,
                        data: [],
                    }
                },
                treeView: {
                    isShow: 1,
                    isShowIcon: 2,
                    keyConfig: {
                        name: 'MenuName',
                        id: 'MenuId',
                        childKey: 'ChildList'
                    },
                    btn: [{
                        iconFontClass: 'icon-tubiaozhizuomoban-',
                        color: '#22AC38',
                        handle: 'addCustom'
                    }, {
                        iconFontClass: 'icon-jia',
                        color: '#E5B626',
                        handle: 'addDirect'
                    }],
                    locationConfig: {
                        key: 'id'
                    }
                },
                selectChoiceId: '', // 选择的部门id
                explainValue: '', // 申请权限说明
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
                setTitle: '申请权限',
                reviewCallBack: function () {
                    self.data = initData().data;
                    self.config = initData().config;
                    // 重置申请权限全局数据
                    Bestone.util.resetApplyData();

                    // 判断是否代为申请
                    if (!!Bestone.util.query().ProxyApply) {
                        self.config.isProxy = true;
                        self.config.tdsLoginShow = true;
                    }
                    // 获取用户信息
                    self.config.userInfo.user = Bestone.user.user;
                    self.config.userInfo.name = Bestone.user.name;
                    self.config.userInfo.branchName = Bestone.user.branchName;

                    // 获取所有权限部门
                    Bestone.util.ajax({
                        url: 'api/PermissionManage/GetAllRoleGroup',
                        data: JSON.stringify({}),
                        success: function (ajaxData) {
                            let selectData = [];
                            $.each(ajaxData.data, function (k, v) {
                                selectData.push({
                                    id: v.Id,
                                    name: v.RoleName
                                })
                            })
                            self.config.selectBox.dropDownData = selectData;
                        }
                    });
                }
            });

            Bestone.ui.ddSetRight({
                control: true,
                text: '下一步(' + Bestone.applyData.MenuArr.length + ')',
                show: true,
                onSuccess: function () {
                    self.submitApply();
                }
            });

            // 获取当前已选菜单数
            self.config.chose = Bestone.applyData.MenuArr.length;
        },
        deactivated: function () {
            var self = this;
            // 回退时清除数据
            Bestone.util.resetData(function () {
                self.data = initData().data;
                self.config = initData().config;
                // 重置申请权限全局数据
                Bestone.util.resetApplyData();
            });
        },
        methods: {
            submitApply: function () {
                let self = this;
                // 判断是否选择门市
                if (Bestone.applyData.MenuArr.length <= 0) {
                    Bestone.ui.message({
                        content: '请先选择'
                    });
                    return;
                }
                Bestone.applyData.ApplyDesc = self.config.explainValue;
                Bestone.util.vueJump({
                    path: '/applyPermission/finalCheck'
                });
            },
            // 获取验证码
            getCodeDeal: function (accountName) {
                let self = this;

                Bestone.util.ajax({
                    url: 'api/DingTalk/SendMessage',
                    data: JSON.stringify({
                        accountName: accountName,
                        msgType: self.config.msgType, // 1-短信 2-语音
                        businessType: 2, // 1-登陆 2-代为申请授权
                    }),
                    success: function (ajaxData) {
                        let phone = ajaxData.data.PhoneNum;
                        let omitPhone = phone.substr(0, 4) + '****' + phone.substr(phone.length - 3, phone.length);
                        let typeText = '';
                        if (self.config.msgType === 1) {
                            typeText = '文字短信'
                        } else {
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
            // 代为提交
            submitDeal: function (obj) {
                let self = this;

                Bestone.util.ajax({
                    url: 'api/DingTalk/AuthProxy',
                    data: JSON.stringify({
                        accountName: obj.accountVal,
                        code: obj.verifyCode,
                    }),
                    success: function (ajaxData) {
                        ajaxData = ajaxData.data;
                        self.config.tdsLoginShow = false;

                        // 写入代为申请用户信息
                        Bestone.applyData.ProxyApplyUserId = ajaxData.UserId;
                        Bestone.applyData.ProxyApplyUserAccount = ajaxData.AccountName;
                        Bestone.applyData.ProxyApplyUserName = ajaxData.UserName;
                        Bestone.applyData.ProxyApplyBranchId = ajaxData.BranchId;
                        Bestone.applyData.ProxyApplyBranchName = ajaxData.BranchName;
                        // 获取代为用户信息
                        self.config.proxyUserInfo.user = Bestone.applyData.ProxyApplyUserAccount;
                        self.config.proxyUserInfo.name = Bestone.applyData.ProxyApplyUserName;
                    }
                });
            },
            // 下拉框点击
            selectClick: function (item) {
                let self = this;
                // 重置申请权限全局数据
                Bestone.applyData.RoleId = 0;
                Bestone.applyData.MenuArr = [];
                // 获取当前已选菜单数
                self.config.chose = Bestone.applyData.MenuArr.length;
                Bestone.ui.ddSetRight({
                    control: true,
                    text: '下一步(' + Bestone.applyData.MenuArr.length + ')',
                    show: true,
                    onSuccess: function () {
                        self.submitApply();
                    }
                });
                self.config.selectChoiceId = item.id;
                Bestone.applyData.RoleId = item.id;

                // 获取权限部门下所有菜单
                Bestone.util.ajax({
                    url: 'api/AuthManage/GetRoleMenus',
                    data: JSON.stringify({
                        RoleId: self.config.selectChoiceId
                    }),
                    success: function (ajaxData) {
                        self.config.searchBox.suggest.data = Bestone.util.getTreeViewDataForSearch({
                            data: ajaxData.data,
                            name: 'MenuName',
                            id: 'MenuId',
                            childKey: 'ChildList'
                        });
                        // 一级不展示按钮
                        $.each(ajaxData.data, function (k, v) {
                            v.frontNoShowBtn = ['addCustom', 'addDirect'];
                        });
                        self.data.treeView = ajaxData.data;
                    }
                });
            },
            // 搜索点击
            searchClickDeal: function (str) {
                Bestone.ui.message({
                    content: '仅支持智能匹配搜索'
                });
            },
            // 输入框值改变
            searchValChangeDeal: function (str) {
                this.config.searchBox.searchVal = str; // 必须，用于父子组件数据双向绑定
            },
            // 搜索下拉框点击
            itemClickDeal: function (item) {
                let val = item.id;
                if (!!val) {
                    let $loca = $('.ui.tree-view .loca' + val);
                    $('.ui.tree-view .item').css('background-color', 'transparent');
                    if ($loca.length > 0) {
                        setTimeout(function () {
                            $loca.css('background-color', '#FFFBE6');
                            $(window).scrollTop($loca.offset().top - 5);
                        }, 100);
                    }
                }
            },
            // 按所属公司添加范围
            addDirectDeal: function (item) {
                let self = this;
                let isActived = false; // 是否已编辑
                let userBranchId = 0; // 获得权限人的机构id
                let userBranchName = ''; // 获得权限人的机构名称
                if (!self.config.isProxy) { // 不是代为申请
                    userBranchId = Bestone.user.branchId;
                    userBranchName = Bestone.user.branchName;
                } else { // 是代为申请
                    userBranchId = Bestone.applyData.ProxyApplyBranchId;
                    userBranchName = Bestone.applyData.ProxyApplyBranchName;
                }
                let newMenuItem = {
                    MenuID: item.MenuId,
                    BranchIds: item.MenuBusinessType !== '' ? [userBranchId] : [], //item.MenuBusinessType 为空字符串不可选范围
                    ButtonIds: [],
                    MenuName: item.MenuName,
                    BranchNames: item.MenuBusinessType !== '' ? [userBranchName] : [],
                    ButtonNames: [],
                };
                $.each(Bestone.applyData.MenuArr, function (k, v) {
                    if (v.MenuID == item.MenuId) {
                        Bestone.applyData.MenuArr.splice(k, 1, newMenuItem);
                        isActived = true;
                        return false;
                    }
                });
                if (!isActived) { // 如果没有编辑则添加一条新的
                    Bestone.applyData.MenuArr.push(newMenuItem);
                }
                // 获取当前已选菜单数
                self.config.chose = Bestone.applyData.MenuArr.length;
                Bestone.ui.ddSetRight({
                    control: true,
                    text: '下一步(' + Bestone.applyData.MenuArr.length + ')',
                    show: true,
                    onSuccess: function () {
                        self.submitApply();
                    }
                });
                Bestone.ui.message({
                    content: '添加成功'
                });
            },
            // 自定义选择权限管理范围
            addCustomDeal: function (item) {
                let self = this;
                // item.MenuBusinessType  17,4,21-门市可选   ''-不可选范围
                if (item.MenuBusinessType !== '') { // 可选范围
                    Bestone.util.vueJump({
                        path: '/applyPermission/mgmtLimit',
                        query: {
                            MenuId: item.MenuId,
                            MenuName: item.MenuName,
                            MenuBusinessType: item.MenuBusinessType
                        }
                    });
                } else { // 不可选范围
                    let isActived = false; // 是否已编辑
                    let newMenuItem = {
                        MenuID: item.MenuId,
                        BranchIds: [],
                        ButtonIds: [],
                        MenuName: item.MenuName,
                        BranchNames: [],
                        ButtonNames: [],
                    };
                    $.each(Bestone.applyData.MenuArr, function (k, v) {
                        if (v.MenuID == item.MenuId) {
                            Bestone.applyData.MenuArr.splice(k, 1, newMenuItem);
                            isActived = true;
                            return false;
                        }
                    });
                    if (!isActived) { // 如果没有编辑则添加一条新的
                        Bestone.applyData.MenuArr.push(newMenuItem);
                    }
                    // 获取当前已选菜单数
                    self.config.chose = Bestone.applyData.MenuArr.length;
                    Bestone.ui.ddSetRight({
                        control: true,
                        text: '下一步(' + Bestone.applyData.MenuArr.length + ')',
                        show: true,
                        onSuccess: function () {
                            self.submitApply();
                        }
                    });
                    Bestone.ui.message({
                        content: '添加成功'
                    });
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    #apply-permission {
        padding-top: 10px;
        padding-bottom: 60px;
        font-size: 14px;
        color: #404040;
        & > .choice-permission {
            margin-top: 10px;
            & > .choice-department {
                padding: 10px 15px;
                background-color: #fff;
            }
        }
        & > .search-content {
            background-color: #fff;
            padding: 10px 15px;
        }
        & > .explain-content {
            padding: 0px 15px;
        }
        & > .tree-view-content {
            margin-top: 10px;
            margin-bottom: 10px;
        }
        & > .explain {
            padding: 10px 15px;
            background-color: #fff;
            margin-top: 10px;
            & > .ui.ui-textarea {
                & > textarea {

                }
            }
        }
    }
</style>