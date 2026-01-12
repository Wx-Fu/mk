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

function init() {
  // 设置一个默认的欢迎文本，当 fetch 失败时显示
  const defaultText = `# 欢迎来到我的 Markdown 空间

这里是默认显示的内容。如果你看到了这个，说明外部的 MD 文件没有加载成功。

> **提示**：请确保你使用了本地服务器（如 VS Code Live Server）来运行此页面，否则浏览器可能会拦截文件读取。

## 功能演示
- **左侧写作，右侧预览**
- 支持标准的 Markdown 语法
- 支持代码高亮

\`\`\`javascript
console.log("Hello World");
\`\`\`

## 关于图片
请将图片放在项目文件夹中，例如 \`assets/images/\`，然后使用相对路径引入：

\`![示例图片](assets/images/sample.jpg)\`
`;
  
  // 尝试加载演示文件
  fetch("posts/2026-01-12-demo.md")
    .then(res => {
      // 如果找不到文件 (404)，抛出错误进入 catch
      if (!res.ok) throw new Error("File not found: " + res.statusText);
      return res.text();
    })
    .then(text => {
      // 成功加载
      currentMarkdown = text;
      renderView();
    })
    .catch(err => {
      // 加载失败，使用默认文本
      console.warn("无法加载外部 Markdown 文件，使用默认内容。", err);
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