webpackJsonp([18],{101:function(e,t,i){"use strict";function a(e){if(Array.isArray(e)){for(var t=0,i=Array(e.length);t<e.length;t++)i[t]=e[t];return i}return Array.from(e)}Object.defineProperty(t,"__esModule",{value:!0});var n=function(){return{data:{list:[]},config:{pageIndex:1,pageSize:15,isLoadAll:!1,isSendAjax:!1,isSendFirst:!1,searchAjaxVal:"",searchBox:{searchVal:"",placeholder:"权限名称/分公司名称"}}}};t.default={data:function(){return new n},activated:function(){var e=this;Bestone.ui.pageInit({setTitle:"我的权限管理",reviewCallBack:function(){e.config.isSendAjax=!0,Bestone.util.ajax({url:"api/UserManage/GetMenuUserConfigAllByUser",data:JSON.stringify({PageIndex:1,PageSize:e.config.pageSize,Keyword:e.config.searchAjaxVal,UserId:Bestone.user.id}),success:function(t){e.config.isSendFirst=!0,t.data.list.length<e.config.pageSize?e.config.isLoadAll=!0:e.config.isLoadAll=!1,e.data.list=t.data.list||[]},complete:function(){e.config.isSendAjax=!1}})}}),Bestone.ui.ddSetRight({control:!0,text:"日志",show:!0,onSuccess:function(){Bestone.util.vueJump({path:"/log/userLog",query:{UserId:Bestone.user.id,isSelf:!0}})}}),Bestone.util.scrollRefresh({callback:function(t){!e.config.isSendFirst||e.config.isSendAjax||e.config.isLoadAll||(e.config.isSendAjax=!0,Bestone.util.ajax({url:"api/UserManage/GetMenuUserConfigAllByUser",showLoad:!1,data:JSON.stringify({PageIndex:e.config.pageIndex+1,PageSize:e.config.pageSize,Keyword:e.config.searchAjaxVal,UserId:Bestone.user.id}),success:function(t){var i;t.data.list.length<e.config.pageSize&&(e.config.isLoadAll=!0),e.config.pageIndex=t.data.page,(i=e.data.list).push.apply(i,a(t.data.list))},complete:function(){e.config.isSendAjax=!1}}))}})},deactivated:function(){var e=this;Bestone.util.resetData(function(){e.data=n().data,e.config=n().config})},methods:{textStatusDeal:function(e){return Bestone.util.textStatusDeal(e)},viewDetail:function(e){Bestone.util.vueJump({path:"/myPermissionMgmt/myPermissionDetail",query:{MenuCode:e.Menu_Code,MenuName:e.Menu_Name||"查看详细"}})},applyPermission:function(){Bestone.util.vueJump({path:"/applyPermission/applyPermission"})},searchClickDeal:function(e){var t=this;t.config.isSendAjax=!0,Bestone.util.ajax({url:"api/UserManage/GetMenuUserConfigAllByUser",data:JSON.stringify({PageIndex:1,PageSize:t.config.pageSize,Keyword:e,UserId:Bestone.user.id}),success:function(i){t.config.searchAjaxVal=e,t.config.pageIndex=1,t.config.isSendFirst=!0,i.data.list.length<t.config.pageSize?t.config.isLoadAll=!0:t.config.isLoadAll=!1,t.data.list=i.data.list||[]},complete:function(){t.config.isSendAjax=!1}})},searchValChangeDeal:function(e){this.config.searchBox.searchVal=e}}}},122:function(e,t,i){t=e.exports=i(0)(void 0),t.push([e.i,"#my-permission-mgmt[data-v-0e191b6e]{padding-top:10px}#my-permission-mgmt>.search[data-v-0e191b6e]{background-color:#fff;padding:10px 15px}#my-permission-mgmt>.list[data-v-0e191b6e]{padding:0 10px}#my-permission-mgmt>.list>ul>li[data-v-0e191b6e]{position:relative;background-color:#fff;border-radius:5px;padding:10px 95px 10px 10px;margin-top:10px;overflow:hidden;font-size:12px}#my-permission-mgmt>.list>ul>li>.list-text>p[data-v-0e191b6e]{line-height:20px;color:#404040;height:20px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}#my-permission-mgmt>.list>ul>li>.view-detail-btn[data-v-0e191b6e]{position:absolute;top:15px;right:10px;cursor:pointer;width:73px;height:28px;border:1px solid #38adff;color:#38adff;line-height:28px;text-align:center;border-radius:3px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}#my-permission-mgmt>.list>ul>li>.view-detail-btn[data-v-0e191b6e]:active{background-color:#ddd}#my-permission-mgmt>.no-data[data-v-0e191b6e]{color:#999;font-size:12px;line-height:20px;text-align:center;margin-top:50px;padding:0 20px}#my-permission-mgmt>.no-data>span[data-v-0e191b6e]{color:#38adff}",""])},155:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",[i("div",{attrs:{id:"my-permission-mgmt"}},[i("div",{staticClass:"search"},[i("search-box",{attrs:{searchVal:e.config.searchBox.searchVal,placeholder:e.config.searchBox.placeholder},on:{searchClick:e.searchClickDeal,searchValChange:e.searchValChangeDeal}})],1),e._v(" "),i("div",{staticClass:"ui ui-title"},[i("p",{staticClass:"omit"},[e._v("你拥有的TDS业支端权限")]),e._v(" "),i("v-touch",{staticClass:"right-btn",attrs:{tag:"a"},on:{pressup:function(t){t.preventDefault(),e.applyPermission(t)},tap:function(t){t.preventDefault(),e.applyPermission(t)}}},[e._v("去申请"),i("i",{staticClass:"iconfont icon-you"})])],1),e._v(" "),e.data.list&&e.data.list.length>0?[i("div",{staticClass:"list"},[i("ul",e._l(e.data.list,function(t,a){return i("li",[i("div",{staticClass:"list-text"},[i("p",[e._v("权限名称："+e._s(e.textStatusDeal(t.Menu_Name)))]),e._v(" "),i("p",[e._v("管理范围："+e._s(e.textStatusDeal(t.Branch_Name)))])]),e._v(" "),i("v-touch",{staticClass:"view-detail-btn",attrs:{tag:"div"},on:{pressup:function(i){i.preventDefault(),e.viewDetail(t,a)},tap:function(i){i.preventDefault(),e.viewDetail(t,a)}}},[e._v("查看详细")])],1)}))])]:e._e(),e._v(" "),e.data.list&&e.data.list.length<=0?i("div",{staticClass:"no-data"},[e._v("你还没有该权限，"),i("br"),e._v("点击右上方"),i("span",[e._v("去申请")]),e._v("按钮申请")]):e._e(),e._v(" "),e.data.list.length>0?i("div",{staticClass:"ui ui-scrollRefresh"},[e.config.isLoadAll?e._e():[i("i",{staticClass:"iconfont icon-load"}),i("span",[e._v("加载中")])],e._v(" "),e.config.isLoadAll?[i("span",[e._v("没有更多了")])]:e._e()],2):e._e(),e._v(" "),e._e()],2)])},staticRenderFns:[]}},186:function(e,t,i){var a=i(122);"string"==typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);i(2)("080b0540",a,!0)},70:function(e,t,i){function a(e){i(186)}var n=i(1)(i(101),i(155),a,"data-v-0e191b6e",null);e.exports=n.exports}});