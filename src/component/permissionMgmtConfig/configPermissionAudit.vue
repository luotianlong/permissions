<!-- 权限管理配置-新增权限审核配置-配置权限审核 -->
<template>
    <div>
    <div id="mgmt-limit">
        <div class="ui ui-text-list">
            <p>TDS账号：{{config.userName}}</p>
            <p>姓名：{{config.userUserName}}</p>
            <p>账号所属公司：{{config.userBranchName}}</p>
        </div>
        <!-- 配置审核菜单 -->
        <div class="config-menu">
            <div class="ui ui-title">配置审核菜单</div>
            <div class="search">
                <search-box :searchVal="config.configMenu.searchBox.searchVal" :placeholder="config.configMenu.searchBox.placeholder" :suggest="config.configMenu.searchBox.suggest" @searchClick="configMenuClickDeal" @searchValChange="configMenuValChangeDeal" @itemClick="configMenuItemClickDeal"></search-box>
            </div>
            <div class="tree-view-content">
                <tree-view :dataArr="data.configMenu.treeView" :setConfig="config.configMenu.treeView" @dataArrChange="configMenuTreeDataChangeDeal" @treeMgmt="configMenuTreeMgmt"></tree-view>
            </div>
            <p class="prompting" v-if="data.configMenu.treeView && data.configMenu.treeView.length<=0">暂无数据</p>
        </div>
        <!-- 配置审核公司 -->
        <div class="config-company">
            <div class="ui ui-title">配置审核公司</div>
            <div class="tab">
                <v-touch tag="div" class="item" :class="config.tabIndex===1?'action':''" @tap.prevent="switchTab(1)" @pressup.prevent="switchTab(1)">1级审核（分公司）</v-touch>
                <v-touch tag="div" class="item" :class="config.tabIndex===2?'action':''" @tap.prevent="switchTab(2)" @pressup.prevent="switchTab(2)">2级审核（集团）</v-touch>
            </div>
            <div v-show="config.tabIndex===1">
                <div class="search">
                    <search-box :searchVal="config.configCompany.searchBox.searchVal" :placeholder="config.configCompany.searchBox.placeholder" :suggest="config.configCompany.searchBox.suggest" @searchClick="configCompanyClickDeal" @searchValChange="configCompanyValChangeDeal" @itemClick="configCompanyItemClickDeal"></search-box>
                </div>
                <div class="tree-view-content">
                    <tree-view :dataArr="data.configCompany.treeView" :setConfig="config.configCompany.treeView" @dataArrChange="configCompanyTreeDataChangeDeal" @treeMgmt="configCompanyTreeMgmt"></tree-view>
                </div>
                <p class="prompting" v-if="data.configCompany.treeView && data.configCompany.treeView.length<=0">暂无数据</p>
            </div>
            <div v-show="config.tabIndex===2">
                <p class="prompting">二级审核，不需要设置具体管理公司范围</p>
            </div>
        </div>
        <div class="ui ui-bottom-btn" v-if="false">
            <v-touch tag="div" class="btn" @pressup.prevent="submitConfig" @tap.prevent="submitConfig">提交配置</v-touch>
        </div>
        <!-- 对话框 -->
        <modal-box :setConfig="config.modalBox" @confirmClick="confirmClickDeal" @cancelClick="cancelClickDeal"></modal-box>
    </div>
</div>
</template>

<script scoped>
    var initData = function () {
        return {
            data: {
                configCompany: {
                    treeView: []
                },
                configMenu: {
                    treeView: []
                }
            },
            config: {
                userID: 0,
                userName: '',
                userUserName: '',
                userBranchName: '',
                tabIndex: 1, // 1-1级，2-2级
                modalBox: {
                    isShow: false,
                    content: '',
                    btn: [{
                        text: '确定',
                        handel: 'confirmClick'
                    }, {
                        text: '取消',
                        handel: 'cancelClick'
                    }]
                },
                configCompany: {
                    searchBox: {
                        searchVal: '',
                        placeholder: '公司名称搜索',
                        suggest: {
                            isShow: 1,
                            data: [],
                        }
                    },
                    treeView: {
                        isShow: 1,
                        isShowIcon: 2,
                        showChoice: true,
                        keyConfig: {
                            name: 'Branch_Name',
                            id: 'Branch_ID',
                            childKey: 'ChildList'
                        },
                        locationConfig: {
                            key: 'id'
                        }
                    }
                },
                configMenu: {
                    searchBox: {
                        searchVal: '',
                        placeholder: '搜索部门权限',
                        suggest: {
                            isShow: 1,
                            data: [],
                        }
                    },
                    treeView: {
                        isShow: 1,
                        isShowIcon: 2,
                        showChoice: true,
                        keyConfig: {
                            name: 'RoleName',
                            id: 'Id',
                            childKey: 'ChildList'
                        },
                        locationConfig: {
                            key: 'id'
                        }
                    }
                }
            }
        }
    };
    export default {
        data() {
            return new initData()
        },
        activated: function () {
            let self = this;
            Bestone.ui.pageInit({
                setTitle: '配置权限审核',
                reviewCallBack: function () {
                    self.config.userID = Bestone.util.query().UserID || 0;
                    self.config.userName = Bestone.util.query().UserName || '';
                    self.config.userUserName = Bestone.util.query().UserUserName || '';
                    self.config.userBranchName = Bestone.util.query().UserBranchName || '';
                    // 配置审核公司
                    Bestone.util.ajax({
                        url: 'api/UserManage/GetCompanyBranchList',
                        data: JSON.stringify({}),
                        success: function (ajaxData) {
                            // 去掉第一级集团
                            var getData = [];
                            $.each(ajaxData.data, function (k,v) {
                                getData.push(...v.ChildList);
                            });
                            self.config.configCompany.searchBox.suggest.data = Bestone.util.getTreeViewDataForSearch({
                                data: getData || [],
                                name: 'Branch_Name',
                                id: 'Branch_ID',
                                childKey: 'ChildList'
                            });
                            self.data.configCompany.treeView = getData || [];
                        }
                    });
                    // 配置审核菜单
                    Bestone.util.ajax({
                        url: 'api/AuthManage/GetRolesByKeyword',
                        data: JSON.stringify({
                            Keyword: ''
                        }),
                        success: function (ajaxData) {
                            self.config.configMenu.searchBox.suggest.data = Bestone.util.getTreeViewDataForSearch({
                                data: ajaxData.data || [],
                                name: 'RoleName',
                                id: 'Id',
                                childKey: 'ChildList'
                            });
                            self.data.configMenu.treeView = ajaxData.data || [];
                        }
                    });
                }
            });

            Bestone.ui.ddSetRight({
                control: true,
                text: '提交',
                show: true,
                onSuccess: function () {
                    self.submitConfig();
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
        methods: {
            // 切换tab
            switchTab: function (id) {
                this.config.tabIndex = id;
            },
            // 提交配置
            submitConfig: function () {
                let self = this;
                // 选中的机构列表
                var branchIds = '';
                if(self.config.tabIndex===1) { // 如果是一级审核
                    function recursive(arr) {
                        $.each(arr, function (k, v) {
                            if (!!v.frontActive && v.frontActive===1) {
                                branchIds = branchIds + v.Branch_ID + ',';
                            }
                            if (!!v.ChildList && v.ChildList.length > 0) { // 如果有子级
                                recursive(v.ChildList);
                            }
                        });
                    }
                    recursive(self.data.configCompany.treeView);

                    if (branchIds.length <= 0) {
                        Bestone.ui.message({
                            content: '请至少选择一家分公司'
                        });
                        return;
                    }
                }
                // 选中的权限部门列表
                var roleIds = '';
                $.each(self.data.configMenu.treeView, function (k, v) {
                    if(!!v.frontActive && v.frontActive===1) {
                        roleIds = roleIds + v.Id + ',';
                    }
                });
                if (roleIds.length <= 0) {
                    Bestone.ui.message({
                        content: '请至少选择一个部门'
                    });
                    return;
                }

                self.config.modalBox.content = '<p style="font-size: 14px;text-align: center;padding: 20px 0px;line-height: 16px;">确定提交？</p>';
                self.config.modalBox.isShow = true;
            },
            // 弹出框确认
            confirmClickDeal: function () {
                let self = this;
                // 选中的机构列表
                var branchIds = '';
                if(self.config.tabIndex===1) { // 如果是一级审核
                    function recursive(arr) {
                        $.each(arr, function (k, v) {
                            if (!!v.frontActive && v.frontActive===1) {
                                branchIds = branchIds + v.Branch_ID + ',';
                            }
                            if (!!v.ChildList && v.ChildList.length > 0) { // 如果有子级
                                recursive(v.ChildList);
                            }
                        });
                    }
                    recursive(self.data.configCompany.treeView);

                    if (branchIds.length <= 0) {
                        Bestone.ui.message({
                            content: '请至少选择一家分公司'
                        });
                        return;
                    }
                    branchIds = branchIds.substring(0,branchIds.length-1); // 去掉最后一个逗号
                }

                // 选中的权限部门列表
                var roleIds = '';
                $.each(self.data.configMenu.treeView, function (k, v) {
                    if(!!v.frontActive && v.frontActive===1) {
                        roleIds = roleIds + v.Id + ',';
                    }
                });
                if (roleIds.length <= 0) {
                    Bestone.ui.message({
                        content: '请至少选择一个部门'
                    });
                    return;
                }
                roleIds = roleIds.substring(0,roleIds.length-1); // 去掉最后一个逗号

                // 发起请求
                Bestone.util.ajax({
                    url: 'api/AuthManage/AddUserCheck',
                    data: JSON.stringify({
                        UserId: self.config.userID,
                        CheckLevel: self.config.tabIndex, // 1-分公司 2-集团
                        BranchIds: branchIds,
                        RoleIds: roleIds,
                        OperId: Bestone.user.id,
                        OperName: Bestone.user.name
                    }),
                    success: function (ajaxData) {
                        Bestone.ui.message({
                            content: '权限审核配置成功',
                            notOper: true
                        });
                        setTimeout(function () {
                            window.app.$router.go(-1);
                        }, 1000);
                    }
                });
            },
            // 弹出框取消
            cancelClickDeal: function () {
                let self = this;
                self.config.modalBox.isShow = false;
            },
            /***************************************  配置审核公司  ***************************************/
            // 搜索点击
            configCompanyClickDeal: function (str) {
                Bestone.ui.message({
                    content: '仅支持智能匹配搜索'
                });
            },
            // 输入框值改变
            configCompanyValChangeDeal: function (str) {
                this.config.configCompany.searchBox.searchVal = str; // 必须，用于父子组件数据双向绑定
            },
            // 搜索下拉框点击
            configCompanyItemClickDeal: function (item) {
                let val = item.id;
                if(!!val) {
                    let $loca = $('.config-company .ui.tree-view .loca' + val);
                    $('.config-company .ui.tree-view .item').css('background-color', 'transparent');
                    if ($loca.length > 0) {
                        setTimeout(function () {
                            $loca.css('background-color', '#FFFBE6');
                            $(window).scrollTop($loca.offset().top-5);
                        },100);
                    }
                }
            },
            // 树形组件数据更改
            configCompanyTreeDataChangeDeal: function (arr) {
                this.data.configCompany.treeView = arr; // 必须，用于父子组件数据双向绑定
                console.log(arr)
            },
            // 点击树形管理
            configCompanyTreeMgmt: function () {
                Bestone.util.vueJump({
                    path: '/permissionControl/permissionMgmt'
                });
            },
            /************************************  配置审核菜单  ***************************************/
            // 搜索点击
            configMenuClickDeal: function (str) {
                Bestone.ui.message({
                    content: '仅支持智能匹配搜索'
                });
            },
            // 输入框值改变
            configMenuValChangeDeal: function (str) {
                this.config.configMenu.searchBox.searchVal = str; // 必须，用于父子组件数据双向绑定
            },
            // 搜索下拉框点击
            configMenuItemClickDeal: function (item) {
                let val = item.id;
                if(!!val) {
                    let $loca = $('.config-menu .ui.tree-view .loca' + val);
                    $('.config-menu .ui.tree-view .item').css('background-color', 'transparent');
                    if ($loca.length > 0) {
                        setTimeout(function () {
                            $loca.css('background-color', '#FFFBE6');
                            $(window).scrollTop($loca.offset().top-5);
                        },100);
                    }
                }
            },
            // 树形组件数据更改
            configMenuTreeDataChangeDeal: function (arr) {
                this.data.configMenu.treeView = arr; // 必须，用于父子组件数据双向绑定
            },
            // 点击树形管理
            configMenuTreeMgmt: function () {
                Bestone.util.vueJump({
                    path: '/permissionControl/permissionMgmt'
                });
            },
        }
    }
</script>

<style lang="scss" scoped>
    #mgmt-limit {
        padding-bottom: 10px;
        & > .config-company,.config-menu {
            margin-top: 10px;
            .search {
                background-color: #fff;
                padding: 10px 15px;
            }
            .tree-view-content {
                margin-top: 10px;
            }
            .prompting {
                color: #999;
                font-size: 12px;
                line-height: 20px;
                text-align: center;
                margin-top: 10px;
                margin-bottom: 20px;
                padding: 0px 20px;
            }
        }
        & > .config-company {
            & > .tab {
                background-color: #fff;
                height: 40px;
                overflow: hidden;
                border-bottom: solid 1px #eee;
                & > .item {
                    position: relative;
                    width: 50%;
                    height: 40px;
                    float: left;
                    line-height: 40px;
                    font-size: 14px;
                    color: #666666;
                    text-align: center;
                    cursor: pointer;
                    user-select: none;
                    &::after {
                        content: '';
                        position: absolute;
                        width: 1px;
                        height: 26px;
                        background-color: #eee;
                        top: 7px;
                        right: 0px;
                    }
                    &.action {
                        color: #38ADFF;
                        &::before {
                            content: '';
                            position: absolute;
                            width: 99%;
                            height: 1px;
                            background-color: #38ADFF;
                            top: 0px;
                            left: 0px;
                        }
                    }
                    &:last-child {
                        float: right;
                        &::after {
                            width: 0px;
                        }
                        &.action {
                            &::before {
                                right: 0px;
                                left: auto;
                            }
                        }
                    }
                }
            }
        }
    }
</style>