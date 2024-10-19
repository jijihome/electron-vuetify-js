# Electron Vuetify JavaScript 项目模板

这是一个基于 Electron、Vue 3 和 Vuetify 的桌面应用程序项目模板。

## 功能特性

- 使用 Electron 框架构建跨平台桌面应用
- 集成 ESLint 进行代码质量控制
- 支持自动导入路由
- 支持自动导入和组件自动注册
- 使用 Pinia 进行状态管理
- 集成 Prettier 进行代码格式化

## 安装

确保您的系统已安装 Node.js 和 Yarn。然后按照以下步骤进行安装:

1. 克隆仓库:

   ```bash
   git clone https://github.com/jijihome/electron-vuetify-js
   cd electron-vuetify-js
   ```

2. 安装依赖:
   ```bash
   yarn install
   ```

## 开发

启动开发服务器:

```bash
yarn start
```

## 项目命令

- `yarn start`: 使用 nodemon 监视 src/electron 目录的变化,并执行`yarn app:dev`命令。
- `yarn dev`: 启动 Vite 开发服务器。
- `yarn build`: 使用 Vite 构建项目,然后使用 electron-builder 打包应用程序。
- `yarn preview`: 预览 Vite 构建后的生产版本。
- `yarn app:dev`: 并行运行 Vite 开发服务器和 Electron 应用,等待开发服务器就绪后再启动 Electron。
- `yarn make:win`: 复制原生模块,构建项目,然后使用 electron-builder 创建 Windows 目录格式的应用程序。
- `yarn make`: 同`yarn make:win`。
- `yarn make:portable`: 复制原生模块,构建项目,然后使用 electron-builder 创建 Windows 便携版应用程序。
- `yarn set:npm:official`: 将 npm registry 设置为官方源。
- `yarn set:npm:huawei`: 将 npm registry 设置为华为镜像源。
- `yarn set:yarn:offical`: 将 yarn registry 设置为官方源。
- `yarn set:yarn:huawei`: 将 yarn registry 设置为华为镜像源。
- `yarn set:yarn:taobao`: 将 yarn registry 设置为淘宝镜像源。
- `yarn gyp`: 重新构建 node-gyp 模块。
- `yarn copy-native`: 复制原生.node 文件到 dist 目录。
- `yarn lint`: 使用 ESLint 检查并修复代码,忽略 .gitignore 中指定的文件。
- `yarn clean`: 清理项目,删除 dist、dist-electron、release 目录和一些自动生成的类型文件。
- `yarn prettier`: 使用 Prettier 检查代码格式。
- `yarn prettier:fix`: 使用 Prettier 自动修复代码格式。

## 主要依赖

- `electron`: 用于构建跨平台桌面应用
- `vue`: 前端框架
- `vuetify`: 基于 Vue 的 UI 组件库
- `pinia`: Vue.js 的状态管理库
- `vue-router`: Vue.js 的官方路由

## 开发依赖

- `vite`: 构建工具和开发服务器
- `@vitejs/plugin-vue`: Vite 的 Vue 插件
- `electron-builder`: 用于打包和构建 Electron 应用
- `eslint`: 代码质量工具
- `sass`: CSS 预处理器
- `unplugin-auto-import`: 自动导入 API
- `unplugin-vue-components`: 自动注册 Vue 组件
- `unplugin-vue-router`: 自动生成 Vue 路由
- `vite-plugin-electron`: Vite 的 Electron 插件
- `vite-plugin-vuetify`: Vite 的 Vuetify 插件
- `prettier`: 代码格式化工具

## Electron Builder 配置

项目使用`electron-builder.json`文件来配置 Electron 应用的打包和分发选项。详细配置请查看项目根目录下的`electron-builder.json`文件。

## 许可证

[MIT](https://choosealicense.com/licenses/mit/)
