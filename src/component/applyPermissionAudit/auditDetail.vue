<!-- 权限申请审核-审核详细 -->
<template>
    <div>
    <div id="audit-detail" v-if="config.isShowPage">
        <div class="ui ui-text-list apply-info">
            <p v-if="!config.applyInfo.ProxyApplyUserName">申请人：{{config.applyInfo.ApplyUserName}}</p>
            <p v-if="!!config.applyInfo.ProxyApplyUserName">代办人：{{config.applyInfo.ApplyUserName}}</p>
            <p>申请时间：{{!!config.applyInfo.ApplyDate ? config.applyInfo.ApplyDate.split(' ')[0] : ''}}</p>
            <p v-if="!!config.applyInfo.ProxyApplyUserAccount && false">申请人账号：{{config.applyInfo.ProxyApplyUserAccount}}</p>
            <p v-if="!!config.applyInfo.ProxyApplyUserName">申请人：{{config.applyInfo.ProxyApplyUserName}}</p>
        </div>
        <div class="ui ui-title" v-if="config.auditData.length>0">审核记录</div>
        <div class="audit-records" v-if="config.auditData.length>0">
            <div class="ui ui-table" v-for="(item,index) in config.auditData">
                <table>
                    <col width="33.333%"/>
                    <col width="33.333%"/>
                    <col width="33.333%"/>
                    <thead>
                    <tr>
                        <th>{{item.ExaminStatus==100 ? '1' : '2'}}级审核人</th>
                        <th>审核时间</th>
                        <th>审核状态</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{{textStatusDeal(item.ExaminUser)}}</td>
                        <td>{{item.ExamineDate.split(' ')[0]}}</td>
                        <td>{{renderExaminStatus(item)}}</td>
                    </tr>
                    <tr>
                        <td colspan="3" style="text-align: left">审核说明：{{!!item.ExamineRemark ? item.ExamineRemark : '无'}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div v-if="config.auditData.length<=0" class="ui no-data" style="margin-top: 0px;">暂无数据</div>
        </div>
        <div class="ui ui-title">申请权限列表</div>
        <div class="apply-list">
            <div class="ui ui-table">
                <table>
                    <col width="33.333%"/>
                    <col width="33.333%"/>
                    <col width="33.333%"/>
                    <thead>
                    <tr>
                        <th>申请权限名称</th>
                        <th>管理范围</th>
                        <th>导出权限</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,index) in config.applyList">
                        <td>{{item.MenuName}}</td>
                        <td v-if="strToArr(item.Branchs).length>1"><v-touch tag="p" @tap.prevent="viewControlLimit(item.Branchs)" @pressup.prevent="viewControlLimit(item.Branchs)">{{textStatusDeal(item.Branchs)}}<i class="iconfont icon-gengduo"></i></v-touch></td>
                        <td v-if="strToArr(item.Branchs).length<=1"><p>{{textStatusDeal(item.Branchs)}}</p></td>
                        <td>{{renderButton(item.Buttons)}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="ui ui-title">申请权限说明</div>
        <div class="instruction-content">{{config.applyInfo.ApplyDesc || '无'}}</div>
        <div class="radio-choice">
            <v-touch tag="div" class="ui ui-radio" :class="checkRadioClass(1)" @tap.prevent="clickRadio(1)" @pressup.prevent="clickRadio(1)">
                <i></i><span>同意</span>
            </v-touch>
            <v-touch tag="div" class="ui ui-radio" :class="checkRadioClass(2)" @tap.prevent="clickRadio(2)" @pressup.prevent="clickRadio(2)">
                <i></i><span>不同意</span>
            </v-touch>
        </div>
        <div class="audit-opinion">
            <div class="ui ui-textarea">
                <textarea placeholder="审核意见（选填）" v-model="config.remark"></textarea>
            </div>
        </div>
        <div class="ui ui-bottom-btn" v-if="true">
            <v-touch tag="div" class="btn" @pressup.prevent="submitEvent" @tap.prevent="submitEvent">提交</v-touch>
        </div>
        <!-- 对话框 -->
        <modal-box :setConfig="config.modalBox" @confirmClick="confirmClickDeal" @cancelClick="cancelClickDeal"></modal-box>
    </div>
</div>
</template>

<script scoped>
    /*
     * source 访问页面来源  1-消息提醒审核快速通道
     */
    var initData = function () {
        return {
            data: {

            },
            config: {
                isShowPage: false, // 是否显示页面
                source: 0, // 来源 0-微应用正常进入，1-审核快速通道
                ddAuthCode: '', // 钉钉免登授权码
                corpId: 0, // 企业ID
                remark: '',
                isAgree: 1, // 1-同意，2-不同意
                applyList: [], // 申请列表
                applyInfo: {}, // 申请信息
                auditData: [], // 审核记录数据
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
        mounted: function () {

        },
        activated: function () {
            let self = this;
            Bestone.ui.pageInit({
                setTitle: '审核详情',
                reviewCallBack: function () {
                    self.config.source = Bestone.util.query().source || 0;
                    if(!dd.version && !Bestone.util.isDev()) {
                        Bestone.ui.message({
                            content: '请在移动端钉钉打开此页面'
                        });
                        Bestone.util.vueJump({
                            path: '/404'
                        });
                        return;
                    }
                    // 获取数据
                    function getData() {
                        self.config.isShowPage = true;
                        // 申请详情
                        Bestone.util.ajax({
                            url: 'api/PermissionManage/GetApplyMemuDetails?applyId=' + Bestone.util.query().ApplyId,
                            data: JSON.stringify({}),
                            success: function (ajaxData) {
                                self.config.applyList = ajaxData.data;
                            }
                        });
                        // 申请信息
                        Bestone.util.ajax({
                            url: 'api/PermissionManage/GetAuthApplyById?applyId=' + Bestone.util.query().ApplyId,
                            data: JSON.stringify({}),
                            success: function (ajaxData) {
                                self.config.applyInfo = ajaxData.data;
                            }
                        });
                        // 审核日志
                        Bestone.util.ajax({
                            url: 'api/PermissionManage/GetExaminLog?applyId=' + Bestone.util.query().ApplyId,
                            data: JSON.stringify({}),
                            success: function (ajaxData) {
                                let newArr = [];
                                $.each(ajaxData.data, function (k,v) {
                                    if(v.ExaminOperStatus!=100 && v.ExaminOperStatus!=101) { // 审核中不展示
                                        newArr.push(v);
                                    }
                                })
                                self.config.auditData = newArr || [];
                            }
                        });
                    }

                    // 审核快速通道访问，需获取dd权限数据
                    if(self.config.source==1) {
                        let timeStamp = new Date().getTime();
                        Bestone.ui.loadingFrame({
                            timestamp: timeStamp
                        });
                        Bestone.util.ajax({
                            url: 'api/DingTalk/GetDingTalkConfig',
                            showLoad: false,
                            data: JSON.stringify({
                                url: location.href
                            }),
                            success: function (ajaxData) {
                                ajaxData = ajaxData.data;
                                self.config.corpId = ajaxData.corpId;

                                dd.config({
                                    agentId: ajaxData.agentid, // 必填，微应用ID
                                    corpId: ajaxData.corpId,//必填，企业ID
                                    timeStamp: ajaxData.timeStamp, // 必填，生成签名的时间戳
                                    nonceStr: ajaxData.nonceStr, // 必填，生成签名的随机串
                                    signature: ajaxData.signature, // 必填，签名
                                    type: 0,
                                    jsApiList: [
                                        'runtime.info',
                                        'biz.contact.choose',
                                        'device.notification.confirm',
                                        'device.notification.alert',
                                        'device.notification.prompt',
                                        'device.base.getUUID',
                                        'device.base.getInterface',
                                        'device.launcher.launchApp',
                                        'biz.alipay.pay',
                                        'biz.user.get',
                                        'biz.util.scan',
                                        'biz.ding.post',
                                        'biz.telephone.call',
                                        'device.notification.modal',
                                        'biz.chat.openSingleChat',
                                        'ui.input.plain',
                                        'ui.progressBar.setColors',
                                        'biz.navigation.setLeft',
                                        'runtime.permission.requestAuthCode',
                                        'device.geolocation.get',
                                        'biz.chat.pickConversation',
                                        'biz.ding.post',
                                        'biz.contact.complexChoose',
                                        'biz.navigation.setTitle',
                                        'biz.navigation.setRight'
                                    ]
                                });

                                dd.ready(function () {
                                    //获取免登授权码
                                    dd.runtime.permission.requestAuthCode({
                                        corpId: ajaxData.corpId,
                                        onSuccess: function (result) {
                                            Bestone.ui.ddSetRight({
                                                control: true,
                                                text: '提交',
                                                show: true,
                                                onSuccess: function () {
                                                    self.submitEvent();
                                                }
                                            });
                                            self.config.ddAuthCode = result.code;
                                            Bestone.util.ajax({
                                                url: 'api/DingTalk/AuthDingDingBind?dingCode=' + result.code,
                                                type: 'GET',
                                                showLoad: false,
                                                success: function (ajaxData) {
                                                    ajaxData = ajaxData.data;

                                                    // 写入用户信息
                                                    Bestone.user.id = ajaxData.UserId; // id
                                                    Bestone.user.user = ajaxData.AccountName; // 账号
                                                    Bestone.user.name = ajaxData.UserName; // 姓名
                                                    Bestone.user.branchId = ajaxData.BranchId; // 所在公司id
                                                    Bestone.user.branchName = ajaxData.BranchName; // 所在公司名称

                                                    // 写入sessionStorage
                                                    sessionStorage.user = JSON.stringify({
                                                        id: ajaxData.UserId, // id
                                                        user: ajaxData.AccountName, // 账号
                                                        name: ajaxData.UserName, // 姓名
                                                        branchId: ajaxData.BranchId, // 所在公司id
                                                        branchName: ajaxData.BranchName // 所在公司名称
                                                    })

                                                    Bestone.util.getToken({
                                                        showLoad: false,
                                                        success: function () {
                                                            // 获取信息
                                                            Bestone.ui.hideLoadingFrame({
                                                                timestamp: timeStamp
                                                            });
                                                            getData();
                                                        }
                                                    });
                                                },
                                                complete: function (XMLHttpRequest, status) {
                                                    if (status != 'success') {
                                                        Bestone.ui.hideLoadingFrame({
                                                            timestamp: timeStamp
                                                        });
                                                    }
                                                }
                                            });
                                        },
                                        onFail: function (err) {
                                            Bestone.ui.hideLoadingFrame({
                                                timestamp: timeStamp
                                            });
                                            Bestone.ui.message({
                                                content: '获取授权码失败'
                                            })
                                        }
                                    });
                                });

                                dd.error(function(error){
                                    Bestone.ui.hideLoadingFrame({
                                        timestamp: timeStamp
                                    });
                                    Bestone.ui.message({
                                        content: JSON.stringify(error)
                                    })
                                });
                            },
                            complete: function (XMLHttpRequest, status) {
                                if (status != 'success') {
                                    Bestone.ui.hideLoadingFrame({
                                        timestamp: timeStamp
                                    });
                                }
                            }
                        });
                    }else {
                        getData();
                    }
                }
            });

            Bestone.ui.ddSetRight({
                control: true,
                text: '提交',
                show: true,
                onSuccess: function () {
                    self.submitEvent();
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
            // 管理范围状态处理
            textStatusDeal: function (str) {
                return Bestone.util.textStatusDeal(str);
            },
            // 查看管理范围
            viewControlLimit: function (str) {
                if(str.substring(str.length-1)===',') {
                    str = str.substring(0,str.length-1);
                }
                var arr = str.split(',');

                let list = [];
                $.each(arr, function (k,v) {
                    list.push({
                        name: v
                    })
                });
                Bestone.mgmtLimitData = list;
                Bestone.util.vueJump({
                    path: '/applyRecord/controlLimit',
                });
            },
            // 审核状态渲染
            renderExaminStatus: function (item) {
                let self = this;
                let text = '';
                if(item.ExaminOperStatus==100 || item.ExaminOperStatus==101) {
                    text = '审核中'
                }else {
                    text = Bestone.vars.examinStatus[item.ExaminOperStatus]
                }
                return text;
            },
            // 单选类名
            checkRadioClass: function (status) {
                return this.config.isAgree == status ? 'checked' : '';
            },
            // 点击单选
            clickRadio: function (status) {
                this.config.isAgree = status;
            },
            // 点击提交
            submitEvent: function () {
                let self = this;
                self.config.modalBox.content = '<p style="font-size: 14px;text-align: center;padding: 20px 0px;line-height: 16px;">确定提交？</p>';
                self.config.modalBox.isShow = true;
            },
            // 弹出框确认
            confirmClickDeal: function () {
                let self = this;
                // 申请信息
                Bestone.util.ajax({
                    url: 'api/PermissionManage/RoleApplyExamine',
                    data: JSON.stringify({
                        ApplyID: parseInt(Bestone.util.query().ApplyId,10),
                        Status: self.config.isAgree,
                        Remark: self.config.remark
                    }),
                    success: function (ajaxData) {
                        Bestone.ui.message({
                            content: '提交成功',
                            notOper: true
                        });
                        if(self.config.source == 1) {
                            self.config.modalBox.content = '<p style="font-size: 14px;text-align: center;padding: 20px 0px;line-height: 16px;">提交成功</p>';
                            self.config.modalBox.btn = [];
                            setTimeout(function () {
                                dd.biz.navigation.close({});
                            },1500);
                        }else {
                            setTimeout(function () {
                                window.app.$router.go(-1);
                            },1000);
                        }
                    }
                });
            },
            // 弹出框取消
            cancelClickDeal: function () {
                let self = this;
                self.config.modalBox.isShow = false;
            },
            // 字符串转数组
            strToArr: function (str) {
                if(str.substring(str.length-1)===',') {
                    str = str.substring(0,str.length-1);
                }
                var arr = str.split(',');
                return arr;
            },
            // 渲染按钮
            renderButton: function (str) {
                let text = '';
                if(str.length<=0) {
                    text = '无';
                }else {
                    if(str.substring(str.length-1)===',') {
                        str = str.substring(0,str.length-1);
                    }
                    var arr = str.split(',');
                    if(arr.length>1) {
                        text = arr[0] + '等';
                    }else {
                        text = arr[0];
                    }
                }
                return text;
            }
        }
    }
</script>

<style lang="scss" scoped>
    #audit-detail {
        padding-top: 10px;
        padding-bottom: 50px;
        & > .apply-info {
            overflow: hidden;
        }
        & > .ui.ui-title {
            margin-top: 10px;
        }
        & > .audit-records {
            background-color: #fff;
            padding: 10px 15px;
            & > .ui.ui-table {
                margin-bottom: 10px;
                &:last-child {
                    margin-bottom: 0px;
                }
            }
        }
        & > .apply-list {
            background-color: #fff;
            padding: 10px 15px;
        }
        & > .instruction-content {
            padding: 10px 15px;
            color: #666;
            line-height: 18px;
            background-color: #fff;
            border-bottom: 1px solid #eee;
        }
        & > .radio-choice {
            padding: 10px 15px;
            background-color: #fff;
            border-bottom: 1px solid #eee;
            min-height: 20px;
            font-size: 0px;
            overflow: hidden;
            & > .ui.ui-radio {
                margin-right: 70px;
                float: left;
                &:last-child {
                    margin-right: 0px;
                }
            }
        }
        &>.audit-opinion {
            padding: 10px 15px;
            background-color: #fff;
            margin-bottom: 10px;
            &>.ui.ui-textarea {
                &>textarea {

                }
            }
        }
    }
</style>