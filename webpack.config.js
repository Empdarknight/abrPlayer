const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry:['babel-polyfill' , './src/js/index.js'] ,
    output: {
        path:path.resolve(__dirname , 'dist'),
        filename:'js/index.js'

    },
    devServer:{
        contentBase:'./dist'
    },
    plugins:[
        new HtmlWebpackPlugin({

            filename:'index.html',
            template:'./src/index.html'
        }) 
    ],
    module:{
        rules:[
            {
                test:/\\index.js$/,
                exclude:/node_modules/,
                use:{
                    loader:'babel-loader'
                }
            }
        ]
    }
}