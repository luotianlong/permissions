<!-- 权限管理-按账号-管理账户权限 -->
<template>
    <div>
    <div id="permission-mgmt">
        <div class="ui ui-text-list">
            <p>TDS账号：{{config.userName}}</p>
            <p>姓名：{{config.userUserName}}</p>
            <p>账号所属公司：{{config.userBranchName}}</p>
        </div>
        <div class="ui ui-title">
            该账户所拥有的权限
            <v-touch tag="a" class="right-btn bg-btn bg-red" @pressup.prevent="clearAll" @tap.prevent="clearAll">清除所有权限</v-touch>
        </div>
        <div class="search-content">
            <search-box :searchVal="config.searchBox.searchVal" :placeholder="config.searchBox.placeholder" @searchClick="pageOneClickDeal" @searchValChange="pageOneValChangeDeal"></search-box>
        </div>
        <div v-if="data.list && data.list.length>0" class="ui ui-card-list">
            <ul>
                <li v-for="(item,index) in data.list">
                    <div class="list-text">
                        <p>权限名称：{{item.Menu_Name}}</p>
                        <p>管理范围：{{textStatusDeal(item.Branch_Name)}}</p>
                    </div>
                    <v-touch tag="div" class="btn" @pressup.prevent="mgmt(item,index)" @tap.prevent="mgmt(item,index)">查看详细</v-touch>
                </li>
            </ul>
        </div>
        <div v-if="data.list.length>0" class="ui ui-scrollRefresh">
            <template v-if="!config.isLoadAll">
                <i class="iconfont icon-load"></i><span>加载中</span>
            </template>
            <template v-if="config.isLoadAll">
                <span>没有更多了</span>
            </template>
        </div>
        <div v-if="data.list && data.list.length<=0" class="no-data">暂无数据</div>
        <div class="ui ui-bottom-btn" v-if="false">
            <v-touch tag="div" class="btn" @pressup.prevent="clearAll" @tap.prevent="clearAll">清除该账户所有权限</v-touch>
        </div>
        <!-- 清除所有对话框 -->
        <modal-box :setConfig="config.modalBox" @confirmClick="confirmClickDeal" @cancelClick="cancelClickDeal"></modal-box>
    </div>
</div>
</template>

<script scoped>
    var initData = function () {
        return {
            data: {
                list: []
            },
            config: {
                userId: 0,
                userName: '',
                userUserName: '',
                userBranchName: '',
                pageIndex: 1,
                pageSize: 20,
                isLoadAll: false, // 是否加载所有数据
                isSendAjax: false, // 是否发起请求
                searchAjaxVal: '',
                searchBox: {
                    searchVal: '',
                    placeholder: '权限名称/管理范围'
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
    };
    export default {
        data() {
            return new initData()
        },
        activated: function () {
            let self = this;
            // 获取url参数赋值
            self.config.userId = parseInt(Bestone.util.query().UserID,10);
            self.config.userName = Bestone.util.query().UserName || '';
            self.config.userUserName = Bestone.util.query().UserUserName || '';
            self.config.userBranchName = Bestone.util.query().UserBranchName || '';

            Bestone.ui.pageInit({
                setTitle: '管理账户权限',
                reviewCallBack: function () {

                }
            });

            Bestone.ui.ddSetRight({
                control: true,
                text: '日志',
                show: true,
                onSuccess: function () {
                    Bestone.util.vueJump({
                        path: '/log/userLog',
                        query: {
                            UserId: self.config.userId
                        }
                    });
                }
            });

            // 进入页面请求数据
            self.config.isSendAjax = true;
            Bestone.util.ajax({
                url: 'api/UserManage/GetMenuUserConfigAllByUser',
                data: JSON.stringify({
                    PageIndex: 1,
                    PageSize: self.config.pageSize,
                    UserId: self.config.userId,
                    Keyword: self.config.searchAjaxVal
                }),
                success: function (ajaxData) {
                    if(ajaxData.data.list.length<self.config.pageSize) {
                        self.config.isLoadAll = true;
                    }
                    self.config.pageIndex = 1; // 更新pageIndex
                    self.data.list = ajaxData.data.list || [];
                },
                complete: function () {
                    self.config.isSendAjax = false;
                }
            });

            // 滚动加载
            Bestone.util.scrollRefresh({
                callback: function (height) {
                    if(!self.config.isSendAjax && !self.config.isLoadAll) {
                        self.config.isSendAjax = true;
                        Bestone.util.ajax({
                            url: 'api/UserManage/GetMenuUserConfigAllByUser',
                            showLoad: false,
                            data: JSON.stringify({
                                PageIndex: self.config.pageIndex + 1,
                                PageSize: self.config.pageSize,
                                UserId: self.config.userId,
                                Keyword: self.config.searchAjaxVal
                            }),
                            success: function (ajaxData) {
                                if(ajaxData.data.list.length<self.config.pageSize) {
                                    self.config.isLoadAll = true;
                                }
                                self.config.pageIndex = ajaxData.data.page; // 更新pageIndex
                                self.data.list.push(...ajaxData.data.list); // 更新数组
                            },
                            complete: function () {
                                self.config.isSendAjax = false;
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
            // 管理范围状态处理
            textStatusDeal: function (str) {
                return Bestone.util.textStatusDeal(str);
            },
            mgmt: function (item) {
                let self = this;
                console.log(item)
                Bestone.util.vueJump({
                    path: '/permissionControl/accountMgmtDetail',
                    query: {
                        UserID: self.config.userId,
                        UserName: self.config.userName,
                        UserUserName: self.config.userUserName,
                        UserBranchName: self.config.userBranchName,
                        MenuCode: item.Menu_Code,
                        MenuName: item.Menu_Name
                    }
                });
            },
            // 搜索点击
            pageOneClickDeal: function (str) {
                let self = this;
                self.config.isSendAjax = true;
                Bestone.util.ajax({
                    url: 'api/UserManage/GetMenuUserConfigAllByUser',
                    data: JSON.stringify({
                        PageIndex: 1,
                        PageSize: self.config.pageSize,
                        UserId: self.config.userId,
                        Keyword: str
                    }),
                    success: function (ajaxData) {
                        self.config.searchAjaxVal = str;
                        self.config.pageIndex = 1;
                        if(ajaxData.data.list.length<self.config.pageSize) {
                            self.config.isLoadAll = true;
                        }else {
                            self.config.isLoadAll = false;
                        }
                        self.data.list = ajaxData.data.list || [];
                    },
                    complete: function () {
                        self.config.isSendAjax = false;
                    }
                });
            },
            // 输入框值改变
            pageOneValChangeDeal: function (str) {
                this.config.searchBox.searchVal = str; // 必须，用于父子组件数据双向绑定
            },
            // 清除所有权限
            clearAll: function () {
                let self = this;
                self.config.modalBox.content = '<p style="font-size: 14px;text-align: center;padding: 20px 0px;line-height: 16px;">确定清除该账户所有权限？</p>';
                self.config.modalBox.isShow = true;
            },
            // 弹出框确认
            confirmClickDeal: function () {
                let self = this;

                // 清除所有权限
                Bestone.util.ajax({
                    url: 'api/UserManage/DeleteMenuUserConfigByUser',
                    data: JSON.stringify({
                        UserId: self.config.userId,
                        OperId: Bestone.user.id,
                        OperName: Bestone.user.name,
                    }),
                    success: function (ajaxData) {
                        self.config.modalBox.isShow = false;
                        Bestone.ui.message({
                            content: '操作成功！'
                        });
                        self.config.isSendAjax = true;
                        // 操作成功后请求列表数据
                        Bestone.util.ajax({
                            url: 'api/UserManage/GetMenuUserConfigAllByUser',
                            data: JSON.stringify({
                                PageIndex: 1,
                                PageSize: self.config.pageSize,
                                UserId: self.config.userId,
                                Keyword: self.config.searchAjaxVal
                            }),
                            success: function (ajaxData) {
                                self.config.pageIndex = 1;
                                if(ajaxData.data.list.length<self.config.pageSize) {
                                    self.config.isLoadAll = true;
                                }else {
                                    self.config.isLoadAll = false;
                                }
                                self.data.list = ajaxData.data.list || [];
                            },
                            complete: function () {
                                self.config.isSendAjax = false;
                            }
                        });
                    }
                });
            },
            // 弹出框取消
            cancelClickDeal: function () {
                this.config.modalBox.isShow = false;
            }
        }
    }
</script>

<style lang="scss" scoped>
    #permission-mgmt {
        padding-top: 10px;
        &>.ui.ui-title {
            margin-top: 10px;
        }
        & > .search-content {
            background-color: #fff;
            padding: 10px 15px;
        }
        & > .ui-card-list {
        }
        & > .no-data {
            color: #999;
            font-size: 12px;
            line-height: 20px;
            text-align: center;
            margin-top: 50px;
            padding: 0px 20px;
            & > span {
                color: #38ADFF;
            }
        }
    }
</style>