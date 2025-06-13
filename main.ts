import { getVideoUrl } from "./douyin.ts";
Deno.serve(async (req) => {
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
});
