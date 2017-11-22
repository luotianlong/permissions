<!-- 树形组件——递归组件 -->
<template>
    <transition name="fade">
        <ul>
            <li v-for="(item,index) in getDataArr" :key="item[options.keyConfig.id]">
                <div class="item" :class="!!options.locationConfig ? 'loca' + item[options.keyConfig[options.locationConfig.key]] : ''" :style="{paddingRight: isShowRightPx}">
                    <v-touch tag="p" :style="{paddingRight: (!!options.btn ? options.btn.length*45 +'px' : '0px')}" @pressup.prevent="clickActive(getDataArr,index)" @tap.prevent="clickActive(getDataArr,index)">
                        <span v-if="!!options.showChoice" class="icon-content" :class="{active:!!options.isActive || (!!item.frontActive && item.frontActive===1)}"><i class="iconfont icon-gou"></i></span>
                        {{item[options.keyConfig.name]}}
                    </v-touch>
                    <!-- 列表按钮 -->
                    <div class="btn" :style="{right: isShowRightPx}">
                        <v-touch tag="div" class="btn-item" v-for="(btnItem,btnIndex) in options.btn" v-if="filterBtn(btnItem.handle,item)" @pressup.prevent="clickBtn(btnItem.handle,item,index)" @tap.prevent="clickBtn(btnItem.handle,item,index)">
                            <i class="iconfont" :class="btnItem.iconFontClass" :style="{backgroundColor:btnItem.color}"></i>
                        </v-touch>
                    </div>
                    <!-- 展开收拢按钮 -->
                    <v-touch tag="i" v-if="options.isShowIcon==1 && isShowIcon(item)" class="show-btn iconfont" :class="iconClass(item)" @pressup.prevent="clickIcon(getDataArr,index)" @tap.prevent="clickIcon(getDataArr,index)"></v-touch>
                </div>
                <!-- 递归组件 -->
                <tree-view-recursion v-if="listIsShow(item) && !!item[options.keyConfig.childKey] && item[options.keyConfig.childKey].length>0" :dataArr="item[options.keyConfig.childKey]" :parentIndex="index" :setConfig="options"></tree-view-recursion>
            </li>
        </ul>
    </transition>
</template>

<script scoped>
    export default {
        props: {
            dataArr: null,
            setConfig: null,
            parentIndex: {
                default: -1
            }, // 父级index
        },
        data() {
            return {
                getDataArr: this.dataArr,
                options: this.setConfig
            }
        },
        watch: {
            getDataArr: {
                handler: function (val, oldval) {
                    this.$emit('dataArrChange', val);
                },
                deep: true
            },
            dataArr: {
                handler: function (val) {
                    let self = this;
                    self.getDataArr = val;
                    // 如果启用自动选中子级功能
                    if(!!self.options.choiceConfig && !!self.options.choiceConfig.choiceChild) {
                        // 如果有父级
                        if (self.parentIndex >= 0) {
                            // 兄弟级全部选中
                            let isAllActive = true; // 兄弟级是否全部选中
                            $.each(val, function (arrKey, arrValue) {
                                if ((!!arrValue.frontActive && arrValue.frontActive === 2) || (!self.options.isActive && !arrValue.frontActive)) { // 没选中
                                    isAllActive = false;
                                }
                            });
                            let thisItem = self.$parent.$data.getDataArr[self.parentIndex];
                            if (isAllActive) {
                                thisItem.frontActive = 1;
                            } else {
                                thisItem.frontActive = 2;
                            }
                            self.$parent.$data.getDataArr.splice(self.parentIndex,1,thisItem);
                        }
                    }
                },
                immediate: true,
                deep: true
            },
            setConfig: {
                handler: function (val) {
                    this.options = val;
                },
                immediate: true,
                deep: true
            }
        },
        computed: {
            // 是否展示展开收拢按钮，右距离px
            isShowRightPx: function () {
                return this.options.isShowIcon==1?'45px':'5px';
            }
        },
        methods: {
            // 展开收拢是否显示
            isShowIcon: function (item) {
                var status = false;
                if (!!item[this.options.keyConfig.childKey] && item[this.options.keyConfig.childKey].length > 0) {
                    status = true;
                }
                return status;
            },
            // 展开收拢图标class
            iconClass: function (item) {
                let self = this;
                var classVal = '';
                if (!!item.frontIsShow) {
                    classVal = item.frontIsShow == 1 ? 'icon-minus' : 'icon-add';
                } else {
                    classVal = self.options.isShow == 1 ? 'icon-minus' : 'icon-add';
                }
                return classVal;
            },
            // 列表是否显示
            listIsShow: function (item) {
                let self = this;
                var isTrue = false;
                if (!!item.frontIsShow) {
                    isTrue = item.frontIsShow == 1 ? true : false;
                } else {
                    isTrue = self.options.isShow == 1 ? true : false;
                }
                return isTrue;
            },
            // 过滤按钮（根据按钮handle判断按钮是否需要显示）
            filterBtn: function (handle,item) {
                var showBtn = true;
                $.each(item.frontNoShowBtn, function (k,v) {
                    if(v==handle) {
                        showBtn = false;
                    }
                });
                return showBtn;
            },
            // 点击展开收拢
            clickIcon: function (arr, index) {
                let self = this;

                function getArr() {
                    return JSON.parse(JSON.stringify(arr[index]));
                };
                let statusOne = getArr();
                statusOne.frontIsShow = 1;
                let statusTwo = getArr();
                statusTwo.frontIsShow = 2;
                if (!!arr[index].frontIsShow) {
                    arr[index].frontIsShow == 1 ? arr.splice(index, 1, statusTwo) : arr.splice(index, 1, statusOne);
                } else {
                    self.options.isShow == 1 ? arr.splice(index, 1, statusTwo) : arr.splice(index, 1, statusOne);
                }
            },
            // 点击列表按钮
            clickBtn: function (handle,item,index) {
                let self = this;
                this.$parent.clickBtn(handle,item,index);
            },
            // 点击选中
            clickActive: function (arr,index) {
                let self = this;

                if(!!self.options.showChoice) {
                    // 给选中的列添加frontActive属性 1-选中，2-未选中
                    function getArr() {
                        return JSON.parse(JSON.stringify(arr[index]));
                    };
                    let statusOne = getArr();
                    statusOne.frontActive = 1;
                    let statusTwo = getArr();
                    statusTwo.frontActive = 2;
                    if (!!arr[index].frontActive) { // 已选过
                        if(arr[index].frontActive===1) { // 已选中
                            arr.splice(index, 1, statusTwo);
                        }else { // 未选中
                            arr.splice(index, 1, statusOne);
                        }
                    } else { // 未选过
                        !!self.options.isActive ? arr.splice(index, 1, statusTwo) : arr.splice(index, 1, statusOne);
                    }

                    // 如果启用自动选中子级功能
                    if(!!self.options.choiceConfig && !!self.options.choiceConfig.choiceChild) {
                        // 如果有父级
                        if(self.parentIndex>=0) {
                            // 兄弟级全部选中
                            let isAllActive = true; // 兄弟级是否全部选中
                            $.each(arr, function (arrKey, arrValue) {
                                if((!!arrValue.frontActive && arrValue.frontActive===2) || (!self.options.isActive && !arrValue.frontActive)) { // 没选中
                                    isAllActive = false;
                                }
                            });
                            if(isAllActive) {
                                self.$parent.$data.getDataArr[self.parentIndex].frontActive = 1;
                            }else {
                                self.$parent.$data.getDataArr[self.parentIndex].frontActive = 2;
                            }
                        }
                        // 选中全部子级子级
                        if(!!arr[index][self.options.keyConfig.childKey] && arr[index][self.options.keyConfig.childKey].length>0) {
                            let activeStatus = arr[index].frontActive;
                            let childList = arr[index][self.options.keyConfig.childKey];
                            function recursive(list) {
                                $.each(list, function (k,v) {
                                    v.frontActive = activeStatus;
                                    if(!!v[self.options.keyConfig.childKey] && v[self.options.keyConfig.childKey].length>0) {
                                        recursive(v[self.options.keyConfig.childKey]);
                                    }
                                });
                            };
                            recursive(childList);
                        }
                    }
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
    ul {
        padding-left: 20px;
        font-size: 14px;
        color: #666;
        overflow: hidden;
        .item {
            padding: 0px 45px 0px 0px;
            min-height: 40px;
            line-height: 20px;
            border-bottom: solid 1px #eee;
            position: relative;
            &>p {
                padding: 10px 0px;
                &>span {
                    line-height: 20px;
                    vertical-align: top;
                }
                &>.icon-content {
                    float: left;
                    width: 20px;
                    height: 20px;
                    background-color: #E4E4E4;
                    border-radius: 10px;
                    text-align: center;
                    margin-right: 5px;
                    &.active {
                        background-color: #38ADFF;
                    }
                    &>i {
                        font-size: 12px;
                        line-height: 20px;
                        color: #fff;
                    }
                }
            }
            & > .btn {
                position: absolute;
                right: 45px;
                top: 0px;
                height: 40px;
                & > .btn-item {
                    width: 40px;
                    height: 40px;
                    float: right;
                    cursor: pointer;
                    text-align: center;
                    &:active {
                        background-color: #eee;
                    }
                    & > i {
                        display: inline-block;
                        margin-top: 7px;
                        width: 26px;
                        height: 26px;
                        line-height: 26px;
                        text-align: center;
                        font-size: 14px;
                        color: #fff;
                        border-radius: 20px;
                    }
                }
            }
            & > i.show-btn {
                position: absolute;
                right: 5px;
                width: 40px;
                top: 0px;
                height: 40px;
                color: #38ADFF;
                cursor: pointer;
                line-height: 40px;
                text-align: center;
                font-size: 20px;
                float: right;
            }
        }
    }
    .fade-enter-active {
        transition: opacity .3s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */
    {
        opacity: 0;
    }
</style>
