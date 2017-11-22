<!-- 权限管理-按权限-管理账户权限 -->
<template>
    <div>
    <div id="permission-mgmt">
        <div class="ui ui-text-list">
            <p>权限菜单：{{config.menuName}}</p>
            <p v-show="config.branchName.length>0">权限管理范围：{{config.branchName}}</p>
        </div>
        <div class="ui ui-title">拥有以上权限的账户如下：</div>
        <div v-if="data.list && data.list.length>0" class="ui ui-card-list">
            <ul>
                <li v-for="(item,index) in data.list" :key="item.Config_ID">
                    <div class="list-text">
                        <p>申请人：{{item.User_UserName}}</p>
                        <p>权限名称：{{item.Menu_Name}}</p>
                        <p>管理范围：{{item.Branch_Name}}</p>
                    </div>
                    <v-touch tag="div" class="btn" @pressup.prevent="mgmt(item,index)" @tap.prevent="mgmt(item,index)">移除权限</v-touch>
                </li>
            </ul>
        </div>
        <div v-if="data.list && data.list.length<=0" class="no-data">暂无数据</div>
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
                menuName: '',
                branchName: '',
                needClear: {
                    item: {},
                    index: 0
                }, // 需要移除权限的clear
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
                setTitle: '管理账户权限',
                reviewCallBack: function () {
                    // 获取菜单和管理范围名称
                    self.config.menuName = Bestone.util.query().MenuName || '';
                    self.config.branchName = Bestone.util.query().Branch_Name || '';

                    // 进入页面首次加载数据
                    Bestone.util.ajax({
                        url: 'api/UserManage/GetMenuUserConfigByRole',
                        data: JSON.stringify({
                            MenuCode: Bestone.util.query().MenuCode,
                            BranchId: parseInt(Bestone.util.query().Branch_ID || 0, 10)
                        }),
                        success: function (ajaxData) {
                            self.data.list.push(...ajaxData.data); // 更新数组
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
            // 管理范围状态处理
            textStatusDeal: function (arr) {
                return Bestone.util.textStatusDeal(arr);
            },
            mgmt: function (item,index) {
                let self = this;
                self.config.needClear.item = item;
                self.config.needClear.index = index;
                self.config.modalBox.content = '<p style="font-size: 14px;text-align: center;padding: 20px 0px;line-height: 16px;">确定移除 <span style="color: #23A4FF;">' + item.User_UserName + '</span> 的权限？</p>';
                self.config.modalBox.isShow = true;
            },
            // 弹出框确认
            confirmClickDeal: function () {
                let self = this;

                Bestone.util.ajax({
                    url: 'api/UserManage/DeleteMenuUserConfigById',
                    data: JSON.stringify({
                        ConfigId: self.config.needClear.item.Config_ID,
                        UserId: self.config.needClear.item.Config_UserID,
                        OperId: Bestone.user.id,
                        OperName: Bestone.user.name,
                    }),
                    success: function (ajaxData) {
                        self.config.modalBox.isShow = false;
                        self.data.list.splice(self.config.needClear.index,1);
                        Bestone.ui.message({
                            content: '操作成功！'
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
        padding-bottom: 10px;
        & > .ui-card-list {
            margin-bottom: 10px;
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