<!-- 权限申请审核 -->
<template>
    <div>
    <div id="apply-permission-audit">
        <div class="search"><search-box :searchVal="config.searchBox.searchVal" :placeholder="config.searchBox.placeholder" @searchClick="searchClickDeal" @searchValChange="searchValChangeDeal"></search-box></div>
        <template v-if="data.list && data.list.length>0">
            <div class="ui ui-title">
                <p class="omit">你的等待审核权限申请</p>
                <v-touch tag="a" class="right-btn" @pressup.prevent="auditRecord" @tap.prevent="auditRecord">审核记录<i class="iconfont icon-you"></i></v-touch>
            </div>
            <div class="list">
                <ul>
                    <li v-for="(item,index) in data.list">
                        <div class="list-text">
                            <p>申请人：{{item.ApplyUserName}}</p>
                            <p>权限名称：{{textStatusDeal(item.Menu_Name)}}</p>
                            <p>管理范围：{{textStatusDeal(item.TargetName)}}</p>
                        </div>
                        <v-touch tag="div" class="audit-btn" @pressup.prevent="audit(item,index)" @tap.prevent="audit(item,index)">审核</v-touch>
                    </li>
                </ul>
            </div>
        </template>
        <div v-if="data.list && data.list.length<=0" class="no-data">你没有待审核权限申请</div>
        <div v-if="data.list.length>0" class="ui ui-scrollRefresh">
            <template v-if="!config.isLoadAll">
                <i class="iconfont icon-load"></i><span>加载中</span>
            </template>
            <template v-if="config.isLoadAll">
                <span>没有更多了</span>
            </template>
        </div>
        <div class="ui ui-bottom-btn" v-if="false">
            <v-touch tag="div" class="btn" @pressup.prevent="auditRecord" @tap.prevent="auditRecord">审核记录</v-touch>
        </div>
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
                pageIndex: 1,
                pageSize: 10,
                isLoadAll: false, // 是否加载所有数据
                isSendAjax: false, // 是否发起请求
                isSendFirst: false, // 是否已发起第一次请求
                searchAjaxVal: '',
                searchBox: {
                    searchVal: '',
                    placeholder: '权限名称/申请人名称',
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
                setTitle: '权限申请审核',
                reviewCallBack: function () {

                }
            });

            // 首次进入页面请求数据
            self.config.isSendAjax = true;
            Bestone.util.ajax({
                url: 'api/PermissionManage/GetRoleApplyExamineList',
                data: JSON.stringify({
                    PageIndex: 1,
                    PageSize: self.config.pageSize,
                    Keyword: self.config.searchAjaxVal,
                    Status: 1
                }),
                success: function (ajaxData) {
                    self.config.pageIndex = 1;
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

            // 数据滚动加载
            Bestone.util.scrollRefresh({
                callback: function (height) {
                    if(self.config.isSendFirst && !self.config.isSendAjax && !self.config.isLoadAll) {
                        self.config.isSendAjax = true;
                        Bestone.util.ajax({
                            url: 'api/PermissionManage/GetRoleApplyExamineList',
                            showLoad: false,
                            data: JSON.stringify({
                                PageIndex: self.config.pageIndex + 1,
                                PageSize: self.config.pageSize,
                                Keyword: self.config.searchAjaxVal,
                                Status: 1
                            }),
                            success: function (ajaxData) {
                                if(ajaxData.data.list.length<self.config.pageSize) {
                                    self.config.isLoadAll = true;
                                }
                                self.config.pageIndex = ajaxData.data.page; // 更新pageIndex
                                self.data.list.push(...ajaxData.data.list); // 更新树形数组
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
            audit: function (item) {
                Bestone.util.vueJump({
                    path: '/applyPermissionAudit/auditDetail',
                    query: {
                        ApplyId: item.ApplyId
                    }
                });
            },
            // 审核记录
            auditRecord: function () {
                Bestone.util.vueJump({path: '/applyPermissionAudit/auditRecord'});
            },
            // 搜索点击
            searchClickDeal: function (str) {
                let self = this;
                self.config.isSendAjax = true;
                Bestone.util.ajax({
                    url: 'api/PermissionManage/GetRoleApplyExamineList',
                    data: JSON.stringify({
                        PageIndex: 1,
                        PageSize: self.config.pageSize,
                        Keyword: str,
                        Status: 1
                    }),
                    success: function (ajaxData) {
                        self.config.searchAjaxVal = str;
                        self.config.pageIndex = 1;
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
            },
            // 输入框值改变
            searchValChangeDeal: function (str) {
                this.config.searchBox.searchVal=str; // 必须，用于父子组件数据双向绑定
            }
        }
    }
</script>

<style lang="scss" scoped>
    #apply-permission-audit {
        padding-top: 10px;
        & > .search {
            background-color: #fff;
            padding: 10px 15px;
        }
        & > .list {
            padding: 0px 10px;
            & > ul {
                & > li {
                    position: relative;
                    background-color: #fff;
                    border-radius: 5px;
                    padding: 10px 95px 10px 10px;
                    margin-top: 10px;
                    overflow: hidden;
                    font-size: 12px;
                    & > .list-text {
                        & > p {
                            line-height: 20px;
                            color: #404040;
                            height: 20px;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                        }
                    }
                    & > .audit-btn {
                        position: absolute;
                        top: 15px;
                        right: 10px;
                        cursor: pointer;
                        width: 60px;
                        height: 28px;
                        border: solid 1px #38ADFF;
                        color: #38ADFF;
                        line-height: 28px;
                        text-align: center;
                        border-radius: 3px;
                        user-select: none;
                        &:active {
                            background-color: #ddd;
                        }
                    }
                }
            }
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