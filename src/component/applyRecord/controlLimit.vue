<!-- 管理范围 -->
<template>
    <div>
    <div id="control-limit">
        <div class="tree-view-content">
            <tree-view :dataArr="data.list" :setConfig="config.treeView" @dataArrChange="dataArrChangeDeal"></tree-view>
        </div>
        <div v-if="data.list && data.list.length<=0" class="ui no-data">暂无数据</div>
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
                treeView: {
                    isShow: 1,
                    isShowIcon: 2,
                    keyConfig: {
                        name: 'name',
                        id: 'id',
                        childKey: 'childList'
                    },
                },
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
                setTitle: '管理范围',
                reviewCallBack: function () {
                    // 判断数据是否失效
                    if (!!Bestone.mgmtLimitData && Bestone.mgmtLimitData.length<=0) {
                        Bestone.ui.message({
                            content: '数据已失效，请重试',
                            notOper: true
                        });
                        setTimeout(function () {
                            window.app.$router.go(-1);
                        }, 1000);
                        return;
                    }

                    self.data.list = Bestone.mgmtLimitData;
                }
            });
        },
        deactivated: function () {
            var self = this;
            // 回退时清除数据
            Bestone.util.resetData(function () {
                self.data = initData().data;
                self.config = initData().config;
                Bestone.mgmtLimitData = [];
            });
        },
        methods: {
            // 树形组件数据更改
            dataArrChangeDeal: function (arr) {
                this.data.list = arr; // 必须，用于父子组件数据双向绑定
            }
        }
    }
</script>

<style lang="scss" scoped>
    #control-limit {
        padding-top: 10px;
        padding-bottom: 10px;
        &>.tree-view-content {

        }
    }
</style>