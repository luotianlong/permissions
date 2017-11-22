<!-- 树形组件 -->
<template>
    <div class="ui tree-view">
        <tree-view-recursion :dataArr="getDataArr" :setConfig="options"></tree-view-recursion>
    </div>
</template>

<script scoped>
    export default {
        props: {
            dataArr: {
                default: function () {
                    return []
                }
            }, // json格式数组
            setConfig: {
                default: function () {
                    return {
                        isShow: 1, // 默认是否展开 1-是，2-否
                        isShowIcon: 1, // 默认是否展示展开按钮 1-是，2-否
                        showChoice: false, // 是否展示选择按钮（默认不展示）
                        isActive: false, // 是否默认全部选中（功能未完善，请勿使用）
                        choiceConfig: {
                            choiceChild: true, // 是否自动选中子级
                        }, // 选择按钮配置
                        keyConfig: {
                            name: 'name',
                            id: 'id',
                            childKey: 'childList',
                        }, // 键名配置
//                        btn: [{
//                            iconFontClass: '', // 图标class
//                            color: '', // 背景色
//                            handle: '' // 回调函数名
//                        }], // 列表按钮
//                        locationConfig: {
//                            key: '', // 键
//                        }, // 定位配置
                    }
                }
            }
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
                    this.getDataArr = val;
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
        methods: {
            // 点击列表按钮
            clickBtn: function (handle,item,index) {
                let self = this;
                this.$emit(handle,item,index);
            }
        },
    }
</script>

<style lang="scss" scoped>
    .ui.tree-view {
        background-color: #fff;
        & > ul {
            padding-left: 15px;
        }
        .fade-enter-active {
            transition: opacity .3s;
        }
        .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */
        {
            opacity: 0;
        }
    }
</style>
