webpackJsonp([19],{100:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=function(){return{data:{treeView:[]},config:{userId:0,userName:"",userUserName:"",userBranchName:"",menuCode:"",menuName:"",searchBox:{searchVal:"",placeholder:"公司名称",suggest:{isShow:1,data:[]}},treeView:{isShow:1,isShowIcon:2,keyConfig:{name:"Branch_Name",id:"Config_ID",childKey:"childList"},locationConfig:{key:"id"}}}}};t.default={data:function(){return new i},activated:function(){var e=this;Bestone.ui.pageInit({setTitle:Bestone.util.query().title||"我的权限管理-查看详细",reviewCallBack:function(){e.config.menuCode=Bestone.util.query().MenuCode||"",e.config.menuName=Bestone.util.query().MenuName||"",Bestone.util.ajax({url:"api/UserManage/GetMenuUserConfigByUser",data:JSON.stringify({MenuCode:e.config.menuCode,UserId:Bestone.user.id,Keyword:e.config.searchBox.searchVal}),success:function(t){e.config.searchBox.suggest.data=Bestone.util.getTreeViewDataForSearch({data:t.data||[],name:"Branch_Name",id:"Config_ID",childKey:"ChildList"}),e.data.treeView=t.data||[]}})}})},deactivated:function(){var e=this;Bestone.util.resetData(function(){e.$data.data=i().data,e.$data.config=i().config})},methods:{itemClickDeal:function(e){var t=e.id;if(t){var a=$(".ui.tree-view .loca"+t);$(".ui.tree-view .item").css("background-color","transparent"),a.length>0&&setTimeout(function(){a.css("background-color","#FFFBE6"),$(window).scrollTop(a.offset().top-5)},100)}},searchClickDeal:function(e){Bestone.ui.message({content:"仅支持智能匹配搜索"})},searchValChangeDeal:function(e){this.config.searchVal=e},dataArrChangeDeal:function(e){this.data.list=e}}}},127:function(e,t,a){t=e.exports=a(0)(void 0),t.push([e.i,"#my-permission-mgmt[data-v-18d509d9]{padding-top:10px;padding-bottom:60px}#my-permission-mgmt>.search-content[data-v-18d509d9]{border-top:1px solid #eee;background-color:#fff;padding:10px 15px}#my-permission-mgmt>.ui-title[data-v-18d509d9]{margin-top:10px}#my-permission-mgmt>.tree-view-content[data-v-18d509d9]{border-bottom:1px solid #eee}",""])},160:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("div",{attrs:{id:"my-permission-mgmt"}},[e.data.treeView&&e.data.treeView.length>0?[a("div",{staticClass:"search-content"},[a("search-box",{attrs:{searchVal:e.config.searchBox.searchVal,placeholder:e.config.searchBox.placeholder,suggest:e.config.searchBox.suggest},on:{searchClick:e.searchClickDeal,searchValChange:e.searchValChangeDeal,itemClick:e.itemClickDeal}})],1),e._v(" "),a("div",{staticClass:"ui ui-title"},[e._v(e._s(e.config.menuName)+"权限管理范围")]),e._v(" "),a("div",{staticClass:"tree-view-content"},[a("tree-view",{attrs:{dataArr:e.data.treeView,setConfig:e.config.treeView}})],1)]:e._e(),e._v(" "),e.data.treeView&&e.data.treeView.length<=0?a("div",{staticClass:"ui no-data"},[e._v("TDS功能菜单，无管理范围设置。")]):e._e()],2)])},staticRenderFns:[]}},191:function(e,t,a){var i=a(127);"string"==typeof i&&(i=[[e.i,i,""]]),i.locals&&(e.exports=i.locals);a(2)("365c39f7",i,!0)},69:function(e,t,a){function i(e){a(191)}var n=a(1)(a(100),a(160),i,"data-v-18d509d9",null);e.exports=n.exports}});