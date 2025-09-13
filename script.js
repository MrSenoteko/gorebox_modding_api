document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const grid = document.getElementById('background-grid');
    const mainContent = document.querySelector('main');
    let quill;
    
    // NEW: Укажите ваше имя пользователя и имя репозитория на GitHub
    const GITHUB_USER = "YOUR_USERNAME";
    const GITHUB_REPO = "YOUR_REPONAME";
    const githubFileLink = document.getElementById('github-file-link');
    if (githubFileLink) {
        githubFileLink.href = `https://github.com/${GITHUB_USER}/${GITHUB_REPO}/edit/main/blog-posts.json`;
    }

    // --- Логика для плавной анимации сетки (без изменений) ---
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

    // --- Логика для плавающей шапки (без изменений) ---
    window.addEventListener('scroll', () => body.classList.toggle('header-scrolled', window.scrollY > 30));

    // --- Логика переключения тем (без изменений) ---
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-toggle-icon');
    const moonIcon = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>`;
    const sunIcon = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>`;
    const setTheme = (isLight) => {
        if (isLight) {
            document.body.classList.add('light-theme');
            themeIcon.innerHTML = sunIcon;
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.remove('light-theme');
            themeIcon.innerHTML = moonIcon;
            localStorage.setItem('theme', 'dark');
        }
    };
    themeToggle.addEventListener('click', () => setTheme(!document.body.classList.contains('light-theme')));
    setTheme(localStorage.getItem('theme') === 'light');

    // --- Навигация по сайту (без изменений) ---
    const pages = document.querySelectorAll('.page-section');
    const navLinks = document.querySelectorAll('.nav-link');
    let currentPage = 'home-page';
    const showPage = (pageId) => {
        const currentPageElement = document.getElementById(currentPage);
        const nextPageElement = document.getElementById(pageId);
        if (currentPageElement && nextPageElement && currentPageElement !== nextPageElement) {
            currentPageElement.classList.remove('active');
            setTimeout(() => {
                currentPageElement.classList.add('hidden');
                nextPageElement.classList.remove('hidden');
                nextPageElement.classList.add('active');
                currentPage = pageId;
            }, 500);
        } else if (nextPageElement) {
            pages.forEach(p => { p.classList.add('hidden'); p.classList.remove('active'); });
            nextPageElement.classList.remove('hidden');
            nextPageElement.classList.add('active');
            currentPage = pageId;
        }
        window.scrollTo(0, 0);
    };
    navLinks.forEach(link => { 
        link.addEventListener('click', (e) => { 
            e.preventDefault(); 
            const targetId = link.dataset.target; 
            if (targetId) showPage(targetId); 
        }); 
    });
    
    // --- Данные документации и их генерация (без изменений) ---
    const docData = [ { category: "Global Lua Functions", icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h1a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.884 5.066A9 9 0 1016.116 5.066M12 3v1m0 16v1" /></svg>`, functions: [ { name: "log(text)", description: "Prints text to the Unity console with a [Lua] prefix.", example: `log("Player position updated")` }, { name: "getDeltaTime()", description: "Returns the value of Time.deltaTime.", example: `local dt = getDeltaTime()\\nplayer.x = player.x + speed * dt` }, ] }, { category: "Lua GUI Functions", icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>`, functions: [ { name: "gui.label(text)", description: "Displays a text label.", example: `M.gui_update = function()\\n    gui.label("Player Health: 100")\\nend` }, { name: "gui.button(text)", description: "Displays a button; returns true if clicked.", example: `M.gui_update = function()\\n    if gui.button("Quit Game") then\\n        log("Quit button pressed")\\n    end\\nend` }, { name: "gui.hSlider(value, left, right)", description: "A horizontal slider; returns the current value.", example: `local volume = 0.5\\nM.gui_update = function()\\n    volume = gui.hSlider(volume, 0.0, 1.0)\\nend` }, { name: "gui.toggle(value, text)", description: "Displays a toggle switch; returns its current boolean status.", example: `local musicEnabled = true\\nM.gui_update = function()\\n    musicEnabled = gui.toggle(musicEnabled, "Music On/Off")\\nend` }, ] }, { category: "Lua Unity Functions", icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>`, functions: [ { name: "Unity.GameObject.Create(name, path, ...)", description: "Creates a new object via PhotonNetwork.", example: `local newCube = Unity.GameObject.Create("MyCube", "Primitives/Cube", 0, 1, 0, 1, 1, 1, 0, 0, 0)` }, { name: "Unity.GameObject.Find(name)", description: "Finds an object by name; returns an object table.", example: `local player = Unity.GameObject.Find("MainPlayer")` }, { name: "Unity.GameObject.AddComponent(id, typeName)", description: "Adds a component to an object by its ID.", example: `local player = Unity.GameObject.Find("MainPlayer")\\nUnity.GameObject.AddComponent(player.id, "Rigidbody")` }, ] }, { category: "GameObject & Transform Methods", icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 7l-8.228 8.228-3.536-3.536L1 21M15 1l6 6" /></svg>`, functions: [ { name: "object:GetName()", description: "Returns the name of the object.", example: `local player = Unity.GameObject.Find("MainPlayer")\\nlog(player:GetName())` }, { name: "object:SetActive(bool)", description: "Activates or deactivates the object.", example: `local enemy = Unity.GameObject.Find("Enemy1")\\nenemy:SetActive(false)` }, { name: "transform:GetPosition()", description: "Returns the global position (x, y, z).", example: `local pos = transform:GetPosition()\\nlog("x=" .. pos.x .. ", y=" .. pos.y)` }, { name: "transform:SetPosition(x, y, z)", description: "Sets the global position.", example: `transform:SetPosition(10, 5, 20)` }, { name: "transform:Translate(x, y, z)", description: "Moves the object by the specified vector.", example: `transform:Translate(0, 0, 5 * getDeltaTime()) -- Move forward` }, { name: "transform:Rotate(x, y, z)", description: "Rotates the object by the specified angles.", example: `transform:Rotate(0, 45 * getDeltaTime(), 0) -- Rotate around Y axis` }, ] }, { category: "Lua Module Lifecycle", icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5" /></svg>`, functions: [ { name: "awake()", description: "Called during Unity's Awake() phase.", example: `M = {}\\nfunction M.awake()\\n    log("Module is awake!")\\nend` }, { name: "start()", description: "Called during Unity's Start() phase.", example: `M = {}\\nfunction M.start()\\n    log("Module has started!")\\nend` }, { name: "update()", description: "Called every frame in Update().", example: `M = {}\\nfunction M.update()\\n    -- Game logic here\\nend` }, { name: "fixed_update()", description: "Called in FixedUpdate().", example: `M = {}\\nfunction M.fixed_update()\\n    -- Physics logic here\\nend` }, ] } ];
    (function generateDocs(){
        const docContainer = document.getElementById('documentation');
        docContainer.innerHTML = ''; 
        docData.forEach(category => { 
            const categoryTitle = document.createElement('h2'); 
            const categoryId = `cat-${category.category.replace(/[^a-zA-Z0-9_]/g, '-')}`;
            categoryTitle.id = categoryId;
            categoryTitle.className = 'text-3xl font-bold border-b-2 border-blue-500/30 pb-3 mb-8 flex items-center scroll-mt-24'; 
            categoryTitle.innerHTML = `${category.icon} ${category.category}`; 
            docContainer.appendChild(categoryTitle); 
            
            const grid = document.createElement('div'); 
            grid.className = 'grid grid-cols-1 md:grid-cols-2 gap-8'; 
            category.functions.forEach(func => { 
                const funcCard = document.createElement('div'); 
                const funcId = `func-${func.name.replace(/[^a-zA-Z0-9_]/g, '-')}`; 
                funcCard.id = funcId; 
                funcCard.className = 'glass-card p-6 doc-item'; 
                funcCard.innerHTML = `<h3 class="text-lg font-semibold text-blue-300 font-mono">${func.name}</h3><p class="mt-2 text-gray-300">${func.description}</p><div class="mt-4"><p class="text-sm font-semibold text-gray-400 mb-2">Example:</p><div class="relative"><pre><code class="language-lua">${func.example.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre><button class="copy-btn" title="Copy Code"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg></button></div></div>`; 
                grid.appendChild(funcCard); 
            }); 
            docContainer.appendChild(grid); 
        });
    })();
    
    // --- ================================== ---
    // --- СИСТЕМА УПРАВЛЕНИЯ БЛОГОМ (CMS) ---
    // --- ================================== ---

    let blogData = [];
    const ADMIN_PASSWORD = 'admin'; 
    let isAdmin = false;

    // UPDATED: Загрузка постов из файла blog-posts.json
    async function loadPosts() {
        try {
            // Добавляем случайный параметр, чтобы избежать кэширования
            const response = await fetch(`blog-posts.json?v=${Date.now()}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            blogData = await response.json();
            generateBlogPages();
        } catch (error) {
            console.error("Could not load blog posts:", error);
            const previewContainer = document.getElementById('blog-preview');
            previewContainer.innerHTML = `<p class="text-red-400">Error loading blog posts. Please check if the 'blog-posts.json' file exists and is valid.</p>`;
        }
    }

    const toggleAdminMode = (enabled) => {
        isAdmin = enabled;
        body.classList.toggle('admin-mode', enabled);
        generateBlogPages();
    };

    const handleAdminLogin = () => {
        const password = prompt('Enter admin password:');
        if (password === ADMIN_PASSWORD) {
            alert('Login successful! You can now edit posts.');
            toggleAdminMode(true);
        } else if (password) {
            alert('Incorrect password.');
        }
    };
    
    const initializeEditor = () => {
        // ... (код инициализации редактора остается прежним)
        const toolbarOptions = [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['blockquote', 'code-block'],
            ['link', 'image', 'divider']
        ];
        const BlockEmbed = Quill.import('blots/block/embed');
        class DividerBlot extends BlockEmbed {}
        DividerBlot.blotName = 'divider';
        DividerBlot.tagName = 'hr';
        Quill.register(DividerBlot);
        quill = new Quill('#editor-container', {
            modules: {
                syntax: true,
                toolbar: {
                    container: toolbarOptions,
                    handlers: {
                        'image': () => {
                            const url = prompt('Enter image URL:');
                            if (url) quill.insertEmbed(quill.getSelection(true).index, 'image', url, Quill.sources.USER);
                        },
                        'divider': () => {
                            const range = quill.getSelection(true);
                            if (range) {
                                quill.insertEmbed(range.index, 'divider', true, Quill.sources.USER);
                                quill.setSelection(range.index + 1, Quill.sources.SILENT);
                            }
                        }
                    }
                }
            },
            theme: 'snow'
        });
        const dividerButton = document.querySelector('.ql-divider');
        if(dividerButton) dividerButton.innerHTML = '<svg viewBox="0 0 18 18"><line class="ql-stroke" x1="0" x2="18" y1="9" y2="9"></line></svg>';
    };

    const createPostCard = (post) => {
         return `
            <div class="glass-card rounded-2xl flex flex-col justify-between overflow-hidden">
                <a href="#" data-target="post-page" data-post-id="${post.id}" class="block post-card flex-grow" style="background-image: url('${post.imageUrl}');">
                    <div class="p-8 post-card-content">
                        <p class="text-sm text-gray-400 mb-2">${post.date}</p>
                        <h3 class="text-2xl font-bold">${post.title}</h3>
                        <p class="text-gray-300 mt-1">${post.summary}</p>
                    </div>
                </a>
                <div class="admin-card-controls p-3 bg-gray-900/70">
                     <button data-edit-id="${post.id}" class="edit-post-btn text-sm bg-blue-600/80 hover:bg-blue-600 w-full text-white font-semibold py-2 px-4 rounded-md transition-colors">Edit</button>
                     <button data-delete-id="${post.id}" class="delete-post-btn text-sm bg-red-600/80 hover:bg-red-600 w-full text-white font-semibold py-2 px-4 rounded-md transition-colors">Delete</button>
                </div>
            </div>
        `;
    };

    const showPost = (postId) => {
        const post = blogData.find(p => p.id === postId);
        if (!post) return;
        const postPageContainer = document.getElementById('post-page');
        postPageContainer.innerHTML = `<div class="relative w-full h-80 rounded-2xl overflow-hidden mb-12"><img src="${post.imageUrl}" class="absolute w-full h-full object-cover" alt="Post banner"><div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div><div class="absolute bottom-0 left-0 p-8 md:p-12"><p class="text-gray-300">${post.date} · ${post.readTime}</p><h1 class="text-4xl md:text-6xl font-bold my-2">${post.title}</h1></div></div><div class="max-w-5xl mx-auto"><div class="prose lg:prose-xl prose-invert ql-snow"><div class="ql-editor">${post.content}</div></div></div>`;
        showPage('post-page');
        hljs.highlightAll();
    };

    const generateBlogPages = () => {
        const previewContainer = document.getElementById('blog-preview');
        const blogGridContainer = document.getElementById('blog-page-grid');
        const sortedPosts = [...blogData].sort((a, b) => new Date(b.date) - new Date(a.date));
        previewContainer.innerHTML = `<div class="flex justify-between items-center"><h2 class="text-3xl font-bold border-b-2 border-blue-500/30 pb-2 mb-8">Blog & News</h2><a href="#" data-target="blog-page" class="nav-link text-blue-300 hover:text-white transition-colors">View All →</a></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${sortedPosts.slice(0, 3).map(createPostCard).join('')}</div>`;
        blogGridContainer.innerHTML = sortedPosts.map(createPostCard).join('');
    };
    
    const editorForm = document.getElementById('blog-editor-form');
    const postIdInput = document.getElementById('post-id-input');
    const postTitleInput = document.getElementById('post-title-input');
    const postSummaryInput = document.getElementById('post-summary-input');
    const postImageUrlInput = document.getElementById('post-image-url-input');

    const showEditor = (post = null) => {
        const jsonOutputContainer = document.getElementById('json-output-container');
        jsonOutputContainer.classList.add('hidden');
        if (post) {
            document.getElementById('editor-title').textContent = "Edit Post";
            postIdInput.value = post.id;
            postTitleInput.value = post.title;
            postSummaryInput.value = post.summary;
            postImageUrlInput.value = post.imageUrl;
            quill.root.innerHTML = post.content;
        } else {
            document.getElementById('editor-title').textContent = "Create New Post";
            editorForm.reset();
            postIdInput.value = '';
            quill.root.innerHTML = '';
        }
        showPage('blog-editor-page');
    };

    // UPDATED: Эта функция теперь генерирует JSON для ручного обновления
    const handleJsonGeneration = (e) => {
        e.preventDefault();
        const postId = postIdInput.value;
        const updatedPosts = [...blogData];
        
        const postData = {
            id: postId || `post-${Date.now()}`,
            title: postTitleInput.value,
            summary: postSummaryInput.value,
            imageUrl: postImageUrlInput.value,
            content: quill.root.innerHTML,
            date: new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }),
            readTime: `${Math.ceil(quill.getText().length / 1500)} min read`
        };

        if (postId) {
            const index = updatedPosts.findIndex(p => p.id === postId);
            if(index > -1) updatedPosts[index] = postData;
        } else {
            updatedPosts.unshift(postData); // Добавляем новый пост в начало
        }

        const jsonOutput = document.getElementById('json-output');
        jsonOutput.value = JSON.stringify(updatedPosts, null, 2); // Форматируем JSON для читаемости

        const jsonOutputContainer = document.getElementById('json-output-container');
        jsonOutputContainer.classList.remove('hidden');
        jsonOutput.select(); // Выделяем текст для удобного копирования
        alert('JSON code generated! Scroll down to copy it.');
    };
    
    mainContent.addEventListener('click', (e) => {
        const postLink = e.target.closest('[data-post-id]');
        const editBtn = e.target.closest('.edit-post-btn');
        const deleteBtn = e.target.closest('.delete-post-btn');
        
        if (postLink && !e.target.closest('.admin-card-controls')) {
            e.preventDefault();
            showPost(postLink.dataset.postId);
        } else if (editBtn) {
            e.preventDefault();
            const post = blogData.find(p => p.id === editBtn.dataset.editId);
            if (post) showEditor(post);
        } else if (deleteBtn) {
            e.preventDefault();
            const confirmed = confirm('This will generate new JSON data without this post. Are you sure?');
            if (confirmed) {
                const postIdToDelete = deleteBtn.dataset.deleteId;
                const updatedPosts = blogData.filter(p => p.id !== postIdToDelete);
                
                showEditor(); // Открываем редактор, чтобы показать JSON
                const jsonOutput = document.getElementById('json-output');
                jsonOutput.value = JSON.stringify(updatedPosts, null, 2);
                
                const jsonOutputContainer = document.getElementById('json-output-container');
                jsonOutputContainer.classList.remove('hidden');
                jsonOutput.select();
                alert('JSON for deletion generated. Copy the code below and update your file on GitHub.');
            }
        }
    });
    
    document.getElementById('admin-login-btn').addEventListener('click', handleAdminLogin);
    document.getElementById('add-post-btn').addEventListener('click', () => showEditor());
    document.getElementById('cancel-edit-btn').addEventListener('click', () => {
        showPage('blog-page');
        document.getElementById('json-output-container').classList.add('hidden');
    });
    editorForm.addEventListener('submit', handleJsonGeneration);

    // --- Инициализация при загрузке ---
    showPage('home-page');
    loadPosts();
    initializeEditor();
    hljs.highlightAll();
});