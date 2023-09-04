chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "request") {
    console.warn("request", request);
    // 在这里发起网络请求
    fetch(request.url, {
      method: request.method || "GET",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(request.data || {}),
    })
      .then((response) => response.text())
      .then((data) => {
        // 将响应数据发送给内容脚本或弹出式窗口
        sendResponse({ data });
      })
      .catch((error) => {
        sendResponse({ error: error.message, request });
      });
    return true; // 返回 true 表示异步操作，保持 sendResponse 可用
  }
});
