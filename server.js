const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const chaptersDir = path.join(__dirname, "chapters");

app.use(express.static(__dirname)); // 让前端能访问 index.html 和 script.js

// 返回章节列表（文件名和标题）
app.get("/api/chapters", (req, res) => {
  fs.readdir(chaptersDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "读取章节目录失败" });
    }
    const chapters = files
      .filter((f) => f.endsWith(".txt"))
      .map((f) => ({
        file: f,
        title: f.replace(".txt", ""),
      }));
    res.json(chapters);
  });
});

// 返回指定章节内容
app.get("/chapters/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(chaptersDir, filename);
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) return res.status(404).send("文件不存在");
    res.send(data);
  });
});

app.listen(3000, () => {
  console.log("服务器启动，监听端口3000");
});
