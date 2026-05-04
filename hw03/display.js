async function loadTxtAsSet(path) {
  const res = await fetch(path);
  const text = await res.text();

  // 每行一個字 → 去掉空行
  return new Set(
    text
      .split("\n")
      .map((c) => c.trim())
      .filter((c) => c.length > 0),
  );
}

async function loadTxtAsArray(path) {
  const res = await fetch(path);
  const text = await res.text();

  return text
    .split("\n")
    .map((c) => c.trim())
    .filter((c) => c.length > 0);
}

function renderWithHighlight(chars, highlightSet, container) {
  const html = chars
    .map((c) => {
      if (highlightSet.has(c)) {
        return `<span style="font-weight:bold; text-decoration:underline;">${c}</span>`;
      }
      return c;
    })
    .join("");

  container.innerHTML = html;
}

async function main() {
  // 0.txt 作為比對集合
  const highlightSet = await loadTxtAsSet("0_written_newline.txt");

  const files = [
    { path: "1_MOE4808_newline.txt", selector: "#MOE4808" },
    { path: "2_big5_newline.txt", selector: "#big5" },
    { path: "3_notosanschar_newline.txt", selector: "#notosanschar" },
  ];

  for (const file of files) {
    const chars = await loadTxtAsArray(file.path);
    const container = document.querySelector(file.selector);
    renderWithHighlight(chars, highlightSet, container);
  }
}

// 等 DOM ready
document.addEventListener("DOMContentLoaded", main);
