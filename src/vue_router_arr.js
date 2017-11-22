/**
 * Created by luotl on 2017/7/6.
 * vue单文件应用路由
 */

// // ie?
// function isIE() {
//     if (!!window.ActiveXObject || "ActiveXObject" in window)
//         return true;
//     else
//         return false;
// };


var routerArr = [
    {
        path: '/',
        component: resolve => require(['./component/index.vue'], resolve)
    },{
        // 我的权限管理
        path: '/myPermissionMgmt/myPermissionMgmt',
        component: resolve => require(['./component/myPermissionMgmt/myPermissionMgmt.vue'], resolve)
    },{
        path: '/myPermissionMgmt/myPermissionDetail',
        component: resolve => require(['./component/myPermissionMgmt/myPermissionDetail.vue'], resolve)
    },{
        // 申请权限
        path: '/applyPermission/applyPermission',
        component: resolve => require(['./component/applyPermission/applyPermission.vue'], resolve)
    },{
        path: '/applyPermission/mgmtLimit',
        component: resolve => require(['./component/applyPermission/mgmtLimit.vue'], resolve)
    },{
        path: '/applyPermission/finalCheck',
        component: resolve => require(['./component/applyPermission/finalCheck.vue'], resolve)
    },{
        // 申请记录
        path: '/applyRecord/applyRecord',
        component: resolve => require(['./component/applyRecord/applyRecord.vue'], resolve)
    },{
        path: '/applyRecord/applyRecordDetail',
        component: resolve => require(['./component/applyRecord/applyRecordDetail.vue'], resolve)
    },{
        path: '/applyRecord/controlLimit',
        component: resolve => require(['./component/applyRecord/controlLimit.vue'], resolve)
    },{
        // 权限申请审核
        path: '/applyPermissionAudit/applyPermissionAudit',
        component: resolve => require(['./component/applyPermissionAudit/applyPermissionAudit.vue'], resolve)
    },{
        path: '/applyPermissionAudit/auditDetail',
        component: resolve => require(['./component/applyPermissionAudit/auditDetail.vue'], resolve)
    },{
        path: '/applyPermissionAudit/auditRecord',
        component: resolve => require(['./component/applyPermissionAudit/auditRecord.vue'], resolve)
    },{
        path: '/applyPermissionAudit/auditRecordDetail',
        component: resolve => require(['./component/applyPermissionAudit/auditRecordDetail.vue'], resolve)
    },{
        // 权限管控
        path: '/permissionControl/permissionControl',
        component: resolve => require(['./component/permissionControl/permissionControl.vue'], resolve)
    },{
        path: '/permissionControl/permissionLimit',
        component: resolve => require(['./component/permissionControl/permissionLimit.vue'], resolve)
    },{
        path: '/permissionControl/permissionMgmt',
        component: resolve => require(['./component/permissionControl/permissionMgmt.vue'], resolve)
    },{
        path: '/permissionControl/accountMgmt',
        component: resolve => require(['./component/permissionControl/accountMgmt.vue'], resolve)
    },{
        path: '/permissionControl/accountMgmtDetail',
        component: resolve => require(['./component/permissionControl/accountMgmtDetail.vue'], resolve)
    },{
        // 权限管理配置
        path: '/permissionMgmtConfig/permissionMgmtConfig',
        component: resolve => require(['./component/permissionMgmtConfig/permissionMgmtConfig.vue'], resolve)
    },{
        path: '/permissionMgmtConfig/addPermissionAudit',
        component: resolve => require(['./component/permissionMgmtConfig/addPermissionAudit.vue'], resolve)
    },{
        path: '/permissionMgmtConfig/configPermissionAudit',
        component: resolve => require(['./component/permissionMgmtConfig/configPermissionAudit.vue'], resolve)
    },{
        path: '/permissionMgmtConfig/mgmtPermissionAudit',
        component: resolve => require(['./component/permissionMgmtConfig/mgmtPermissionAudit.vue'], resolve)
    },{
        path: '/permissionMgmtConfig/mgmtPermissionAuditDetail',
        component: resolve => require(['./component/permissionMgmtConfig/mgmtPermissionAuditDetail.vue'], resolve)
    },{
        path: '/permissionMgmtConfig/addPermissionMgmt',
        component: resolve => require(['./component/permissionMgmtConfig/addPermissionMgmt.vue'], resolve)
    },{
        path: '/permissionMgmtConfig/configPermissionMgmt',
        component: resolve => require(['./component/permissionMgmtConfig/configPermissionMgmt.vue'], resolve)
    },{
        path: '/permissionMgmtConfig/mgmtPermissionMgmt',
        component: resolve => require(['./component/permissionMgmtConfig/mgmtPermissionMgmt.vue'], resolve)
    },{
        path: '/permissionMgmtConfig/deptConfig',
        component: resolve => require(['./component/permissionMgmtConfig/deptConfig.vue'], resolve)
    },{
        path: '/permissionMgmtConfig/deptConfigDetail',
        component: resolve => require(['./component/permissionMgmtConfig/deptConfigDetail.vue'], resolve)
    },{
        path: '/permissionMgmtConfig/setConfigAdmin',
        component: resolve => require(['./component/permissionMgmtConfig/setConfigAdmin.vue'], resolve)
    },{
        // 日志
        path: '/log/userLog',
        component: resolve => require(['./component/log/userLog.vue'], resolve)
    },{
        // 404页面
        path: '*',
        component: resolve => require(['./component/404.vue'], resolve)
    }
];

module.exports = routerArr;