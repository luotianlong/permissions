<!-- 搜索框组件 -->
<template>
    <form @submit.prevent="search" action>
        <div class="ui ui-search">
            <div class="input-content">
                <div class="content">
                    <input type="text" v-model="options.searchVal" :placeholder="options.placeholder || ''" ref="searchVal" name="searchVal" autocomplete="off" />
                    <transition name="fade">
                        <div class="suggest-box" v-if="options.suggest.isShow===1 && options.suggestShowData.length>0">
                            <ul>
                                <v-touch tag="li" v-for="(sugItem,sugIndex) in options.suggestShowData" v-if="sugIndex<=5" @tap.prevent="clickItem(sugItem)" @pressup.prevent="clickItem(sugItem)">{{sugItem.name}}</v-touch>
                            </ul>
                            <div class="suggest-bottom"><v-touch tag="div" @tap.prevent="suggestClose" @pressup.prevent="suggestClose" class="suggest-close">关闭</v-touch></div>
                        </div>
                    </transition>
                </div>
            </div>
            <v-touch tag="a" class="search-btn" @tap.prevent="search" @pressup.prevent="search">
                <i class="iconfont icon-sousuo"></i>
            </v-touch>
        </div>
    </form>
</template>

<script scoped>
    export default {
        props: {
            searchVal: {
                type: String,
                required: true
            },
            placeholder: {
                default: ''
            },
            suggest: { // 搜索匹配下拉框配置
                default: function () {
                    return {
                        isShow: 2, // 是否显示 1-是，2-否
                        data: [], // 获得的源数据
                    }
                }
            }
        },
        data() {
            return {
                options: {
                    searchVal: this.searchVal,
                    placeholder: this.placeholder,
                    suggest: this.suggest,
                    suggestShowData: [] // 展示的数据
                }
            }
        },
        watch: {
            'options.searchVal': {
                handler: function (val, oldval) {
                    let self = this;
                    self.$emit('searchValChange', val);
                    // 输入框值变化触发下拉框变化
                    if(!!self.options.suggest && self.options.suggest.isShow===1) {
                        let showData = [];
                        $.each(self.options.suggest.data, function (k,v) {
                            if(v.name.toLowerCase().indexOf(val.toLowerCase())>-1 && val.length>0) {
                                showData.push(v);
                            }
                        });
                        self.options.suggestShowData = showData;
                    }
                },
                deep: true
            },
            searchVal: {
                handler: function (val) {
                    this.options.searchVal = val;
                },
                immediate: true
            },
            placeholder: {
                handler: function (val) {
                    this.options.placeholder = val;
                },
                immediate: true
            },
            suggest: {
                handler: function (val) {
                    this.options.suggest = val;
                },
                immediate: true,
                deep: true
            }
        },
        mounted: function () {
            let self = this;
            hub.$on('clickApp', function (e) {
                // 点击页面其他部分隐藏下拉框
                if ($(e.target).parents('.ui.ui-search .input-content').length <= 0) {
                    self.options.suggestShowData = [];
                }
            });
        },
        methods: {
            // 搜索
            search: function () {
                let self = this;
                this.$emit('searchClick', self.options.searchVal);
                self.$refs.searchVal.blur();
            },
            // 点击列表
            clickItem: function (item) {
                let self = this;
//                self.options.searchVal = item.name;
                self.$refs.searchVal.blur();
                self.options.suggestShowData = [];
                self.$emit('itemClick', item);
            },
            // 关闭推荐框
            suggestClose: function () {
                let self = this;
                self.options.suggestShowData = [];
            }
        }
    }
</script>

<style lang="scss" scoped>
    .ui {
        // 搜索框
        &.ui-search {
            $height: 32px;
            height: 34px;
            position: relative;
            padding-right: 55px;
            & > .input-content {
                position: relative;
                border-bottom-left-radius: 18px;
                border-top-left-radius: 18px;
                padding: 0px 2px 0px 14px;
                /*overflow: hidden;*/
                height: $height;
                border: solid 1px #e9e9e9;
                border-width: 1px 0px 1px 1px;
                & > .content {
                    position: relative;
                    & > input {
                        width: 100%;
                        padding: 7px 0px;
                        height: 18px;
                        text-align: center;
                        font-size: 14px;
                        color: #666;
                        line-height: 18px;
                    }
                    & > .suggest-box {
                        position: absolute;
                        top: 33px;
                        left: 0px;
                        width: 100%;
                        border: solid 1px #ddd;
                        border-top: 0px;
                        background-color: #fff;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                        z-index: 2;
                        &>ul {
                            &>li {
                                background-color: #fff;
                                height: 35px;
                                padding: 0px 10px;
                                font-size: 12px;
                                line-height: 35px;
                                border-bottom: solid 1px #eee;
                                cursor: pointer;
                                overflow: hidden;
                                &:last-child {
                                    border-bottom: none;
                                }
                                &:active {
                                    background-color: #efefef;
                                }
                            }
                        }
                        &>.suggest-bottom {
                            height: 30px;
                            background-color: #F7F7F7;
                            border-top: solid 1px #ddd;
                            &>.suggest-close {
                                float: right;
                                width: 70px;
                                font-size: 12px;
                                color: #666;
                                height: 30px;
                                text-align: center;
                                line-height: 30px;
                                cursor: pointer;
                                border-left: solid 1px #ddd;
                                &:active {
                                    background-color: #e9e9e9;
                                }
                            }
                        }
                    }
                }
            }
            & > .search-btn {
                user-select: none;
                position: absolute;
                top: 0px;
                right: 0px;
                display: block;
                width: 55px;
                height: 34px;
                line-height: 34px;
                background-color: #38ADFF;
                text-align: center;
                border-bottom-right-radius: 18px;
                border-top-right-radius: 18px;
                cursor: pointer;
                &:active {
                    background-color: #0077CA;
                }
                & > i {
                    font-size: 18px;
                    line-height: 34px;
                    color: #fff;
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
