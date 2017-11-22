<!-- 权限管控 -->
<template>
    <div>
    <div id="permission-control">
        <div class="tab">
            <v-touch tag="div" class="item" :class="config.tabIndex===1?'action':''" @tap.prevent="switchTab(1)" @pressup.prevent="switchTab(1)">按权限</v-touch>
            <v-touch tag="div" class="item" :class="config.tabIndex===2?'action':''" @tap.prevent="switchTab(2)" @pressup.prevent="switchTab(2)">按账号</v-touch>
        </div>
        <!-- 按权限 -->
        <div v-show="config.tabIndex===1" class="page-one">
            <div class="search-content">
                <search-box :searchVal="config.pageOne.searchBox.searchVal" :placeholder="config.pageOne.searchBox.placeholder" :suggest="config.pageOne.searchBox.suggest" @searchClick="pageOneClickDeal" @searchValChange="pageOneValChangeDeal" @itemClick="itemClickDeal"></search-box>
            </div>
            <div class="tree-view-content">
                <div v-if="data.pageOne.treeView.length==0" class="no-data">暂无数据</div>
                <tree-view :dataArr="data.pageOne.treeView" :setConfig="config.pageOne.treeView" @treeMgmt="pageOneTreeMgmt"></tree-view>
            </div>
        </div>
        <!-- 按账号 -->
        <div v-show="config.tabIndex===2" class="page-two">
            <div class="search-content">
                <search-box :searchVal="config.pageTwo.searchBox.searchVal" :placeholder="config.pageTwo.searchBox.placeholder" @searchClick="pageTwoClickDeal" @searchValChange="pageTwoValChangeDeal"></search-box>
            </div>
            <div class="list-content">
                <div v-if="data.pageTwo.list && data.pageTwo.list.length>0" class="ui ui-card-list">
                    <ul>
                        <li v-for="(item,index) in data.pageTwo.list">
                            <div class="list-text">
                                <p>TDS账号：{{item.User_Name}}</p>
                                <p>姓名：{{item.User_UserName}}</p>
                                <p>账号所属公司：{{item.UserBranchName}}</p>
                            </div>
                            <v-touch tag="div" class="btn" @pressup.prevent="mgmt(item,index)" @tap.prevent="mgmt(item,index)">管理权限</v-touch>
                        </li>
                    </ul>
                </div>
                <div v-if="data.pageTwo.list.length>0" class="ui ui-scrollRefresh">
                    <template v-if="!config.pageTwo.isLoadAll">
                        <i class="iconfont icon-load"></i><span>加载中</span>
                    </template>
                    <template v-if="config.pageTwo.isLoadAll">
                        <span>没有更多了</span>
                    </template>
                </div>
                <div v-if="data.pageTwo.list && data.pageTwo.list.length<=0" class="no-data">{{config.pageTwo.noDataText}}</div>
            </div>
        </div>
    </div>
</div>
</template>

<script scoped>
    var initData = function () {
        return {
            data: {
                pageOne: {
                    treeView: []
                },
                pageTwo: {
                    list: []
                }
            },
            config: {
                tabIndex: 1, // 1-按权限，2-按账号
                pageOne: {
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
                            id: 'MenuCode',
                            childKey: 'ChildList'
                        },
                        btn: [{
                            iconFontClass: 'icon-manager',
                            color: '#E5B626',
                            handle: 'treeMgmt'
                        }],
                        locationConfig: {
                            key: 'id'
                        }
                    }
                },
                pageTwo: {
                    noDataText: '请输入条件搜索',
                    pageIndex: 1,
                    pageSize: 10,
                    isLoadAll: false, // 是否加载所有数据
                    isSendAjax: false, // 是否发起请求
                    isSendFirst: false, // 是否已发起第一次请求
                    searchAjaxVal: '',
                    searchBox: {
                        searchVal: '',
                        placeholder: '登录账号/姓名搜索',
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
                setTitle: '权限管控',
                reviewCallBack: function () {
                    // 请求权限菜单
                    Bestone.util.ajax({
                        url: 'api/UserManage/GetUserRoleMenus',
                        data: JSON.stringify({
                            Keyword: ''
                        }),
                        success: function (ajaxData) {
                            self.config.pageOne.searchBox.suggest.data = Bestone.util.getTreeViewDataForSearch({
                                data: ajaxData.data,
                                name: 'MenuName',
                                id: 'MenuCode',
                                childKey: 'ChildList'
                            });
                            // 一级不展示按钮
                            $.each(ajaxData.data, function (k,v) {
                                v.frontNoShowBtn = ['treeMgmt'];
                            });
                            self.data.pageOne.treeView = ajaxData.data;
                        }
                    });
                }
            });

            // 按账号数据滚动加载
            Bestone.util.scrollRefresh({
                callback: function (height) {
                    if(self.config.tabIndex===2 && self.config.pageTwo.isSendFirst && !self.config.pageTwo.isSendAjax && !self.config.pageTwo.isLoadAll) {
                        self.config.pageTwo.isSendAjax = true;
                        Bestone.util.ajax({
                            url: 'api/UserManage/GetUsers',
                            showLoad: false,
                            data: JSON.stringify({
                                PageIndex: self.config.pageTwo.pageIndex + 1,
                                PageSize: self.config.pageTwo.pageSize,
                                Keyword: self.config.pageTwo.searchAjaxVal
                            }),
                            success: function (ajaxData) {
                                if(ajaxData.data.list.length<self.config.pageTwo.pageSize) {
                                    self.config.pageTwo.isLoadAll = true;
                                }
                                self.config.pageTwo.pageIndex = ajaxData.data.page; // 更新pageIndex
                                self.data.pageTwo.list.push(...ajaxData.data.list); // 更新树形数组
                            },
                            complete: function () {
                                self.config.pageTwo.isSendAjax = false;
                            }
                        });
                    }
                }
            })
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
            /*******************************************按权限****************************************/
            // 搜索点击
            pageOneClickDeal: function (str) {
                Bestone.ui.message({
                    content: '仅支持智能匹配搜索'
                });
            },
            // 输入框值改变
            pageOneValChangeDeal: function (str) {
                this.config.pageOne.searchBox.searchVal = str; // 必须，用于父子组件数据双向绑定
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
            // 树形组件点击按钮
            pageOneTreeMgmt: function (item) {
                console.log(item)
                var url = '';
                if(item.MenuType==1) { // 功能菜单
                    url = '/permissionControl/permissionMgmt';
                }else if(item.MenuType==2) { // 业务菜单（需要设置管理范围）
                    url = '/permissionControl/permissionLimit';
                }
                Bestone.util.vueJump({
                    path: url,
                    query: {
                        MenuName: item.MenuName,
                        MenuCode: item.MenuCode
                    }
                });
            },
            /*******************************************按账号****************************************/
            // 搜索点击
            pageTwoClickDeal: function (str) {
                let self = this;
                // 按关键字获取员工账号
                self.config.pageTwo.isSendAjax = true;
                Bestone.util.ajax({
                    url: 'api/UserManage/GetUsers',
                    data: JSON.stringify({
                        PageIndex: 1,
                        PageSize: self.config.pageTwo.pageSize,
                        Keyword: str
                    }),
                    success: function (ajaxData) {
                        self.config.pageTwo.searchAjaxVal = str;
                        self.config.pageTwo.pageIndex = 1;
                        self.config.pageTwo.isSendFirst = true;
                        if(ajaxData.data.list.length<self.config.pageTwo.pageSize) {
                            self.config.pageTwo.isLoadAll = true;
                        }else {
                            self.config.pageTwo.isLoadAll = false;
                        }
                        self.data.pageTwo.list = ajaxData.data.list || [];
                        self.config.pageTwo.noDataText = '暂无数据';
                    },
                    complete: function () {
                        self.config.pageTwo.isSendAjax = false;
                    }
                });
            },
            // 输入框值改变
            pageTwoValChangeDeal: function (str) {
                this.config.pageTwo.searchBox.searchVal = str; // 必须，用于父子组件数据双向绑定
            },
            // 管理范围状态处理
            textStatusDeal: function (arr) {
                return Bestone.util.textStatusDeal(arr);
            },
            mgmt: function (item) {
                Bestone.util.vueJump({
                    path: '/permissionControl/accountMgmt',
                    query: {
                        UserID: item.User_ID,
                        UserName: item.User_Name,
                        UserUserName: item.User_UserName,
                        UserBranchName: item.UserBranchName
                    }
                });
            },
        }
    }
</script>

<style lang="scss" scoped>
    #permission-control {
        padding-top: 10px;
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
        & > .page-one {
            padding-bottom: 10px;
            & > .search-content {
                background-color: #fff;
                padding: 10px 15px;
            }
            & > .tree-view-content {
                margin-top: 10px;
                & > .no-data {
                    color: #999;
                    font-size: 12px;
                    line-height: 20px;
                    text-align: center;
                    margin-top: 50px;
                    padding: 0px 20px;
                }
            }
        }
        & > .page-two {
            & > .search-content {
                background-color: #fff;
                padding: 10px 15px;
            }
            & > .list-content {
                margin-top: 10px;
                & > .no-data {
                    color: #999;
                    font-size: 12px;
                    line-height: 20px;
                    text-align: center;
                    margin-top: 50px;
                    padding: 0px 20px;
                }
            }
        }
    }
</style>