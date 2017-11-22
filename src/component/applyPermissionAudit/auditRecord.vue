<!-- 审核记录 -->
<template>
    <div>
    <div id="audit-record">
        <div class="search"><search-box :searchVal="config.searchBox.searchVal" :placeholder="config.searchBox.placeholder" @searchClick="searchClickDeal" @searchValChange="searchValChangeDeal"></search-box></div>
        <div class="list">
            <ul>
                <li v-for="(item,index) in data.list">
                    <div class="list-text">
                        <p>申请人：{{item.ApplyUserName}}</p>
                        <p>权限名称：{{textStatusDeal(item.Menu_Name)}}</p>
                        <p>管理范围：{{textStatusDeal(item.TargetName)}}</p>
                    </div>
                    <div class="icon">
                        <i v-if="item.ApplyStatus==100 || item.ApplyStatus==101" class="iconfont one icon-weitongguo"></i>
                        <i v-if="item.ApplyStatus==200" class="iconfont two icon-yinzhangshenpitongguo"></i>
                        <i v-if="item.ApplyStatus==300" class="iconfont three icon-yinzhang-shenpibohui"></i>
                    </div>
                    <v-touch tag="div" class="view-detail-btn" @pressup.prevent="viewDetail(item,index)" @tap.prevent="viewDetail(item,index)">查看详细</v-touch>
                </li>
            </ul>
        </div>
        <div v-if="data.list && data.list.length<=0" class="ui no-data">暂无数据</div>
        <div v-if="data.list.length>0" class="ui ui-scrollRefresh">
            <template v-if="!config.isLoadAll">
                <i class="iconfont icon-load"></i><span>加载中</span>
            </template>
            <template v-if="config.isLoadAll">
                <span>没有更多了</span>
            </template>
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
                setTitle: '审核记录',
                reviewCallBack: function () {
                    Bestone.util.ajax({
                        url: 'api/PermissionManage/GetRoleApplyExamineList',
                        data: JSON.stringify({
                            PageIndex: 1,
                            PageSize: self.config.pageSize,
                            Keyword: self.config.searchAjaxVal,
                            Status: 2
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
                                Status: 2
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
                self.$data.data = initData().data;
                self.$data.config = initData().config;
            });
        },
        methods: {
            // 申请权限、管理范围状态处理
            textStatusDeal: function (arr) {
                return Bestone.util.textStatusDeal(arr);
            },
            viewDetail: function (item) {
                var self = this;
                Bestone.util.vueJump({
                    path: '/applyPermissionAudit/auditRecordDetail',
                    query: {
                        ApplyId: item.ApplyId
                    }
                });
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
                        Status: 2
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
    #audit-record {
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
                    padding: 10px;
                    margin-top: 10px;
                    overflow: hidden;
                    font-size: 12px;
                    & > .list-text {
                        & > p {
                            padding-right: 140px;
                            line-height: 20px;
                            color: #404040;
                            height: 20px;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            &.long-text {
                                padding-right: 0px;
                            }
                        }
                    }
                    & > .icon {
                        position: absolute;
                        right: 100px;
                        top: 4px;
                        & > i {
                            font-size: 36px;
                            &.one {
                                font-size: 48px;
                                line-height: 54px;
                                color: #FF8800;
                            }
                            &.two {
                                color: #1C93E7;
                            }
                            &.three {
                                color: #D81E06;
                            }
                        }
                    }
                    & > .view-detail-btn {
                        position: absolute;
                        top: 15px;
                        right: 10px;
                        cursor: pointer;
                        width: 73px;
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
    }
</style>