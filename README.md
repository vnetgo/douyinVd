# 抖音无水印视频下载服务

## 📌 功能说明

通过提供的抖音视频链接，获取对应的无水印视频链接。

### 🔧 请求方式
- **方法**：GET
- **地址**：`https://yourdomain?url=https://v.douyin.com/xxxx/`
- **参数说明**：
    - `url`: 抖音视频分享链接

### 📤 返回结果
返回解析后的无水印视频直链（URL）。

---

## 🚀 部署方式

本项目支持多种部署方式，方便快速上线使用。

### 1. Deno Deploy 部署
- 进入 [Deno Deploy](https://dash.deno.com/) 控制台。
- 创建新项目，选择可执行文件为 [douyin.ts](file:///Users/pwhcoder/WebstormProjects/douyinVd/douyin.ts)。
- 部署后即可通过 HTTPS 访问服务。

### 2. Cloudflare Workers 部署
- 安装 [`denoflare`](https://github.com/skymethod/denoflare) CLI 工具。
- 在项目根目录配置 `.denoflare` 文件。
- 执行部署命令：
  ```bash
  denoflare push cfworker.ts
  ```

- 参考文档：[Cloudflare Workers 教程](https://docs.deno.com/examples/cloudflare_workers_tutorial/)

