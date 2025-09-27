const contentDiv = document.getElementById("content");
const select = document.getElementById("chapterSelect");
const themeBtn = document.getElementById("toggleTheme");
const backToTopBtn = document.getElementById("backToTop");
const bookShelfBtn = document.getElementById("bookShelfBtn");
const fontIncrease = document.getElementById("fontIncrease");
const fontDecrease = document.getElementById("fontDecrease");

// 获取 URL 参数里的 book
const urlParams = new URLSearchParams(window.location.search);
const book = urlParams.get("book");

// 根据当前 URL 动态判断基础路径，兼容 GitHub Pages 子目录
const basePath = window.location.pathname.startsWith("/my-novel-reader")
  ? "/my-novel-reader"
  : "";

// 封装 fetch novel.json，根据 book 参数加载对应书籍的章节
function fetchNovelJson() {
  if (!book) return Promise.reject(new Error("未指定书名 book 参数"));
  return fetch(`${basePath}/books/${book}/novel.json`).then((res) => {
    if (!res.ok) throw new Error("无法加载 novel.json");
    return res.json();
  });
}

// 页面加载
document.addEventListener("DOMContentLoaded", () => {
  // 初始化主题
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeBtn.textContent = "🌞 切换到日间模式";
  } else {
    document.body.classList.remove("dark");
    themeBtn.textContent = "🌙 切换到夜间模式";
  }

  // 加载章节列表
  fetchNovelJson()
    .then((data) => {
      const chapters = data.chapters;
      chapters.forEach((chapter) => {
        const option = document.createElement("option");
        option.value = chapter.id;
        option.textContent = chapter.title;
        select.appendChild(option);
      });

      if (chapters.length > 0) {
        const lastId = localStorage.getItem(`lastChapter_${book}`);
        const defaultId = chapters.some((ch) => ch.id == lastId)
          ? lastId
          : chapters[0].id;
        loadChapter(defaultId);
        select.value = defaultId;
      }
    })
    .catch((err) => {
      contentDiv.innerHTML = "加载章节列表失败：" + err.message;
    });
});

// 根据章节 id 加载内容
function loadChapter(id) {
  fetchNovelJson()
    .then((data) => {
      const chapter = data.chapters.find((ch) => ch.id == id);
      contentDiv.innerHTML = chapter ? chapter.content : "章节未找到";
    })
    .catch((err) => {
      contentDiv.innerHTML = "加载章节内容失败：" + err.message;
    });
}

// 章节切换事件
select.addEventListener("change", () => {
  const selectedId = select.value;
  loadChapter(selectedId);
  localStorage.setItem(`lastChapter_${book}`, selectedId);
});

// 🌙 日夜模式切换
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    themeBtn.textContent = "🌞 切换到日间模式";
    localStorage.setItem("theme", "dark");
  } else {
    themeBtn.textContent = "🌙 切换到夜间模式";
    localStorage.setItem("theme", "light");
  }
});

// 返回顶部按钮
window.addEventListener("scroll", () => {
  backToTopBtn.style.display = window.scrollY > 100 ? "block" : "none";
});

backToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
// ========== 字体大小调整 ==========
let fontSize = parseInt(window.getComputedStyle(contentDiv).fontSize, 10); // 初始字号
const fontIncreaseBtn = document.getElementById("fontIncrease");
const fontDecreaseBtn = document.getElementById("fontDecrease");

fontIncreaseBtn.addEventListener("click", () => {
  fontSize += 2;
  contentDiv.style.fontSize = fontSize + "px";
  localStorage.setItem("fontSize", fontSize); // 记住设置
});

fontDecreaseBtn.addEventListener("click", () => {
  if (fontSize > 10) {
    fontSize -= 2;
    contentDiv.style.fontSize = fontSize + "px";
    localStorage.setItem("fontSize", fontSize);
  }
});

// 页面加载时恢复用户选择的字号
document.addEventListener("DOMContentLoaded", () => {
  const savedFontSize = localStorage.getItem("fontSize");
  if (savedFontSize) {
    fontSize = parseInt(savedFontSize, 10);
    contentDiv.style.fontSize = fontSize + "px";
  }
});
