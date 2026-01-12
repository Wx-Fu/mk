// 初始化 markdown 解析器
const md = window.markdownit({
  html: true,
  linkify: true,
  typographer: true
});

// --- 文章数据配置 ---
const posts = [
  {
    id: "demo-1",
    title: "demo",
    date: "2026-01-12",
    tags: ["Diffusion", "Generative AI"],
    file: "posts/diffusion-note.md",
    excerpt: "understanding"
  },
  {
    id: "demo-2",
    title: "demo2",
    date: "2025-12-28",
    tags: ["Avatar", "Multimodal"],
    file: "posts/emo-avatar.md",
    excerpt: "Notes on something."
  }
];

// 获取 DOM 元素
const listSection = document.getElementById("post-list");
const listContainer = document.getElementById("list-container");
const detailSection = document.getElementById("post-detail");
const markdownViewer = document.getElementById("markdown-viewer");
const backBtn = document.getElementById("backBtn");

// --- 初始化 ---
function init() {
  renderList();

  // 处理浏览器后退
  window.onpopstate = (event) => {
    if (event.state && event.state.view === "detail") {
      loadPost(event.state.postId);
    } else {
      showList();
    }
  };

  // 处理 URL 参数直接访问
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('post');
  if (postId) {
    loadPost(postId);
  }
}

// 渲染列表
function renderList() {
  listContainer.innerHTML = "";
  
  posts.forEach(post => {
    const card = document.createElement("div");
    card.className = "note-card";
    
    // 生成 Tags
    const tagsHtml = post.tags.map(t => `<span class="tag">${t}</span>`).join("");

    card.innerHTML = `
      <h3 class="note-title">${post.title}</h3>
      <div class="note-meta">
        <span>${post.date}</span>
        <span style="margin:0 6px">·</span>
        ${tagsHtml}
      </div>
      <p class="note-excerpt">${post.excerpt}</p>
    `;
    
    card.onclick = () => {
      const newUrl = `${window.location.pathname}?post=${post.id}`;
      history.pushState({ view: "detail", postId: post.id }, "", newUrl);
      loadPost(post.id);
    };
    
    listContainer.appendChild(card);
  });
}

// 加载文章详情
function loadPost(postId) {
  const post = posts.find(p => p.id === postId);
  if (!post) return; 

  listSection.classList.add("hidden");
  detailSection.classList.remove("hidden");
  window.scrollTo(0, 0);

  markdownViewer.innerHTML = `<div style="padding:40px; text-align:center; color:#666;">Loading...</div>`;

  fetch(post.file)
    .then(res => {
      if (!res.ok) throw new Error("Post not found");
      return res.text();
    })
    .then(text => {
      // 可以在这里拼接标题
      const html = md.render(`# ${post.title}\n\n` + text);
      markdownViewer.innerHTML = html;
    })
    .catch(err => {
      markdownViewer.innerHTML = `<p>Error loading content: ${err.message}</p>`;
    });
}

// 返回列表
function showList() {
  detailSection.classList.add("hidden");
  listSection.classList.remove("hidden");
  // 清除 URL
  history.pushState({ view: "list" }, "", window.location.pathname);
}

backBtn.onclick = showList;

init();