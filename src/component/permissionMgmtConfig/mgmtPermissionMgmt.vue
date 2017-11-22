<!-- 权限管理配置-管理权限管理配置 -->
<template>
    <div>
    <div id="permission-control">
        <div class="search-content">
            <search-box :searchVal="config.searchBox.searchVal" :placeholder="config.searchBox.placeholder" @searchClick="ClickDeal" @searchValChange="ValChangeDeal"></search-box>
        </div>
        <div class="list-content">
            <div v-if="data.list && data.list.length>0" class="ui ui-card-list">
                <ul>
                    <v-touch tag="li" v-for="(item,index) in data.list" @pressup.prevent="checkBoxClick(data.list,index)" @tap.prevent="checkBoxClick(data.list,index)">
                        <div class="list-text">
                            <p>TDS账号：{{item.User_Name}}</p>
                            <p>姓名：{{item.User_UserName}}</p>
                            <p>账号所属公司：{{item.Branch_Name}}</p>
                            <p>管理的权限部门：{{item.RoleName}}</p>
                        </div>
                        <div class="ui ui-checkbox" :class="!!item.frontChecked ? 'checked' : ''">
                            <span class="icon-content"><i class="iconfont icon-gou"></i></span>
                        </div>
                    </v-touch>
                </ul>
            </div>
            <div v-if="data.list && data.list.length<=0" class="no-data">{{config.noDataText}}</div>
        </div>
        <div v-if="data.list.length>0" class="ui ui-scrollRefresh">
            <template v-if="!config.isLoadAll">
                <i class="iconfont icon-load"></i><span>加载中</span>
            </template>
            <template v-if="config.isLoadAll">
                <span>没有更多了</span>
            </template>
        </div>
        <div class="ui ui-bottom-btn" v-if="false">
            <v-touch tag="div" class="btn" @pressup.prevent="clearPermission" @tap.prevent="clearPermission">移除权限</v-touch>
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
                noDataText: '请输入条件搜索',
                pageIndex: 1,
                pageSize: 10,
                isLoadAll: false, // 是否加载所有数据
                isSendAjax: false, // 是否发起请求
                isSendFirst: false, // 是否已发起第一次请求
                searchAjaxVal: '',
                searchBox: {
                    searchVal: '',
                    placeholder: '登录账号/姓名/权限管理部门名称搜索',
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
            Bestone.ui.pageInit({
                setTitle: '管理“权限管理”配置',
                reviewCallBack: function () {

                }
            });

            Bestone.ui.ddSetRight({
                control: true,
                text: '移除权限',
                show: true,
                onSuccess: function () {
                    self.clearPermission();
                }
            });

            // 按账号数据滚动加载
            Bestone.util.scrollRefresh({
                callback: function (height) {
                    if(self.config.isSendFirst && !self.config.isSendAjax && !self.config.isLoadAll) {
                        self.config.isSendAjax = true;
                        Bestone.util.ajax({
                            url: 'api/AuthManage/GetRoleManageList',
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
            // 搜索点击
            ClickDeal: function (str) {
                let self = this;
                self.config.isSendAjax = true;
                Bestone.util.ajax({
                    url: 'api/AuthManage/GetRoleManageList',
                    data: JSON.stringify({
                        PageIndex: 1,
                        PageSize: self.config.pageSize,
                        Keyword: str
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
                        self.config.noDataText = '暂无数据';
                    },
                    complete: function () {
                        self.config.isSendAjax = false;
                    }
                });
            },
            // 输入框值改变
            ValChangeDeal: function (str) {
                this.config.searchBox.searchVal = str; // 必须，用于父子组件数据双向绑定
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
            // 移除权限
            clearPermission: function (item) {
                let self = this;

                // 移除id组
                var ids = '';
                $.each(self.data.list, function (k,v) {
                    if(!!v.frontChecked) {
                        ids = ids + v.Id + ',';
                    }
                });
                if (ids.length <= 0) {
                    Bestone.ui.message({
                        content: '请至少选择一个'
                    });
                    return;
                }

                self.config.modalBox.content = '<p style="font-size: 14px;text-align: center;padding: 20px 0px;line-height: 16px;">确定移除选中权限？</p>';
                self.config.modalBox.isShow = true;
            },
            // 弹出框确认
            confirmClickDeal: function () {
                let self = this;

                // 移除id组
                var ids = '';
                $.each(self.data.list, function (k,v) {
                    if(!!v.frontChecked) {
                        ids = ids + v.Id + ',';
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
                    url: 'api/AuthManage/DeleteRoleManage',
                    data: JSON.stringify({
                        Ids: ids,
                        OperId: Bestone.user.id,
                        OperName: Bestone.user.name
                    }),
                    success: function (ajaxData) {
                        Bestone.ui.message({
                            content: '移除成功'
                        });
                        self.config.modalBox.isShow = false;
                        // 删除成功后刷新列表
                        self.config.isSendAjax = true;
                        Bestone.util.ajax({
                            url: 'api/AuthManage/GetRoleManageList',
                            data: JSON.stringify({
                                PageIndex: 1,
                                PageSize: self.config.pageSize,
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
                let self = this;
                self.config.modalBox.isShow = false;
            },
        }
    }
</script>

<style lang="scss" scoped>
    #permission-control {
        padding-top: 10px;
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
</style>