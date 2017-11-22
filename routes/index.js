var express = require('express');
var request = require('request');
var fs = require('fs');
var router = express.Router();

var Bestone = {
    version: '20170706'
}

/* 首页 */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Express',
        Bestone: Bestone
    });
});

/* 匹配所有其他页面 */
router.get('/:page', function(req, res, next) {
    var viewName = req.params.page.toLowerCase();
    var thisPath = __dirname.substring(0, __dirname.length - 6);
    fs.exists(`${ thisPath }/views/${ viewName }.html`, function(exists) {
        exists ? res.render(viewName, {
            Bestone: Bestone
        }) : next();
    });
});

router.use(function (req, res) {
    res.render('index', {
        title: 'Express',
        Bestone: Bestone
    });
})

// router.get('/test', function(req, res, next) {
//     res.send('respond with a reee');
// });

module.exports = router;