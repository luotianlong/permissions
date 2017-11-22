<!-- 申请权限-最后确认 -->
<template>
    <div>
    <div id="apply-record-detail">
        <div class="ui ui-text-list">
            <template v-if="!!!config.proxyUserInfo.name">
                <p>申请账号：{{config.userInfo.user}}</p>
                <p>姓名：{{config.userInfo.name}}</p>
            </template>
            <template v-if="!!config.proxyUserInfo.name">
                <p>申请账号：{{config.proxyUserInfo.user}}</p>
                <p>申请人：{{config.proxyUserInfo.name}}</p>
            </template>
        </div>
        <div class="ui ui-title">申请权限列表</div>
        <div class="apply-list">
            <div class="ui ui-table">
                <table>
                    <col width="28.333%"/>
                    <col width="28.333%"/>
                    <col width="28.333%"/>
                    <col width="15%"/>
                    <thead>
                    <tr>
                        <th>申请权限名称</th>
                        <th>管理范围</th>
                        <th>导出权限</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,index) in config.menuArr">
                        <td>{{item.MenuName}}</td>
                        <td v-if="item.BranchIds.length>1"><v-touch tag="p" @tap.prevent="viewControlLimit(item)" @pressup.prevent="viewControlLimit(item)">{{item.BranchNames[0]}}等<i class="iconfont icon-gengduo"></i></v-touch></td>
                        <td v-if="item.BranchIds.length<=1">{{item.BranchNames[0] || '全部'}}</td>
                        <td>{{renderButtonNames(item.ButtonNames)}}</td>
                        <td><v-touch tag="p" @tap.prevent="deleteMenu(item,index)" @pressup.prevent="deleteMenu(item,index)" class="del-btn">删除</v-touch></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="ui ui-title">申请权限说明</div>
        <div class="instruction-content">{{config.explainValue}}</div>
        <div class="ui ui-bottom-btn" v-if="true">
            <v-touch tag="div" class="btn" @pressup.prevent="submit" @tap.prevent="submit">提交权限申请</v-touch>
        </div>
        <!-- 对话框 -->
        <modal-box :setConfig="config.modalBox" @confirmClick="confirmClickDeal" @cancelClick="cancelClickDeal"></modal-box>
    </div>
</div>
</template>

<script scoped>
    var initData = function () {
        return {
            data: {},
            config: {
                menuArr: [],
                userInfo: {
                    user: '',
                    name: '',
                    branchName: ''
                }, // 用户信息
                proxyUserInfo: {
                    user: '',
                    name: ''
                }, // 代为申请人信息
                explainValue: '', // 申请权限说明
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
        mounted: function () {

        },
        activated: function () {
            let self = this;
            Bestone.ui.pageInit({
                setTitle: '申请权限',
                reviewCallBack: function () {
                    // 判断数据是否失效
                    if (Bestone.applyData.RoleId === 0) {
                        Bestone.ui.message({
                            content: '数据已失效，请重新申请',
                            notOper: true
                        });
                        setTimeout(function () {
                            window.app.$router.go(-1);
                        }, 1000);
                        return;
                    }

                    self.config.menuArr = Bestone.applyData.MenuArr;
                    self.config.userInfo.user = Bestone.user.user;
                    self.config.userInfo.name = Bestone.user.name;
                    // 获取代为用户信息
                    self.config.proxyUserInfo.user = Bestone.applyData.ProxyApplyUserAccount;
                    self.config.proxyUserInfo.name = Bestone.applyData.ProxyApplyUserName;

                    self.config.explainValue = Bestone.applyData.ApplyDesc || '无';
                }
            });

            Bestone.ui.ddSetRight({
                control: true,
                text: '提交',
                show: true,
                onSuccess: function () {
                    self.submit();
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
            // 查看管理范围
            viewControlLimit: function (item) {
                let list = [];
                $.each(item.BranchNames, function (k,v) {
                    list.push({
                        name: v
                    })
                });
                Bestone.mgmtLimitData = list;
                Bestone.util.vueJump({
                    path: '/applyRecord/controlLimit',
                });
            },
            // 渲染按钮名称
            renderButtonNames: function (arr) {
                let renderText = '';
                if(arr.length<=0) {
                    renderText = '无';
                }else if(arr.length===1) {
                    renderText = arr[0];
                }else {
                    renderText = arr[0] + '等';
                }
                return renderText;
            },
            // 删除菜单
            deleteMenu: function (item,index) {
                let self = this;
                Bestone.applyData.MenuArr.splice(index,1);
            },
            // 提交权限申请
            submit: function () {
                let self  = this;
                if(!!Bestone.applyData.MenuArr && Bestone.applyData.MenuArr.length<=0) {
                    Bestone.ui.message({
                        content: '申请权限不能为空'
                    });
                    return;
                }

                self.config.modalBox.content = '<p style="font-size: 14px;text-align: center;padding: 20px 0px;line-height: 16px;">确定提交？</p>';
                self.config.modalBox.isShow = true;
            },
            // 弹出框确认
            confirmClickDeal: function () {
                let self = this;
                Bestone.util.ajax({
                    url: 'api/PermissionManage/RoleApply',
                    data: JSON.stringify({
                        RoleID: Bestone.applyData.RoleId, // 选择的部门
                        ApplyUserID: Bestone.user.id, // 申请人ID
                        ProxyApplyUserId: Bestone.applyData.ProxyApplyUserId, // 代为申请人ID
                        ApplyDesc: Bestone.applyData.ApplyDesc, // 描述
                        Menus: Bestone.applyData.MenuArr
                    }),
                    success: function (ajaxData) {
                        Bestone.ui.message({
                            content: '提交成功',
                            notOper: true
                        });
                        self.config.modalBox.isShow = false;
                        setTimeout(function () {
                            window.app.$router.go(-2);
                        },500);
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
    #apply-record-detail {
        padding-top: 10px;
        padding-bottom: 50px;
        & > .ui.ui-title {
            margin-top: 10px;
        }
        & > .apply-list {
            background-color: #fff;
            padding: 10px 15px;
            & > .ui.ui-table {
                .del-btn {
                    color: #FF4C4C;
                }
            }
        }
        &>.instruction-content {
            padding: 10px 15px;
            color: #666;
            line-height: 18px;
            background-color: #fff;
            margin-bottom: 10px;
        }
    }
</style>