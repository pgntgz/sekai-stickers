import localQuotes from "../quotes.json";

// 内存中维护的段子缓冲池
let quotePool = [...localQuotes];
let isFetching = false;

/**
 * 智能分词与折行算法：
 * 当单行文字超过 7 个字且没有换行时，优先寻找居中合理的标点符号截断；
 * 没有标点时在句子中间自然断行，防止贴纸画布左右溢出顶框。
 */
export function smartBreakText(text) {
  if (!text) return "";
  const trimmed = text.trim();
  if (trimmed.includes("\n")) {
    return trimmed; // 已经包含换行符，尊重用户排版
  }

  const len = trimmed.length;
  if (len <= 7) {
    return trimmed; // 7字以内单行展示最为饱满
  }

  // 标点符号集
  const puncts = ["，", "。", "！", "？", "；", "…", ",", ".", "!", "?", "~", "～", " "];
  const mid = len / 2;
  let bestIdx = -1;
  let minDiff = 999;

  for (let i = 0; i < len; i++) {
    const ch = trimmed[i];
    if (puncts.includes(ch) && i >= 2 && i <= len - 3) {
      const diff = Math.abs(i - mid);
      if (diff < minDiff) {
        minDiff = diff;
        bestIdx = i;
      }
    }
  }

  if (bestIdx !== -1) {
    if (trimmed[bestIdx] === " ") {
      return trimmed.slice(0, bestIdx) + "\n" + trimmed.slice(bestIdx + 1);
    }
    return trimmed.slice(0, bestIdx + 1) + "\n" + trimmed.slice(bestIdx + 1);
  }

  // 没有合适标点，在正中间折行
  const cut = Math.floor(len / 2);
  return trimmed.slice(0, cut) + "\n" + trimmed.slice(cut);
}

/**
 * 过滤清洗短段子：3~24 字
 */
function cleanQuote(content) {
  if (!content) return null;
  const str = content.trim().replace(/\r/g, "");
  if (str.length >= 3 && str.length <= 24 && str.split("\n").length <= 2) {
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
 * 获取一条随机短段子（自动进行智能断行）
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
  return smartBreakText(chosen);
}
