let currentLang = 'en';
let articlesData = {};
let siteTexts = {};

const gridContainer = document.getElementById('grid-container');
const homeView = document.getElementById('home-view');
const articleView = document.getElementById('article-view');
const articleContent = document.getElementById('article-content');

// Load data from routes.json
async function loadData() {
    try {
        const response = await fetch('routes.json');
        if (!response.ok) throw new Error('Failed to load routes.json');
        const data = await response.json();
        articlesData = data.articles;
        siteTexts = data.siteTexts;
        
        // Apply initial language
        applyLanguage();
        renderGrid();
    } catch (error) {
        console.error('Error loading data:', error);
        gridContainer.innerHTML = `
            <div style="color: #ef4444; padding: 40px; text-align: center; grid-column: 1/-1;">
                ❌ Error loading articles data. Please check routes.json file.
                <br><small>${error.message}</small>
            </div>
        `;
    }
}

// Apply language settings
function applyLanguage() {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'fa' ? 'rtl' : 'ltr';
    document.body.dir = currentLang === 'fa' ? 'rtl' : 'ltr';

    const texts = siteTexts[currentLang];
    if (!texts) return;

    document.getElementById('lang-toggle').innerText = texts.langCode;
    document.getElementById('hero-title').innerText = texts.heroTitle;
    document.getElementById('hero-subtitle').innerText = texts.heroSub;
    document.getElementById('nav-home').innerText = texts.navHome;
    document.getElementById('nav-about').innerText = texts.navAbout;
    document.getElementById('nav-games').innerText = texts.navGames;
    document.getElementById('back-text').innerText = texts.backBtn;
    document.getElementById('footer-name').innerText = texts.footerName;
}

// Toggle Language
function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'fa' : 'en';
    applyLanguage();
    renderGrid();
}

// Render Grid
function renderGrid() {
    gridContainer.innerHTML = '';
    const data = articlesData[currentLang];
    
    if (!data || data.length === 0) {
        gridContainer.innerHTML = `
            <div style="color: #9e9e9e; padding: 40px; text-align: center; grid-column: 1/-1;">
                📝 No articles available in this language yet.
            </div>
        `;
        return;
    }

    data.forEach(article => {
        const card = document.createElement('div');
        card.className = 'article-card';
        card.onclick = () => loadArticle(article.id);

        const imgSrc = article.thumb || 'https://via.placeholder.com/300x200/2d2d2d/9e9e9e?text=No+Image';
        // let imgSrc = article.thumb;
        
        // if (imgSrc && imgSrc.startsWith('images/')) {
        //     imgSrc = 'assets/' + imgSrc;
        // }

        // if (!imgSrc) {
        //     imgSrc = 'https://via.placeholder.com/300x200/2d2d2d/9e9e9e?text=No+Image';
        // }

        card.innerHTML = `
            <img src="${imgSrc}" alt="${article.title}" class="card-img" loading="lazy">
            <div class="card-content">
                <h3>${article.title}</h3>
                <p>${article.excerpt}</p>
                <span class="card-tag">${article.tag}</span>
            </div>
        `;
        gridContainer.appendChild(card);
    });
}

// Load Article
async function loadArticle(id) {
    const article = articlesData[currentLang]?.find(a => a.id === id);
    if (!article) {
        articleContent.innerHTML = `<div style="color: #ef4444; padding: 20px;">❌ Article not found</div>`;
        return;
    }

    homeView.style.display = 'none';
    articleView.style.display = 'block';

    try {
        const response = await fetch(article.htmlFile);
        if (!response.ok) throw new Error("Article file not found");
        const htmlContent = await response.text();

        articleContent.innerHTML = `
            <div style="text-align: center; margin-bottom: 24px;">
                <h2 style="font-size: 2rem; color: #ffffff;">${article.title}</h2>
                <p style="color: #9e9e9e;">${article.tag}</p>
            </div>
            <img src="${article.fullImage}" alt="${article.title}" class="article-full-img" loading="lazy">
            <div class="article-body">
                ${htmlContent}
            </div>
        `;

        // Re-run Prism for syntax highlighting
        if (window.Prism) {
            Prism.highlightAll();
        }
    } catch (error) {
        articleContent.innerHTML = `
            <div style="color: #ef4444; padding: 20px;">
                ❌ Error loading article: ${error.message}
            </div>
        `;
    }
}

// Go Home
function goHome() {
    articleView.style.display = 'none';
    homeView.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Initialize - Load data first
loadData();