webpackJsonp([6],{113:function(e,a,t){"use strict";function n(e){if(Array.isArray(e)){for(var a=0,t=Array(e.length);a<e.length;a++)t[a]=e[a];return t}return Array.from(e)}Object.defineProperty(a,"__esModule",{value:!0});var i=function(){return{data:{pageOne:{treeView:[]},pageTwo:{list:[]}},config:{tabIndex:1,pageOne:{searchBox:{searchVal:"",placeholder:"搜索部门权限",suggest:{isShow:1,data:[]}},treeView:{isShow:1,isShowIcon:2,keyConfig:{name:"RoleName",id:"Id",childKey:"ChildList"},btn:[{iconFontClass:"icon-manager",color:"#E5B626",handle:"treeMgmt"}],locationConfig:{key:"id"}}},pageTwo:{noDataText:"请输入条件搜索",pageIndex:1,pageSize:10,isLoadAll:!1,isSendAjax:!1,isSendFirst:!1,searchAjaxVal:"",searchBox:{searchVal:"",placeholder:"登录账号/姓名/权限管理公司名称搜索"},modalBox:{isShow:!1,content:"",btn:[{text:"确定",handel:"confirmClick"},{text:"取消",handel:"cancelClick"}]}}}}};a.default={data:function(){return new i},watch:{"config.tabIndex":{handler:function(e,a){var t=this;1===e?Bestone.ui.ddSetRight():2===e&&Bestone.ui.ddSetRight({control:!0,text:"移除权限",show:!0,onSuccess:function(){t.clearPermission()}})},deep:!0,immediate:!0}},activated:function(){var e=this;Bestone.ui.pageInit({setTitle:"管理“权限审核”配置",reviewCallBack:function(){Bestone.util.ajax({url:"api/AuthManage/GetRolesByKeyword",data:JSON.stringify({Keyword:""}),success:function(a){e.config.pageOne.searchBox.suggest.data=Bestone.util.getTreeViewDataForSearch({data:a.data||[],name:"RoleName",id:"Id",childKey:"ChildList"}),e.data.pageOne.treeView=a.data||[]}})}}),Bestone.util.scrollRefresh({callback:function(a){2!==e.config.tabIndex||!e.config.pageTwo.isSendFirst||e.config.pageTwo.isSendAjax||e.config.pageTwo.isLoadAll||(e.config.pageTwo.isSendAjax=!0,Bestone.util.ajax({url:"api/AuthManage/GetUserCheckByUser",showLoad:!1,data:JSON.stringify({PageIndex:e.config.pageTwo.pageIndex+1,PageSize:e.config.pageTwo.pageSize,Keyword:e.config.pageTwo.searchAjaxVal}),success:function(a){var t;a.data.list.length<e.config.pageTwo.pageSize&&(e.config.pageTwo.isLoadAll=!0),e.config.pageTwo.pageIndex=a.data.page,(t=e.data.pageTwo.list).push.apply(t,n(a.data.list))},complete:function(){e.config.pageTwo.isSendAjax=!1}}))}})},deactivated:function(){var e=this;Bestone.util.resetData(function(){e.data=i().data,e.config=i().config})},methods:{switchTab:function(e){this.config.tabIndex=e},pageOneClickDeal:function(e){Bestone.ui.message({content:"仅支持智能匹配搜索"})},pageOneValChangeDeal:function(e){this.config.pageOne.searchBox.searchVal=e},itemClickDeal:function(e){var a=e.id;if(a){var t=$(".ui.tree-view .loca"+a);$(".ui.tree-view .item").css("background-color","transparent"),t.length>0&&setTimeout(function(){t.css("background-color","#FFFBE6"),$(window).scrollTop(t.offset().top-5)},100)}},pageOneTreeMgmt:function(e){Bestone.util.vueJump({path:"/permissionMgmtConfig/mgmtPermissionAuditDetail",query:{RoleName:e.RoleName,RoleId:e.Id}})},pageTwoClickDeal:function(e){var a=this;a.config.pageTwo.isSendAjax=!0,Bestone.util.ajax({url:"api/AuthManage/GetUserCheckByUser",data:JSON.stringify({PageIndex:1,PageSize:a.config.pageTwo.pageSize,Keyword:e}),success:function(t){a.config.pageTwo.searchAjaxVal=e,a.config.pageTwo.pageIndex=1,a.config.pageTwo.isSendFirst=!0,t.data.list.length<a.config.pageTwo.pageSize?a.config.pageTwo.isLoadAll=!0:a.config.pageTwo.isLoadAll=!1,a.data.pageTwo.list=t.data.list||[],a.config.pageTwo.noDataText="暂无数据"},complete:function(){a.config.pageTwo.isSendAjax=!1}})},pageTwoValChangeDeal:function(e){this.config.pageTwo.searchBox.searchVal=e},textStatusDeal:function(e){return Bestone.util.textStatusDeal(e)},checkBoxClick:function(e,a){function t(){return JSON.parse(JSON.stringify(e[a]))}var n=t();n.frontChecked=!0;var i=t();i.frontChecked=!1,e[a].frontChecked?e.splice(a,1,i):e.splice(a,1,n)},clearPermission:function(e){var a=this,t="";if($.each(a.data.pageTwo.list,function(e,a){a.frontChecked&&(t=t+a.id+",")}),t.length<=0)return void Bestone.ui.message({content:"请至少选择一个"});a.config.pageTwo.modalBox.content='<p style="font-size: 14px;text-align: center;padding: 20px 0px;line-height: 16px;">确定移除选中权限？</p>',a.config.pageTwo.modalBox.isShow=!0},confirmClickDeal:function(){var e=this,a="";if($.each(e.data.pageTwo.list,function(e,t){t.frontChecked&&(a=a+t.id+",")}),a.length<=0)return void Bestone.ui.message({content:"请至少选择一个"});a=a.substring(0,a.length-1),Bestone.util.ajax({url:"api/AuthManage/DeleteUserCheck",data:JSON.stringify({Ids:a,OperId:Bestone.user.id,OperName:Bestone.user.name}),success:function(a){Bestone.ui.message({content:"移除成功"}),e.config.pageTwo.modalBox.isShow=!1,e.config.pageTwo.isSendAjax=!0,Bestone.util.ajax({url:"api/AuthManage/GetUserCheckByUser",data:JSON.stringify({PageIndex:1,PageSize:e.config.pageTwo.pageSize,Keyword:e.config.pageTwo.searchAjaxVal}),success:function(a){e.config.pageTwo.pageIndex=1,a.data.list.length<e.config.pageTwo.pageSize?e.config.pageTwo.isLoadAll=!0:e.config.pageTwo.isLoadAll=!1,e.data.pageTwo.list=a.data.list||[]},complete:function(){e.config.pageTwo.isSendAjax=!1}})}})},cancelClickDeal:function(){this.config.pageTwo.modalBox.isShow=!1}}}},121:function(e,a,t){a=e.exports=t(0)(void 0),a.push([e.i,"#permission-control[data-v-097c2124]{padding-top:10px}#permission-control>.page-one[data-v-097c2124]{padding-bottom:10px}#permission-control>.page-one>.search-content[data-v-097c2124]{background-color:#fff;padding:10px 15px}#permission-control>.page-one>.tree-view-content[data-v-097c2124]{margin-top:10px}#permission-control>.page-one>.tree-view-content>.no-data[data-v-097c2124]{color:#999;font-size:12px;line-height:20px;text-align:center;margin-top:50px;padding:0 20px}#permission-control>.page-two>.search-content[data-v-097c2124]{background-color:#fff;padding:10px 15px}#permission-control>.page-two>.list-content[data-v-097c2124]{margin-top:10px}#permission-control>.page-two>.list-content>.no-data[data-v-097c2124]{color:#999;font-size:12px;line-height:20px;text-align:center;margin-top:50px;padding:0 20px}",""])},154:function(e,a){e.exports={render:function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("div",[t("div",{attrs:{id:"permission-control"}},[t("div",{staticClass:"ui ui-tab"},[t("v-touch",{staticClass:"item",class:1===e.config.tabIndex?"action":"",attrs:{tag:"div"},on:{tap:function(a){a.preventDefault(),e.switchTab(1)},pressup:function(a){a.preventDefault(),e.switchTab(1)}}},[e._v("按权限")]),e._v(" "),t("v-touch",{staticClass:"item",class:2===e.config.tabIndex?"action":"",attrs:{tag:"div"},on:{tap:function(a){a.preventDefault(),e.switchTab(2)},pressup:function(a){a.preventDefault(),e.switchTab(2)}}},[e._v("按账号")])],1),e._v(" "),t("div",{directives:[{name:"show",rawName:"v-show",value:1===e.config.tabIndex,expression:"config.tabIndex===1"}],staticClass:"page-one"},[t("div",{staticClass:"search-content"},[t("search-box",{attrs:{searchVal:e.config.pageOne.searchBox.searchVal,placeholder:e.config.pageOne.searchBox.placeholder,suggest:e.config.pageOne.searchBox.suggest},on:{searchClick:e.pageOneClickDeal,searchValChange:e.pageOneValChangeDeal,itemClick:e.itemClickDeal}})],1),e._v(" "),t("div",{staticClass:"tree-view-content"},[0==e.data.pageOne.treeView.length?t("div",{staticClass:"no-data"},[e._v("暂无数据")]):e._e(),e._v(" "),t("tree-view",{attrs:{dataArr:e.data.pageOne.treeView,setConfig:e.config.pageOne.treeView},on:{treeMgmt:e.pageOneTreeMgmt}})],1)]),e._v(" "),t("div",{directives:[{name:"show",rawName:"v-show",value:2===e.config.tabIndex,expression:"config.tabIndex===2"}],staticClass:"page-two"},[t("div",{staticClass:"search-content"},[t("search-box",{attrs:{searchVal:e.config.pageTwo.searchBox.searchVal,placeholder:e.config.pageTwo.searchBox.placeholder},on:{searchClick:e.pageTwoClickDeal,searchValChange:e.pageTwoValChangeDeal}})],1),e._v(" "),t("div",{staticClass:"list-content"},[e.data.pageTwo.list&&e.data.pageTwo.list.length>0?t("div",{staticClass:"ui ui-card-list"},[t("ul",e._l(e.data.pageTwo.list,function(a,n){return t("v-touch",{attrs:{tag:"li"},on:{pressup:function(a){a.preventDefault(),e.checkBoxClick(e.data.pageTwo.list,n)},tap:function(a){a.preventDefault(),e.checkBoxClick(e.data.pageTwo.list,n)}}},[t("div",{staticClass:"list-text"},[t("p",[e._v("TDS账号："+e._s(a.User_Name))]),e._v(" "),t("p",[e._v("姓名："+e._s(a.User_UserName))]),e._v(" "),t("p",[e._v("账号所属公司："+e._s(a.Up_Branch_Name))]),e._v(" "),t("p",[e._v("权限审核管理部门权限："+e._s(a.RoleName))]),e._v(" "),t("p",[e._v("权限审核管理公司："+e._s(a.Branch_Name))])]),e._v(" "),t("div",{staticClass:"ui ui-checkbox",class:a.frontChecked?"checked":""},[t("span",{staticClass:"icon-content"},[t("i",{staticClass:"iconfont icon-gou"})])]),e._v(" "),t("p",{staticClass:"down-text"},[e._v("（"+e._s(a.CheckLevel)+"级审核）")])])}))]):e._e(),e._v(" "),e.data.pageTwo.list&&e.data.pageTwo.list.length<=0?t("div",{staticClass:"no-data"},[e._v(e._s(e.config.pageTwo.noDataText))]):e._e()]),e._v(" "),e.data.pageTwo.list.length>0?t("div",{staticClass:"ui ui-scrollRefresh"},[e.config.pageTwo.isLoadAll?e._e():[t("i",{staticClass:"iconfont icon-load"}),t("span",[e._v("加载中")])],e._v(" "),e.config.pageTwo.isLoadAll?[t("span",[e._v("没有更多了")])]:e._e()],2):e._e(),e._v(" "),e._e(),e._v(" "),t("modal-box",{attrs:{setConfig:e.config.pageTwo.modalBox},on:{confirmClick:e.confirmClickDeal,cancelClick:e.cancelClickDeal}})],1)])])},staticRenderFns:[]}},185:function(e,a,t){var n=t(121);"string"==typeof n&&(n=[[e.i,n,""]]),n.locals&&(e.exports=n.locals);t(2)("54b35fc6",n,!0)},82:function(e,a,t){function n(e){t(185)}var i=t(1)(t(113),t(154),n,"data-v-097c2124",null);e.exports=i.exports}});