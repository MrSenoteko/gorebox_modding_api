document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const grid = document.getElementById('background-grid');
    const mainContent = document.querySelector('main');
    
    // --- Логика для плавной анимации сетки ---
    let mouseX = 0, mouseY = 0, gridX = 0, gridY = 0;
    document.body.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
    const animate = () => {
        const smoothing = 0.08;
        const targetGridX = (mouseX / window.innerWidth - 0.5) * -50;
        const targetGridY = (mouseY / window.innerHeight - 0.5) * -50;
        gridX += (targetGridX - gridX) * smoothing;
        gridY += (targetGridY - gridY) * smoothing;
        grid.style.transform = `translate(${gridX}px, ${gridY}px)`;
        requestAnimationFrame(animate);
    };
    animate();

    // --- Логика для плавающей шапки ---
    window.addEventListener('scroll', () => body.classList.toggle('header-scrolled', window.scrollY > 30));

    // --- Логика переключения тем ---
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-toggle-icon');
    const moonIcon = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>`;
    const sunIcon = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>`;
    const setTheme = (isLight) => {
        body.classList.toggle('light-theme', isLight);
        themeIcon.innerHTML = isLight ? sunIcon : moonIcon;
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    };
    themeToggle.addEventListener('click', () => setTheme(!body.classList.contains('light-theme')));
    setTheme(localStorage.getItem('theme') === 'light');

    // --- СИСТЕМА ПЕРЕКЛЮЧЕНИЯ ЯЗЫКА ---
    const translations = {
        ru: {
            nav_documentation: "Документация", nav_blog: "Блог", search_placeholder: "Поиск...",
            blog_title: "Блог и Новости", view_all: "Смотреть все →",
            toc_title: "Содержание",
            footer_copyright: `© ${new Date().getFullYear()} GoreBox Modding Api. Все права защищены.`
        },
        en: {
            nav_documentation: "Documentation", nav_blog: "Blog", search_placeholder: "Search...",
            blog_title: "Blog & News", view_all: "View All →",
            toc_title: "On this page",
            footer_copyright: `© ${new Date().getFullYear()} GoreBox Modding Api. All rights reserved.`
        }
    };
    let currentLang = localStorage.getItem('lang') || 'ru';
    const langToggle = document.getElementById('lang-toggle');
    const setLanguage = (lang) => {
        currentLang = lang;
        localStorage.setItem('lang', lang);
        document.documentElement.lang = lang;
        langToggle.textContent = lang === 'ru' ? 'EN' : 'RU';
        document.querySelectorAll('[data-lang-key]').forEach(el => {
            const key = el.dataset.langKey;
            if (translations[lang][key]) el.innerHTML = translations[lang][key];
        });
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.placeholder = translations[lang].search_placeholder;
        
        generateDocumentation();
        generateDocsSidebar();
        generateBlogPages();
        const postPage = document.getElementById('post-page');
        if (!postPage.classList.contains('hidden') && postPage.dataset.currentPostId) {
            showPost(postPage.dataset.currentPostId);
        }
    };
    langToggle.addEventListener('click', () => setLanguage(currentLang === 'ru' ? 'en' : 'ru'));

    // --- Навигация по сайту ---
    const pages = document.querySelectorAll('.page-section');
    const navLinks = document.querySelectorAll('.nav-link');
    let currentPage = 'home-page';
    const showPage = (pageId) => {
        const docsSidebar = document.getElementById('docs-sidebar');
        const postTocSidebar = document.getElementById('post-toc-sidebar');
        
        const currentPageEl = document.getElementById(currentPage);
        if (currentPageEl) currentPageEl.classList.add('hidden');
        
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.remove('hidden');
             setTimeout(() => {
                animateElementsOnLoad(`#${pageId} .doc-item, #${pageId} .glass-card`);
            }, 50);
        }
        
        currentPage = pageId;
        
        docsSidebar.classList.toggle('lg:block', pageId === 'home-page');
        docsSidebar.classList.toggle('hidden', pageId !== 'home-page');
        
        postTocSidebar.classList.toggle('lg:block', pageId === 'post-page');
        postTocSidebar.classList.toggle('hidden', pageId !== 'post-page');

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    navLinks.forEach(link => link.addEventListener('click', (e) => { e.preventDefault(); showPage(link.dataset.target); }));
    
    // --- ДАННЫЕ ДОКУМЕНТАЦИИ ---
    const docData = [
        { 
            category: { ru: "Глобальные функции Lua", en: "Global Lua Functions" }, 
            icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h1a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.884 5.066A9 9 0 1016.116 5.066M12 3v1m0 16v1" /></svg>`, 
            functions: [ 
                { name: "log(text)", description: { ru: "Выводит текст в консоль Unity с префиксом [Lua].", en: "Prints text to the Unity console with a [Lua] prefix." }, example: `log("Player position updated")` }, 
                { name: "getDeltaTime()", description: { ru: "Возвращает значение Time.deltaTime.", en: "Returns the value of Time.deltaTime." }, example: `local dt = getDeltaTime()\nplayer.x = player.x + speed * dt` }, 
            ] 
        }, 
        { 
            category: {ru: "Функции Lua GUI", en: "Lua GUI Functions"}, 
            icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>`, 
            functions: [ 
                { name: "gui.label(text)", description: {ru: "Отображает текстовую метку.", en: "Displays a text label."}, example: `M.gui_update = function()\n    gui.label("Player Health: 100")\nend` }, 
                { name: "gui.button(text)", description: {ru: "Отображает кнопку; возвращает true при нажатии.", en: "Displays a button; returns true if clicked."}, example: `M.gui_update = function()\n    if gui.button("Quit Game") then\n        log("Quit button pressed")\n    end\nend` },
                { name: "gui.hSlider(value, left, right)", description: {ru: "Горизонтальный слайдер; возвращает текущее значение.", en: "A horizontal slider; returns the current value."}, example: `local volume = 0.5\nM.gui_update = function()\n    volume = gui.hSlider(volume, 0.0, 1.0)\nend` },
                { name: "gui.toggle(value, text)", description: {ru: "Отображает переключатель; возвращает его текущий булев статус.", en: "Displays a toggle switch; returns its current boolean status."}, example: `local musicEnabled = true\nM.gui_update = function()\n    musicEnabled = gui.toggle(musicEnabled, "Music On/Off")\nend` },
            ] 
        },
        { 
            category: {ru: "Функции Lua Unity", en: "Lua Unity Functions"}, 
            icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>`, 
            functions: [
                { name: "Unity.GameObject.Create(name, path, ...)", description: {ru: "Создает новый объект через PhotonNetwork.", en: "Creates a new object via PhotonNetwork."}, example: `local newCube = Unity.GameObject.Create("MyCube", "Primitives/Cube", 0, 1, 0, 1, 1, 1, 0, 0, 0)` },
                { name: "Unity.GameObject.Find(name)", description: {ru: "Находит объект по имени; возвращает таблицу объекта.", en: "Finds an object by name; returns an object table."}, example: `local player = Unity.GameObject.Find("MainPlayer")` },
                { name: "Unity.GameObject.AddComponent(id, typeName)", description: {ru: "Добавляет компонент к объекту по его ID.", en: "Adds a component to an object by its ID."}, example: `local player = Unity.GameObject.Find("MainPlayer")\nUnity.GameObject.AddComponent(player.id, "Rigidbody")` },
            ] 
        },
        { 
            category: {ru: "Методы GameObject & Transform", en: "GameObject & Transform Methods"}, 
            icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 7l-8.228 8.228-3.536-3.536L1 21M15 1l6 6" /></svg>`, 
            functions: [
                { name: "object:GetName()", description: {ru: "Возвращает имя объекта.", en: "Returns the name of the object."}, example: `local player = Unity.GameObject.Find("MainPlayer")\nlog(player:GetName())` },
                { name: "object:SetActive(bool)", description: {ru: "Активирует или деактивирует объект.", en: "Activates or deactivates the object."}, example: `local enemy = Unity.GameObject.Find("Enemy1")\nenemy:SetActive(false)` },
                { name: "transform:GetPosition()", description: {ru: "Возвращает глобальную позицию (x, y, z).", en: "Returns the global position (x, y, z)."}, example: `local pos = transform:GetPosition()\nlog("x=" .. pos.x .. ", y=" .. pos.y)` },
                { name: "transform:SetPosition(x, y, z)", description: {ru: "Устанавливает глобальную позицию.", en: "Sets the global position."}, example: `transform:SetPosition(10, 5, 20)` },
                { name: "transform:Translate(x, y, z)", description: {ru: "Перемещает объект на указанный вектор.", en: "Moves the object by the specified vector."}, example: `transform:Translate(0, 0, 5 * getDeltaTime()) -- Move forward` },
                { name: "transform:Rotate(x, y, z)", description: {ru: "Вращает объект на указанные углы.", en: "Rotates the object by the specified angles."}, example: `transform:Rotate(0, 45 * getDeltaTime(), 0) -- Rotate around Y axis` },
            ] 
        },
        { 
            category: {ru: "Жизненный цикл модуля Lua", en: "Lua Module Lifecycle"}, 
            icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5" /></svg>`, 
            functions: [
                { name: "awake()", description: {ru: "Вызывается во время фазы Awake() в Unity.", en: "Called during Unity's Awake() phase."}, example: `M = {}\nfunction M.awake()\n    log("Module is awake!")\nend` },
                { name: "start()", description: {ru: "Вызывается во время фазы Start() в Unity.", en: "Called during Unity's Start() phase."}, example: `M = {}\nfunction M.start()\n    log("Module has started!")\nend` },
                { name: "update()", description: {ru: "Вызывается каждый кадр в Update().", en: "Called every frame in Update()."}, example: `M = {}\nfunction M.update()\n    -- Game logic here\nend` },
                { name: "fixed_update()", description: {ru: "Вызывается в FixedUpdate().", en: "Called in FixedUpdate()."}, example: `M = {}\nfunction M.fixed_update()\n    -- Physics logic here\nend` },
            ] 
        }
    ];

    // --- ЛОГИКА АНИМАЦИЙ ---
    const animateElementsOnLoad = (selector) => {
        document.querySelectorAll(selector).forEach((el, index) => {
            el.classList.add('will-animate');
            setTimeout(() => {
                el.classList.add('is-animated');
            }, index * 80);
        });
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    const observeElements = (selector) => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('will-animate');
            observer.observe(el);
        });
    };
    
    const handleScrollAndHighlight = (targetId) => {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            showPage('home-page');
            setTimeout(() => {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                targetElement.classList.add('highlight-item');
                setTimeout(() => {
                    targetElement.classList.remove('highlight-item');
                }, 1500);
            }, 100);
        }
    };
    
    const generateDocumentation = () => {
        const docContainer = document.getElementById('documentation');
        if (!docContainer) return;
        docContainer.innerHTML = docData.map(category => {
            const categoryName = category.category[currentLang] || category.category['en'];
            const functionsHtml = category.functions.map(func => {
                const funcDescription = func.description[currentLang] || func.description['en'];
                const funcId = `func-${func.name.replace(/[^a-zA-Z0-9_]/g, '-')}`;
                return `<div id="${funcId}" class="glass-card p-6 doc-item">
                    <h3 class="text-lg font-semibold text-blue-300 font-mono">${func.name}</h3>
                    <p class="mt-2 text-gray-300">${funcDescription}</p>
                    <div class="mt-4">
                        <p class="text-sm font-semibold text-gray-400 mb-2">Example:</p>
                        <div class="relative">
                            <pre><code class="language-lua">${func.example.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>
                            <button class="copy-btn" title="Copy Code"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg></button>
                        </div>
                    </div>
                </div>`;
            }).join('');
            return `<h2 id="cat-${categoryName.replace(/[^a-zA-Z0-9_]/g, '-')}" class="text-3xl font-bold border-b-2 border-blue-500/30 pb-3 mb-8 flex items-center scroll-mt-24">${category.icon} ${categoryName}</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">${functionsHtml}</div>`;
        }).join('');
        hljs.highlightAll();
        observeElements('#documentation h2');
    };
    
    const generateDocsSidebar = () => {
        const sidebarContainer = document.getElementById('docs-sidebar');
        if (!sidebarContainer) return;
        sidebarContainer.innerHTML = '';
        const nav = document.createElement('nav');
        nav.className = 'sticky top-28';
        const navList = document.createElement('ul');
        navList.className = 'space-y-6';
        docData.forEach(category => {
            const categoryName = category.category[currentLang] || category.category.en;
            const categoryId = `cat-${categoryName.replace(/[^a-zA-Z0-9_]/g, '-')}`;
            const categoryLi = document.createElement('li');
            const categoryLink = document.createElement('a');
            categoryLink.href = `#${categoryId}`;
            categoryLink.textContent = categoryName;
            categoryLink.className = 'font-bold text-lg text-blue-300 hover:text-white transition-colors';
            categoryLink.dataset.targetId = categoryId;
            categoryLi.appendChild(categoryLink);
            const subList = document.createElement('ul');
            subList.className = 'pl-4 mt-2 space-y-2 border-l border-blue-500/20';
            category.functions.forEach(func => {
                const funcId = `func-${func.name.replace(/[^a-zA-Z0-9_]/g, '-')}`;
                const funcLi = document.createElement('li');
                const funcLink = document.createElement('a');
                funcLink.href = `#${funcId}`;
                funcLink.textContent = func.name;
                funcLink.className = 'block text-sm text-gray-400 hover:text-blue-300 transition-colors font-mono';
                funcLink.dataset.targetId = funcId;
                funcLi.appendChild(funcLink);
                subList.appendChild(funcLi);
            });
            categoryLi.appendChild(subList);
            navList.appendChild(categoryLi);
        });
        nav.appendChild(navList);
        sidebarContainer.appendChild(nav);
        sidebarContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && e.target.dataset.targetId) {
                e.preventDefault();
                handleScrollAndHighlight(e.target.dataset.targetId);
            }
        });
    };

    const searchInput = document.getElementById('searchInput');
    const searchResultsContainer = document.getElementById('searchResults');
    searchInput.addEventListener('input', (e) => { 
        const searchTerm = e.target.value.toLowerCase(); 
        searchResultsContainer.innerHTML = ''; 
        if (searchTerm.length < 1) { 
            searchResultsContainer.classList.add('hidden'); 
            return; 
        } 
        const results = docData.flatMap(category => 
            category.functions
                .filter(func => {
                    const description = func.description[currentLang] || func.description.en;
                    return func.name.toLowerCase().includes(searchTerm) || description.toLowerCase().includes(searchTerm);
                })
                .map(func => ({ name: func.name, id: `func-${func.name.replace(/[^a-zA-Z0-9_]/g, '-')}` }))
        );
        if (results.length > 0) { 
            searchResultsContainer.classList.remove('hidden'); 
            results.forEach(result => { 
                const resultItem = document.createElement('a'); 
                resultItem.href = `#${result.id}`; 
                resultItem.textContent = result.name; 
                resultItem.className = 'block text-left p-2 rounded-md hover:bg-blue-500/20 transition-colors cursor-pointer text-blue-200'; 
                resultItem.dataset.targetId = result.id; 
                searchResultsContainer.appendChild(resultItem); 
            }); 
        } else { 
            searchResultsContainer.classList.add('hidden'); 
        } 
    });
    searchResultsContainer.addEventListener('click', (e) => { 
        if (e.target.tagName === 'A' && e.target.dataset.targetId) { 
            e.preventDefault(); 
            handleScrollAndHighlight(e.target.dataset.targetId); 
            searchResultsContainer.classList.add('hidden'); 
            searchInput.value = ''; 
        } 
    });
    document.addEventListener('click', (e) => { 
        if (!e.target.closest('#searchResults') && e.target !== searchInput) { 
            searchResultsContainer.classList.add('hidden'); 
        } 
    });
    
    // --- СИСТЕМА ОТОБРАЖЕНИЯ БЛОГА ---
    let blogData = [];

    async function loadPosts() {
        try {
            const response = await fetch(`blog-posts.json?v=${Date.now()}`);
            blogData = await response.json();
            generateBlogPages();
        } catch (error) { console.error("Could not load blog posts:", error); }
    }

    const createPostCard = (post) => {
        const title = post.title[currentLang] || post.title.en;
        const summary = post.summary[currentLang] || post.summary.en;
        return `<a href="#" data-target="post-page" data-post-id="${post.id}" class="block post-card glass-card rounded-2xl flex-grow" style="background-image: url('${post.imageUrl}');">
            <div class="p-8 post-card-content">
                <p class="text-sm text-gray-400 mb-2">${post.date}</p>
                <h3 class="text-2xl font-bold">${title}</h3>
                <p class="text-gray-300 mt-1">${summary}</p>
            </div>
        </a>`;
    };
    
    const generatePostTOC = (contentContainer) => {
        const tocContainer = document.getElementById('post-toc-sidebar');
        tocContainer.innerHTML = '';
        const headings = contentContainer.querySelectorAll('h2, h3');
        if (headings.length < 1) { tocContainer.classList.add('hidden'); return; }
        const nav = document.createElement('nav');
        nav.className = 'sticky top-28';
        const title = document.createElement('h3');
        title.textContent = translations[currentLang].toc_title;
        title.className = 'text-lg font-bold mb-4 text-blue-300';
        nav.appendChild(title);
        const list = document.createElement('ul');
        list.className = 'space-y-2';
        headings.forEach((heading, index) => {
            const id = `heading-${index}`;
            heading.id = id;
            const link = document.createElement('a');
            link.href = `#${id}`;
            link.textContent = heading.textContent;
            link.className = 'block text-sm text-gray-400 hover:text-blue-300 transition-colors';
            if (heading.tagName === 'H3') link.classList.add('pl-4');
            const listItem = document.createElement('li');
            listItem.appendChild(link);
            list.appendChild(listItem);
        });
        nav.appendChild(list);
        tocContainer.appendChild(nav);
        tocContainer.classList.remove('hidden');
    };

    const showPost = (postId) => {
        const post = blogData.find(p => p.id === postId);
        if (!post) return;
        const title = post.title[currentLang] || post.title.en;
        const content = post.content[currentLang] || post.content.en;
        const postPageContainer = document.getElementById('post-page');
        postPageContainer.dataset.currentPostId = postId;
        postPageContainer.innerHTML = `<div class="relative w-full h-80 rounded-2xl overflow-hidden mb-12">
                <img src="${post.imageUrl}" class="absolute w-full h-full object-cover" alt="Post banner">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                <div class="absolute bottom-0 left-0 p-8 md:p-12">
                    <p class="text-gray-300">${post.date} · ${post.readTime}</p>
                    <h1 class="post-title-text text-4xl md:text-6xl font-bold my-2">${title}</h1>
                </div>
            </div>
            <div class="max-w-5xl mx-auto"><div class="prose lg:prose-xl prose-invert ql-snow"><div class="ql-editor">${content}</div></div></div>`;
        showPage('post-page');
        const contentDiv = postPageContainer.querySelector('.ql-editor');
        if (contentDiv) generatePostTOC(contentDiv);
        hljs.highlightAll();
    };

    const generateBlogPages = () => {
        const previewContainer = document.getElementById('blog-preview');
        const blogGridContainer = document.getElementById('blog-page-grid');
        if (!blogData || blogData.length === 0 || !previewContainer || !blogGridContainer) return;
        const sortedPosts = [...blogData].sort((a, b) => new Date(b.date) - new Date(a.date));
        const previewTitleHtml = `<div class="flex justify-between items-center"><h2 class="text-3xl font-bold border-b-2 border-blue-500/30 pb-2 mb-8" data-lang-key="blog_title">${translations[currentLang].blog_title}</h2><a href="#" data-target="blog-page" class="nav-link text-blue-300 hover:text-white transition-colors" data-lang-key="view_all">${translations[currentLang].view_all}</a></div>`;
        previewContainer.innerHTML = `${previewTitleHtml}<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${sortedPosts.slice(0, 3).map(createPostCard).join('')}</div>`;
        blogGridContainer.innerHTML = sortedPosts.map(createPostCard).join('');
        observeElements('#blog-preview h2, #blog-page h2');
    };
    
    mainContent.addEventListener('click', (e) => {
        const postLink = e.target.closest('[data-post-id]');
        if (postLink) { 
            e.preventDefault(); 
            showPost(postLink.dataset.postId); 
        } 
    });
    
    // --- ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ ---
    setLanguage(currentLang);
    showPage('home-page');
    loadPosts();
    hljs.highlightAll();
});