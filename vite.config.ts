import { fileURLToPath, URL } from 'node:url'
import vueSetupExtend from 'vite-plugin-vue-setup-extend-plus'
// 1. 导入 loadEnv
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
// 2. 向 defineConfig 传递对象改为传递方法，并返回配置对象
export default defineConfig(({ mode }) => {
  // mode：获取 --mode 指定的模式，process.cwd()项目根目录，下面 `env` 相当于 `import.meta.env`
  const env = loadEnv(mode, process.cwd());
  return {
    // 开发服务器选项
    server: {
      host: '0.0.0.0',
      open: true, //启动服务时自动打开浏览器访问
      port: 8888, //端口号， 如果端口号被占用，会自动提升1
      proxy: {
        // '/dev-api': { // 匹配 /dev-api 开头的请求，
        [env.VITE_APP_BASE_API]: { // 引用变量作为key时，要加中括号[]
          // 目标服务器
          target: env.VITE_APP_SERVICE_URL,
          // 开启代理
          changeOrigin: true,
          rewrite: path => path.replace(new RegExp(`^${env.VITE_APP_BASE_API}/`), '')
        },
      }
    },
    assetsInclude: ['**/*.bmp'],
    plugins: [
      vue(),
      vueSetupExtend() // 让 `<script setup name="xx">` 上 name 作为缓存组件名
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
});
