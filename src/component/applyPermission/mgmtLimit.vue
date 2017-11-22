<!-- 管理范围选择 -->
<template>
    <div>
    <div id="mgmt-limit">
        <div class="tab" v-if="config.isShowTab">
            <v-touch tag="div" class="item" :class="config.tabIndex===1?'action':''" @tap.prevent="switchTab(1)" @pressup.prevent="switchTab(1)">按公司</v-touch>
            <v-touch tag="div" class="item" :class="config.tabIndex===2?'action':''" @tap.prevent="switchTab(2)" @pressup.prevent="switchTab(2)">按门市</v-touch>
        </div>
        <!-- 按公司 -->
        <div v-show="config.tabIndex===1" class="page-one">
            <div class="ui ui-title">选择业务管理范围</div>
            <div class="search">
                <search-box :searchVal="config.pageOne.searchBox.searchVal" :placeholder="config.pageOne.searchBox.placeholder" :suggest="config.pageOne.searchBox.suggest" @searchClick="pageOneClickDeal" @searchValChange="pageOneValChangeDeal" @itemClick="pageOneItemClickDeal"></search-box>
            </div>
            <div class="help-choice">
                <ul>
                    <li v-for="(item,index) in config.pageOne.helpChoice">
                        <v-touch tag="div" class="ui ui-checkbox" :class="item.checked ? 'checked' : ''" @tap.prevent="clickHelpCheckBox(item,index)" @pressup.prevent="clickHelpCheckBox(item,index)">
                            <span class="icon-content"><i class="iconfont icon-gou"></i></span><span class="text">{{item.text}}</span>
                        </v-touch>
                    </li>
                </ul>
            </div>
            <div class="tree-view-content">
                <div v-if="data.pageOne.treeView.length==0" class="no-data" style="margin-top: 0px;margin-bottom: 10px;">暂无数据</div>
                <tree-view :dataArr="data.pageOne.treeView" :setConfig="config.pageOne.treeView" @dataArrChange="pageOneTreeDataChangeDeal"></tree-view>
            </div>
        </div>
        <!-- 按门市 -->
        <div v-show="config.tabIndex===2" class="page-two">
            <div class="search">
                <search-box :searchVal="config.pageTwo.searchBox.searchVal" :placeholder="config.pageTwo.searchBox.placeholder" :suggest="config.pageTwo.searchBox.suggest" @searchClick="pageTwoClickDeal" @searchValChange="pageTwoValChangeDeal" @itemClick="pageTwoItemClickDeal"></search-box>
            </div>
            <div class="tree-view-content">
                <div v-if="data.pageTwo.treeView.length==0" class="no-data" style="margin-top: 0px;margin-bottom: 10px;">暂无数据</div>
                <tree-view :dataArr="data.pageTwo.treeView" :setConfig="config.pageTwo.treeView" @dataArrChange="pageTwoTreeDataChangeDeal"></tree-view>
            </div>
        </div>
        <!-- 其他多选 -->
        <div class="other-checkbox">
            <ul>
                <v-touch tag="li" v-for="(item,index) in config.otherCheckbox" @tap.prevent="clickOtherCheckBox(item,index)" @pressup.prevent="clickOtherCheckBox(item,index)">
                    <div class="ui ui-checkbox" :class="item.checked ? 'checked' : ''">
                        <span class="icon-content"><i class="iconfont icon-gou"></i></span><span class="text">{{item.Value}}</span>
                    </div>
                </v-touch>
            </ul>
        </div>
        <div class="ui ui-bottom-btn" v-if="true">
            <v-touch tag="div" class="btn" @pressup.prevent="submit" @tap.prevent="submit">确定</v-touch>
        </div>
    </div>
</div>
</template>

<script scoped>
    var initData = function () {
        return {
            data: {
                pageOne: {
                    treeView: []
                },
                pageTwo: {
                    treeView: []
                }
            },
            config: {
                tabIndex: 1, // 1-按公司，2-按门市
                isShowTab: false, // 是否展示tab
                otherCheckbox: [], // 下方按钮
                pageOne: {
                    helpChoice: [{
                        text: '全选',
                        category: 0
                    },{
                        text: '自有公司',
                        category: 1
                    },{
                        text: '合资公司',
                        category: 2
                    },{
                        text: '合作社',
                        category: 3
                    },{
                        text: '旅景',
                        category: 4
                    },{
                        text: '携程',
                        category: 5
                    },{
                        text: '悠程',
                        category: 6
                    }],
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
                        isShowIcon: 1,
                        showChoice: true,
                        keyConfig: {
                            name: 'Branch_Name',
                            id: 'Branch_ID',
                            childKey: 'ChildList'
                        },
                        locationConfig: {
                            key: 'id'
                        }
                    }
                },
                pageTwo: {
                    searchBox: {
                        searchVal: '',
                        placeholder: '门市名称/门市所属公司名称',
                        suggest: {
                            isShow: 1,
                            data: [],
                        }
                    },
                    treeView: {
                        isShow: 1,
                        isShowIcon: 1,
                        showChoice: true,
                        isActive: false,
                        keyConfig: {
                            name: 'BranchName',
                            id: 'BranchId',
                            childKey: 'ChildList'
                        },
                        locationConfig: {
                            key: 'id'
                        }
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
                setTitle: '管理范围选择',
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

                    // 是否展示tab
                    if([17,4,21].indexOf(Bestone.util.query().MenuBusinessType)>=0) { // 17 4 21 时，门市可选
                        self.config.isShowTab = true;
                    }

                    // 按公司
                    Bestone.util.ajax({
                        url: 'api/PermissionManage/GetAllRoleBranch',
                        data: JSON.stringify({}),
                        success: function (ajaxData) {
                            self.config.pageOne.searchBox.suggest.data = Bestone.util.getTreeViewDataForSearch({
                                data: ajaxData.data || [],
                                name: 'Branch_Name',
                                id: 'Branch_ID',
                                childKey: 'ChildList'
                            });
                            self.data.pageOne.treeView = ajaxData.data || [];
                        }
                    });

                    // 按门市
                    Bestone.util.ajax({
                        url: 'api/PermissionManage/GetRoleBranch',
                        data: JSON.stringify({
                            BussinessType: 1,
                            Key: ''
                        }),
                        success: function (ajaxData) {
                            self.config.pageTwo.searchBox.suggest.data = Bestone.util.getTreeViewDataForSearch({
                                data: ajaxData.data || [],
                                name: 'BranchName',
                                id: 'BranchId',
                                childKey: 'ChildList'
                            });
                            self.data.pageTwo.treeView = ajaxData.data || [];
                        }
                    });

                    // 下方按钮选择
                    Bestone.util.ajax({
                        url: 'api/PermissionManage/GetMenuRoleButtons?menuId=' + Bestone.util.query().MenuId,
                        data: JSON.stringify({}),
                        success: function (ajaxData) {
                            self.config.otherCheckbox = ajaxData.data || [];
                        }
                    });
                }
            });

            Bestone.ui.ddSetRight({
                control: true,
                text: '确定',
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
            // 切换tab
            switchTab: function (id) {
                this.config.tabIndex = id;
            },
            // 点击其余多选框
            clickOtherCheckBox: function (item, index) {
                let self = this;
                let newItem = item;
                if (!newItem.checked) { // 未选中
                    newItem.checked = true;
                } else {
                    newItem.checked = false;
                }
                self.config.otherCheckbox.splice(index, 1, newItem);
            },
            // 确定
            submit: function () {
                let self = this;
                let newMenu = {
                    MenuID: parseInt(Bestone.util.query().MenuId,10),
                    BranchIds: [],
                    ButtonIds: [],
                    MenuName: Bestone.util.query().MenuName || '',
                    BranchNames: [],
                    ButtonNames: [],
                };

                // 获取机构
                if(self.config.tabIndex === 1) { // 公司
                    // 递归
                    function recursive(data) {
                        $.each(data, function (k,v) {
                            if(!!v.frontActive && v.frontActive===1) {
                                newMenu.BranchIds.push(v.Branch_ID);
                                newMenu.BranchNames.push(v.Branch_Name);
                            };
                            if(!!v.ChildList && v.ChildList.length>0) {
                                recursive(v.ChildList);
                            }
                        });
                    }
                    recursive(self.data.pageOne.treeView);
                }else { // 门市
                    $.each(self.data.pageTwo.treeView, function (k,v) {
                        if(!!v.frontActive && v.frontActive===1) {
                            newMenu.BranchIds.push(v.BranchId);
                            newMenu.BranchNames.push(v.BranchName);
                        };
                    });
                }
                if(newMenu.BranchIds.length<=0) {
                    Bestone.ui.message({
                        content: '请至少选择一家公司或门市'
                    });
                    return;
                }

                // 获取底部按钮
                $.each(self.config.otherCheckbox, function (k,v) {
                    if(!!v.checked) {
                        newMenu.ButtonIds.push(parseInt(v.Id,10));
                        newMenu.ButtonNames.push(v.Value);
                    };
                });

                // 判断是否已编辑
                let isActived = false;
                $.each(Bestone.applyData.MenuArr,function (k,v) {
                    if(v.MenuID==newMenu.MenuID) {
                        Bestone.applyData.MenuArr.splice(k,1,newMenu);
                        isActived = true;
                        return false;
                    }
                })
                if(!isActived) { // 如果没有编辑则添加一条新的
                    Bestone.applyData.MenuArr.push(newMenu);
                }
                window.app.$router.go(-1);
            },
            /***************************************  按公司  ***************************************/
            // 搜索点击
            pageOneClickDeal: function (str) {
                Bestone.ui.message({
                    content: '仅支持智能匹配搜索'
                });
            },
            // 输入框值改变
            pageOneValChangeDeal: function (str) {
                this.config.pageOne.searchBox.searchVal = str; // 必须，用于父子组件数据双向绑定
            },
            // 搜索下拉框点击
            pageOneItemClickDeal: function (item) {
                let val = item.id;
                if (!!val) {
                    let $loca = $('.page-one .ui.tree-view .loca' + val);
                    $('.page-one .ui.tree-view .item').css('background-color', 'transparent');
                    if ($loca.length > 0) {
                        setTimeout(function () {
                            $loca.css('background-color', '#FFFBE6');
                            $(window).scrollTop($loca.offset().top - 5);
                        }, 100);
                    }
                }
            },
            // 筛选
            clickHelpCheckBox: function (item,index) {
                let self = this;
                let newItem = item;
                if (!newItem.checked) { // 未选中
                    newItem.checked = true;
                } else {
                    newItem.checked = false;
                }
                self.config.pageOne.helpChoice.splice(index, 1, newItem);

                // 改变机构选择状态
                // 递归
                function recursive(data) {
                    $.each(data, function (k,v) {
                        if(v.Branch_Category===item.category || item.category===0) {
                            let newV = v;
                            if (!!self.config.pageOne.helpChoice[index].checked) {
                                newV.frontActive = 1;
                            } else {
                                newV.frontActive = 2;
                            }
                            data.splice(k, 1, newV);
                        }
                        if(!!v.ChildList && v.ChildList.length>0) {
                            recursive(v.ChildList);
                        }
                    });
                }
                recursive(self.data.pageOne.treeView);
            },
            // 树形组件数据更改
            pageOneTreeDataChangeDeal: function (arr) {
                this.data.pageOne.treeView = arr; // 必须，用于父子组件数据双向绑定
            },
            /************************************  按门市  ***************************************/
            // 搜索点击
            pageTwoClickDeal: function (str) {
                Bestone.ui.message({
                    content: '仅支持智能匹配搜索'
                });
            },
            // 输入框值改变
            pageTwoValChangeDeal: function (str) {
                this.config.pageTwo.searchBox.searchVal = str; // 必须，用于父子组件数据双向绑定
            },
            // 搜索下拉框点击
            pageTwoItemClickDeal: function (item) {
                let val = item.id;
                if (!!val) {
                    let $loca = $('.page-two .ui.tree-view .loca' + val);
                    $('.page-two .ui.tree-view .item').css('background-color', 'transparent');
                    if ($loca.length > 0) {
                        setTimeout(function () {
                            $loca.css('background-color', '#FFFBE6');
                            $(window).scrollTop($loca.offset().top - 5);
                        }, 100);
                    }
                }
            },
            // 树形组件数据更改
            pageTwoTreeDataChangeDeal: function (arr) {
                this.data.pageTwo.treeView = arr; // 必须，用于父子组件数据双向绑定
            },
        }
    }
</script>

<style lang="scss" scoped>
    #mgmt-limit {
        padding-top: 10px;
        padding-bottom: 60px;
        & > .tab {
            background-color: #fff;
            height: 40px;
            overflow: hidden;
            border-bottom: solid 1px #eee;
            margin-bottom: 10px;
            & > .item {
                position: relative;
                width: 50%;
                height: 40px;
                float: left;
                line-height: 40px;
                font-size: 14px;
                color: #666666;
                text-align: center;
                cursor: pointer;
                user-select: none;
                &::after {
                    content: '';
                    position: absolute;
                    width: 1px;
                    height: 26px;
                    background-color: #eee;
                    top: 7px;
                    right: 0px;
                }
                &.action {
                    color: #38ADFF;
                    &::before {
                        content: '';
                        position: absolute;
                        width: 99%;
                        height: 1px;
                        background-color: #38ADFF;
                        top: 0px;
                        left: 0px;
                    }
                }
                &:last-child {
                    float: right;
                    &::after {
                        width: 0px;
                    }
                    &.action {
                        &::before {
                            right: 0px;
                            left: auto;
                        }
                    }
                }
            }
        }
        & > .page-one, .page-two {
            & > .search {
                background-color: #fff;
                padding: 10px 15px;
            }
            & > .tree-view-content {
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
        & > .page-one {
            & > .help-choice {
                background-color: #fff;
                border-top: solid 1px #eee;
                padding: 15px 15px;
                padding-top: 0px;
                & > ul {
                    overflow: hidden;
                    font-size: 0px;
                    & > li {
                        float: left;
                        margin-top: 15px;
                        margin-right: 20px;
                    }
                }
            }
        }
        & > .other-checkbox {
            background-color: #fff;
            margin-top: 10px;
            & > ul {
                & > li {
                    cursor: pointer;
                    min-height: 16px;
                    padding: 12px 15px;
                    border-bottom: solid 1px #eee;
                    font-size: 0px;
                }
            }
        }
    }
</style>