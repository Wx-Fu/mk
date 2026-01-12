// 初始化 markdown解析器
const md = window.markdownit({
  html: true,
  linkify: true,
  typographer: true
});

// --- 1. 文章数据配置 (这是你的CMS) ---
// 你每写一篇新 md 文件，就在这里加一条记录
const posts = [
  {
    id: "post-1", // 唯一ID
    title: "Understanding Diffusion Models: A Comprehensive Guide",
    date: "2026-01-12",
    tags: ["Diffusion", "Generative AI"],
    file: "posts/diffusion-note.md", // 对应的 md 文件路径
    excerpt: "My reading notes on the fundamental principles of DDPM and DDIM, explaining the forward and reverse processes..."
  },
  {
    id: "post-2", // 示例第二篇
    title: "Review: EMO-Avatar for Emotional Support",
    date: "2025-12-28",
    tags: ["Avatar", "Paper Review"],
    file: "posts/emo-avatar.md",
    excerpt: "An in-depth analysis of the EMO-Avatar framework presented at MM 2025, focusing on its LLM-orchestrated agent system."
  }
];

// 获取 DOM 元素
const listSection = document.getElementById("post-list");
const listContainer = document.getElementById("list-container");
const detailSection = document.getElementById("post-detail");
const markdownViewer = document.getElementById("markdown-viewer");
const backBtn = document.getElementById("backBtn");

// --- 2. 初始化：渲染列表 ---
function init() {
  renderList();
  
  // 处理浏览器的后退按钮
  window.onpopstate = (event) => {
    if (event.state && event.state.view === "detail") {
      loadPost(event.state.postId);
    } else {
      showList();
    }
  };

  // 检查 URL 是否带参数 (例如 index.html?post=post-1)
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('post');
  if (postId) {
    loadPost(postId);
  }
}

// 渲染文章卡片列表
function renderList() {
  listContainer.innerHTML = "";
  
  posts.forEach(post => {
    // 创建卡片 DOM
    const card = document.createElement("div");
    card.className = "note-card";
    
    // 生成标签 HTML
    const tagsHtml = post.tags.map(tag => `<span class="tag">#${tag}</span>`).join(" ");
    
    card.innerHTML = `
      <h3 class="note-title">${post.title}</h3>
      <div class="note-meta">
        <span>📅 ${post.date}</span>
        ${tagsHtml}
      </div>
      <p class="note-excerpt">${post.excerpt}</p>
    `;
    
    // 点击事件：跳转详情
    card.onclick = () => {
      // 修改 URL 但不刷新页面
      const newUrl = `${window.location.pathname}?post=${post.id}`;
      history.pushState({ view: "detail", postId: post.id }, "", newUrl);
      loadPost(post.id);
    };
    
    listContainer.appendChild(card);
  });
}

// --- 3. 详情页逻辑 ---

// 加载并显示文章
function loadPost(postId) {
  const post = posts.find(p => p.id === postId);
  if (!post) return; // 找不到文章

  // 切换视图
  listSection.classList.add("hidden");
  detailSection.classList.remove("hidden");
  window.scrollTo(0, 0); // 回到顶部

  markdownViewer.innerHTML = `<div class="loading">Loading content...</div>`;

  // Fetch md 文件
  fetch(post.file)
    .then(res => {
      if (!res.ok) throw new Error("Post not found");
      return res.text();
    })
    .then(text => {
      // 渲染 Markdown
      // 可以在这里拼接标题，让 md 文件里不用重复写标题
      const contentWithTitle = `# ${post.title}\n\n` + text;
      markdownViewer.innerHTML = md.render(contentWithTitle);
    })
    .catch(err => {
      markdownViewer.innerHTML = `<p class="error">Error loading post: ${err.message}</p>`;
    });
}

// 返回列表
function showList() {
  detailSection.classList.add("hidden");
  listSection.classList.remove("hidden");
  // 清除 URL 参数
  history.pushState({ view: "list" }, "", window.location.pathname);
}

// 绑定返回按钮
backBtn.onclick = showList;

// 启动
init();