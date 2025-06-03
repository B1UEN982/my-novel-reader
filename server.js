const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const chaptersDir = path.join(__dirname, "chapters");

app.use(express.static(__dirname)); // 让前端能访问 index.html 和 script.js

app.get("/api/chapters", (req, res) => {
  const novelPath = path.join(__dirname, "novel.json");
  fs.readFile(novelPath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "读取小说数据失败" });
    }
    const novel = JSON.parse(data);
    res.json(novel.chapters);
  });
});

app.get("/api/chapter/:id", (req, res) => {
  const id = req.params.id;
  const novelPath = path.join(__dirname, "novel.json");
  fs.readFile(novelPath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "读取小说数据失败" });
    }
    const novel = JSON.parse(data);
    const chapter = novel.chapters.find((c) => c.id === id);
    if (!chapter) {
      return res.status(404).json({ error: "章节未找到" });
    }
    res.json(chapter);
  });
});

app.listen(3000, () => {
  console.log("服务器启动，监听端口3000");
});
