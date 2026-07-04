let currentLang = 'en';
let articlesData = {};
let siteTexts = {};
let currentArticleId = null;
let searchQuery = '';

const gridContainer = document.getElementById('grid-container');
const homeView = document.getElementById('home-view');
const articleView = document.getElementById('article-view');
const articleContent = document.getElementById('article-content');
const searchInput = document.getElementById('search-input');
const searchClear = document.getElementById('search-clear');

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
    
    // Update search placeholder
    if (searchInput) {
        searchInput.placeholder = texts.searchPlaceholder || 'Search by tags...';
    }
}

// Toggle Language
function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'fa' : 'en';
    applyLanguage();

    // If Current Article, Loading This...
    if (currentArticleId && articleView.style.display !== 'none') {
        loadArticle(currentArticleId);
    } else {
        // If searching Is Enable, Search Again.
        // Clear search and render grid with new language
        if (searchInput) {
            searchInput.value = '';
            searchQuery = '';
            if (searchClear) {
                searchClear.style.display = 'none';
            }
        }
        renderGrid();
    }
}

// Search Articles
function searchArticles() {
    searchQuery = searchInput.value.trim().toLowerCase();
    
    // Show/hide clear button
    if (searchClear) {
        searchClear.style.display = searchQuery ? 'block' : 'none';
    }
    
    const data = articlesData[currentLang];
    if (!data) return;

    // If Search Is Empty, Show All
    if (!searchQuery) {
        renderGrid();
        return;
    }

    // Filter Arcticles By Tags
    const filteredData = data.filter(article => {
        if (!article.tags || !Array.isArray(article.tags)) return false;
        return article.tags.some(tag => tag.toLowerCase().includes(searchQuery));
    });
    
    renderGrid(filteredData);
}

// Clear Search
function clearSearch() {
    searchInput.value = '';
    searchQuery = '';
    if (searchClear) {
        searchClear.style.display = 'none';
    }
    renderGrid();
    searchInput.focus();
}

// Render Grid
function renderGrid(filteredData) {
    gridContainer.innerHTML = '';
    const data = filteredData || articlesData[currentLang];
    
    if (!data || data.length === 0) {
        const noResultsText = siteTexts[currentLang]?.noResults || 'No articles found matching your search';
        gridContainer.innerHTML = `
            <div style="color: #9e9e9e; padding: 40px; text-align: center; grid-column: 1/-1;">
                📝 ${noResultsText}
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
        
        // Create Tags
        let tagsHtml = '';
        if (article.tags && Array.isArray(article.tags)) {
            tagsHtml = '<div class="card-tags">' + 
                article.tags.map(tag => `<span class="card-tag">#${tag}</span>`).join('') + 
                '</div>';
        }

        card.innerHTML = `
            <img src="${imgSrc}" alt="${article.title}" class="card-img" loading="lazy">
            <div class="card-content">
                <h3>${article.title}</h3>
                <p>${article.excerpt}</p>
                ${tagsHtml}
            </div>
        `;
        gridContainer.appendChild(card);
    });
}

// Load Article
async function loadArticle(id) {
    currentArticleId = id;
    
    const article = articlesData[currentLang]?.find(a => a.id === id);
    if (!article) {
        articleContent.innerHTML = `<div style="color: #ef4444; padding: 20px;">❌ Article not found</div>`;
        return;
    }

    // Hide search bar in article view
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer) {
        searchContainer.style.display = 'none';
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
                <p style="color: #9e9e9e;">${article.tags ? article.tags.join(' • ') : ''}</p>
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
    currentArticleId = null;
    articleView.style.display = 'none';
    homeView.style.display = 'block';
    
    // Show search bar again
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer) {
        searchContainer.style.display = 'block';
    }
    
    // Clear search and render grid
    if (searchInput) {
        searchInput.value = '';
        searchQuery = '';
        if (searchClear) {
            searchClear.style.display = 'none';
        }
    }
    
    renderGrid();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Initialize - Load data first
loadData();