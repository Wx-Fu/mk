// 初始化 markdown-it
const md = window.markdownit({
  html: true,
  linkify: true,
  typographer: true
});

// 获取元素
const viewMode = document.getElementById("view-mode");
const editMode = document.getElementById("edit-mode");
const content = document.getElementById("content");
const input = document.getElementById("markdown-input");
const preview = document.getElementById("preview");

// 按钮
const editBtn = document.getElementById("editBtn");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const downloadBtn = document.getElementById("downloadBtn");

let currentMarkdown = "";

// --- 核心逻辑 ---

// 1. 初始化
function init() {
  // 定义一个默认的模版，当找不到文件时显示这个
  // 这模仿了学术主页的 Publications 列表风格
  const defaultContent = `
### Publications

**EMO-Avatar: An LLM-Agent-Orchestrated Framework for Multimodal Emotional Support** *Keqi Chen, **Wenxin Fu**, Qihang Lu, et al.* MM 2025  
[PDF] [Code] [Project Page]

---

**Another Awesome Paper Title** *Wenxin Fu, Co-author Name* CVPR 2024 (In submission)  
To address the empathy gap in chatbots, we propose...

### Recent Posts

- [2026-01-12] My first update on this static blog
- [2025-12-20] Year end summary
`;

  // 尝试去 fetch 你的文件 (假设你要展示 demo.md)
  // 如果你的 posts 文件夹是空的，这里会失败，然后自动加载上面的 defaultContent
  fetch("posts/2026-01-12-demo.md")
    .then(res => {
      if (!res.ok) throw new Error("File not found");
      return res.text();
    })
    .then(text => {
      currentMarkdown = text;
      render();
    })
    .catch(err => {
      console.log("No external post found, loading default template.");
      currentMarkdown = defaultContent;
      render();
    });
}

// 2. 渲染函数
function render() {
  content.innerHTML = md.render(currentMarkdown);
  input.value = currentMarkdown;
  preview.innerHTML = md.render(currentMarkdown);
}

// 3. 交互逻辑

// 进入编辑模式
editBtn.onclick = () => {
  viewMode.classList.add("hidden");
  editMode.classList.remove("hidden");
  editBtn.style.display = "none"; // 隐藏顶部的编辑按钮
  render(); // 刷新一下预览
};

// 实时预览
input.oninput = () => {
  preview.innerHTML = md.render(input.value);
};

// 保存（这里是模拟保存，实际上是退回预览模式）
saveBtn.onclick = () => {
  currentMarkdown = input.value;
  content.innerHTML = md.render(currentMarkdown);
  
  // 切换回阅读模式
  editMode.classList.add("hidden");
  viewMode.classList.remove("hidden");
  editBtn.style.display = "inline-flex";
};

// 取消编辑
cancelBtn.onclick = () => {
  editMode.classList.add("hidden");
  viewMode.classList.remove("hidden");
  editBtn.style.display = "inline-flex";
  // 恢复之前的内容
  input.value = currentMarkdown;
};

// 下载功能
downloadBtn.onclick = () => {
  const text = input.value;
  const blob = new Blob([text], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "content.md";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// 启动应用
init();