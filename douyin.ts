const pattern = /"video":{"play_addr":{"uri":"([a-z0-9]+)"/;
const cVUrl =
  "https://www.iesdouyin.com/aweme/v1/play/?video_id=%s&ratio=1080p&line=0";

async function doGet(url: string): Promise<Response> {
  const headers = new Headers();
  headers.set(
    "User-Agent",
    "Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-G973U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.2 Chrome/87.0.4280.141 Mobile Safari/537.36",
  );
  const resp = await fetch(url, { method: "GET", headers });
  return resp;
}

async function getVideoId(url: string): Promise<string> {
  const resp = await doGet(url);
  const body = await resp.text();
  const match = pattern.exec(body);
  if (!match || !match[1]) throw new Error("Video ID not found in URL");
  return match[1];
}

async function getVideoUrl(url: string): Promise<string> {
  const id = await getVideoId(url);
  let downloadUrl = cVUrl.replace("%s", id);

  // Try to follow redirects to get the actual video URL
  try {
    const headers = new Headers();
    headers.set(
      "User-Agent",
      "Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-G973U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.2 Chrome/87.0.4280.141 Mobile Safari/537.36",
    );
    // Adding a Referer, as this is often checked by video servers
    // The initial URL (the one shared by the user) can be a good candidate for Referer
    headers.set("Referer", url); 

    const resp = await fetch(downloadUrl, { method: "GET", headers: headers, redirect: "manual" }); // Important: redirect: "manual"
    if (resp.status === 302) {
      const location = resp.headers.get("Location");
      if (location) {
        console.log("Redirected to:", location);
        downloadUrl = location; // Use the redirected URL
      } else {
        console.warn("Got 302 but no Location header for:", downloadUrl);
      }
    } else {
      console.log(`Initial request to ${downloadUrl} status: ${resp.status}. Body will not be consumed here.`);
      // If not a redirect, we assume (for now) this URL might work or needs further client-side handling.
      // Or, we might need to parse resp.text() if it contains the video URL in a different format.
    }
  } catch (e) {
    console.error("Error trying to follow redirect for video URL:", e);
    // Fallback to the initially constructed URL if fetching/redirect fails
  }

  return downloadUrl;
}

//const url = "https://v.douyin.com/JyCk5gy";
//const downloadUrl = await getVideoUrl(url);
//console.log(downloadUrl);

export { getVideoUrl };
