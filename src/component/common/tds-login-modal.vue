<!-- tds登录模态框 -->
<template>
    <div class="tds-login-modal">
        <div class="box-height-control" ref="box">
            <div class="box-width-control">
                <div class="box">
                    <div class="title">TDS业支端账号</div>
                    <form @submit.prevent="search" action>
                        <div class="ui ui-input account"><input type="text" placeholder="请输入账号" ref="accountVal" v-model="accountVal"/></div>
                        <div class="verify-code">
                            <div class="ui ui-input"><input type="text" placeholder="请输入验证码" ref="verifyCode" v-model="verifyCode"/></div>
                            <v-touch tag="div" @tap.prevent="getCode" @pressup.prevent="getCode" class="get-code">{{options.getCodeBtnText}}</v-touch>
                        </div>
                        <p class="send-code-prompt">{{options.prompt}}</p>
                        <p class="bind-prompt">{{options.warn}}</p>
                        <v-touch tag="div" class="submit-btn" @tap.prevent="submit" @pressup.prevent="submit">{{options.submitBtnText}}</v-touch>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script scoped>
    // 引用：<search-box :searchVal="config.searchVal" :placeholder="config.placeholder" @searchClick="searchClickDeal" @searchValChange="searchValChangeDeal"></search-box>
    export default {
        props: {
            setConfig: {
                default: function () {
                    return {
                        getCodeBtnText: '获取短信验证码', // 获取验证码按钮文字
                        submitBtnText: '代为申请权限账号授权', // 提交按钮文字
                        prompt: '', // 提示语
                        warn: '注：账号绑定不可更改，请绑定本人账号。',
                    }
                }
            }
        },
        data() {
            return {
                options: this.setConfig,
                canGetCode: true, // 能否获取code
                accountVal: '',
                verifyCode: ''
            }
        },
        watch: {
            setConfig: {
                handler: function (val, oldval) {
                    this.options = val;
                },
                deep: true,
                immediate: true
            },
        },
        mounted: function () {
            var $box = $(this.$refs.box);
            var height = $box.height();
            $box.css('margin-top',-height/2 + 'px');
        },
        methods: {
            // 获取验证码
            getCode: function () {
                let self = this;
                if(!!self.canGetCode) {
                    let accountVal = $.trim(self.accountVal);
                    if($.trim(self.accountVal).length<=0) {
                        Bestone.ui.message({
                            content: '账号不能为空'
                        });
                        return;
                    }

                    self.$emit('getCode', accountVal);
                    self.canGetCode = false;
                    let countDownTime = 60;
                    let oldText = self.setConfig.getCodeBtnText;
                    self.options.getCodeBtnText = countDownTime + '秒';
                    let countDown = setInterval(function () {
                        if(countDownTime>=1) {
                            countDownTime--;
                            self.options.getCodeBtnText = countDownTime + '秒';
                        } else {
                            self.options.getCodeBtnText = oldText;
                            clearInterval(countDown);
                            self.canGetCode = true;
                        }
                    },1000);
                }
            },
            // 提交
            submit: function () {
                let self = this;
                let accountVal = $.trim(self.accountVal);
                let verifyCode = $.trim(self.verifyCode);
                if(accountVal.length<=0 || verifyCode.length<=0) {
                    Bestone.ui.message({
                        content: '账号和验证码不能为空'
                    });
                    return;
                }
                self.$emit('submit',{
                    accountVal: self.accountVal,
                    verifyCode: self.verifyCode,
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .tds-login-modal {
        position: fixed;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        margin: 0px auto;
        max-width: 540px;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .3);
        z-index: 50;
        & > .box-height-control {
            position: relative;
            top: 50%;
            margin-top: -150px;
            & > .box-width-control {
                margin: 0px auto;
                max-width: 520px;
                padding: 0px 15px;
                & > .box {
                    background-color: #fff;
                    padding: 10px;
                    border-radius: 5px;
                    & > .title {
                        font-size: 16px;
                        line-height: 20px;
                        color: #404040;
                        text-align: center;
                    }
                    & > form {
                        & > .account {
                            margin-top: 15px;
                        }
                        & > .verify-code {
                            margin-top: 10px;
                            position: relative;
                            padding-right: 137px;
                            & > .ui.ui-input {

                            }
                            & > .get-code {
                                position: absolute;
                                top: 0px;
                                right: 0px;
                                height: 38px;
                                border: solid 1px #289CED;
                                width: 125px;
                                text-align: center;
                                color: #289CED;
                                font-size: 12px;
                                line-height: 38px;
                                border-radius: 5px;
                                cursor: pointer;
                                &:active {
                                    background-color: #eee;
                                }
                            }
                        }
                        & > .send-code-prompt {
                            margin: 7px 0px 5px;
                            line-height: 16px;
                            min-height: 16px;
                            font-size: 12px;
                            color: #666666;
                        }
                        & > .bind-prompt {
                            margin: 5px 0px 0px;
                            line-height: 16px;
                            font-size: 12px;
                            color: #0066CC;
                        }
                        & > .submit-btn {
                            margin-top: 15px;
                            font-size: 14px;
                            height: 40px;
                            line-height: 40px;
                            text-align: center;
                            color: #fff;
                            background-color: #289CED;
                            border-radius: 5px;
                            margin-bottom: 5px;
                            cursor: pointer;
                            &:active {
                                background-color: #0077CA;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
