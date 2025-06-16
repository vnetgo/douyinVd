import {getVideoUrl} from "./douyin.ts";

const handler = async (req:Request) => {
    console.log("Method:", req.method);

    const url = new URL(req.url);

    // 如果是根路径请求，返回HTML页面
    if (url.pathname === "/") {
        try {
            const htmlContent = await Deno.readTextFile("./index.html");
            return new Response(htmlContent, {
                headers: { "Content-Type": "text/html; charset=utf-8" },
            });
        } catch (error) {
            console.error("Error reading index.html:", error);
            return new Response("无法加载页面", { status: 500 });
        }
    }

    // 处理视频下载请求
    if (url.searchParams.has("url")) {
        const inputUrl = url.searchParams.get("url")!;
        console.log("inputUrl:", inputUrl);
        try {
            const videoUrl = await getVideoUrl(inputUrl);
            // 为了触发浏览器下载，而不是直接在页面显示内容，可以考虑重定向
            // 或者，如果API直接返回视频流并且客户端JS处理下载，则保持原样
            // 这里我们先尝试直接返回视频URL，前端JS会处理跳转
            // 如果要直接下载，可以设置 Content-Disposition header
            // 返回视频URL为JSON，由前端处理预览和下载
            return new Response(JSON.stringify({ videoUrl }), {
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("Error getting video URL:", error);
            return new Response("获取视频链接失败: " + error.message, { status: 500 });
        }
    } 

    // 对于其他路径或没有url参数的请求，可以返回一个更友好的提示或404
    return new Response("无效的请求。请访问首页或提供有效的视频URL参数。", { status: 404 });
}

export {handler}