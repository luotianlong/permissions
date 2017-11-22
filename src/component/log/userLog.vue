<!-- 我的权限日志 -->
<template><div>
    <div id="my-log">
        <div class="search"><search-box :searchVal="config.searchBox.searchVal" :placeholder="config.searchBox.placeholder" @searchClick="searchClickDeal" @searchValChange="searchValChangeDeal"></search-box></div>
        <div class="list">
            <ul v-if="data.list && data.list.length>0">
                <li v-for="(item,index) in data.list">
                    <div class="time">{{item.CreateDate}}</div>
                    <div class="content">
                        <p class="name">{{config.isSelf && item.BusinessType==1 ? '我' : item.UserName}}</p>
                        <p v-if="item.BusinessType==1" class="text">申请权限<v-touch tag="a" @pressup.prevent="viewDetail(item,index)" @tap.prevent="viewDetail(item,index)">（{{item.BusinessCode}}）</v-touch></p>
                        <p v-if="item.BusinessType==2" class="text">1级审核通过 {{config.isSelf ? '我' : item.ApplyUserName}} 的权限申请<v-touch tag="a" @pressup.prevent="viewDetail(item,index)" @tap.prevent="viewDetail(item,index)">（{{item.BusinessCode}}）</v-touch></p>
                        <p v-if="item.BusinessType==3" class="text">1级审核驳回 {{config.isSelf ? '我' : item.ApplyUserName}} 的权限申请<v-touch tag="a" @pressup.prevent="viewDetail(item,index)" @tap.prevent="viewDetail(item,index)">（{{item.BusinessCode}}）</v-touch></p>
                        <p v-if="item.BusinessType==4" class="text">2级审核通过 {{config.isSelf ? '我' : item.ApplyUserName}} 的权限申请<v-touch tag="a" @pressup.prevent="viewDetail(item,index)" @tap.prevent="viewDetail(item,index)">（{{item.BusinessCode}}）</v-touch><br/><span>系统开通了申请的权限。</span></p>
                        <p v-if="item.BusinessType==5" class="text">2级审核驳回 {{config.isSelf ? '我' : item.ApplyUserName}} 的权限申请<v-touch tag="a" @pressup.prevent="viewDetail(item,index)" @tap.prevent="viewDetail(item,index)">（{{item.BusinessCode}}）</v-touch></p>
                        <p v-if="item.BusinessType==6" class="text">新增 {{item.ApplyUserName}} {{item.BranchName}} {{item.RoleName}} 权限管理{{item.CheckLevel}}级审核。</p>
                        <p v-if="item.BusinessType==7" class="text">移除 {{item.ApplyUserName}} {{item.BranchName}} {{item.RoleName}} 权限管理{{item.CheckLevel}}级审核。</p>
                        <p v-if="item.BusinessType==8" class="text">新增 {{item.ApplyUserName}} {{item.RoleName}} 权限管理功能。</p>
                        <p v-if="item.BusinessType==9" class="text">移除 {{item.ApplyUserName}} {{item.RoleName}} 权限管理功能。</p>
                        <p v-if="item.BusinessType==10" class="text">新增 {{item.ApplyUserName}} 系统管理员身份。</p>
                        <p v-if="item.BusinessType==11" class="text">移除 {{item.ApplyUserName}} 系统管理员身份。</p>
                        <p v-if="item.BusinessType==12" class="text">新增 {{item.RoleName}} 所管理的权限。</p>
                        <p v-if="item.BusinessType==16" class="text">变更 {{item.RoleName}} 所管理的权限。</p>
                        <p v-if="item.BusinessType==13" class="text">移除了 {{config.isSelf ? '我' : item.ApplyUserName}} 的所有权限</p>
                        <p v-if="item.BusinessType==14 || item.BusinessType==15" class="text">移除了 {{config.isSelf ? '我' : item.ApplyUserName}} 的 {{item.BranchName || ''}}“{{item.MenuName}}”权限</p>
                    </div>
                </li>
            </ul>
            <div v-if="data.list && data.list.length<=0" class="no-data">暂无数据</div>
        </div>
        <div v-if="data.list.length>0" class="ui ui-scrollRefresh">
            <template v-if="!config.isLoadAll">
                <i class="iconfont icon-load"></i><span>加载中</span>
            </template>
            <template v-if="config.isLoadAll">
                <span>没有更多了</span>
            </template>
        </div>
    </div>
</div></template>

<script scoped>
    var initData = function () {
        return {
            data: {
                list: [],
            },
            config: {
                userId: 0, // 被查询的员工id
                isSelf: false, // 是否本人
                pageIndex: 1,
                pageSize: 20,
                isLoadAll: false, // 是否加载所有数据
                isSendAjax: false, // 是否发起请求
                isSendFirst: false, // 是否已发起第一次请求
                searchAjaxVal: '',
                searchBox: {
                    searchVal: '',
                    placeholder: '关键字搜索',
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
            self.config.userId = parseInt(Bestone.util.query().UserId,10);
            self.config.isSelf = !!Bestone.util.query().isSelf;

            Bestone.ui.pageInit({
                setTitle: '权限日志',
                reviewCallBack: function () {
                    // 获取日志
                    self.config.isSendAjax = true;
                    Bestone.util.ajax({
                        url: !!self.config.userId ? 'api/UserManage/GetUserLogList' : 'api/UserManage/GetLogList',
                        data: JSON.stringify({
                            PageIndex: 1,
                            PageSize: self.config.pageSize,
                            Keyword: self.config.searchAjaxVal,
                            UserId: self.config.userId
                        }),
                        success: function (ajaxData) {
                            self.config.isSendFirst = true;
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

            // 滚动加载
            Bestone.util.scrollRefresh({
                callback: function (height) {
                    if(!self.config.isSendAjax && !self.config.isLoadAll) {
                        self.config.isSendAjax = true;
                        Bestone.util.ajax({
                            url: !!self.config.userId ? 'api/UserManage/GetUserLogList' : 'api/UserManage/GetLogList',
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
            // 搜索点击
            searchClickDeal: function (str) {
                let self = this;
                self.config.isSendAjax = true;
                Bestone.util.ajax({
                    url: !!self.config.userId ? 'api/UserManage/GetUserLogList' : 'api/UserManage/GetLogList',
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
            searchValChangeDeal: function (str) {
                this.config.searchBox.searchVal=str; // 必须，用于父子组件数据双向绑定
            },
            // 查看详细
            viewDetail: function (item,index) {
                Bestone.util.vueJump({
                    path: '/applyRecord/applyRecordDetail',
                    query: {
                        ApplyId: item.ApplyId
                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    #my-log {
        padding-top: 10px;
        & > .search {
            background-color: #fff;
            padding: 10px 15px;
        }
        & > .list {
            padding: 10px 10px 0px;
            & > ul {
                & > li {
                    min-height: 45px;
                    padding: 5px 10px;
                    background-color: #fff;
                    border-radius: 5px;
                    font-size: 12px;
                    color: #404040;
                    margin-bottom: 10px;
                    & > .time {
                        line-height: 20px;
                        min-height: 20px;
                    }
                    & > .content {
                        line-height: 20px;
                        min-height: 20px;
                        margin-top: 5px;
                        overflow: hidden;
                        & > .name {
                            float: left;
                            width: 50px;
                            padding-right: 10px;
                            height: 20px;
                            line-height: 20px;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                        }
                        &>.text {
                            overflow: hidden;
                            &>a {
                                color: #0066CC;
                                display: inline-block;
                                height: 20px;
                                &:active {
                                    background-color: #eee;
                                }
                            }
                            &>span {
                                color: #0066CC;
                            }
                        }
                    }
                    &:last-child {
                        margin-bottom: 0px;
                    }
                }
            }
            &>.no-data {
                color: #999;
                font-size: 12px;
                line-height: 20px;
                text-align: center;
                margin-top: 40px;
            }
        }
    }
</style>
