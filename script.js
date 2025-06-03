const contentDiv = document.getElementById("content");
const select = document.getElementById("chapterSelect");
const themeBtn = document.getElementById("toggleTheme");
const backToTopBtn = document.getElementById("backToTop");

// 从服务器获取章节列表并生成选项
fetch("/api/chapters")
  .then((res) => res.json())
  .then((chapters) => {
    chapters.forEach((chapter) => {
      const option = document.createElement("option");
      option.value = chapter.file; // 用文件名
      option.textContent = chapter.title;
      select.appendChild(option);
    });
    if (chapters.length > 0) {
      loadChapter(chapters[0].file);
    }
  });

// 读取并显示章节内容
function loadChapter(file) {
  fetch(`/chapters/${encodeURIComponent(file)}`) // 注意要encodeURIComponent编码中文和空格
    .then((res) => res.text())
    .then((text) => {
      contentDiv.textContent = text;
    });
}

// 切换章节时加载内容
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
