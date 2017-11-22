<!-- 权限管理-按账号-管理账户权限-详细 -->
<template>
    <div>
    <div id="permission-mgmt">
        <div class="ui ui-text-list">
            <p>TDS账号：{{config.userName}}</p>
            <p>姓名：{{config.userUserName}}</p>
            <p>账号所属公司：{{config.userBranchName}}</p>
        </div>
        <div class="search-content">
            <search-box :searchVal="config.searchBox.searchVal" :placeholder="config.searchBox.placeholder" :suggest="config.searchBox.suggest" @searchClick="searchClickDeal" @searchValChange="searchValChangeDeal" @itemClick="itemClickDeal"></search-box>
        </div>
        <div class="ui ui-title">
            <p class="omit" style="width: 65%;">{{config.menuName}}权限管理范围</p>
            <v-touch tag="a" class="right-btn bg-btn bg-red" @pressup.prevent="clearAll" @tap.prevent="clearAll">移除该权限</v-touch>
        </div>
        <div class="tree-view-content">
            <tree-view :dataArr="data.treeView" :setConfig="config.treeView" @clear="clearDeal"></tree-view>
        </div>
        <div v-if="data.treeView && data.treeView.length<=0" class="ui no-data">暂无数据</div>
        <div class="ui ui-bottom-btn" v-if="false">
            <v-touch tag="div" class="btn" @pressup.prevent="clearAll" @tap.prevent="clearAll">移除该权限</v-touch>
        </div>
        <!-- 移除该权限对话框 -->
        <modal-box :setConfig="config.modalBox.clearAll" @confirmClick="clearAllConfirmClickDeal" @cancelClick="clearAllCancelClickDeal"></modal-box>
        <!-- 移除该权限某一范围对话框 -->
        <modal-box :setConfig="config.modalBox.clearOne" @confirmClick="clearOneConfirmClickDeal" @cancelClick="clearOneCancelClickDeal"></modal-box>
    </div>
</div>
</template>

<script scoped>
    var initData = function () {
        return {
            data: {
                treeView: []
            },
            config: {
                userId: 0,
                userName: '',
                userUserName: '',
                userBranchName: '',
                menuCode: '',
                menuName: '',
                clearOneNeedClear: {
                    item: {},
                    index: 0
                }, // 需要移除权限的clear
                modalBox: {
                    clearAll: {
                        isShow: false,
                        content: '',
                        btn: [{
                            text: '确定',
                            handel: 'confirmClick'
                        }, {
                            text: '取消',
                            handel: 'cancelClick'
                        }]
                    }, // 移除该权限
                    clearOne: {
                        isShow: false,
                        content: '',
                        btn: [{
                            text: '确定',
                            handel: 'confirmClick'
                        }, {
                            text: '取消',
                            handel: 'cancelClick'
                        }]
                    }, // 移除该权限某一范围
                },
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
                    isShowIcon: 2,
                    keyConfig: {
                        name: 'Branch_Name',
                        id: 'Config_ID',
                        childKey: 'ChildList',
                    },
                    btn: [{
                        iconFontClass: 'icon-shanchu',
                        color: '#FF4141',
                        handle: 'clear'
                    }],
                    locationConfig: {
                        key: 'id'
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
                setTitle: '管理账户权限',
                reviewCallBack: function () {
                    // 获取url参数赋值
                    self.config.userId = parseInt(Bestone.util.query().UserID,10);
                    self.config.userName = Bestone.util.query().UserName || '';
                    self.config.userUserName = Bestone.util.query().UserUserName || '';
                    self.config.userBranchName = Bestone.util.query().UserBranchName || '';
                    self.config.menuCode = Bestone.util.query().MenuCode || '';
                    self.config.menuName = Bestone.util.query().MenuName || '';

                    Bestone.util.ajax({
                        url: 'api/UserManage/GetMenuUserConfigByUser',
                        data: JSON.stringify({
                            MenuCode: self.config.menuCode,
                            UserId: self.config.userId,
                            Keyword: self.config.searchBox.searchVal
                        }),
                        success: function (ajaxData) {
                            self.config.searchBox.suggest.data = Bestone.util.getTreeViewDataForSearch({
                                data: ajaxData.data || [],
                                name: 'Branch_Name',
                                id: 'Config_ID',
                                childKey: 'ChildList',
                            });
                            self.data.treeView = ajaxData.data || [];
                        }
                    });
                }
            });
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
            // 移除该权限
            clearAll: function () {
                let self = this;
                self.config.modalBox.clearAll.content = '<p style="font-size: 14px;text-align: center;padding: 20px 0px;line-height: 16px;">确定移除该权限？</p>';
                self.config.modalBox.clearAll.isShow = true;
            },
            // 移除该权限弹出框确认
            clearAllConfirmClickDeal: function () {
                let self = this;

                // 移除该权限
                Bestone.util.ajax({
                    url: 'api/UserManage/DeleteMenuUserConfigByMenu',
                    data: JSON.stringify({
                        MenuCode: self.config.menuCode,
                        UserId: self.config.userId,
                        OperId: Bestone.user.id,
                        OperName: Bestone.user.name,
                    }),
                    success: function (ajaxData) {
                        Bestone.ui.message({
                            content: '操作成功！',
                            notOper: true
                        });
                        setTimeout(function () {
                            self.config.modalBox.clearAll.isShow = false;
                            window.app.$router.go(-1);
                        },1000);
                    }
                });
            },
            // 移除该权限弹出框取消
            clearAllCancelClickDeal: function () {
                this.config.modalBox.clearAll.isShow = false;
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
            // 搜索点击
            searchClickDeal: function (str) {
                let self = this;
                Bestone.ui.message({
                    content: '仅支持智能匹配搜索'
                });
            },
            // 输入框值改变
            searchValChangeDeal: function (str) {
                this.config.searchBox.searchVal = str; // 必须，用于父子组件数据双向绑定
                console.log(str);
            },
            // 单个清除
            clearDeal: function (item,index) {
                let self = this;
                self.config.clearOneNeedClear.item = item;
                self.config.clearOneNeedClear.index = index;
                self.config.modalBox.clearOne.content = '<p style="font-size: 14px;text-align: center;padding: 20px 0px;line-height: 16px;">确定移除' + item.Branch_Name + '？</p>';
                self.config.modalBox.clearOne.isShow = true;
            },
            // 单个清除弹出框确认
            clearOneConfirmClickDeal: function () {
                let self = this;

                // 移除该权限
                Bestone.util.ajax({
                    url: 'api/UserManage/DeleteMenuUserConfigById',
                    data: JSON.stringify({
                        ConfigId: self.config.clearOneNeedClear.item.Config_ID,
                        UserId: self.config.userId,
                        OperId: Bestone.user.id,
                        OperName: Bestone.user.name,
                    }),
                    success: function (ajaxData) {
                        Bestone.ui.message({
                            content: '操作成功！',
                            notOper: true
                        });
                        self.config.modalBox.clearOne.isShow = false;
                        self.data.treeView.splice(self.config.clearOneNeedClear.index,1);
                        if(self.data.treeView.length===0) {
                            setTimeout(function () {
                                window.app.$router.go(-1);
                            },1000);
                        }
                    }
                });
            },
            // 单个清除弹出框取消
            clearOneCancelClickDeal: function () {
                this.config.modalBox.clearOne.isShow = false;
            },
        }
    }
</script>

<style lang="scss" scoped>
    #permission-mgmt {
        padding-top: 10px;
        padding-bottom: 10px;
        & > .search-content {
            border-top: solid 1px #eee;
            background-color: #fff;
            padding: 10px 15px;
        }
        &>.ui-title {
            margin-top: 10px;
        }
        & > .tree-view-content {
            border-bottom: solid 1px #eee;
        }
    }
</style>