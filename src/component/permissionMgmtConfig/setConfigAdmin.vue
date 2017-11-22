<!-- 权限管理配置-新增权限管理配置 -->
<template>
    <div>
    <div id="set-config-admin">
        <div class="search"><search-box :searchVal="config.searchBox.searchVal" :placeholder="config.searchBox.placeholder" @searchClick="searchClickDeal" @searchValChange="searchValChangeDeal"></search-box></div>
        <div class="ui ui-card-list">
            <ul v-if="data.list && data.list.length>0">
                <li v-for="(item,index) in data.list">
                    <div class="list-text">
                        <p>TDS账号：{{item.User_Name}}</p>
                        <p>姓名：{{item.User_UserName}}</p>
                        <p>账号所属公司：{{item.Branch_Name}}</p>
                    </div>
                    <v-touch tag="div" class="btn" :class="item.Status==200 ? 'red' : ''" @pressup.prevent="changePermission(item,index)" @tap.prevent="changePermission(item,index)">{{item.Status==200 ? '移除权限' : '添加权限'}}</v-touch>
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
        <!-- 对话框 -->
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
                pageIndex: 1,
                pageSize: 10,
                isLoadAll: false, // 是否加载所有数据
                isSendAjax: false, // 是否发起请求
                isFirstAjax: true, // 是否第一次发起请求
                searchAjaxVal: '',
                searchBox: {
                    searchVal: '',
                    placeholder: '登录账号/姓名搜索'
                },
                needOper: {
                    item: {},
                    index: 0
                }, // 需要操作的item
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
            Bestone.ui.pageInit({
                setTitle: '设置“配置管理员”',
                reviewCallBack: function () {
                    self.config.isSendAjax = true;
                    Bestone.util.ajax({
                        url: 'api/AuthManage/GetUserWithRoleWhiteList',
                        data: JSON.stringify({
                            PageIndex: 1,
                            PageSize: self.config.pageSize,
                            Keyword: self.config.searchAjaxVal
                        }),
                        success: function (ajaxData) {
                            self.config.isFirstAjax = false;
                            self.data.list = ajaxData.data.list || [];
                            if(ajaxData.data.list.length<self.config.pageSize) {
                                self.config.isLoadAll = true;
                            }
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
                    if(!self.config.isFirstAjax && !self.config.isSendAjax && !self.config.isLoadAll) {
                        self.config.isSendAjax = true;
                        Bestone.util.ajax({
                            url: 'api/AuthManage/GetUserWithRoleWhiteList',
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
            // 修改权限
            changePermission: function (item,index) {
                let self = this;
                let text = '';
                self.config.needOper.item = item;
                self.config.needOper.index = index;
                if(item.Status==200) { // 已经添加
                    text = '移除';
                }else { // 未添加
                    text = '添加';
                }
                self.config.modalBox.content = '<p style="font-size: 14px;text-align: center;padding: 20px 0px;line-height: 16px;">确定' + text + ' <span style="color: #23A4FF;">' + item.User_UserName + '</span> 的权限？</p>';
                self.config.modalBox.isShow = true;
            },
            // 弹出框确认
            confirmClickDeal: function () {
                let self = this;
                let item = self.config.needOper.item;
                let index = self.config.needOper.index;
                if(item.Status==200) {
                    // 移除权限
                    Bestone.util.ajax({
                        url: 'api/AuthManage/DeleteRoleWhiteList',
                        data: JSON.stringify({
                            UserId: item.User_ID,
                            OperId: Bestone.user.id,
                            OperName: Bestone.user.name
                        }),
                        success: function (ajaxData) {
                            Bestone.ui.message({
                                content: '移除成功'
                            });
                            self.config.modalBox.isShow = false;

                            let newItem = item;
                            newItem.Status = 400
                            self.data.list.splice(index,1,newItem);
                        }
                    });
                }else {
                    // 添加权限
                    Bestone.util.ajax({
                        url: 'api/AuthManage/AddRoleWhiteList',
                        data: JSON.stringify({
                            UserId: item.User_ID,
                            OperId: Bestone.user.id,
                            OperName: Bestone.user.name
                        }),
                        success: function (ajaxData) {
                            Bestone.ui.message({
                                content: '添加成功'
                            });
                            self.config.modalBox.isShow = false;

                            let newItem = item;
                            newItem.Status = 200
                            self.data.list.splice(index,1,newItem);
                        }
                    });
                }
            },
            // 弹出框取消
            cancelClickDeal: function () {
                let self = this;
                self.config.modalBox.isShow = false;
            },
            // 搜索点击
            searchClickDeal: function (str) {
                let self = this;
                self.config.isSendAjax = true;
                Bestone.util.ajax({
                    url: 'api/AuthManage/GetUserWithRoleWhiteList',
                    data: JSON.stringify({
                        PageIndex: 1,
                        PageSize: self.config.pageSize,
                        Keyword: str
                    }),
                    success: function (ajaxData) {
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
    #set-config-admin {
        padding-top: 10px;
        & > .search {
            background-color: #fff;
            padding: 10px 15px;
        }
    }
</style>