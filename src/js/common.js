import $ from "jquery";

// 处理ios移动端点击效果
document.body.addEventListener('touchstart', function () {
});

// 判断登录
(function () {
    let pathName = location.pathname;
    // 判断是否需要检查登录状态
    function isNeedCheckLogin() {
        // 不需要登录的页面地址
        let noNeedArr = [
            '/applyRecord/applyRecordDetail',
            '/applyPermissionAudit/auditRecordDetail',
            '/applyPermissionAudit/auditDetail',
            '/404'
        ];

        if(noNeedArr.indexOf(pathName)>-1) {
            return false; // 不需要检查登录
        }
        return true;
    }

    // 获取sessionStorage存储的用户信息
    if(!!sessionStorage.user && !!JSON.parse(sessionStorage.user).id) {
        Bestone.user = JSON.parse(sessionStorage.user);
    }else {
        if(pathName!=='/' && isNeedCheckLogin()) {
            location.href = '/';
        }
    }
})();

// 万恶的fixed
(function () {
    // // if(Bestone.util.navigator({checkType:'Android'})) {
    //     var h = document.body.scrollHeight;
    //     window.onresize = function () {
    //         if (document.body.scrollHeight < h) {
    //             $('.ui.ui-bottom-btn').css('display','none');
    //         } else {
    //             $('.ui.ui-bottom-btn').css('display','block');
    //         }
    //     };
    // // }

    // function fixedWatch(el) {
    //     if(document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA'){
    //         el.addClass('focus');
    //     } else {
    //         el.removeClass('focus');
    //     }
    // }
    //
    // setInterval(function () {
    //     fixedWatch($('.ui.ui-bottom-btn'));
    // }, 500);

})();

// 钉钉 禁用webview下拉弹性效果
(function () {
    dd.ready(function () {
        dd.ui.webViewBounce.disable({});
    });
})();
