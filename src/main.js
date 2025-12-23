/**
 * YURI-MATRIX.BLOG - Official Script
 * Includes: Lenis, GSAP, Lucide, Form Validation, Cookie Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // === 1. ИНИЦИАЛИЗАЦИЯ ИКОНОК (LUCIDE) ===
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // === 2. ПЛАВНЫЙ СКРОЛЛ (LENIS) ===
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Экспортируем lenis в window, чтобы он был доступен везде
    window.lenis = lenis;

    // === 3. МОБИЛЬНОЕ МЕНЮ ===
    const burger = document.querySelector('.burger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuLinks = document.querySelectorAll('.mobile-menu__link, .mobile-menu .btn');

    if (burger && mobileMenu) {
        burger.addEventListener('click', () => {
            const isActive = burger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            // Блокируем скролл при открытом меню
            document.body.style.overflow = isActive ? 'hidden' : '';
        });
    }

    // Закрытие меню при клике на ссылку
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // === 4. АНИМАЦИИ (GSAP) ===
    if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        tl.from('.hero__title', {
            y: 60,
            opacity: 0,
            duration: 1.2,
            delay: 0.5
        })
        .from('.hero__text', {
            y: 30,
            opacity: 0,
            duration: 1
        }, "-=0.8")
        .from('.hero__actions', {
            y: 20,
            opacity: 0,
            duration: 0.8
        }, "-=0.6")
        .from('.header', {
            y: -100,
            opacity: 0,
            duration: 1
        }, "-=1.2");
    }

    // === 5. ЛОГИКА КАПЧИ ===
    const captchaLabel = document.getElementById('captcha-label');
    const captchaInput = document.getElementById('captcha-input');
    let captchaAnswer = 0;

    function generateCaptcha() {
        if (!captchaLabel) return;
        const n1 = Math.floor(Math.random() * 10) + 1;
        const n2 = Math.floor(Math.random() * 10) + 1;
        captchaAnswer = n1 + n2;
        captchaLabel.innerText = `Подтвердите, что вы не робот: ${n1} + ${n2} = ?`;
    }

    generateCaptcha();

    // === 6. ВАЛИДАЦИЯ И ОТПРАВКА ФОРМЫ (AJAX SIMULATION) ===
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('form-message');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const phone = document.getElementById('phone').value;
            const userCaptcha = parseInt(captchaInput.value);
            const submitBtn = this.querySelector('button[type="submit"]');

            // 1. Валидация телефона (только цифры)
            if (!/^\d+$/.test(phone.replace(/\D/g, ''))) {
                showFormStatus('Пожалуйста, введите корректный номер телефона (только цифры)', 'error');
                return;
            }

            // 2. Валидация капчи
            if (userCaptcha !== captchaAnswer) {
                showFormStatus('Неверный ответ на защитный вопрос', 'error');
                generateCaptcha();
                captchaInput.value = '';
                return;
            }

            // 3. Имитация отправки
            submitBtn.disabled = true;
            submitBtn.innerText = 'Отправка...';

            setTimeout(() => {
                showFormStatus('Благодарим! Ваша заявка принята. Мы свяжемся с вами в течение 24 часов.', 'success');
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerText = 'Отправить запрос';
                generateCaptcha();
            }, 1500);
        });
    }

    function showFormStatus(text, type) {
        if (!formMessage) return;
        formMessage.innerText = text;
        formMessage.className = 'form-message ' + (type === 'success' ? 'success' : 'error');
        formMessage.style.display = 'block';
        
        if (type === 'success') {
            formMessage.style.color = '#065f46';
            formMessage.style.background = '#d1fae5';
            formMessage.style.padding = '15px';
            formMessage.style.borderRadius = '8px';
            formMessage.style.marginTop = '15px';
        } else {
            formMessage.style.color = '#991b1b';
            formMessage.style.background = '#fee2e2';
            formMessage.style.padding = '15px';
            formMessage.style.borderRadius = '8px';
            formMessage.style.marginTop = '15px';
        }
    }

    // === 7. COOKIE POPUP ===
    const cookiePopup = document.getElementById('cookie-popup');
    const acceptCookies = document.getElementById('accept-cookies');

    if (cookiePopup && !localStorage.getItem('matrix_cookies_accepted')) {
        setTimeout(() => {
            cookiePopup.style.display = 'block';
            gsap.from(cookiePopup, { y: 100, opacity: 0, duration: 0.5 });
        }, 3000);
    }

    if (acceptCookies) {
        acceptCookies.addEventListener('click', () => {
            localStorage.setItem('matrix_cookies_accepted', 'true');
            gsap.to(cookiePopup, { y: 100, opacity: 0, duration: 0.5, onComplete: () => {
                cookiePopup.style.display = 'none';
            }});
        });
    }

    // === 8. ПЛАВНЫЙ ПЕРЕХОД ПО ЯКОРНЫМ ССЫЛКАМ ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                lenis.scrollTo(target, {
                    offset: -80,
                    duration: 1.5
                });
            }
        });
    });

    // === 9. ЭФФЕКТ СКРОЛЛА ДЛЯ HEADER ===
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.style.padding = '12px 0';
            header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
        } else {
            header.style.padding = '20px 0';
            header.style.boxShadow = 'none';
        }
    });

});