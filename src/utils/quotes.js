import localQuotes from "../quotes.json";

// 内存中维护的段子缓冲池
let quotePool = [...localQuotes];
let isFetching = false;

/**
 * 过滤清洗短段子：3~22 字，剔除过长文本与复杂换行
 */
function cleanQuote(content) {
  if (!content) return null;
  const str = content.trim().replace(/\r/g, "");
  if (str.length >= 3 && str.length <= 22 && str.split("\n").length <= 2) {
    return str;
  }
  return null;
}

/**
 * 后台静默预加载更多段子（优先请求本站 Nginx 反代 /api/quotes）
 */
export async function prefetchQuotes() {
  if (isFetching) return;
  isFetching = true;
  try {
    const res = await fetch("/api/quotes?sort=random&limit=50", {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      const raw = data?.data?.quotes || [];
      const newQuotes = [];
      for (const item of raw) {
        const text = cleanQuote(item.content);
        if (text && !quotePool.includes(text)) {
          newQuotes.push(text);
        }
      }
      if (newQuotes.length > 0) {
        quotePool = [...quotePool, ...newQuotes];
      }
    }
  } catch (err) {
    // 静默忽略网络错误，保留已有本地词库
  } finally {
    isFetching = false;
  }
}

/**
 * 获取一条随机短段子（耗尽时自动循环并触发后台拉取）
 */
export function getRandomQuote() {
  if (quotePool.length < 5) {
    prefetchQuotes();
  }
  if (quotePool.length === 0) {
    quotePool = [...localQuotes];
  }
  const index = Math.floor(Math.random() * quotePool.length);
  const chosen = quotePool[index];
  quotePool.splice(index, 1);
  return chosen;
}
