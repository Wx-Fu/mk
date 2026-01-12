const md = window.markdownit();

const viewMode = document.getElementById("view-mode");
const editMode = document.getElementById("edit-mode");
const editBtn = document.getElementById("editBtn");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");

const content = document.getElementById("content");
const input = document.getElementById("markdown-input");
const preview = document.getElementById("preview");

let currentMarkdown = "";

// 加载示例 Markdown
fetch("posts/2026-01-12-demo.md")
  .then(res => res.text())
  .then(text => {
    currentMarkdown = text;
    content.innerHTML = md.render(text);
  });

// 切换到编辑模式
editBtn.onclick = () => {
  viewMode.classList.add("hidden");
  editMode.classList.remove("hidden");

  input.value = currentMarkdown;
  preview.innerHTML = md.render(currentMarkdown);
};

// 实时预览
input.oninput = () => {
  preview.innerHTML = md.render(input.value);
};

// 保存（本 Demo 仅保存到内存）
saveBtn.onclick = () => {
  currentMarkdown = input.value;
  content.innerHTML = md.render(currentMarkdown);

  editMode.classList.add("hidden");
  viewMode.classList.remove("hidden");
};

// 取消
cancelBtn.onclick = () => {
  editMode.classList.add("hidden");
  viewMode.classList.remove("hidden");
};
