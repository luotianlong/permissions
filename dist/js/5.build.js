webpackJsonp([5],{114:function(e,t,a){"use strict";function i(e){if(Array.isArray(e)){for(var t=0,a=Array(e.length);t<e.length;t++)a[t]=e[t];return a}return Array.from(e)}Object.defineProperty(t,"__esModule",{value:!0});var n=function(){return{data:{list:[]},config:{roleId:0,roleName:"",pageIndex:1,pageSize:10,isLoadAll:!1,isSendAjax:!1,searchAjaxVal:"",searchBox:{searchVal:"",placeholder:"登录账号/姓名/权限管理公司名称搜索"},modalBox:{isShow:!1,content:"",btn:[{text:"确定",handel:"confirmClick"},{text:"取消",handel:"cancelClick"}]}}}};t.default={data:function(){return new n},activated:function(){var e=this;Bestone.ui.pageInit({setTitle:"管理“权限审核”配置",reviewCallBack:function(){e.config.roleName=Bestone.util.query().RoleName||"",e.config.roleId=Bestone.util.query().RoleId||0,e.config.isSendAjax=!0,Bestone.util.ajax({url:"api/AuthManage/GetUserCheckByRole",data:JSON.stringify({RoleId:e.config.roleId,PageIndex:e.config.pageIndex,PageSize:e.config.pageSize,Keyword:e.config.searchAjaxVal}),success:function(t){t.data.list.length<e.config.pageSize&&(e.config.isLoadAll=!0),e.data.list=t.data.list||[]},complete:function(){e.config.isSendAjax=!1}})}}),Bestone.ui.ddSetRight({control:!0,text:"移除权限",show:!0,onSuccess:function(){e.clearPermission()}}),Bestone.util.scrollRefresh({callback:function(t){e.config.isSendAjax||e.config.isLoadAll||(e.config.isSendAjax=!0,Bestone.util.ajax({url:"api/AuthManage/GetUserCheckByRole",showLoad:!1,data:JSON.stringify({RoleId:e.config.roleId,PageIndex:e.config.pageIndex+1,PageSize:e.config.pageSize,Keyword:e.config.searchAjaxVal}),success:function(t){var a;t.data.list.length<e.config.pageSize&&(e.config.isLoadAll=!0),e.config.pageIndex=t.data.page,(a=e.data.list).push.apply(a,i(t.data.list))},complete:function(){e.config.isSendAjax=!1}}))}})},deactivated:function(){var e=this;Bestone.util.resetData(function(){e.data=n().data,e.config=n().config})},methods:{ClickDeal:function(e){var t=this;t.config.isSendAjax=!0,Bestone.util.ajax({url:"api/AuthManage/GetUserCheckByRole",data:JSON.stringify({RoleId:t.config.roleId,PageIndex:1,PageSize:t.config.pageSize,Keyword:e}),success:function(a){t.config.searchAjaxVal=e,t.config.pageIndex=1,a.data.list.length<t.config.pageSize?t.config.isLoadAll=!0:t.config.isLoadAll=!1,t.data.list=a.data.list||[]},complete:function(){t.config.isSendAjax=!1}})},ValChangeDeal:function(e){this.config.searchBox.searchVal=e,console.log(e)},textStatusDeal:function(e){return Bestone.util.textStatusDeal(e)},checkBoxClick:function(e,t){function a(){return JSON.parse(JSON.stringify(e[t]))}var i=this,n=a();n.frontChecked=!0;var o=a();o.frontChecked=!1,e[t].frontChecked?e.splice(t,1,o):e.splice(t,1,n),console.log(i.data.list)},clearPermission:function(){var e=this,t="";if($.each(e.data.list,function(e,a){a.frontChecked&&(t=t+a.id+",")}),t.length<=0)return void Bestone.ui.message({content:"请至少选择一个"});e.config.modalBox.content='<p style="font-size: 14px;text-align: center;padding: 20px 0px;line-height: 16px;">确定移除选中权限？</p>',e.config.modalBox.isShow=!0},confirmClickDeal:function(){var e=this,t="";if($.each(e.data.list,function(e,a){a.frontChecked&&(t=t+a.id+",")}),t.length<=0)return void Bestone.ui.message({content:"请至少选择一个"});t=t.substring(0,t.length-1),Bestone.util.ajax({url:"api/AuthManage/DeleteUserCheck",data:JSON.stringify({Ids:t,OperId:Bestone.user.id,OperName:Bestone.user.name}),success:function(t){Bestone.ui.message({content:"移除成功"}),e.config.modalBox.isShow=!1,e.config.isSendAjax=!0,Bestone.util.ajax({url:"api/AuthManage/GetUserCheckByRole",data:JSON.stringify({RoleId:e.config.roleId,PageIndex:1,PageSize:e.config.pageSize,Keyword:e.config.searchAjaxVal}),success:function(t){e.config.pageIndex=1,t.data.list.length<e.config.pageSize?e.config.isLoadAll=!0:e.config.isLoadAll=!1,e.data.list=t.data.list||[]},complete:function(){e.config.isSendAjax=!1}})}})},cancelClickDeal:function(){this.config.modalBox.isShow=!1}}}},136:function(e,t,a){t=e.exports=a(0)(void 0),t.push([e.i,"#permission-control[data-v-840127d6]{padding-top:10px}#permission-control>.search-content[data-v-840127d6]{background-color:#fff;padding:10px 15px}#permission-control>.list-content[data-v-840127d6]{margin-top:10px}#permission-control>.list-content>.no-data[data-v-840127d6]{color:#999;font-size:12px;line-height:20px;text-align:center;margin-top:50px;padding:0 20px}",""])},169:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("div",{attrs:{id:"permission-control"}},[a("div",{staticClass:"ui ui-title"},[e._v("配置管理部门权限："+e._s(e.config.roleName))]),e._v(" "),a("div",{staticClass:"search-content"},[a("search-box",{attrs:{searchVal:e.config.searchBox.searchVal,placeholder:e.config.searchBox.placeholder},on:{searchClick:e.ClickDeal,searchValChange:e.ValChangeDeal}})],1),e._v(" "),a("div",{staticClass:"list-content"},[e.data.list&&e.data.list.length>0?a("div",{staticClass:"ui ui-card-list"},[a("ul",e._l(e.data.list,function(t,i){return a("v-touch",{attrs:{tag:"li"},on:{pressup:function(t){t.preventDefault(),e.checkBoxClick(e.data.list,i)},tap:function(t){t.preventDefault(),e.checkBoxClick(e.data.list,i)}}},[a("div",{staticClass:"list-text"},[a("p",[e._v("TDS账号："+e._s(t.User_Name))]),e._v(" "),a("p",[e._v("姓名："+e._s(t.User_UserName))]),e._v(" "),a("p",[e._v("账号所属公司："+e._s(t.Up_Branch_Name))]),e._v(" "),a("p",[e._v("权限审核管理公司："+e._s(t.Branch_Name))])]),e._v(" "),a("div",{staticClass:"ui ui-checkbox",class:t.frontChecked?"checked":""},[a("span",{staticClass:"icon-content"},[a("i",{staticClass:"iconfont icon-gou"})])]),e._v(" "),a("p",{staticClass:"down-text"},[e._v("（"+e._s(t.CheckLevel)+"级审核）")])])}))]):e._e(),e._v(" "),e.data.list.length>0?a("div",{staticClass:"ui ui-scrollRefresh"},[e.config.isLoadAll?e._e():[a("i",{staticClass:"iconfont icon-load"}),a("span",[e._v("加载中")])],e._v(" "),e.config.isLoadAll?[a("span",[e._v("没有更多了")])]:e._e()],2):e._e(),e._v(" "),e.data.list&&e.data.list.length<=0?a("div",{staticClass:"no-data"},[e._v("暂无数据")]):e._e()]),e._v(" "),e._e(),e._v(" "),a("modal-box",{attrs:{setConfig:e.config.modalBox},on:{confirmClick:e.confirmClickDeal,cancelClick:e.cancelClickDeal}})],1)])},staticRenderFns:[]}},200:function(e,t,a){var i=a(136);"string"==typeof i&&(i=[[e.i,i,""]]),i.locals&&(e.exports=i.locals);a(2)("1d19e29a",i,!0)},83:function(e,t,a){function i(e){a(200)}var n=a(1)(a(114),a(169),i,"data-v-840127d6",null);e.exports=n.exports}});