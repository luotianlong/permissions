webpackJsonp([10],{109:function(e,t,i){"use strict";function n(e){if(Array.isArray(e)){for(var t=0,i=Array(e.length);t<e.length;t++)i[t]=e[t];return i}return Array.from(e)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){return{data:{configCompany:{treeView:[]},configMenu:{treeView:[]}},config:{userID:0,userName:"",userUserName:"",userBranchName:"",tabIndex:1,modalBox:{isShow:!1,content:"",btn:[{text:"确定",handel:"confirmClick"},{text:"取消",handel:"cancelClick"}]},configCompany:{searchBox:{searchVal:"",placeholder:"公司名称搜索",suggest:{isShow:1,data:[]}},treeView:{isShow:1,isShowIcon:2,showChoice:!0,keyConfig:{name:"Branch_Name",id:"Branch_ID",childKey:"ChildList"},locationConfig:{key:"id"}}},configMenu:{searchBox:{searchVal:"",placeholder:"搜索部门权限",suggest:{isShow:1,data:[]}},treeView:{isShow:1,isShowIcon:2,showChoice:!0,keyConfig:{name:"RoleName",id:"Id",childKey:"ChildList"},locationConfig:{key:"id"}}}}}};t.default={data:function(){return new a},activated:function(){var e=this;Bestone.ui.pageInit({setTitle:"配置权限审核",reviewCallBack:function(){e.config.userID=Bestone.util.query().UserID||0,e.config.userName=Bestone.util.query().UserName||"",e.config.userUserName=Bestone.util.query().UserUserName||"",e.config.userBranchName=Bestone.util.query().UserBranchName||"",Bestone.util.ajax({url:"api/UserManage/GetCompanyBranchList",data:JSON.stringify({}),success:function(t){var i=[];$.each(t.data,function(e,t){i.push.apply(i,n(t.ChildList))}),e.config.configCompany.searchBox.suggest.data=Bestone.util.getTreeViewDataForSearch({data:i||[],name:"Branch_Name",id:"Branch_ID",childKey:"ChildList"}),e.data.configCompany.treeView=i||[]}}),Bestone.util.ajax({url:"api/AuthManage/GetRolesByKeyword",data:JSON.stringify({Keyword:""}),success:function(t){e.config.configMenu.searchBox.suggest.data=Bestone.util.getTreeViewDataForSearch({data:t.data||[],name:"RoleName",id:"Id",childKey:"ChildList"}),e.data.configMenu.treeView=t.data||[]}})}}),Bestone.ui.ddSetRight({control:!0,text:"提交",show:!0,onSuccess:function(){e.submitConfig()}})},deactivated:function(){var e=this;Bestone.util.resetData(function(){e.data=a().data,e.config=a().config})},methods:{switchTab:function(e){this.config.tabIndex=e},submitConfig:function(){var e=this,t="";if(1===e.config.tabIndex){if(function e(i){$.each(i,function(i,n){n.frontActive&&1===n.frontActive&&(t=t+n.Branch_ID+","),n.ChildList&&n.ChildList.length>0&&e(n.ChildList)})}(e.data.configCompany.treeView),t.length<=0)return void Bestone.ui.message({content:"请至少选择一家分公司"})}var i="";if($.each(e.data.configMenu.treeView,function(e,t){t.frontActive&&1===t.frontActive&&(i=i+t.Id+",")}),i.length<=0)return void Bestone.ui.message({content:"请至少选择一个部门"});e.config.modalBox.content='<p style="font-size: 14px;text-align: center;padding: 20px 0px;line-height: 16px;">确定提交？</p>',e.config.modalBox.isShow=!0},confirmClickDeal:function(){var e=this,t="";if(1===e.config.tabIndex){if(function e(i){$.each(i,function(i,n){n.frontActive&&1===n.frontActive&&(t=t+n.Branch_ID+","),n.ChildList&&n.ChildList.length>0&&e(n.ChildList)})}(e.data.configCompany.treeView),t.length<=0)return void Bestone.ui.message({content:"请至少选择一家分公司"});t=t.substring(0,t.length-1)}var i="";if($.each(e.data.configMenu.treeView,function(e,t){t.frontActive&&1===t.frontActive&&(i=i+t.Id+",")}),i.length<=0)return void Bestone.ui.message({content:"请至少选择一个部门"});i=i.substring(0,i.length-1),Bestone.util.ajax({url:"api/AuthManage/AddUserCheck",data:JSON.stringify({UserId:e.config.userID,CheckLevel:e.config.tabIndex,BranchIds:t,RoleIds:i,OperId:Bestone.user.id,OperName:Bestone.user.name}),success:function(e){Bestone.ui.message({content:"权限审核配置成功",notOper:!0}),setTimeout(function(){window.app.$router.go(-1)},1e3)}})},cancelClickDeal:function(){this.config.modalBox.isShow=!1},configCompanyClickDeal:function(e){Bestone.ui.message({content:"仅支持智能匹配搜索"})},configCompanyValChangeDeal:function(e){this.config.configCompany.searchBox.searchVal=e},configCompanyItemClickDeal:function(e){var t=e.id;if(t){var i=$(".config-company .ui.tree-view .loca"+t);$(".config-company .ui.tree-view .item").css("background-color","transparent"),i.length>0&&setTimeout(function(){i.css("background-color","#FFFBE6"),$(window).scrollTop(i.offset().top-5)},100)}},configCompanyTreeDataChangeDeal:function(e){this.data.configCompany.treeView=e,console.log(e)},configCompanyTreeMgmt:function(){Bestone.util.vueJump({path:"/permissionControl/permissionMgmt"})},configMenuClickDeal:function(e){Bestone.ui.message({content:"仅支持智能匹配搜索"})},configMenuValChangeDeal:function(e){this.config.configMenu.searchBox.searchVal=e},configMenuItemClickDeal:function(e){var t=e.id;if(t){var i=$(".config-menu .ui.tree-view .loca"+t);$(".config-menu .ui.tree-view .item").css("background-color","transparent"),i.length>0&&setTimeout(function(){i.css("background-color","#FFFBE6"),$(window).scrollTop(i.offset().top-5)},100)}},configMenuTreeDataChangeDeal:function(e){this.data.configMenu.treeView=e},configMenuTreeMgmt:function(){Bestone.util.vueJump({path:"/permissionControl/permissionMgmt"})}}}},120:function(e,t,i){t=e.exports=i(0)(void 0),t.push([e.i,'#mgmt-limit[data-v-079714c3]{padding-bottom:10px}#mgmt-limit .config-menu[data-v-079714c3],#mgmt-limit>.config-company[data-v-079714c3]{margin-top:10px}#mgmt-limit .config-menu .search[data-v-079714c3],#mgmt-limit>.config-company .search[data-v-079714c3]{background-color:#fff;padding:10px 15px}#mgmt-limit .config-menu .tree-view-content[data-v-079714c3],#mgmt-limit>.config-company .tree-view-content[data-v-079714c3]{margin-top:10px}#mgmt-limit .config-menu .prompting[data-v-079714c3],#mgmt-limit>.config-company .prompting[data-v-079714c3]{color:#999;font-size:12px;line-height:20px;text-align:center;margin-top:10px;margin-bottom:20px;padding:0 20px}#mgmt-limit>.config-company>.tab[data-v-079714c3]{background-color:#fff;height:40px;overflow:hidden;border-bottom:1px solid #eee}#mgmt-limit>.config-company>.tab>.item[data-v-079714c3]{position:relative;width:50%;height:40px;float:left;line-height:40px;font-size:14px;color:#666;text-align:center;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}#mgmt-limit>.config-company>.tab>.item[data-v-079714c3]:after{content:"";position:absolute;width:1px;height:26px;background-color:#eee;top:7px;right:0}#mgmt-limit>.config-company>.tab>.item.action[data-v-079714c3]{color:#38adff}#mgmt-limit>.config-company>.tab>.item.action[data-v-079714c3]:before{content:"";position:absolute;width:99%;height:1px;background-color:#38adff;top:0;left:0}#mgmt-limit>.config-company>.tab>.item[data-v-079714c3]:last-child{float:right}#mgmt-limit>.config-company>.tab>.item[data-v-079714c3]:last-child:after{width:0}#mgmt-limit>.config-company>.tab>.item:last-child.action[data-v-079714c3]:before{right:0;left:auto}',""])},153:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",[i("div",{attrs:{id:"mgmt-limit"}},[i("div",{staticClass:"ui ui-text-list"},[i("p",[e._v("TDS账号："+e._s(e.config.userName))]),e._v(" "),i("p",[e._v("姓名："+e._s(e.config.userUserName))]),e._v(" "),i("p",[e._v("账号所属公司："+e._s(e.config.userBranchName))])]),e._v(" "),i("div",{staticClass:"config-menu"},[i("div",{staticClass:"ui ui-title"},[e._v("配置审核菜单")]),e._v(" "),i("div",{staticClass:"search"},[i("search-box",{attrs:{searchVal:e.config.configMenu.searchBox.searchVal,placeholder:e.config.configMenu.searchBox.placeholder,suggest:e.config.configMenu.searchBox.suggest},on:{searchClick:e.configMenuClickDeal,searchValChange:e.configMenuValChangeDeal,itemClick:e.configMenuItemClickDeal}})],1),e._v(" "),i("div",{staticClass:"tree-view-content"},[i("tree-view",{attrs:{dataArr:e.data.configMenu.treeView,setConfig:e.config.configMenu.treeView},on:{dataArrChange:e.configMenuTreeDataChangeDeal,treeMgmt:e.configMenuTreeMgmt}})],1),e._v(" "),e.data.configMenu.treeView&&e.data.configMenu.treeView.length<=0?i("p",{staticClass:"prompting"},[e._v("暂无数据")]):e._e()]),e._v(" "),i("div",{staticClass:"config-company"},[i("div",{staticClass:"ui ui-title"},[e._v("配置审核公司")]),e._v(" "),i("div",{staticClass:"tab"},[i("v-touch",{staticClass:"item",class:1===e.config.tabIndex?"action":"",attrs:{tag:"div"},on:{tap:function(t){t.preventDefault(),e.switchTab(1)},pressup:function(t){t.preventDefault(),e.switchTab(1)}}},[e._v("1级审核（分公司）")]),e._v(" "),i("v-touch",{staticClass:"item",class:2===e.config.tabIndex?"action":"",attrs:{tag:"div"},on:{tap:function(t){t.preventDefault(),e.switchTab(2)},pressup:function(t){t.preventDefault(),e.switchTab(2)}}},[e._v("2级审核（集团）")])],1),e._v(" "),i("div",{directives:[{name:"show",rawName:"v-show",value:1===e.config.tabIndex,expression:"config.tabIndex===1"}]},[i("div",{staticClass:"search"},[i("search-box",{attrs:{searchVal:e.config.configCompany.searchBox.searchVal,placeholder:e.config.configCompany.searchBox.placeholder,suggest:e.config.configCompany.searchBox.suggest},on:{searchClick:e.configCompanyClickDeal,searchValChange:e.configCompanyValChangeDeal,itemClick:e.configCompanyItemClickDeal}})],1),e._v(" "),i("div",{staticClass:"tree-view-content"},[i("tree-view",{attrs:{dataArr:e.data.configCompany.treeView,setConfig:e.config.configCompany.treeView},on:{dataArrChange:e.configCompanyTreeDataChangeDeal,treeMgmt:e.configCompanyTreeMgmt}})],1),e._v(" "),e.data.configCompany.treeView&&e.data.configCompany.treeView.length<=0?i("p",{staticClass:"prompting"},[e._v("暂无数据")]):e._e()]),e._v(" "),i("div",{directives:[{name:"show",rawName:"v-show",value:2===e.config.tabIndex,expression:"config.tabIndex===2"}]},[i("p",{staticClass:"prompting"},[e._v("二级审核，不需要设置具体管理公司范围")])])]),e._v(" "),e._e(),e._v(" "),i("modal-box",{attrs:{setConfig:e.config.modalBox},on:{confirmClick:e.confirmClickDeal,cancelClick:e.cancelClickDeal}})],1)])},staticRenderFns:[]}},184:function(e,t,i){var n=i(120);"string"==typeof n&&(n=[[e.i,n,""]]),n.locals&&(e.exports=n.locals);i(2)("353bfb2e",n,!0)},78:function(e,t,i){function n(e){i(184)}var a=i(1)(i(109),i(153),n,"data-v-079714c3",null);e.exports=a.exports}});