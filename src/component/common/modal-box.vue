<!-- 对话框组件 -->
<template>
    <div class="ui ui-modal" v-if="options.isShow">
        <div class="box" ref="box">
            <div class="content" v-html="options.content"></div>
            <div class="bottom-btn" v-if="options.btn && options.btn.length>0">
                <v-touch v-for="(btnItem,btnIndex) in options.btn" tag="a" @pressup.prevent="clickBtn(btnItem.handel)" @tap.prevent="clickBtn(btnItem.handel)" :style="{width: 100/options.btn.length + '%'}">{{btnItem.text}}</v-touch>
            </div>
        </div>
    </div>
</template>

<script scoped>
    export default {
        props: {
            setConfig: {
                default: function () {
                    return {
                        isShow: false,
                        content: '',
                        btn: [{
                            text: '确定',
                            handel: 'confirmClick'
                        },{
                            text: '取消',
                            handel: 'cancelClick'
                        }]
                    }
                }
            }
        },
        data() {
            return {
                options: this.setConfig
            }
        },
        watch: {
            setConfig: {
                handler: function (val) {
                    this.options = val;
                },
                immediate: true,
                deep: true
            }
        },
        mounted: function () {
        },
        updated: function () {
            var $box = $(this.$refs.box);
            var height = $box.height();
            $box.css('margin-top',-height/2 + 'px');
        },
        methods: {
            clickBtn: function (handle) {
                this.$emit(handle);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .ui {
        &.ui-modal {
            position: fixed;
            top: 0px;
            left: 0px;
            right: 0px;
            width: 100%;
            margin: 0px auto;
            max-width: 540px;
            height: 100%;
            z-index: 100;
            background-color: rgba( 0, 0, 0, .3);
            & > .box {
                position: absolute;
                top: 50%;
                left: 15%;
                margin-top: -100px;
                width: 70%;
                background-color: #fff;
                border-radius: 5px;
                overflow: hidden;
                &>.content {
                    padding: 15px 10px;
                    min-height: 20px;
                }
                &>.bottom-btn {
                    height: 40px;
                    line-height: 40px;
                    background-color: #F8F8F8;
                    border-top: solid 1px #ddd;
                    overflow: hidden;
                    &>a {
                        float: left;
                        display: block;
                        width: 50%;
                        position: relative;
                        font-size: 14px;
                        text-align: center;
                        cursor: pointer;
                        &::after {
                            content: '';
                            position: absolute;
                            top: 0px;
                            right: 0px;
                            width: 1px;
                            height: 100%;
                            background-color: #ddd;
                        }
                        &:last-child {
                            &::after {
                                width: 0px;
                            }
                        }
                        &:active {
                            background-color: #eee;
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
