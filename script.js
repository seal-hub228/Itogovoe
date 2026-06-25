// ========== THEME TOGGLE ==========
const themeToggleBtn = document.getElementById('themeToggle');
const themeIcon = themeToggleBtn?.querySelector('.theme-icon');

function setTheme(theme) {
    if (!themeToggleBtn) return;
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeIcon) themeIcon.textContent = '🌙';
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
        if (themeIcon) themeIcon.textContent = '☀️';
        localStorage.setItem('theme', 'light');
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
}

// ========== MOBILE MENU ==========
const mobileBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');
if (mobileBtn && mobileNav) {
    mobileBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('open');
    });
    mobileNav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('open');
        });
    });
}

// ========== CONTACT FORM ==========
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateForm(name, email, message) {
    const errors = [];
    if (name.trim().length < 2) errors.push('Имя должно содержать минимум 2 символа.');
    if (!validateEmail(email)) errors.push('Введите корректный email адрес.');
    if (message.trim().length < 5) errors.push('Сообщение должно содержать минимум 5 символов.');
    return errors;
}

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        const errors = validateForm(name, email, message);

        if (errors.length > 0) {
            formStatus.textContent = '❌ ' + errors.join(' ');
            formStatus.className = 'form-status error';
            return;
        }

        const formData = {
            name: name,
            email: email,
            message: message
        };
        console.log('📩 Данные формы:', formData);

        formStatus.textContent = '✅ Ваша заявка отправлена! Мы свяжемся с вами в ближайшее время.';
        formStatus.className = 'form-status success';
        contactForm.reset();

        setTimeout(() => {
            formStatus.textContent = '';
            formStatus.className = 'form-status';
        }, 5000);
    });
}

// ========== ANIMATED COUNTERS ==========
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                const duration = 1500;
                const startTime = performance.now();

                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const current = Math.floor(progress * target);
                    el.textContent = current;

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        el.textContent = target;
                    }
                }
                requestAnimationFrame(updateCounter);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        setTheme('dark');
    }

    animateCounters();

    // Обработка ошибок для всех изображений
    document.querySelectorAll('.tour-image img, .hero-image img, .about-image img, .team-photo img').forEach(img => {
        img.onerror = function() {
            this.style.display = 'none';
            const parent = this.parentNode;
            if (parent) {
                if (parent.classList.contains('tour-image') || parent.classList.contains('hero-image') || parent.classList.contains('about-image')) {
                    const placeholder = document.createElement('div');
                    placeholder.textContent = '✦';
                    placeholder.style.fontSize = '3rem';
                    placeholder.style.color = 'var(--accent-color)';
                    placeholder.style.display = 'flex';
                    placeholder.style.alignItems = 'center';
                    placeholder.style.justifyContent = 'center';
                    placeholder.style.height = '100%';
                    placeholder.style.width = '100%';
                    parent.appendChild(placeholder);
                } else if (parent.classList.contains('team-photo')) {
                    parent.textContent = '✦';
                    parent.style.fontSize = '2.8rem';
                    parent.style.color = 'var(--accent-color)';
                    parent.style.display = 'flex';
                    parent.style.alignItems = 'center';
                    parent.style.justifyContent = 'center';
                }
            }
        };
    });
});
