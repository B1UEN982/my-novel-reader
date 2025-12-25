const fs = require("fs");
const path = require("path");

const booksDir = path.join(__dirname, "books");

function getChapterTitle(filename) {
  // 去掉扩展名作为章节标题 key test
  return path.basename(filename, ".txt");
}

async function buildJsonForBook(bookPath) {
  try {
    const chaptersDir = path.join(bookPath, "chapters");
    const outputFile = path.join(bookPath, "novel.json");

    // 检查是否有 chapters 目录
    const exists = await fs.promises.stat(chaptersDir).catch(() => null);
    if (!exists) {
      console.warn(`跳过：${bookPath}（没有 chapters 文件夹）`);
      return;
    }

    const files = await fs.promises.readdir(chaptersDir);
    const txtFiles = files.filter((f) => f.endsWith(".txt")).sort();

    const chapters = [];

    for (let i = 0; i < txtFiles.length; i++) {
      const filename = txtFiles[i];
      const filepath = path.join(chaptersDir, filename);
      const content = await fs.promises.readFile(filepath, "utf-8");

      chapters.push({
        id: i + 1,
        title: getChapterTitle(filename),
        content: content, // 保留原始格式
      });
    }

    const novelJson = { chapters };

    await fs.promises.writeFile(
      outputFile,
      JSON.stringify(novelJson, null, 2),
      "utf-8"
    );

    console.log(`成功生成: ${outputFile}`);
  } catch (err) {
    console.error(`处理 ${bookPath} 时发生错误:`, err);
  }
}

async function buildAll() {
  try {
    const books = await fs.promises.readdir(booksDir);

    for (const book of books) {
      const bookPath = path.join(booksDir, book);
      const stat = await fs.promises.stat(bookPath);
      if (stat.isDirectory()) {
        await buildJsonForBook(bookPath);
      }
    }

    console.log("全部小说处理完成。");
  } catch (err) {
    console.error("发生错误:", err);
  }
}

buildAll();
