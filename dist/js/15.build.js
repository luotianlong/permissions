webpackJsonp([15],{104:function(e,a,t){"use strict";function o(e){if(Array.isArray(e)){for(var a=0,t=Array(e.length);a<e.length;a++)t[a]=e[a];return t}return Array.from(e)}Object.defineProperty(a,"__esModule",{value:!0});var n=function(){return{data:{pageOne:{treeView:[]},pageTwo:{list:[]}},config:{tabIndex:1,pageOne:{searchBox:{searchVal:"",placeholder:"权限名称",suggest:{isShow:1,data:[]}},treeView:{isShow:1,isShowIcon:2,keyConfig:{name:"MenuName",id:"MenuCode",childKey:"ChildList"},btn:[{iconFontClass:"icon-manager",color:"#E5B626",handle:"treeMgmt"}],locationConfig:{key:"id"}}},pageTwo:{noDataText:"请输入条件搜索",pageIndex:1,pageSize:10,isLoadAll:!1,isSendAjax:!1,isSendFirst:!1,searchAjaxVal:"",searchBox:{searchVal:"",placeholder:"登录账号/姓名搜索"}}}}};a.default={data:function(){return new n},activated:function(){var e=this;Bestone.ui.pageInit({setTitle:"权限管控",reviewCallBack:function(){Bestone.util.ajax({url:"api/UserManage/GetUserRoleMenus",data:JSON.stringify({Keyword:""}),success:function(a){e.config.pageOne.searchBox.suggest.data=Bestone.util.getTreeViewDataForSearch({data:a.data,name:"MenuName",id:"MenuCode",childKey:"ChildList"}),$.each(a.data,function(e,a){a.frontNoShowBtn=["treeMgmt"]}),e.data.pageOne.treeView=a.data}})}}),Bestone.util.scrollRefresh({callback:function(a){2!==e.config.tabIndex||!e.config.pageTwo.isSendFirst||e.config.pageTwo.isSendAjax||e.config.pageTwo.isLoadAll||(e.config.pageTwo.isSendAjax=!0,Bestone.util.ajax({url:"api/UserManage/GetUsers",showLoad:!1,data:JSON.stringify({PageIndex:e.config.pageTwo.pageIndex+1,PageSize:e.config.pageTwo.pageSize,Keyword:e.config.pageTwo.searchAjaxVal}),success:function(a){var t;a.data.list.length<e.config.pageTwo.pageSize&&(e.config.pageTwo.isLoadAll=!0),e.config.pageTwo.pageIndex=a.data.page,(t=e.data.pageTwo.list).push.apply(t,o(a.data.list))},complete:function(){e.config.pageTwo.isSendAjax=!1}}))}})},deactivated:function(){var e=this;Bestone.util.resetData(function(){e.data=n().data,e.config=n().config})},methods:{switchTab:function(e){this.config.tabIndex=e},pageOneClickDeal:function(e){Bestone.ui.message({content:"仅支持智能匹配搜索"})},pageOneValChangeDeal:function(e){this.config.pageOne.searchBox.searchVal=e},itemClickDeal:function(e){var a=e.id;if(a){var t=$(".ui.tree-view .loca"+a);$(".ui.tree-view .item").css("background-color","transparent"),t.length>0&&setTimeout(function(){t.css("background-color","#FFFBE6"),$(window).scrollTop(t.offset().top-5)},100)}},pageOneTreeMgmt:function(e){console.log(e);var a="";1==e.MenuType?a="/permissionControl/permissionMgmt":2==e.MenuType&&(a="/permissionControl/permissionLimit"),Bestone.util.vueJump({path:a,query:{MenuName:e.MenuName,MenuCode:e.MenuCode}})},pageTwoClickDeal:function(e){var a=this;a.config.pageTwo.isSendAjax=!0,Bestone.util.ajax({url:"api/UserManage/GetUsers",data:JSON.stringify({PageIndex:1,PageSize:a.config.pageTwo.pageSize,Keyword:e}),success:function(t){a.config.pageTwo.searchAjaxVal=e,a.config.pageTwo.pageIndex=1,a.config.pageTwo.isSendFirst=!0,t.data.list.length<a.config.pageTwo.pageSize?a.config.pageTwo.isLoadAll=!0:a.config.pageTwo.isLoadAll=!1,a.data.pageTwo.list=t.data.list||[],a.config.pageTwo.noDataText="暂无数据"},complete:function(){a.config.pageTwo.isSendAjax=!1}})},pageTwoValChangeDeal:function(e){this.config.pageTwo.searchBox.searchVal=e},textStatusDeal:function(e){return Bestone.util.textStatusDeal(e)},mgmt:function(e){Bestone.util.vueJump({path:"/permissionControl/accountMgmt",query:{UserID:e.User_ID,UserName:e.User_Name,UserUserName:e.User_UserName,UserBranchName:e.UserBranchName}})}}}},148:function(e,a,t){a=e.exports=t(0)(void 0),a.push([e.i,'#permission-control[data-v-f96e4332]{padding-top:10px}#permission-control>.tab[data-v-f96e4332]{background-color:#fff;height:40px;overflow:hidden;border-bottom:1px solid #eee}#permission-control>.tab>.item[data-v-f96e4332]{position:relative;width:50%;height:40px;float:left;line-height:40px;font-size:14px;color:#666;text-align:center;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}#permission-control>.tab>.item[data-v-f96e4332]:after{content:"";position:absolute;width:1px;height:26px;background-color:#eee;top:7px;right:0}#permission-control>.tab>.item.action[data-v-f96e4332]{color:#38adff}#permission-control>.tab>.item.action[data-v-f96e4332]:before{content:"";position:absolute;width:99%;height:1px;background-color:#38adff;top:0;left:0}#permission-control>.tab>.item[data-v-f96e4332]:last-child{float:right}#permission-control>.tab>.item[data-v-f96e4332]:last-child:after{width:0}#permission-control>.tab>.item:last-child.action[data-v-f96e4332]:before{right:0;left:auto}#permission-control>.page-one[data-v-f96e4332]{padding-bottom:10px}#permission-control>.page-one>.search-content[data-v-f96e4332]{background-color:#fff;padding:10px 15px}#permission-control>.page-one>.tree-view-content[data-v-f96e4332]{margin-top:10px}#permission-control>.page-one>.tree-view-content>.no-data[data-v-f96e4332]{color:#999;font-size:12px;line-height:20px;text-align:center;margin-top:50px;padding:0 20px}#permission-control>.page-two>.search-content[data-v-f96e4332]{background-color:#fff;padding:10px 15px}#permission-control>.page-two>.list-content[data-v-f96e4332]{margin-top:10px}#permission-control>.page-two>.list-content>.no-data[data-v-f96e4332]{color:#999;font-size:12px;line-height:20px;text-align:center;margin-top:50px;padding:0 20px}',""])},181:function(e,a){e.exports={render:function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("div",[t("div",{attrs:{id:"permission-control"}},[t("div",{staticClass:"tab"},[t("v-touch",{staticClass:"item",class:1===e.config.tabIndex?"action":"",attrs:{tag:"div"},on:{tap:function(a){a.preventDefault(),e.switchTab(1)},pressup:function(a){a.preventDefault(),e.switchTab(1)}}},[e._v("按权限")]),e._v(" "),t("v-touch",{staticClass:"item",class:2===e.config.tabIndex?"action":"",attrs:{tag:"div"},on:{tap:function(a){a.preventDefault(),e.switchTab(2)},pressup:function(a){a.preventDefault(),e.switchTab(2)}}},[e._v("按账号")])],1),e._v(" "),t("div",{directives:[{name:"show",rawName:"v-show",value:1===e.config.tabIndex,expression:"config.tabIndex===1"}],staticClass:"page-one"},[t("div",{staticClass:"search-content"},[t("search-box",{attrs:{searchVal:e.config.pageOne.searchBox.searchVal,placeholder:e.config.pageOne.searchBox.placeholder,suggest:e.config.pageOne.searchBox.suggest},on:{searchClick:e.pageOneClickDeal,searchValChange:e.pageOneValChangeDeal,itemClick:e.itemClickDeal}})],1),e._v(" "),t("div",{staticClass:"tree-view-content"},[0==e.data.pageOne.treeView.length?t("div",{staticClass:"no-data"},[e._v("暂无数据")]):e._e(),e._v(" "),t("tree-view",{attrs:{dataArr:e.data.pageOne.treeView,setConfig:e.config.pageOne.treeView},on:{treeMgmt:e.pageOneTreeMgmt}})],1)]),e._v(" "),t("div",{directives:[{name:"show",rawName:"v-show",value:2===e.config.tabIndex,expression:"config.tabIndex===2"}],staticClass:"page-two"},[t("div",{staticClass:"search-content"},[t("search-box",{attrs:{searchVal:e.config.pageTwo.searchBox.searchVal,placeholder:e.config.pageTwo.searchBox.placeholder},on:{searchClick:e.pageTwoClickDeal,searchValChange:e.pageTwoValChangeDeal}})],1),e._v(" "),t("div",{staticClass:"list-content"},[e.data.pageTwo.list&&e.data.pageTwo.list.length>0?t("div",{staticClass:"ui ui-card-list"},[t("ul",e._l(e.data.pageTwo.list,function(a,o){return t("li",[t("div",{staticClass:"list-text"},[t("p",[e._v("TDS账号："+e._s(a.User_Name))]),e._v(" "),t("p",[e._v("姓名："+e._s(a.User_UserName))]),e._v(" "),t("p",[e._v("账号所属公司："+e._s(a.UserBranchName))])]),e._v(" "),t("v-touch",{staticClass:"btn",attrs:{tag:"div"},on:{pressup:function(t){t.preventDefault(),e.mgmt(a,o)},tap:function(t){t.preventDefault(),e.mgmt(a,o)}}},[e._v("管理权限")])],1)}))]):e._e(),e._v(" "),e.data.pageTwo.list.length>0?t("div",{staticClass:"ui ui-scrollRefresh"},[e.config.pageTwo.isLoadAll?e._e():[t("i",{staticClass:"iconfont icon-load"}),t("span",[e._v("加载中")])],e._v(" "),e.config.pageTwo.isLoadAll?[t("span",[e._v("没有更多了")])]:e._e()],2):e._e(),e._v(" "),e.data.pageTwo.list&&e.data.pageTwo.list.length<=0?t("div",{staticClass:"no-data"},[e._v(e._s(e.config.pageTwo.noDataText))]):e._e()])])])])},staticRenderFns:[]}},212:function(e,a,t){var o=t(148);"string"==typeof o&&(o=[[e.i,o,""]]),o.locals&&(e.exports=o.locals);t(2)("65f3e4ed",o,!0)},73:function(e,a,t){function o(e){t(212)}var n=t(1)(t(104),t(181),o,"data-v-f96e4332",null);e.exports=n.exports}});