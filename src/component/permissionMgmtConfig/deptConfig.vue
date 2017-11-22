<!-- 权限管理配置-部门配置 -->
<template>
    <div>
    <div id="dept-config">
        <div class="ui ui-normal-list">
            <ul>
                <v-touch tag="li" v-for="(item,index) in data.list" :key="item.Id" @pressup.prevent="configClick(item)" @tap.prevent="configClick(item)">
                    <p>{{item.RoleName}}</p>
                    <i class="iconfont icon-you"></i>
                </v-touch>
            </ul>
        </div>
        <div v-if="data.list.length==0" class="ui no-data">暂无数据</div>
        <div class="ui ui-bottom-btn" v-if="false">
            <v-touch tag="div" class="btn" @pressup.prevent="addDept" @tap.prevent="addDept">新增管理部门</v-touch>
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
            config: {}
        }
    };
    export default {
        data() {
            return new initData()
        },
        activated: function () {
            let self = this;
            Bestone.ui.pageInit({
                setTitle: '权限管理部门配置',
                reviewCallBack: function () {

                }
            });

            Bestone.ui.ddSetRight({
                control: true,
                text: '新增',
                show: true,
                onSuccess: function () {
                    self.addDept();
                }
            });

            Bestone.util.ajax({
                url: 'api/AuthManage/GetRoles',
                data: JSON.stringify({}),
                success: function (ajaxData) {
                    self.data.list = ajaxData.data || [];
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
            // 配置
            configClick: function(item) {
                Bestone.util.vueJump({
                    path: '/permissionMgmtConfig/deptConfigDetail',
                    query: {
                        RoleId: item.Id,
                        RoleName: item.RoleName
                    }
                });
            },
            // 新增
            addDept: function () {
                Bestone.util.vueJump({
                    path: '/permissionMgmtConfig/deptConfigDetail',
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    #dept-config {
        padding: 10px 0px 10px;
    }
</style>