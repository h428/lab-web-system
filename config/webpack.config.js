const CompressionWebpackPlugin = require('compression-webpack-plugin');
const prodGzipList = ['js', 'css'];
export const chainWebpack = (config) => {
  config.merge({
    optimization: {
      minimize: true,
      splitChunks: {
        chunks: 'async',
        minSize: 30000,
        minChunks: 2,
        automaticNameDelimiter: '.',
        cacheGroups: {
          vendor: {
            name: 'vendors',
            test: /^.*node_modules[\\/](?!ag-grid-|lodash|wangeditor|react-virtualized|rc-select|rc-drawer|rc-time-picker|rc-tree|rc-table|rc-calendar|antd).*$/,
            chunks: "all",
            priority: 10,
          },
          virtualized: {
            name: "virtualized",
            test: /[\\/]node_modules[\\/]react-virtualized/,
            chunks: "all",
            priority: 10
          },
          rcselect: {
            name: "rc-select",
            test: /[\\/]node_modules[\\/]rc-select/,
            chunks: "all",
            priority: 10
          },
          rcdrawer: {
            name: "rcdrawer",
            test: /[\\/]node_modules[\\/]rc-drawer/,
            chunks: "all",
            priority: 10
          },
          rctimepicker: {
            name: "rctimepicker",
            test: /[\\/]node_modules[\\/]rc-time-picker/,
            chunks: "all",
            priority: 10
          },
          ag: {
            name: "ag",
            test: /[\\/]node_modules[\\/]ag-grid-/,
            chunks: "all",
            priority: 10
          },
          antd: {
            name: "antd",
            test: /[\\/]node_modules[\\/]antd[\\/]/,
            chunks: "all",
            priority: 9
          },
          rctree: {
            name: "rctree",
            test: /[\\/]node_modules[\\/]rc-tree/,
            chunks: "all",
            priority: -1
          },
          rccalendar: {
            name: "rccalendar",
            test: /[\\/]node_modules[\\/]rc-calendar[\\/]/,
            chunks: "all",
            priority: -1
          },
          rctable: {
            name: "rctable",
            test: /[\\/]node_modules[\\/]rc-table[\\/]es[\\/]/,
            chunks: "all",
            priority: -1
          },
          wang: {
            name: "wang",
            test: /[\\/]node_modules[\\/]wangeditor[\\/]/,
            chunks: "all",
            priority: -1
          },
          lodash: {
            name: "lodash",
            test: /[\\/]node_modules[\\/]lodash[\\/]/,
            chunks: "all",
            priority: -2
          },
          bizcharts: {
            name: "bizcharts",
            test: /[\\/]node_modules[\\/]bizcharts[\\/]/,
            chunks: "all",
            priority: 10
          },
          xlsx: {
            name: "xlsx",
            test: /[\\/]node_modules[\\/]xlsx[\\/]/,
            chunks: "async",
            priority: 10
          }
        }
      }
    }
  });
  config.plugin("replace").use(require("webpack").ContextReplacementPlugin).tap(() => {
    return [/moment[/\\]locale$/, /zh-cn/];
  });

  if (process.env.NODE_ENV === 'production') {  // 生产模式开启
    config.plugin('compression-webpack-plugin').use(
      new CompressionWebpackPlugin({
        // filename: 文件名称，这里我们不设置，让它保持和未压缩的文件同一个名称
        algorithm: 'gzip', // 指定生成gzip格式
        test: new RegExp('\\.(' + prodGzipList.join('|') + ')$'), // 匹配哪些格式文件需要压缩
        threshold: 10240, //对超过10k的数据进行压缩
        minRatio: 0.6 // 压缩比例，值为0 ~ 1
      })
    );
  }
}

