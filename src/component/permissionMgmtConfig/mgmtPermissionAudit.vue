<!-- 权限管理配置-管理权限审核配置 -->
<template>
    <div>
    <div id="permission-control">
        <div class="ui ui-tab">
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
                        <v-touch tag="li" v-for="(item,index) in data.pageTwo.list" @pressup.prevent="checkBoxClick(data.pageTwo.list,index)" @tap.prevent="checkBoxClick(data.pageTwo.list,index)">
                            <div class="list-text">
                                <p>TDS账号：{{item.User_Name}}</p>
                                <p>姓名：{{item.User_UserName}}</p>
                                <p>账号所属公司：{{item.Up_Branch_Name}}</p>
                                <p>权限审核管理部门权限：{{item.RoleName}}</p>
                                <p>权限审核管理公司：{{item.Branch_Name}}</p>
                            </div>
                            <div class="ui ui-checkbox" :class="!!item.frontChecked ? 'checked' : ''">
                                <span class="icon-content"><i class="iconfont icon-gou"></i></span>
                            </div>
                            <p class="down-text">（{{item.CheckLevel}}级审核）</p>
                        </v-touch>
                    </ul>
                </div>
                <div v-if="data.pageTwo.list && data.pageTwo.list.length<=0" class="no-data">{{config.pageTwo.noDataText}}</div>
            </div>
            <div v-if="data.pageTwo.list.length>0" class="ui ui-scrollRefresh">
                <template v-if="!config.pageTwo.isLoadAll">
                    <i class="iconfont icon-load"></i><span>加载中</span>
                </template>
                <template v-if="config.pageTwo.isLoadAll">
                    <span>没有更多了</span>
                </template>
            </div>
            <div class="ui ui-bottom-btn" v-if="false">
                <v-touch tag="div" class="btn" @pressup.prevent="clearPermission" @tap.prevent="clearPermission">移除权限</v-touch>
            </div>
            <!-- 对话框 -->
            <modal-box :setConfig="config.pageTwo.modalBox" @confirmClick="confirmClickDeal" @cancelClick="cancelClickDeal"></modal-box>
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
                        placeholder: '搜索部门权限',
                        suggest: {
                            isShow: 1,
                            data: [],
                        }
                    },
                    treeView: {
                        isShow: 1,
                        isShowIcon: 2,
                        keyConfig: {
                            name: 'RoleName',
                            id: 'Id',
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
                        placeholder: '登录账号/姓名/权限管理公司名称搜索',
                    },
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
                    }
                }
            }
        }
    };
    export default {
        data() {
            return new initData()
        },
        watch: {
            'config.tabIndex': {
                handler: function (val, oldval) {
                    let self = this;
                    if(val===1) {
                        Bestone.ui.ddSetRight();
                    }else if(val===2) {
                        Bestone.ui.ddSetRight({
                            control: true,
                            text: '移除权限',
                            show: true,
                            onSuccess: function () {
                                self.clearPermission();
                            }
                        });
                    }
                },
                deep: true,
                immediate: true,
            },
        },
        activated: function () {
            let self = this;
            Bestone.ui.pageInit({
                setTitle: '管理“权限审核”配置',
                reviewCallBack: function () {
                    Bestone.util.ajax({
                        url: 'api/AuthManage/GetRolesByKeyword',
                        data: JSON.stringify({
                            Keyword: ''
                        }),
                        success: function (ajaxData) {
                            self.config.pageOne.searchBox.suggest.data = Bestone.util.getTreeViewDataForSearch({
                                data: ajaxData.data || [],
                                name: 'RoleName',
                                id: 'Id',
                                childKey: 'ChildList'
                            });
                            self.data.pageOne.treeView = ajaxData.data || [];
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
                            url: 'api/AuthManage/GetUserCheckByUser',
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
                if(!!val) {
                    let $loca = $('.ui.tree-view .loca' + val);
                    $('.ui.tree-view .item').css('background-color', 'transparent');
                    if ($loca.length > 0) {
                        setTimeout(function () {
                            $loca.css('background-color', '#FFFBE6');
                            $(window).scrollTop($loca.offset().top-5);
                        },100);
                    }
                }
            },
            // 树形组件点击按钮
            pageOneTreeMgmt: function (item) {
                Bestone.util.vueJump({
                    path: '/permissionMgmtConfig/mgmtPermissionAuditDetail',
                    query: {
                        RoleName: item.RoleName,
                        RoleId: item.Id
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
                    url: 'api/AuthManage/GetUserCheckByUser',
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
            // 选择
            checkBoxClick: function (arr,index) {
                let self = this;

                function getArr() {
                    return JSON.parse(JSON.stringify(arr[index]));
                };
                let statusOne = getArr();
                statusOne.frontChecked = true;
                let statusTwo = getArr();
                statusTwo.frontChecked = false;
                !!arr[index].frontChecked ? arr.splice(index, 1, statusTwo) : arr.splice(index, 1, statusOne);
            },
            clearPermission: function (item) {
                let self = this;

                // 移除id组
                var ids = '';
                $.each(self.data.pageTwo.list, function (k,v) {
                    if(!!v.frontChecked) {
                        ids = ids + v.id + ',';
                    }
                });
                if (ids.length <= 0) {
                    Bestone.ui.message({
                        content: '请至少选择一个'
                    });
                    return;
                }

                self.config.pageTwo.modalBox.content = '<p style="font-size: 14px;text-align: center;padding: 20px 0px;line-height: 16px;">确定移除选中权限？</p>';
                self.config.pageTwo.modalBox.isShow = true;
            },
            // 弹出框确认
            confirmClickDeal: function () {
                let self = this;
                // 移除id组
                var ids = '';
                $.each(self.data.pageTwo.list, function (k,v) {
                    if(!!v.frontChecked) {
                        ids = ids + v.id + ',';
                    }
                });
                if (ids.length <= 0) {
                    Bestone.ui.message({
                        content: '请至少选择一个'
                    });
                    return;
                }
                ids = ids.substring(0,ids.length-1); // 去掉最后一个逗号

                Bestone.util.ajax({
                    url: 'api/AuthManage/DeleteUserCheck',
                    data: JSON.stringify({
                        Ids: ids,
                        OperId: Bestone.user.id,
                        OperName: Bestone.user.name
                    }),
                    success: function (ajaxData) {
                        Bestone.ui.message({
                            content: '移除成功'
                        });
                        self.config.pageTwo.modalBox.isShow = false;
                        // 删除成功后刷新列表
                        self.config.pageTwo.isSendAjax = true;
                        Bestone.util.ajax({
                            url: 'api/AuthManage/GetUserCheckByUser',
                            data: JSON.stringify({
                                PageIndex: 1,
                                PageSize: self.config.pageTwo.pageSize,
                                Keyword: self.config.pageTwo.searchAjaxVal
                            }),
                            success: function (ajaxData) {
                                self.config.pageTwo.pageIndex = 1;
                                if(ajaxData.data.list.length<self.config.pageTwo.pageSize) {
                                    self.config.pageTwo.isLoadAll = true;
                                }else {
                                    self.config.pageTwo.isLoadAll = false;
                                }
                                self.data.pageTwo.list = ajaxData.data.list || [];
                            },
                            complete: function () {
                                self.config.pageTwo.isSendAjax = false;
                            }
                        });
                    }
                });
            },
            // 弹出框取消
            cancelClickDeal: function () {
                let self = this;
                self.config.pageTwo.modalBox.isShow = false;
            },
        }
    }
</script>

<style lang="scss" scoped>
    #permission-control {
        padding-top: 10px;
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
        &>.page-two {
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