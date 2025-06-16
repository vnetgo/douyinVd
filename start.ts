import { serve } from "https://deno.land/std/http/server.ts";

await serve(async (req) => {
    const url = new URL(req.url);
    
    if (url.pathname === "/") {
        const html = await Deno.readTextFile("./public/index.html");
        return new Response(html, {
            headers: { "Content-Type": "text/html" }
        });
    }
    
    // 保留原有API功能
    if (url.pathname === "/api/download") {
        // 原有下载逻辑...
    }
}, { port: 8000 });