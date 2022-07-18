import { defineConfig } from 'umi';
// import {chainWebpack} from './webpack.config';

export default defineConfig({
  hash: true,
  nodeModulesTransform: {
    type: 'none',
  },
  dynamicImport: {
    loading: '@/components/pro/PageLoading',
  },
  publicPath: '/',
  title: 'Labmate',
  // chainWebpack,
});
