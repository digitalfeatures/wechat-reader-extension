const ICON = {
  SYNC: `
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" class="arco-icon arco-icon-sync" stroke-width="4" stroke-linecap="butt" stroke-linejoin="miter" filter="" data-v-249840b0="">
      <path d="M11.98 11.703c-6.64 6.64-6.64 17.403 0 24.042a16.922 16.922 0 0 0 8.942 4.7M34.603 37.156l1.414-1.415c6.64-6.639 6.64-17.402 0-24.041A16.922 16.922 0 0 0 27.075 7M14.81 11.982l-1.414-1.414-1.414-1.414h2.829v2.828ZM33.192 36.02l1.414 1.414 1.414 1.415h-2.828V36.02Z"></path>
    </svg>
    `,
};

class CSSUnit {
  static toPXUnit(value) {
    return `${value}px`;
  }
}

let BOOK_CACHE_TABLE = [];

async function getShelfs() {
  const response = await fetch("https://weread.qq.com/web/shelf/sync", {
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
      "content-type": "application/json;charset=UTF-8",
      "sec-ch-ua":
        '"Not/A)Brand";v="99", "Google Chrome";v="115", "Chromium";v="115"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
    },
    referrer: "https://weread.qq.com/web/shelf",
    referrerPolicy: "strict-origin-when-cross-origin",
    method: "GET",
    mode: "cors",
    credentials: "include",
  });
  const res = await response.json();
  if (res) {
    const { books } = res;
    BOOK_CACHE_TABLE = books;
  }
}

function handleRequestServer(url, method, data) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      { action: "request", url, method, data },
      (response) => {
        console.warn("response", response);
        if (chrome.runtime.lastError) {
          return resolve({
            status: false,
            message: chrome.runtime.lastError,
          });
        }

        if (response.error) {
          return resolve({
            status: false,
            message: response.error,
          });
        }

        resolve({
          status: true,
          data: response.data,
        });
      }
    );
  });
}

function createGroup(parent) {
  const group = document.createElement("div");
  group.style["position"] = "absolute";
  group.style["width"] = "100%";

  group.style["bottom"] = CSSUnit.toPXUnit(50);
  group.style["height"] = CSSUnit.toPXUnit(36);

  group.style["background"] = "rgba(0,0,0,.3)";

  group.style["display"] = "flex";
  group.style["align-items"] = "center";
  group.style["justify-content"] = "flex-end";

  const sync = document.createElement("div");
  sync.innerHTML = ICON.SYNC;

  Object.assign(sync.style, {
    boxSizing: "border-box",
    width: "36px",
    height: "36px",
    padding: "10px",
    color: "rgba(255,255,255,1)",
  });

  const title = (parent.children[1] || {}).innerText || "";
  sync.addEventListener("click", (event) => {
    event.preventDefault();
    if (title) {
      const book = BOOK_CACHE_TABLE.find((book) => book.title === title);
      if (book) {
        const { bookId } = book;

        handleRequestServer("http://localhost:62025/book", "POST", {
          name: title,
          referenceResourceId: bookId,
          referenceResourceSource: "wechat-reader",
        }).then((response) => {
          const { status } = response;
          if (status) {
            sync.style["color"] = "#58a55c";
          }

          const book = BOOK_CACHE_TABLE.find((book) => book.title === title);
          if (book) {
            console.log("title", response);
          }
        });
      }
    }
  });

  group.appendChild(sync);

  if (parent) {
    parent.appendChild(group);
  }
}

function main() {
  // 缓存书架信息
  getShelfs();

  const elements = document.getElementsByClassName("shelfBook");
  for (const element of elements) {
    createGroup(element);
  }

  // 目标元素，你希望监听在它下面插入新元素的元素
  const targetElement = document.getElementsByClassName("shelf_list")[0];

  // 创建一个 Mutation Observer 实例
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        // 检查是否有新元素插入
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.className === "shelfBook") {
              createGroup(node);
            }
          }
        }
      }
    }
  });

  // 配置 Mutation Observer，监视子节点插入
  const config = { childList: true };
  observer.observe(targetElement, config);
}

(function () {
  setTimeout(() => {
    main();
  }, 2 * 1000);
})();
