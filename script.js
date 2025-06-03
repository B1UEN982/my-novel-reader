const contentDiv = document.getElementById("content");
const select = document.getElementById("chapterSelect");
const themeBtn = document.getElementById("toggleTheme");
const backToTopBtn = document.getElementById("backToTop");

// 页面加载完后执行
document.addEventListener("DOMContentLoaded", () => {
  // 从 novel.json 读取章节列表
  fetch("/novel.json")
    .then((res) => res.json())
    .then((data) => {
      const chapters = data.chapters;
      chapters.forEach((chapter) => {
        const option = document.createElement("option");
        option.value = chapter.id; // 用章节 id 作为 value
        option.textContent = chapter.title;
        select.appendChild(option);
      });
      if (chapters.length > 0) {
        loadChapter(chapters[0].id); // 默认加载第一章
      }
    });
});

// 根据章节 id 加载对应内容
function loadChapter(id) {
  fetch("/novel.json")
    .then((res) => res.json())
    .then((data) => {
      const chapter = data.chapters.find((ch) => ch.id == id);
      if (chapter) {
        contentDiv.textContent = chapter.content;
      } else {
        contentDiv.textContent = "章节未找到";
      }
    });
}

// 章节切换事件
select.addEventListener("change", () => {
  loadChapter(select.value);
});

// 🌙 切换日夜模式
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeBtn.textContent = document.body.classList.contains("dark")
    ? "🌞 切换到日间模式"
    : "🌙 切换到夜间模式";
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
