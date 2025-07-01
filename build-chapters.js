const fs = require("fs");
const path = require("path");

const chaptersDir = path.join(__dirname, "chapters");
const outputFile = path.join(__dirname, "novel.json");

function getChapterTitle(filename) {
  // 这里简单取文件名作为章节标题，去掉扩展名
  return path.basename(filename, ".txt");
}

async function buildJson() {
  try {
    const files = await fs.promises.readdir(chaptersDir);
    // 筛选txt文件，按文件名排序（确保章节顺序）
    const txtFiles = files.filter((f) => f.endsWith(".txt")).sort();

    const chapters = [];

    for (let i = 0; i < txtFiles.length; i++) {
      const filename = txtFiles[i];
      const filepath = path.join(chaptersDir, filename);
      const content = await fs.promises.readFile(filepath, "utf-8");

      chapters.push({
        id: i + 1,
        title: getChapterTitle(filename),
        content: content, // ← 去掉 .trim()，保留原始格式
      });
    }

    const novelJson = { chapters };

    await fs.promises.writeFile(
      outputFile,
      JSON.stringify(novelJson, null, 2),
      "utf-8"
    );

    console.log("成功生成 novel.json");
  } catch (err) {
    console.error("发生错误:", err);
  }
}

buildJson();
