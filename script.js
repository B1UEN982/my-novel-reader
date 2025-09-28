const contentDiv = document.getElementById("content");
const select = document.getElementById("chapterSelect");
const themeBtn = document.getElementById("toggleTheme");
const backToTopBtn = document.getElementById("backToTop");
const fontIncreaseBtn = document.getElementById("fontIncrease");
const fontDecreaseBtn = document.getElementById("fontDecrease");

const urlParams = new URLSearchParams(window.location.search);
const book = urlParams.get("book");

const basePath = window.location.pathname.startsWith("/my-novel-reader")
  ? "/my-novel-reader"
  : "";

let chapterData = null;
let fontSize = parseInt(window.getComputedStyle(contentDiv).fontSize, 10);

function fetchNovelJson() {
  if (chapterData) return Promise.resolve(chapterData);
  if (!book) return Promise.reject(new Error("未指定书名 book 参数"));
  return fetch(`${basePath}/books/${book}/novel.json`)
    .then((res) => {
      if (!res.ok) throw new Error("无法加载 novel.json");
      return res.json();
    })
    .then((data) => {
      chapterData = data;
      return data;
    });
}

function loadChapter(id) {
  if (!chapterData) return fetchNovelJson().then(() => loadChapter(id));
  const chapter = chapterData.chapters.find((ch) => ch.id == id);
  contentDiv.innerHTML = chapter ? chapter.content : "章节未找到";
}

// 初始化页面
document.addEventListener("DOMContentLoaded", () => {
  // 初始化封面与简介
  const booksInfo = {
    月之幻想: {
      cover: "images/cover/月之幻想.png",
      intro:
        "《月姬》的同人合集，“月之幻想”指的是B1UEN对《月姬 -The other side of red garden-》遥遥无期的不满，和一些幻想。",
    },
    孟晓的校园故事: {
      cover: "images/cover/きゅうくらりん--いよわ.png",
      intro: "孟晓的校园故事，封面出自《きゅうくらりん--いよわ》。",
    },
    随笔: {
      cover: "images/misakimei3.jpg",
      intro: "B1UEN的随笔，不限篇幅和形式，封面是《Another》小说的插画。",
    },
  };
  const coverEl = document.getElementById("bookCover");
  const introEl = document.getElementById("bookIntro");
  if (booksInfo[book]) {
    coverEl.src = booksInfo[book].cover;
    introEl.textContent = booksInfo[book].intro;
  } else {
    introEl.textContent = "未找到该书。";
  }

  // 初始化主题
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeBtn.textContent = "🌞 切换到日间模式";
  } else {
    document.body.classList.remove("dark");
    themeBtn.textContent = "🌙 切换到夜间模式";
  }

  // 初始化字体
  const savedFontSize = localStorage.getItem("fontSize");
  if (savedFontSize) {
    fontSize = parseInt(savedFontSize, 10);
    contentDiv.style.fontSize = fontSize + "px";
  }

  // 加载章节列表
  fetchNovelJson()
    .then((data) => {
      data.chapters.forEach((ch) => {
        const option = document.createElement("option");
        option.value = ch.id;
        option.textContent = ch.title;
        select.appendChild(option);
      });
      if (data.chapters.length > 0) {
        const lastId = localStorage.getItem(`lastChapter_${book}`);
        const defaultId = data.chapters.some((ch) => ch.id == lastId)
          ? lastId
          : data.chapters[0].id;
        loadChapter(defaultId);
        select.value = defaultId;
      }
    })
    .catch((err) => {
      contentDiv.innerHTML = "加载章节列表失败：" + err.message;
    });
});

// 章节切换
select.addEventListener("change", () => {
  const selectedId = select.value;
  loadChapter(selectedId);
  localStorage.setItem(`lastChapter_${book}`, selectedId);
});

// 日夜模式切换
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

// 字号调整
fontIncreaseBtn.addEventListener("click", () => {
  fontSize += 2;
  contentDiv.style.fontSize = fontSize + "px";
  localStorage.setItem("fontSize", fontSize);
});
fontDecreaseBtn.addEventListener("click", () => {
  if (fontSize > 10) {
    fontSize -= 2;
    contentDiv.style.fontSize = fontSize + "px";
    localStorage.setItem("fontSize", fontSize);
  }
});
