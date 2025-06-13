import { getVideoUrl } from "./douyin.ts";
Deno.serve(async (req) => {
  console.log("Method:", req.method);

  const url = new URL(req.url);
  if (url.searchParams.has("url")) {
    const videoUrl = await getVideoUrl(url.searchParams.get("url")!);
    return new Response(videoUrl);
  } else {
    return new Response("请提供url参数");
  }
});
