<!-- 权限管理配置-部门配置-详细 -->
<template>
    <div>
        <div id="dept-config-detail">
            <div class="dept-name">
                <div class="ui ui-input"><input type="text" v-model="config.deptNameVal" placeholder="填写部门名称" name="deptName"/></div>
            </div>
            <div class="search-content" v-if="config.selectChoiceId !== ''">
                <search-box :searchVal="config.searchBox.searchVal" :placeholder="config.searchBox.placeholder" :suggest="config.searchBox.suggest" @searchClick="searchClickDeal" @searchValChange="searchValChangeDeal" @itemClick="itemClickDeal"></search-box>
            </div>
            <div class="tree-view-content" v-if="config.selectChoiceId !== ''">
                <tree-view :dataArr="data.treeView" :setConfig="config.treeView" @dataArrChange="dataArrChangeDeal"></tree-view>
            </div>
            <div class="ui ui-bottom-btn" v-if="false">
                <v-touch tag="div" class="btn" @pressup.prevent="submitConfig" @tap.prevent="submitConfig">保存配置</v-touch>
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
                deptNameVal: '', // 部门名称输入框值
                searchBox: {
                    searchVal: '',
                    placeholder: '权限名称',
                    suggest: {
                        isShow: 1,
                        data: [],
                    }
                },
                treeView: {
                    isShow: 1,
                    isShowIcon: 2,
                    showChoice: true,
                    choiceConfig: {
                        choiceChild: true
                    },
                    keyConfig: {
                        name: 'MenuName',
                        id: 'MenuCode',
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
                setTitle: '权限管理部门配置',
                reviewCallBack: function () {
                    self.config.deptNameVal = Bestone.util.query().RoleName || '';
                    // 按关键字获取全部菜单
                    Bestone.util.ajax({
                        url: 'api/AuthManage/GetAllMenus',
                        data: JSON.stringify({
                            Keyword: ''
                        }),
                        success: function (ajaxData) {
                            self.config.searchBox.suggest.data = Bestone.util.getTreeViewDataForSearch({
                                data: ajaxData.data || [],
                                name: 'MenuName',
                                id: 'MenuCode',
                                childKey: 'ChildList'
                            });
                            self.data.treeView = ajaxData.data || [];

                            // 获取指定权限管理部门下的所有菜单
                            if(!!Bestone.util.query().RoleId || Bestone.util.query().RoleId===0) {
                                Bestone.util.ajax({
                                    url: 'api/AuthManage/GetRoleMenus',
                                    data: JSON.stringify({
                                        RoleId: Bestone.util.query().RoleId
                                    }),
                                    success: function (ajaxData) {
                                        var activeMenuCodes = [];
                                        // 循环选中的
                                        $.each(ajaxData.data, function (k, v) {
                                            $.each(v.ChildList, function (key,value) {
                                                activeMenuCodes.push(value.MenuCode);
                                            });
                                        });
                                        // 循环树
                                        $.each(self.data.treeView, function (k, v) {
                                            $.each(v.ChildList, function (key,value) {
                                                if(activeMenuCodes.indexOf(value.MenuCode) >= 0) {
                                                    var thisItem = value;
                                                    thisItem.frontActive = 1;
                                                    self.data.treeView[k].ChildList.splice(key,1,thisItem);
                                                }
                                            });
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
            });

            Bestone.ui.ddSetRight({
                control: true,
                text: '保存',
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

                if (self.config.deptNameVal.length <= 0) {
                    Bestone.ui.message({
                        content: '部门名称不能为空'
                    });
                    return;
                }

                var menuCodes = '';
                $.each(self.data.treeView, function (k, v) {
                    $.each(v.ChildList, function (key,value) {
                        if (!!value.frontActive && value.frontActive===1) {
                            menuCodes = menuCodes + value.MenuCode + ',';
                        }
                    });
                });
                if (menuCodes.length <= 0) {
                    Bestone.ui.message({
                        content: '请至少选择一个权限'
                    });
                    return;
                }

                self.config.modalBox.content = '<p style="font-size: 14px;text-align: center;padding: 20px 0px;line-height: 16px;">确定保存配置？</p>';
                self.config.modalBox.isShow = true;
            },
            // 弹出框确认
            confirmClickDeal: function () {
                let self = this;

                if (self.config.deptNameVal.length <= 0) {
                    Bestone.ui.message({
                        content: '部门名称不能为空'
                    });
                    return;
                }

                var menuCodes = '';
                $.each(self.data.treeView, function (k, v) {
                    $.each(v.ChildList, function (key,value) {
                        if (!!value.frontActive && value.frontActive===1) {
                            menuCodes = menuCodes + value.MenuCode + ',';
                        }
                    });
                });
                if (menuCodes.length <= 0) {
                    Bestone.ui.message({
                        content: '请至少选择一个权限'
                    });
                    return;
                }
                menuCodes = menuCodes.substring(0,menuCodes.length-1); // 去掉最后一个逗号

                if(!!Bestone.util.query().RoleId || Bestone.util.query().RoleId===0) { // 更新
                    Bestone.util.ajax({
                        url: 'api/AuthManage/UpdateRole',
                        data: JSON.stringify({
                            Id: Bestone.util.query().RoleId,
                            RoleName: self.config.deptNameVal,
                            MenuCodes: menuCodes,
                            OperId: Bestone.user.id,
                            OperName: Bestone.user.name
                        }),
                        success: function (ajaxData) {
                            Bestone.ui.message({
                                content: '配置成功',
                                notOper: true
                            });
                            self.config.modalBox.isShow = false;
                            setTimeout(function () {
                                window.app.$router.go(-1);
                            }, 1000);
                        }
                    });
                }else { // 新增
                    Bestone.util.ajax({
                        url: 'api/AuthManage/AddRole',
                        data: JSON.stringify({
                            RoleName: self.config.deptNameVal,
                            MenuCodes: menuCodes,
                            OperId: Bestone.user.id,
                            OperName: Bestone.user.name
                        }),
                        success: function (ajaxData) {
                            Bestone.ui.message({
                                content: '配置成功',
                                notOper: true
                            });
                            self.config.modalBox.isShow = false;
                            setTimeout(function () {
                                window.app.$router.go(-1);
                            }, 1000);
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
    #dept-config-detail {
        padding-top: 10px;
        padding-bottom: 10px;
        & > .dept-name {
            padding: 5px 15px;
            background-color: #fff;
        }
        & > .search-content {
            border-top: solid 1px #eee;
            background-color: #fff;
            padding: 10px 15px;
        }
        & > .tree-view-content {
            margin-top: 10px;
            border-bottom: solid 1px #eee;
        }
    }
</style>