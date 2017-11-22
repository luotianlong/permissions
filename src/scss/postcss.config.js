/**
 * Created by luotl on 2017/7/12.
 */

module.exports = {
    plugins: [
        require('autoprefixer')({ browsers: ['last 10 Chrome versions', 'last 5 Firefox versions', 'Safari >= 6', 'ie > 8'] })
    ]
}