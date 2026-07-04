const articlesData = [
    {
        id: "conventional-commits",
        title: "راهنمای استاندارد کامیت‌های گیت (Conventional Commits)",
        excerpt: "یاد بگیرید چگونه کامیت‌های خود را استاندارد کنید تا تیم‌ها و ابزارهای خودکار بتوانند آنها را بخوانند.",
        tag: "Git & Workflow",
        thumb: "images/thumbnails/git-commit-thumb.png",
        fullImage: "images/full/git-commit-full.png", 
        htmlFile: "assets/html/articles/conventional-commits.html"
    },

    {
        id: "java-spring-boot",
        title: "مفاهیم پایه‌ی Spring Boot و Dependency Injection",
        excerpt: "نگاهی عمیق به IoC Container و نحوه‌ی مدیریت Beanها در اسپرینگ بوت.",
        tag: "Java & Spring",
        thumb: "images/thumbnails/spring-thumb.png",
        fullImage: "images/full/spring-full.png",
        htmlFile: "assets/html/articles/java-spring-boot.html"
    }
];

const gridContainer = document.getElementById('grid-container');
const homeView = document.getElementById('home-view');
const articleView = document.getElementById('article-view');
const articleContent = document.getElementById('article-content');

function renderGrid() {
    gridContainer.innerHTML = '';
    
    articlesData.forEach(article => {
        const card = document.createElement('div');
        card.className = 'article-card';

        card.onclick = () => loadArticle(article.id);

        const imgSrc = article.thumb || 'https://via.placeholder.com/300x200/e2e8f0/666666?text=No+Image';

        card.innerHTML = `
            <img src="${imgSrc}" alt="${article.title}" class="card-img">
            <div class="card-content">
                <h3>${article.title}</h3>
                <p>${article.excerpt}</p>
                <span class="card-tag">${article.tag}</span>
            </div>
        `;
        gridContainer.appendChild(card);
    });
}

function loadArticle(id) {
    const article = articlesData.find(a => a.id === id);
    if (!article) return;

    homeView.style.display = 'none';
    articleView.style.display = 'block';

    fetch(article.htmlFile)
        .then(response => {
            if (!response.ok) throw new Error("فایل مقاله پیدا نشد");
            return response.text();
        })
        .then(htmlContent => {
            articleContent.innerHTML = `
                <div style="text-align: center; margin-bottom: 20px;">
                    <h2 style="font-size: 2rem; color: #111;">${article.title}</h2>
                    <p style="color: #666;">${article.tag}</p>
                </div>
                <img src="${article.fullImage}" alt="${article.title}" class="article-full-img">
                <div class="article-body">
                    ${htmlContent}
                </div>
            `;
        })
        .catch(error => {
            articleContent.innerHTML = `<div style="color: red; padding: 20px;">خطا در بارگذاری مقاله: ${error.message}</div>`;
        });
}

function goBack() {
    articleView.style.display = 'none';
    homeView.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

renderGrid();