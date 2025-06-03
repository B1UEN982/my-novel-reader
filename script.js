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
      option.value = chapter.id; // 改成用章节id
      option.textContent = chapter.title;
      select.appendChild(option);
    });
    if (chapters.length > 0) {
      loadChapter(chapters[0].id); // 用章节id加载
    }
  });

// 读取并显示章节内容
function loadChapter(id) {
  fetch(`/api/chapter/${id}`) // 改成调用新的API接口，传章节id
    .then((res) => res.json())
    .then((chapter) => {
      contentDiv.innerHTML = chapter.content.replace(/\n/g, "<br>"); // 处理换行显示
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
