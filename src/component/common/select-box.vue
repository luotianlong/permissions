<!-- 下拉选择框 -->
<template>
    <div class="ui ui-select">
        <v-touch tag="div" class="value-box" @pressup.prevent="clickValueBox" @tap.prevent="clickValueBox">
            <p class="value">{{valueRender}}</p>
            <i class="iconfont icon-jiantou-down"></i>
        </v-touch>
        <transition name="fade">
            <div class="item-box" v-if="options.dropDownIsShow===1">
                <div class="item-content">
                    <ul>
                        <v-touch tag="li" v-for="(item,index) in options.dropDownData" :class="!!item.isActive ? 'active' : ''" :key="item.id" @pressup.prevent="clickItem(item)" @tap.prevent="clickItem(item)">{{item.name}}</v-touch>
                    </ul>
                </div>
            </div>
        </transition>
    </div>
</template>

<script scoped>
    export default {
        props: {
            defaultVal: {
                default: '',
            }, // 默认展示值，为空则展示下拉列表第一个值
            dropDownData: {
                default: []
            }, // 下拉框数据 {id:0,name:'例子'}
        },
        data() {
            return {
                options: {
                    dropDownIsShow: 2, // 下拉框是否显示 1-显示，2-不显示
                    defaultVal: this.defaultVal,
                    dropDownData: this.dropDownData,
                }
            }
        },
        watch: {
            dropDownData: {
                handler: function (val) {
                    this.options.dropDownData = val;
                },
                deep: true,
                immediate: true
            }
        },
        mounted: function () {
            let self = this;
            hub.$on('clickApp', function (e) {
                // 点击页面其他部分隐藏下拉框
                if ($(e.target).parents('.ui.ui-select').length <= 0) {
                    self.options.dropDownIsShow = 2
                }
            });
        },
        computed: {
            clickApp: function (e) {
                let self = this;
                console.log(e)
                // 点击页面其他部分隐藏产品类型下拉框
                if ($(e.target).parents('.ui.ui-select').length <= 0) {
                    self.options.dropDownIsShow = 2
                }
            },
            // 展示选中值
            valueRender: function () {
                let self = this;
                let activeName = '';
                $.each(self.options.dropDownData, function (k,v) {
                    if(!!v.isActive) {
                        activeName = v.name;
                    }
                });
                if(!!activeName) return activeName;
                if(!!self.options.defaultVal) return self.options.defaultVal;

                // 如果没选中也没默认展示值，则显示第一个
                let thisData = self.options.dropDownData[0];
                thisData.isActive = true; // 是否选中
                self.options.dropDownData.splice(0,1,thisData);
                return self.options.dropDownData[0].name;
            }
        },
        methods: {
            // 点击展开收拢下拉框
            clickValueBox: function () {
                this.options.dropDownIsShow === 1 ? this.options.dropDownIsShow = 2 : this.options.dropDownIsShow = 1;
            },
            // 点击下拉选项
            clickItem: function (item) {
                let self = this;
                $.each(self.options.dropDownData, function (k,v) {
                    let thisData = self.options.dropDownData[k];
                    thisData.isActive = false; // 是否选中
                    self.options.dropDownData.splice(k,1,thisData);
                    if(v.id===item.id) {
                        thisData.isActive = true; // 是否选中
                        self.options.dropDownData.splice(k,1,thisData);
                    }
                });
                self.options.dropDownIsShow = 2;
                self.$emit('selectClick', item);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .ui.ui-select {
        font-size: 14px;
        position: relative;
        z-index: 2;
        & > .value-box {
            height: 40px;
            background-color: #F8F8F8;
            padding: 0px 40px 0px 5px;
            border: solid 1px #eee;
            position: relative;
            cursor: pointer;
            & > .value {
                color: #666;
                line-height: 40px;
            }
            & > i {
                position: absolute;
                right: 0px;
                top: 0px;
                width: 40px;
                height: 40px;
                line-height: 40px;
                font-size: 16px;
                text-align: center;
                color: #999;
            }
        }
        & > .item-box {
            position: absolute;
            top: 41px;
            left: 0px;
            width: 100%;
            z-index: 2;
            background-color: #fff;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
            & > .item-content {
                border: solid 1px #eee;
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
                max-height: 200px;
                & > ul {
                    & > li {
                        font-size: 12px;
                        color: #666;
                        height: 35px;
                        line-height: 35px;
                        padding: 0px 5px;
                        border-bottom: solid 1px #eee;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        cursor: pointer;
                        &:last-child {
                            border-bottom: none;
                        }
                        &:active {
                            background-color: #eee;
                        }
                        &.active {
                            background-color: #fafafa;
                        }
                    }
                }
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
