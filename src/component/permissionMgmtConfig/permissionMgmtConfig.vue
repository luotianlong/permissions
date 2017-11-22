<!-- 权限管理配置 -->
<template>
    <div>
    <div id="permission-mgmt-config">
        <div class="ui ui-text-list">
            <p>功能说明：此功能为配置功能，配置权限审核及管理的功能权限。</p>
        </div>
        <div class="ui ui-normal-list">
            <ul>
                <v-touch tag="li" v-for="(item,index) in data.list" :key="item.id" @pressup.prevent="jump(item)" @tap.prevent="jump(item)">
                    <p>{{item.name}}</p>
                    <i class="iconfont icon-you"></i>
                </v-touch>
            </ul>
        </div>
    </div>
</div>
</template>

<script scoped>
    var initData = function () {
        return {
            data: {
                list: [{
                    name: '新增“权限审核”配置',
                    id: 1,
                    path: '/permissionMgmtConfig/addPermissionAudit'
                },{
                    name: '管理“权限审核”配置',
                    id: 2,
                    path: '/permissionMgmtConfig/mgmtPermissionAudit'
                },{
                    name: '新增“权限管理”配置',
                    id: 3,
                    path: '/permissionMgmtConfig/addPermissionMgmt'
                },{
                    name: '管理“权限管理”配置',
                    id: 4,
                    path: '/permissionMgmtConfig/mgmtPermissionMgmt'
                },{
                    name: '权限管理部门配置',
                    id: 5,
                    path: '/permissionMgmtConfig/deptConfig'
                },{
                    name: '设置“配置管理员”',
                    id: 6,
                    path: '/permissionMgmtConfig/setConfigAdmin'
                },{
                    name: '系统日志',
                    id: 7,
                    path: '/log/userLog'
                }]
            },
            config: {}
        }
    };
    export default {
        data() {
            return new initData()
        },
        activated: function () {
            Bestone.ui.pageInit({
                setTitle: '权限管理配置',
                reviewCallBack: function () {
                    console.log('刷新')
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
            // 跳转页面
            jump: function(item) {
                Bestone.util.vueJump({
                    path: item.path,
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    #permission-mgmt-config {
        padding: 10px 0px;
        &>.ui-normal-list {
            margin-top: 10px;
        }
    }
</style>