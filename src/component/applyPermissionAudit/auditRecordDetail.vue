<!-- 审核记录-查看详细 -->
<template>
    <div>
    <div id="audit-record-detail">
        <div class="ui ui-text-list">
            <template v-if="!config.applyInfo.ProxyApplyUserName">
                <p>申请人：{{config.applyInfo.ApplyUserName}}</p>
                <p>申请时间：{{!!config.applyInfo.ApplyDate ? config.applyInfo.ApplyDate.split(' ')[0] : ''}}</p>
            </template>
            <template v-if="!!config.applyInfo.ProxyApplyUserName">
                <p>代办人：{{config.applyInfo.ApplyUserName}}</p>
                <p>申请时间：{{!!config.applyInfo.ApplyDate ? config.applyInfo.ApplyDate.split(' ')[0] : ''}}</p>
                <p v-if="!!config.applyInfo.ProxyApplyUserAccount && false">申请账号：{{config.applyInfo.ProxyApplyUserAccount}}</p>
                <p v-if="!!config.applyInfo.ProxyApplyUserName">申请人：{{config.applyInfo.ProxyApplyUserName}}</p>
            </template>
        </div>
        <div class="ui ui-title">审核记录</div>
        <div class="audit-records">
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
        <div class="instruction-content">{{!!config.applyInfo.ApplyDesc ? config.applyInfo.ApplyDesc : '无'}}</div>
    </div>
</div>
</template>

<script scoped>
    var initData = function () {
        return {
            data: {},
            config: {
                applyList: [], // 申请列表
                applyInfo: {}, // 申请信息
                auditData: [], // 审核记录数据
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
                setTitle: '查看详细',
                reviewCallBack: function () {
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
                            self.config.auditData = ajaxData.data || [];
                        }
                    });
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
    #audit-record-detail {
        &>.ui.ui-text-list {
            margin-top: 10px;
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
        &>.instruction-content {
            padding: 10px 15px;
            color: #666;
            line-height: 18px;
            background-color: #fff;
            margin-bottom: 10px;
        }
    }
</style>