<!-- 权限管理配置-新增权限管理配置 -->
<template>
    <div>
    <div id="add-permission-mgmt">
        <div class="search"><search-box :searchVal="config.searchBox.searchVal" :placeholder="config.searchBox.placeholder" @searchClick="searchClickDeal" @searchValChange="searchValChangeDeal"></search-box></div>
        <div class="ui ui-card-list">
            <ul v-if="data.list && data.list.length>0">
                <li v-for="(item,index) in data.list">
                    <div class="list-text">
                        <p>TDS账号：{{item.User_Name}}</p>
                        <p>姓名：{{item.User_UserName}}</p>
                        <p>账号所属公司：{{item.UserBranchName}}</p>
                    </div>
                    <v-touch tag="div" class="btn" @pressup.prevent="configClick(item,index)" @tap.prevent="configClick(item,index)">配置</v-touch>
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
        <div v-if="data.list && data.list.length<=0" class="ui no-data">{{config.noDataText}}</div>
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
                noDataText: '请搜索TDS业支端登录账户或姓名进行相关配置。',
                pageIndex: 1,
                pageSize: 10,
                isLoadAll: false, // 是否加载所有数据
                isSendAjax: false, // 是否发起请求
                isFirstAjax: true, // 是否第一次发起请求
                searchAjaxVal: '',
                searchBox: {
                    searchVal: '',
                    placeholder: '登录账号/姓名搜索'
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
                setTitle: '新增“权限管理”配置',
                reviewCallBack: function () {

                }
            });

            // 滚动加载
            Bestone.util.scrollRefresh({
                callback: function (height) {
                    if(!self.config.isFirstAjax && !self.config.isSendAjax && !self.config.isLoadAll) {
                        self.config.isSendAjax = true;
                        Bestone.util.ajax({
                            url: 'api/UserManage/GetUsers',
                            showLoad: false,
                            data: JSON.stringify({
                                PageIndex: self.config.pageIndex + 1,
                                PageSize: self.config.pageSize,
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
            textStatusDeal: function (arr) {
                return Bestone.util.textStatusDeal(arr);
            },
            configClick: function (item) {
                Bestone.util.vueJump({
                    path: '/permissionMgmtConfig/configPermissionMgmt',
                    query: {
                        UserID: item.User_ID,
                        UserName: item.User_Name,
                        UserUserName: item.User_UserName,
                        UserBranchName: item.UserBranchName,
                    }
                });
            },
            // 搜索点击
            searchClickDeal: function (str) {
                let self = this;
                self.config.isSendAjax = true;
                Bestone.util.ajax({
                    url: 'api/UserManage/GetUsers',
                    data: JSON.stringify({
                        PageIndex: 1,
                        PageSize: self.config.pageSize,
                        Keyword: str
                    }),
                    success: function (ajaxData) {
                        self.config.noDataText = '暂无数据';
                        self.config.isFirstAjax = false;
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
            searchValChangeDeal: function (str) {
                this.config.searchBox.searchVal=str; // 必须，用于父子组件数据双向绑定
            }
        }
    }
</script>

<style lang="scss" scoped>
    #add-permission-mgmt {
        padding-top: 10px;
        & > .search {
            background-color: #fff;
            padding: 10px 15px;
        }
    }
</style>