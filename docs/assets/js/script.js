const articlesData = {
    en: [
        {
            id: "conventional-commits",
            title: "Conventional Commits Standard",
            excerpt: "Learn how to standardize your git commits so teams and automation tools can read them.",
            tag: "Git & Workflow",
            thumb: "/images/thumbnails/git-commit-thumb.png",
            fullImage: "/images/full/git-commit-full.png", 
            htmlFile: "assets/html/articles/conventional-commits/conventional-commits-en.html"
        },

        // Add Another English Articles
    ],
    fa: [
        {
            id: "conventional-commits",
            title: "راهنمای استاندارد کامیت‌های گیت",
            excerpt: "یاد بگیرید چگونه کامیت‌های خود را استاندارد کنید تا تیم‌ها و ابزارهای خودکار بتوانند آنها را بخوانند.",
            tag: "Git & Workflow",
            thumb: "/images/thumbnails/git-commit-thumb.png",
            fullImage: "/images/full/git-commit-full.png", 
            htmlFile: "assets/html/articles/conventional-commits/conventional-commits-fa.html"
        },

        // Add Another Persian Articles
    ]
};

// Static Text For Two Language
const siteTexts = {
    en: {
        heroTitle: "📚 Knowledge Base",
        heroSub: "Tech notes, architecture, and coding patterns",
        navHome: "Home",
        navAbout: "About",
        navGames: "Games",
        backBtn: "Back to list",
        footerName: "You",
        langCode: "FA"
    },
    fa: {
        heroTitle: "📚 دانشنامه‌ی توسعه",
        heroSub: "یادداشت‌های فنی، معماری و الگوهای کدنویسی",
        navHome: "خانه",
        navAbout: "درباره ما",
        navGames: "بازی‌ها",
        backBtn: "بازگشت به لیست",
        footerName: "شما",
        langCode: "EN"
    }
};

let currentLang = 'en'; // Default Language
const gridContainer = document.getElementById('grid-container');
const homeView = document.getElementById('home-view');
const articleView = document.getElementById('article-view');
const articleContent = document.getElementById('article-content');

// Change Language Method
function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'fa' : 'en';
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'fa' ? 'rtl' : 'ltr';
    document.body.dir = currentLang === 'fa' ? 'rtl' : 'ltr';

    // Change Button Text
    document.getElementById('lang-toggle').innerText = siteTexts[currentLang].langCode;

    // CHange Header-Navbar Text
    document.getElementById('hero-title').innerText = siteTexts[currentLang].heroTitle;
    document.getElementById('hero-subtitle').innerText = siteTexts[currentLang].heroSub;
    document.getElementById('nav-home').innerText = siteTexts[currentLang].navHome;
    document.getElementById('nav-about').innerText = siteTexts[currentLang].navAbout;
    document.getElementById('nav-games').innerText = siteTexts[currentLang].navGames;
    document.getElementById('back-text').innerText = siteTexts[currentLang].backBtn;
    document.getElementById('footer-name').innerText = siteTexts[currentLang].footerName;

    // Re-Render By New-Language
    renderGrid();
}

// Grid Render
function renderGrid() {
    gridContainer.innerHTML = '';
    const data = articlesData[currentLang];

    data.forEach(article => {
        const card = document.createElement('div');
        card.className = 'article-card';
        card.onclick = () => loadArticle(article.id);

        const imgSrc = article.thumb || 'https://via.placeholder.com/300x200/2d2d2d/9e9e9e?text=No+Image';
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

// Loading Articles
function loadArticle(id) {

    // Find Article
    const article = articlesData[currentLang].find(a => a.id === id);
    if (!article) return;

    homeView.style.display = 'none';
    articleView.style.display = 'block';

    fetch(article.htmlFile)
        .then(response => {
            if (!response.ok) throw new Error("Article file not found");
            return response.text();
        })
        .then(htmlContent => {
            articleContent.innerHTML = `
                <div style="text-align: center; margin-bottom: 24px;">
                    <h2 style="font-size: 2rem; color: #ffffff;">${article.title}</h2>
                    <p style="color: #9e9e9e;">${article.tag}</p>
                </div>
                <img src="${article.fullImage}" alt="${article.title}" class="article-full-img">
                <div class="article-body">
                    ${htmlContent}
                </div>
            `;

            // Run Prism After First Render
            if (window.Prism) {
                Prism.highlightAll();
            }
        })
        .catch(error => {
            articleContent.innerHTML = `<div style="color: #ef4444; padding: 20px;">Error loading article: ${error.message}</div>`;
        });
}

// Home Button
function goHome() {
    articleView.style.display = 'none';
    homeView.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// First Render English
renderGrid();