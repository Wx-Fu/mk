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

// 1. 初始化
function init() {
  // --- 重要：优化后的学术列表 Markdown 模版 ---
  // 使用标准的 Markdown 语法来模拟学术引用格式
  const defaultContent = `
## Publications

**EMO-Avatar: An LLM-Agent-Orchestrated Framework for Multimodal Emotional Support in Human Animation**
*Keqi Chen, **Wenxin Fu**, Qihang Lu, Zekai Sun, Yizhong Geng, Yi Liu, Puyuan Guo, Yingming Gao, Ya Li*
MM 2025
[PDF] [Code] [Project Page]

**Another Awesome Paper Title for CVPR**
***Wenxin Fu***, *Co-author Name, Another Author*
CVPR 2024 (In submission)
To address the empathy gap in chatbots, we propose a novel framework...

## Recent Posts

- **2026-01-12**: [Setup my new academic homepage based on Markdown](https://github.com)
- **2025-12-20**: Year-end summary and future research plans.
`;

  // 尝试加载外部文件，失败则使用模版
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
      console.log("Loading template content (no external file found).");
      currentMarkdown = defaultContent;
      render();
    });
}

// 2. 渲染函数
function render() {
  content.innerHTML = md.render(currentMarkdown);
  // 编辑器里的内容也要同步
  input.value = currentMarkdown;
  preview.innerHTML = md.render(currentMarkdown);
}

// 3. 交互逻辑
editBtn.onclick = () => {
  viewMode.classList.add("hidden");
  editMode.classList.remove("hidden");
  editBtn.style.display = "none"; // 隐藏 Header 上的编辑按钮
  render();
};

input.oninput = () => {
  preview.innerHTML = md.render(input.value);
};

saveBtn.onclick = () => {
  currentMarkdown = input.value;
  content.innerHTML = md.render(currentMarkdown);
  exitEditMode();
};

cancelBtn.onclick = () => {
  // 恢复为修改前的内容
  input.value = currentMarkdown;
  exitEditMode();
};

function exitEditMode() {
  editMode.classList.add("hidden");
  viewMode.classList.remove("hidden");
  editBtn.style.display = "inline-flex";
}

downloadBtn.onclick = () => {
  const text = input.value;
  const blob = new Blob([text], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  // 使用当前日期作为文件名
  const date = new Date().toISOString().slice(0, 10);
  a.download = `content-${date}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// 启动
init();