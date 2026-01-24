// Extra JavaScript for UBC Story

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add reading progress indicator
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--ubc-blue), var(--ubc-gold));
        z-index: 1000;
        transition: width 0.2s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollProgress = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = scrollProgress + '%';
    });

    // Add copy button for code blocks
    document.querySelectorAll('pre code').forEach(block => {
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.innerHTML = '📋 复制';
        button.style.cssText = `
            position: absolute;
            top: 8px;
            right: 8px;
            background: var(--ubc-blue);
            color: white;
            border: none;
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 12px;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.2s ease;
        `;
        
        const pre = block.parentElement;
        pre.style.position = 'relative';
        pre.appendChild(button);

        pre.addEventListener('mouseenter', () => button.style.opacity = '1');
        pre.addEventListener('mouseleave', () => button.style.opacity = '0');

        button.addEventListener('click', async () => {
            const text = block.textContent;
            try {
                await navigator.clipboard.writeText(text);
                button.innerHTML = '✅ 已复制';
                setTimeout(() => {
                    button.innerHTML = '📋 复制';
                }, 2000);
            } catch (err) {
                button.innerHTML = '❌ 复制失败';
                setTimeout(() => {
                    button.innerHTML = '📋 复制';
                }, 2000);
            }
        });
    });

    // Add table of contents toggle for mobile
    const toc = document.querySelector('.md-nav--secondary .md-nav__link--active');
    if (toc && window.innerWidth <= 768) {
        const tocToggle = document.createElement('button');
        tocToggle.innerHTML = '📖 目录';
        tocToggle.style.cssText = `
            background: var(--ubc-blue);
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 16px;
            margin: 8px;
            cursor: pointer;
            font-size: 14px;
        `;
        
        const secondaryNav = document.querySelector('.md-nav--secondary');
        if (secondaryNav) {
            secondaryNav.insertBefore(tocToggle, secondaryNav.firstChild);
            
            tocToggle.addEventListener('click', () => {
                const tocList = secondaryNav.querySelector('.md-nav__list');
                if (tocList) {
                    tocList.style.display = tocList.style.display === 'none' ? 'block' : 'none';
                }
            });
        }
    }

    // Add chapter navigation
    const addChapterNavigation = () => {
        const chapters = document.querySelectorAll('h1[id], h2[id]');
        if (chapters.length > 1) {
            const nav = document.createElement('nav');
            nav.className = 'chapter-navigation';
            nav.innerHTML = '<h3>章节导航</h3><ul></ul>';
            nav.style.cssText = `
                background: var(--md-default-bg-color);
                border: 1px solid var(--md-default-fg-color--lightest);
                border-radius: 8px;
                padding: 16px;
                margin: 16px 0;
            `;
            
            const ul = nav.querySelector('ul');
            chapters.forEach(chapter => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = '#' + chapter.id;
                a.textContent = chapter.textContent;
                a.style.cssText = `
                    color: var(--ubc-blue);
                    text-decoration: none;
                    display: block;
                    padding: 4px 0;
                    transition: color 0.2s ease;
                `;
                a.addEventListener('mouseenter', () => a.style.color = 'var(--ubc-dark-blue)');
                a.addEventListener('mouseleave', () => a.style.color = 'var(--ubc-blue)');
                
                li.appendChild(a);
                ul.appendChild(li);
            });
            
            const content = document.querySelector('.md-content__inner');
            if (content) {
                content.insertBefore(nav, content.firstChild.nextSibling);
            }
        }
    };

    addChapterNavigation();

    // Add back to top button
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '⬆️ 回到顶部';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--ubc-blue);
        color: white;
        border: none;
        border-radius: 8px;
        padding: 12px 16px;
        font-size: 14px;
        cursor: pointer;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.transform = 'translateY(0)';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.transform = 'translateY(20px)';
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('.md-search__input');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Escape to close search
        if (e.key === 'Escape') {
            const searchOverlay = document.querySelector('.md-search__overlay');
            if (searchOverlay) {
                searchOverlay.click();
            }
        }
    });

    // Add theme toggle animation
    const themeToggle = document.querySelector('[data-md-component="palette"]');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.style.transition = 'background-color 0.3s ease';
        });
    }

    // Add print-friendly styles
    const printButton = document.createElement('button');
    printButton.innerHTML = '🖨️ 打印';
    printButton.style.cssText = `
        background: var(--ubc-gold);
        color: var(--ubc-dark-blue);
        border: none;
        border-radius: 4px;
        padding: 8px 16px;
        margin: 8px;
        cursor: pointer;
        font-size: 14px;
    `;
    
    printButton.addEventListener('click', () => {
        window.print();
    });

    // Add print button to header
    const header = document.querySelector('.md-header__inner');
    if (header) {
        header.appendChild(printButton);
    }

    console.log('UBC Story JavaScript loaded successfully!');
});