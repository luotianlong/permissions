webpackJsonp([22],{132:function(t,a,i){a=t.exports=i(0)(void 0),a.push([t.i,"#apply-record-detail>.ui.ui-text-list[data-v-5af736fa],#apply-record-detail>.ui.ui-title[data-v-5af736fa]{margin-top:10px}#apply-record-detail>.audit-records[data-v-5af736fa]{background-color:#fff;padding:10px 15px}#apply-record-detail>.audit-records>.ui.ui-table[data-v-5af736fa]{margin-bottom:10px}#apply-record-detail>.audit-records>.ui.ui-table[data-v-5af736fa]:last-child{margin-bottom:0}#apply-record-detail>.apply-list[data-v-5af736fa]{background-color:#fff;padding:10px 15px}#apply-record-detail>.instruction-content[data-v-5af736fa]{padding:10px 15px;color:#666;line-height:18px;background-color:#fff;margin-bottom:10px}",""])},165:function(t,a){t.exports={render:function(){var t=this,a=t.$createElement,i=t._self._c||a;return i("div",[i("div",{attrs:{id:"apply-record-detail"}},[t.config.applyInfo.ProxyApplyUserAccount?i("div",{staticClass:"ui ui-text-list"},[t._e(),t._v(" "),i("p",[t._v("申请人："+t._s(t.config.applyInfo.ProxyApplyUserName))])]):t._e(),t._v(" "),i("div",{staticClass:"ui ui-title"},[t._v("审核记录")]),t._v(" "),i("div",{staticClass:"audit-records"},[t._l(t.config.auditData,function(a,e){return i("div",{staticClass:"ui ui-table"},[i("table",[i("col",{attrs:{width:"33.333%"}}),t._v(" "),i("col",{attrs:{width:"33.333%"}}),t._v(" "),i("col",{attrs:{width:"33.333%"}}),t._v(" "),i("thead",[i("tr",[i("th",[t._v(t._s(100==a.ExaminStatus?"1":"2")+"级审核人")]),t._v(" "),i("th",[t._v("审核时间")]),t._v(" "),i("th",[t._v("审核状态")])])]),t._v(" "),i("tbody",[i("tr",[i("td",[t._v(t._s(t.textStatusDeal(a.ExaminUser)))]),t._v(" "),i("td",[t._v(t._s(a.ExamineDate.split(" ")[0]))]),t._v(" "),i("td",[t._v(t._s(t.renderExaminStatus(a)))])]),t._v(" "),i("tr",[i("td",{staticStyle:{"text-align":"left"},attrs:{colspan:"3"}},[t._v("审核说明："+t._s(a.ExamineRemark?a.ExamineRemark:"无"))])])])])])}),t._v(" "),t.config.auditData.length<=0?i("div",{staticClass:"ui no-data",staticStyle:{"margin-top":"0px"}},[t._v("暂无数据")]):t._e()],2),t._v(" "),i("div",{staticClass:"ui ui-title"},[t._v("申请权限列表")]),t._v(" "),i("div",{staticClass:"apply-list"},[i("div",{staticClass:"ui ui-table"},[i("table",[i("col",{attrs:{width:"33.333%"}}),t._v(" "),i("col",{attrs:{width:"33.333%"}}),t._v(" "),i("col",{attrs:{width:"33.333%"}}),t._v(" "),t._m(0),t._v(" "),i("tbody",t._l(t.config.applyList,function(a,e){return i("tr",[i("td",[t._v(t._s(a.MenuName))]),t._v(" "),t.strToArr(a.Branchs).length>1?i("td",[i("v-touch",{attrs:{tag:"p"},on:{tap:function(i){i.preventDefault(),t.viewControlLimit(a.Branchs)},pressup:function(i){i.preventDefault(),t.viewControlLimit(a.Branchs)}}},[t._v(t._s(t.textStatusDeal(a.Branchs))),i("i",{staticClass:"iconfont icon-gengduo"})])],1):t._e(),t._v(" "),t.strToArr(a.Branchs).length<=1?i("td",[i("p",[t._v(t._s(t.textStatusDeal(a.Branchs)))])]):t._e(),t._v(" "),i("td",[t._v(t._s(t.renderButton(a.Buttons)))])])}))])])]),t._v(" "),i("div",{staticClass:"ui ui-title"},[t._v("申请权限说明")]),t._v(" "),i("div",{staticClass:"instruction-content"},[t._v(t._s(t.config.applyInfo.ApplyDesc?t.config.applyInfo.ApplyDesc:"无"))])])])},staticRenderFns:[function(){var t=this,a=t.$createElement,i=t._self._c||a;return i("thead",[i("tr",[i("th",[t._v("申请权限名称")]),t._v(" "),i("th",[t._v("管理范围")]),t._v(" "),i("th",[t._v("导出权限")])])])}]}},196:function(t,a,i){var e=i(132);"string"==typeof e&&(e=[[t.i,e,""]]),e.locals&&(t.exports=e.locals);i(2)("7a48dd86",e,!0)},65:function(t,a,i){function e(t){i(196)}var n=i(1)(i(96),i(165),e,"data-v-5af736fa",null);t.exports=n.exports},96:function(t,a,i){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var e=function(){return{data:{},config:{applyList:[],applyInfo:{},auditData:[]}}};a.default={data:function(){return new e},mounted:function(){},activated:function(){var t=this;Bestone.ui.pageInit({setTitle:"查看详细",reviewCallBack:function(){Bestone.util.ajax({url:"api/PermissionManage/GetApplyMemuDetails?applyId="+Bestone.util.query().ApplyId,data:JSON.stringify({}),success:function(a){t.config.applyList=a.data}}),Bestone.util.ajax({url:"api/PermissionManage/GetAuthApplyById?applyId="+Bestone.util.query().ApplyId,data:JSON.stringify({}),success:function(a){t.config.applyInfo=a.data}}),Bestone.util.ajax({url:"api/PermissionManage/GetExaminLog?applyId="+Bestone.util.query().ApplyId,data:JSON.stringify({}),success:function(a){t.config.auditData=a.data||[]}})}})},deactivated:function(){var t=this;Bestone.util.resetData(function(){t.data=e().data,t.config=e().config})},methods:{textStatusDeal:function(t){return Bestone.util.textStatusDeal(t)},viewControlLimit:function(t){","===t.substring(t.length-1)&&(t=t.substring(0,t.length-1));var a=t.split(","),i=[];$.each(a,function(t,a){i.push({name:a})}),Bestone.mgmtLimitData=i,Bestone.util.vueJump({path:"/applyRecord/controlLimit"})},renderExaminStatus:function(t){return 100==t.ExaminOperStatus||101==t.ExaminOperStatus?"审核中":Bestone.vars.examinStatus[t.ExaminOperStatus]},strToArr:function(t){return","===t.substring(t.length-1)&&(t=t.substring(0,t.length-1)),t.split(",")},renderButton:function(t){var a="";if(t.length<=0)a="无";else{","===t.substring(t.length-1)&&(t=t.substring(0,t.length-1));var i=t.split(",");a=i.length>1?i[0]+"等":i[0]}return a}}}}});