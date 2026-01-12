// 初始化 markdown-it，开启 HTML 标签支持和链接自动转换
const md = window.markdownit({
  html: true,
  linkify: true,
  typographer: true
});

// DOM 元素获取
const viewMode = document.getElementById("view-mode");
const editMode = document.getElementById("edit-mode");
const content = document.getElementById("content");

// 按钮
const editBtn = document.getElementById("editBtn");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const downloadBtn = document.getElementById("downloadBtn");

// 编辑器元素
const input = document.getElementById("markdown-input");
const preview = document.getElementById("preview");

// 全局变量存储当前 Markdown
let currentMarkdown = "";

// 1. 初始化：加载示例 Markdown
// 注意：如果你直接双击打开 html 文件，fetch 可能会被浏览器拦截（CORS 错误）。
// 建议使用 VS Code 的 "Live Server" 插件或 Python 开启本地服务器。
function init() {
  const defaultText = "# 欢迎使用 Markdown 编辑器\n\n如果无法加载外部文件，这是默认显示的内容。\n\n## 功能列表\n- 左侧编辑\n- 右侧实时预览";
  
  fetch("posts/2026-01-12-demo.md")
    .then(res => {
      if (!res.ok) throw new Error("File not found");
      return res.text();
    })
    .then(text => {
      currentMarkdown = text;
      renderView();
    })
    .catch(err => {
      console.warn("加载失败，使用默认文本", err);
      currentMarkdown = defaultText;
      renderView();
    });
}

// 渲染阅读视图
function renderView() {
  content.innerHTML = md.render(currentMarkdown);
}

// 2. 切换到编辑模式
editBtn.onclick = () => {
  viewMode.classList.add("hidden");
  editMode.classList.remove("hidden");
  editBtn.style.display = 'none'; // 编辑时隐藏顶部编辑按钮

  input.value = currentMarkdown;
  updatePreview();
};

// 3. 实时预览逻辑
input.oninput = updatePreview;

function updatePreview() {
  const text = input.value;
  preview.innerHTML = md.render(text);
}

// 4. 保存（更新内存并返回阅读模式）
saveBtn.onclick = () => {
  currentMarkdown = input.value;
  renderView();
  exitEditMode();
};

// 5. 取消（放弃修改）
cancelBtn.onclick = exitEditMode;

function exitEditMode() {
  editMode.classList.add("hidden");
  viewMode.classList.remove("hidden");
  editBtn.style.display = 'block';
}

// 6. 新增功能：下载 .md 文件
// 因为这是静态页面，不能直接写入服务器，所以提供下载，让你手动覆盖文件
downloadBtn.onclick = () => {
  const text = input.value;
  const blob = new Blob([text], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  // 生成文件名，例如：post-时间戳.md
  a.download = `post-${new Date().toISOString().slice(0,10)}.md`;
  document.body.appendChild(a);
  a.click();
  
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// 启动
init();