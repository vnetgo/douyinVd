import {getVideoUrl} from "./douyin.ts";

const handler = async (req:Request) => {
    console.log("Method:", req.method);

    const url = new URL(req.url);

    // 优先处理视频下载请求 (API call)
    if (url.searchParams.has("url")) {
        const inputUrl = url.searchParams.get("url")!;
        console.log("API Call - inputUrl:", inputUrl);
        try {
            const videoUrl = await getVideoUrl(inputUrl);
            return new Response(JSON.stringify({ videoUrl }), {
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("Error getting video URL:", error);
            return new Response(JSON.stringify({ error: "获取视频链接失败: " + error.message }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }
    }

    // 如果没有url参数，再检查是否为根路径请求，返回HTML页面
    if (url.pathname === "/") {
        try {
            const htmlContent = await Deno.readTextFile("./index.html");
            return new Response(htmlContent, {
                headers: { "Content-Type": "text/html; charset=utf-8" },
            });
        } catch (error) {
            console.error("Error reading index.html:", error);
            // 确保此处的错误也返回JSON
            return new Response(JSON.stringify({ error: "无法加载页面: " + error.message }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }
    }

    // 对于其他未匹配的路径，返回JSON格式的404错误
    return new Response(JSON.stringify({ error: "请求的资源未找到。" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
    });
}

export {handler}