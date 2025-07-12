const contentDiv = document.getElementById("content");
const select = document.getElementById("chapterSelect");
const themeBtn = document.getElementById("toggleTheme");
const backToTopBtn = document.getElementById("backToTop");

// 根据当前 URL 动态判断基础路径，兼容 GitHub Pages 子目录
const basePath = window.location.pathname.startsWith("/my-novel-reader")
  ? "/my-novel-reader"
  : "";

// 统一封装 fetch novel.json
function fetchNovelJson() {
  return fetch(`${basePath}/novel.json`).then((res) => {
    if (!res.ok) throw new Error("无法加载 novel.json");
    return res.json();
  });
}

// 页面加载完后执行
document.addEventListener("DOMContentLoaded", () => {
  // 【插入点】主题初始化，先读localStorage并应用
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeBtn.textContent = "🌞 切换到日间模式";
  } else {
    document.body.classList.remove("dark");
    themeBtn.textContent = "🌙 切换到夜间模式";
  }
  fetchNovelJson()
    .then((data) => {
      const chapters = data.chapters;
      chapters.forEach((chapter) => {
        const option = document.createElement("option");
        option.value = chapter.id; // 用章节 id 作为 value
        option.textContent = chapter.title;
        select.appendChild(option);
      });
      if (chapters.length > 0) {
        const lastId = localStorage.getItem("lastChapter");
        const defaultId = chapters.some((ch) => ch.id == lastId)
          ? lastId
          : chapters[0].id;
        loadChapter(defaultId);
        select.value = defaultId;
      }
    })
    .catch((err) => {
      contentDiv.textContent = "加载章节列表失败：" + err.message;
    });
});

// 根据章节 id 加载对应内容
function loadChapter(id) {
  fetchNovelJson()
    .then((data) => {
      const chapter = data.chapters.find((ch) => ch.id == id);
      if (chapter) {
        contentDiv.textContent = chapter.content;
      } else {
        contentDiv.textContent = "章节未找到";
      }
    })
    .catch((err) => {
      contentDiv.textContent = "加载章节内容失败：" + err.message;
    });
}

// 章节切换事件（同时保存到本地）
select.addEventListener("change", () => {
  const selectedId = select.value;
  loadChapter(selectedId);
  localStorage.setItem("lastChapter", selectedId);
});

// 🌙 切换日夜模式
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

// 监听滚动，超过100px显示按钮，否则隐藏
window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    backToTopBtn.style.display = "block";
  } else {
    backToTopBtn.style.display = "none";
  }
});

// 点击按钮，平滑滚动回顶部
backToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
