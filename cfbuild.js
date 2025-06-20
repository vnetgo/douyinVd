// home/pwh/jspj/douyinVd/douyin.ts
var pattern = /"video":{"play_addr":{"uri":"([a-z0-9]+)"/;
var cVUrl = "https://www.iesdouyin.com/aweme/v1/play/?video_id=%s&ratio=1080p&line=0";
var statsRegex = /"statistics"\s*:\s*\{([\s\S]*?)\},/;
var regex = /"nickname":\s*"([^"]+)",\s*"signature":\s*"([^"]+)"/;
var ctRegex = /"create_time":\s*(\d+)/;
var descRegex = /"desc":\s*"([^"]+)"/;
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
async function doGet(url) {
  const headers = new Headers();
  headers.set(
    "User-Agent",
    "Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-G973U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.2 Chrome/87.0.4280.141 Mobile Safari/537.36"
  );
  const resp = await fetch(url, { method: "GET", headers });
  return resp;
}
async function getVideoInfo(url) {
  const resp = await doGet(url);
  const body = await resp.text();
  const match = pattern.exec(body);
  if (!match || !match[1]) throw new Error("Video ID not found in URL");
  const video_url = cVUrl.replace("%s", match[1]);
  const auMatch = body.match(regex);
  const ctMatch = body.match(ctRegex);
  const descMatch = body.match(descRegex);
  const statsMatch = body.match(statsRegex);
  if (statsMatch) {
    const innerContent = statsMatch[0];
    const awemeIdMatch = innerContent.match(/"aweme_id"\s*:\s*"([^"]+)"/);
    const commentCountMatch = innerContent.match(/"comment_count"\s*:\s*(\d+)/);
    const diggCountMatch = innerContent.match(/"digg_count"\s*:\s*(\d+)/);
    const playCountMatch = innerContent.match(/"play_count"\s*:\s*(\d+)/);
    const shareCountMatch = innerContent.match(/"share_count"\s*:\s*(\d+)/);
    const collectCountMatch = innerContent.match(/"collect_count"\s*:\s*(\d+)/);
    const douyinVideoInfo = {
      aweme_id: awemeIdMatch ? awemeIdMatch[1] : null,
      comment_count: commentCountMatch ? parseInt(commentCountMatch[1]) : null,
      digg_count: diggCountMatch ? parseInt(diggCountMatch[1]) : null,
      share_count: shareCountMatch ? parseInt(shareCountMatch[1]) : null,
      collect_count: collectCountMatch ? parseInt(collectCountMatch[1]) : null,
      nickname: null,
      signature: null,
      desc: null,
      create_time: null,
      video_url,
      type: "video",
      image_url_list: null
    };
    if (auMatch) {
      douyinVideoInfo.nickname = auMatch[1];
      douyinVideoInfo.signature = auMatch[2];
    }
    if (ctMatch) {
      const date = new Date(parseInt(ctMatch[1]) * 1e3);
      douyinVideoInfo.create_time = formatDate(date);
    }
    if (descMatch) {
      douyinVideoInfo.desc = descMatch[1];
    }
    console.log(douyinVideoInfo);
    return douyinVideoInfo;
  } else {
    throw new Error("No stats found in the response.");
  }
}
async function getVideoId(url) {
  const resp = await doGet(url);
  const body = await resp.text();
  const match = pattern.exec(body);
  if (!match || !match[1]) throw new Error("Video ID not found in URL");
  return match[1];
}
async function getVideoUrl(url) {
  const id = await getVideoId(url);
  const downloadUrl = cVUrl.replace("%s", id);
  return downloadUrl;
}

// home/pwh/jspj/douyinVd/serve.ts
var handler = async (req) => {
  console.log("Method:", req.method);
  const url = new URL(req.url);
  if (url.searchParams.has("url")) {
    const inputUrl = url.searchParams.get("url");
    console.log("inputUrl:", inputUrl);
    if (url.searchParams.has("data")) {
      const videoInfo = await getVideoInfo(inputUrl);
      return new Response(JSON.stringify(videoInfo));
    }
    const videoUrl = await getVideoUrl(inputUrl);
    return new Response(videoUrl);
  } else {
    return new Response("\u8BF7\u63D0\u4F9Burl\u53C2\u6570");
  }
};

// home/pwh/jspj/douyinVd/cfworker.ts
var cfworker_default = {
  fetch: handler
};
export {
  cfworker_default as default
};
