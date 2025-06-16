import {getVideoUrl} from "./douyin.ts";

const handler = async (req:Request) => {
    console.log("Method:", req.method);

    const url = new URL(req.url);
    if (url.searchParams.has("url")) {
        const inputUrl = url.searchParams.get("url")!;
        console.log("inputUrl:", inputUrl);
        const videoUrl = await getVideoUrl(inputUrl);
        return new Response(videoUrl);
    } else {
        return new Response("请提供url参数");
    }
}

// 新增静态文件服务中间件
import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const router = new Router();

// 原有API路由
router.get("/api/download", async (ctx) => {
    // 原有下载逻辑...
});

// 新增静态文件服务
router.get("/", async (ctx) => {
    try {
        ctx.response.body = await Deno.readTextFile("./public/index.html");
        ctx.response.type = "text/html";
    } catch {
        ctx.response.status = 404;
    }
});

const app = new Application();
app.use(router.routes());
app.listen({ port: 8000 });
export {handler}