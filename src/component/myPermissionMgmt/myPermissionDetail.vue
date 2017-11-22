<!-- 我的权限管理-查看详细 -->
<template>
    <div>
    <div id="my-permission-mgmt">
        <template v-if="data.treeView && data.treeView.length>0">
            <div class="search-content">
                <search-box :searchVal="config.searchBox.searchVal" :placeholder="config.searchBox.placeholder" :suggest="config.searchBox.suggest" @searchClick="searchClickDeal" @searchValChange="searchValChangeDeal" @itemClick="itemClickDeal"></search-box>
            </div>
            <div class="ui ui-title">{{config.menuName}}权限管理范围</div>
            <div class="tree-view-content">
                <tree-view :dataArr="data.treeView" :setConfig="config.treeView"></tree-view>
            </div>
        </template>
        <div v-if="data.treeView && data.treeView.length<=0" class="ui no-data">TDS功能菜单，无管理范围设置。</div>
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
                        childKey: 'childList',
                    },
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
                setTitle: Bestone.util.query().title || '我的权限管理-查看详细',
                reviewCallBack: function () {
                    self.config.menuCode = Bestone.util.query().MenuCode || '';
                    self.config.menuName = Bestone.util.query().MenuName || '';

                    Bestone.util.ajax({
                        url: 'api/UserManage/GetMenuUserConfigByUser',
                        data: JSON.stringify({
                            MenuCode: self.config.menuCode,
                            UserId: Bestone.user.id,
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
                self.$data.data = initData().data;
                self.$data.config = initData().config;
            });
        },
        methods: {
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
                this.config.searchVal=str; // 必须，用于父子组件数据双向绑定
            },
            // 树形组件数据更改
            dataArrChangeDeal: function (arr) {
                this.data.list=arr; // 必须，用于父子组件数据双向绑定
            }
        }
    }
</script>

<style lang="scss" scoped>
    #my-permission-mgmt {
        padding-top: 10px;
        padding-bottom: 60px;
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