<!-- 权限管理配置-新增权限管理配置-配置权限管理 -->
<template>
    <div>
    <div id="permission-mgmt">
        <div class="ui ui-text-list">
            <p>TDS账号：{{config.userName}}</p>
            <p>姓名：{{config.userUserName}}</p>
            <p>账号所属公司：{{config.userBranchName}}</p>
        </div>
        <div class="search-content" v-if="config.selectChoiceId !== ''">
            <search-box :searchVal="config.searchBox.searchVal" :placeholder="config.searchBox.placeholder" :suggest="config.searchBox.suggest" @searchClick="searchClickDeal" @searchValChange="searchValChangeDeal" @itemClick="itemClickDeal"></search-box>
        </div>
        <div class="ui ui-title">配置权限管理部门</div>
        <div class="tree-view-content" v-if="config.selectChoiceId !== ''">
            <tree-view :dataArr="data.treeView" :setConfig="config.treeView" @dataArrChange="dataArrChangeDeal"></tree-view>
        </div>
        <div class="ui ui-bottom-btn" v-if="false">
            <v-touch tag="div" class="btn" @pressup.prevent="submitConfig" @tap.prevent="submitConfig">提交配置</v-touch>
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
                treeView: []
            },
            config: {
                userID: 0,
                userName: '',
                userUserName: '',
                userBranchName: '',
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
                    showChoice: true,
                    keyConfig: {
                        name: 'RoleName',
                        id: 'Id',
                        childKey: 'ChildList'
                    },
                    locationConfig: {
                        key: 'id'
                    }
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
                setTitle: '配置权限管理',
                reviewCallBack: function () {
                    self.config.userID = Bestone.util.query().UserID || 0;
                    self.config.userName = Bestone.util.query().UserName || '';
                    self.config.userUserName = Bestone.util.query().UserUserName || '';
                    self.config.userBranchName = Bestone.util.query().UserBranchName || '';

                    // 按关键字获取权限管理部门
                    Bestone.util.ajax({
                        url: 'api/AuthManage/GetRolesByKeyword',
                        data: JSON.stringify({
                            Keyword: ''
                        }),
                        success: function (ajaxData) {
                            self.config.searchBox.suggest.data = Bestone.util.getTreeViewDataForSearch({
                                data: ajaxData.data || [],
                                name: 'RoleName',
                                id: 'Id',
                                childKey: 'ChildList'
                            });
                            self.data.treeView = ajaxData.data || [];
                        }
                    });
                }
            });

            Bestone.ui.ddSetRight({
                control: true,
                text: '提交',
                show: true,
                onSuccess: function () {
                    self.submitConfig();
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
            // 提交配置
            submitConfig: function () {
                let self = this;

                // 选中的权限部门列表
                var roleIds = '';
                $.each(self.data.treeView, function (k, v) {
                    if(!!v.frontActive && v.frontActive===1) {
                        roleIds = roleIds + v.Id + ',';
                    }
                });
                if (roleIds.length <= 0) {
                    Bestone.ui.message({
                        content: '请至少选择一个部门'
                    });
                    return;
                }

                self.config.modalBox.content = '<p style="font-size: 14px;text-align: center;padding: 20px 0px;line-height: 16px;">确定提交？</p>';
                self.config.modalBox.isShow = true;
            },
            // 弹出框确认
            confirmClickDeal: function () {
                let self = this;

                // 选中的权限部门列表
                var roleIds = '';
                $.each(self.data.treeView, function (k, v) {
                    if(!!v.frontActive && v.frontActive===1) {
                        roleIds = roleIds + v.Id + ',';
                    }
                });
                if (roleIds.length <= 0) {
                    Bestone.ui.message({
                        content: '请至少选择一个部门'
                    });
                    return;
                }
                roleIds = roleIds.substring(0,roleIds.length-1); // 去掉最后一个逗号

                Bestone.util.ajax({
                    url: 'api/AuthManage/AddRoleManange',
                    data: JSON.stringify({
                        UserId: self.config.userID,
                        RoleIds: roleIds,
                        OperId: Bestone.user.id,
                        OperName: Bestone.user.name
                    }),
                    success: function (ajaxData) {
                        Bestone.ui.message({
                            content: '权限管理配置成功',
                            notOper: true
                        });
                        self.config.modalBox.isShow = false;
                        setTimeout(function () {
                            window.app.$router.go(-1);
                        }, 500);
                    }
                });
            },
            // 弹出框取消
            cancelClickDeal: function () {
                let self = this;
                self.config.modalBox.isShow = false;
            },
            // 搜索点击
            searchClickDeal: function (str) {
                Bestone.ui.message({
                    content: '仅支持智能匹配搜索'
                });
            },
            // 输入框值改变
            searchValChangeDeal: function (str) {
                this.config.searchBox.searchVal = str; // 必须，用于父子组件数据双向绑定
            },
            // 搜索下拉框点击
            itemClickDeal: function (item) {
                let val = item.id;
                if (!!val) {
                    let $loca = $('.ui.tree-view .loca' + val);
                    $('.ui.tree-view .item').css('background-color', 'transparent');
                    if ($loca.length > 0) {
                        setTimeout(function () {
                            $loca.css('background-color', '#FFFBE6');
                            $(window).scrollTop($loca.offset().top - 5);
                        }, 100);
                    }
                }
            },
            // 树形列表数据双向绑定
            dataArrChangeDeal: function (arr) {
                let self = this;
                self.data.treeView = arr;
            }
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