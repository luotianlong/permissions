<!-- 权限管理-按权限-管理范围选择 -->
<template>
    <div>
    <div id="permission-limit">
        <div class="ui ui-title">菜单权限：{{data.titleName}}</div>
        <div class="tab" v-if="config.tabShow">
            <v-touch tag="div" class="item" :class="config.tabIndex===1?'action':''" @tap.prevent="switchTab(1)" @pressup.prevent="switchTab(1)">按公司</v-touch>
            <v-touch tag="div" class="item" :class="config.tabIndex===2?'action':''" @tap.prevent="switchTab(2)" @pressup.prevent="switchTab(2)">按门市</v-touch>
        </div>
        <!-- 按公司 -->
        <div v-show="config.tabIndex===1" class="page-one">
            <div class="search">
                <search-box :searchVal="config.pageOne.searchBox.searchVal" :placeholder="config.pageOne.searchBox.placeholder" :suggest="config.pageOne.searchBox.suggest" @searchClick="pageOneClickDeal" @searchValChange="pageOneValChangeDeal" @itemClick="pageOneItemClickDeal"></search-box>
            </div>
            <div class="tree-view-content">
                <div v-if="data.pageOne.treeView.length==0" class="no-data">暂无数据</div>
                <tree-view :dataArr="data.pageOne.treeView" :setConfig="config.pageOne.treeView" @dataArrChange="pageOneTreeDataChangeDeal" @treeMgmt="pageOneTreeMgmt"></tree-view>
            </div>
        </div>
        <!-- 按门市 -->
        <div v-show="config.tabIndex===2" class="page-two">
            <div class="search">
                <search-box :searchVal="config.pageTwo.searchBox.searchVal" :placeholder="config.pageTwo.searchBox.placeholder" @searchClick="pageTwoClickDeal" @searchValChange="pageTwoValChangeDeal"></search-box>
            </div>
            <div class="tree-view-content">
                <div v-if="data.pageTwo.treeView.length==0" class="no-data">暂无数据</div>
                <tree-view :dataArr="data.pageTwo.treeView" :setConfig="config.pageTwo.treeView" @dataArrChange="pageTwoTreeDataChangeDeal" @treeMgmt="pageTwoTreeMgmt"></tree-view>
                <div v-if="data.pageTwo.treeView.length>0" class="ui ui-scrollRefresh">
                    <template v-if="!config.pageTwo.isLoadAll">
                        <i class="iconfont icon-load"></i><span>加载中</span>
                    </template>
                    <template v-if="config.pageTwo.isLoadAll">
                        <span>没有更多了</span>
                    </template>
                </div>
            </div>
        </div>
        <!-- 功能菜单 -->
        <div class="function-menu" v-if="config.showFunctionMenu">
            <p>该菜单为功能菜单，无需选择范围</p>
            <v-touch tag="a" class="ui ui-button" @pressup.prevent="clickFunctionMenu" @tap.prevent="clickFunctionMenu">继续</v-touch>
        </div>
    </div>
</div>
</template>

<script scoped>
    var initData = function () {
        return {
            data: {
                titleName: '',
                pageOne: {
                    treeView: []
                },
                pageTwo: {
                    treeView: []
                }
            },
            config: {
                showFunctionMenu: false, // 是否显示功能菜单提示框
                tabIndex: 0, // 1-按公司，2-按门市
                tabShow: false, // 是否显示tab
                pageOne: {
                    searchBox: {
                        searchVal: '',
                        placeholder: '公司名称',
                        suggest: {
                            isShow: 1,
                            data: [],
                        }
                    },
                    treeView: {
                        isShow: 1,
                        isShowIcon: 1,
                        keyConfig: {
                            name: 'Branch_Name',
                            id: 'Branch_ID',
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
                    pageIndex: 1,
                    pageSize: 20,
                    isLoadAll: false, // 是否加载所有数据
                    isSendAjax: false, // 是否发起请求
                    searchAjaxVal: '',
                    searchBox: {
                        searchVal: '',
                        placeholder: '门市名称'
                    },
                    treeView: {
                        isShow: 1,
                        isShowIcon: 2,
                        keyConfig: {
                            name: 'Branch_Name',
                            id: 'Branch_ID',
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
                setTitle: '管理范围选择',
                reviewCallBack: function () {
                    // title
                    self.data.titleName = Bestone.util.query().MenuName;

                    // 按门市
                    function storeAjaxGet() {
                        self.config.pageTwo.isSendAjax = true;
                        Bestone.util.ajax({
                            url: 'api/UserManage/GetStoreBranchList',
                            showLoad: false,
                            data: JSON.stringify({
                                PageIndex: self.config.pageTwo.pageIndex,
                                PageSize: self.config.pageTwo.pageSize,
                                Keyword: self.config.pageTwo.searchAjaxVal
                            }),
                            success: function (ajaxData) {
                                if(ajaxData.data.list.length<self.config.pageTwo.pageSize) {
                                    self.config.pageTwo.isLoadAll = true;
                                }
                                self.data.pageTwo.treeView = ajaxData.data.list || [];
                                Bestone.ui.hideLoadingFrame();
                                // 根据获取的数据渲染页面
                                if(self.data.pageOne.treeView.length>0) {
                                    self.config.tabIndex = 1;
                                    if(self.data.pageTwo.treeView.length>0) {
                                        self.config.tabShow = true;
                                    }
                                }else { // 功能菜单，不需要选择范围
                                    self.config.showFunctionMenu = true;
                                    Bestone.util.vueJump({
                                        path: '/permissionControl/permissionMgmt',
                                        query: {
                                            MenuName: Bestone.util.query().MenuName,
                                            MenuCode: Bestone.util.query().MenuCode
                                        }
                                    });
                                }
                            },
                            complete: function () {
                                self.config.pageTwo.isSendAjax = false;
                            }
                        });
                    }

                    // 按公司
                    Bestone.ui.loadingFrame();
                    Bestone.util.ajax({
                        url: 'api/UserManage/GetCompanyBranchList',
                        showLoad: false,
                        data: JSON.stringify({}),
                        success: function (ajaxData) {
                            self.config.pageOne.searchBox.suggest.data = Bestone.util.getTreeViewDataForSearch({
                                data: ajaxData.data || [],
                                name: 'Branch_Name',
                                id: 'Branch_ID',
                                childKey: 'ChildList'
                            });
                            self.data.pageOne.treeView = ajaxData.data || [];
                            storeAjaxGet();
                        }
                    });
                }
            });

            // 门市数据滚动加载
            Bestone.util.scrollRefresh({
                callback: function (height) {
                    if(self.config.tabIndex===2 && !self.config.pageTwo.isSendAjax && !self.config.pageTwo.isLoadAll) {
                        self.config.pageTwo.isSendAjax = true;
                        Bestone.util.ajax({
                            url: 'api/UserManage/GetStoreBranchList',
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
                                self.data.pageTwo.treeView.push(...ajaxData.data.list); // 更新树形数组
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
            // 功能菜单情况点击跳转
            clickFunctionMenu: function () {
                Bestone.util.vueJump({
                    path: '/permissionControl/permissionMgmt',
                    query: {
                        MenuName: Bestone.util.query().MenuName,
                        MenuCode: Bestone.util.query().MenuCode
                    }
                });
            },
            /***************************************  按公司  ***************************************/
            // 搜索点击
            pageOneClickDeal: function (str) {
                console.log(str)
            },
            // 输入框值改变
            pageOneValChangeDeal: function (str) {
                this.config.pageOne.searchBox.searchVal = str; // 必须，用于父子组件数据双向绑定
            },
            // 搜索下拉框点击
            pageOneItemClickDeal: function (item) {
                let val = item.id;
                if(!!val) {
                    let $loca = $('.page-one .ui.tree-view .loca' + val);
                    $('.page-one .ui.tree-view .item').css('background-color', 'transparent');
                    if ($loca.length > 0) {
                        setTimeout(function () {
                            $loca.css('background-color', '#FFFBE6');
                            $(window).scrollTop($loca.offset().top-5);
                        },100);
                    }
                }
            },
            // 树形组件数据更改
            pageOneTreeDataChangeDeal: function (arr) {
                this.data.pageOne.treeView = arr; // 必须，用于父子组件数据双向绑定
                console.log(arr)
            },
            // 点击树形管理
            pageOneTreeMgmt: function (item) {
                Bestone.util.vueJump({
                    path: '/permissionControl/permissionMgmt',
                    query: {
                        MenuName: Bestone.util.query().MenuName,
                        MenuCode: Bestone.util.query().MenuCode,
                        Branch_ID: item.Branch_ID,
                        Branch_Name: item.Branch_Name
                    }
                });
            },
            /************************************  按门市  ***************************************/
            // 搜索点击
            pageTwoClickDeal: function (str) {
                let self = this;
                self.config.pageTwo.isSendAjax = true;
                Bestone.util.ajax({
                    url: 'api/UserManage/GetStoreBranchList',
                    data: JSON.stringify({
                        PageIndex: 1,
                        PageSize: self.config.pageTwo.pageSize,
                        Keyword: str
                    }),
                    success: function (ajaxData) {
                        self.config.pageTwo.searchAjaxVal = str;
                        self.config.pageTwo.pageIndex = 1;
                        if(ajaxData.data.list.length<self.config.pageTwo.pageSize) {
                            self.config.pageTwo.isLoadAll = true;
                        }else {
                            self.config.pageTwo.isLoadAll = false;
                        }
                        self.data.pageTwo.treeView = ajaxData.data.list || [];
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
            // 树形组件数据更改
            pageTwoTreeDataChangeDeal: function (arr) {
                this.data.pageTwo.treeView = arr; // 必须，用于父子组件数据双向绑定
            },
            // 点击树形管理
            pageTwoTreeMgmt: function (item) {
                Bestone.util.vueJump({
                    path: '/permissionControl/permissionMgmt',
                    query: {
                        MenuName: Bestone.util.query().MenuName,
                        MenuCode: Bestone.util.query().MenuCode,
                        Branch_ID: item.Branch_ID,
                        Branch_Name: item.Branch_Name
                    }
                });
            },
        }
    }
</script>

<style lang="scss" scoped>
    #permission-limit {
        padding-top: 10px;
        & > .tab {
            background-color: #fff;
            height: 40px;
            overflow: hidden;
            border-bottom: solid 1px #eee;
            margin-bottom: 10px;
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
        & > .page-one,.page-two {
            & > .search {
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
        &>.page-one {
            padding-bottom: 10px;
        }
        &>.function-menu {
            margin-top: 60px;
            text-align: center;
            &>p {
                padding: 30px 15px;
                line-height: 18px;
                font-size: 14px;
                color: #999;
                text-align: center;
            }
            &>a {
                margin-top: 20px;
            }
        }
    }
</style>