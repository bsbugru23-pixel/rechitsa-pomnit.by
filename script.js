(function () {
    'use strict';

    var docEl = document.documentElement;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    
    var burger = document.getElementById('burger');
    var nav = document.getElementById('nav');

    function closeNav() {
        if (!nav || !burger) return;
        nav.classList.remove('is-open');
        burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
    }

    if (burger && nav) {
        burger.addEventListener('click', function () {
            var open = !nav.classList.contains('is-open');
            nav.classList.toggle('is-open', open);
            burger.classList.toggle('is-open', open);
            burger.setAttribute('aria-expanded', open ? 'true' : 'false');
            document.body.classList.toggle('nav-open', open);
        });

        nav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', closeNav);
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeNav();
        });
    }

    
    var topbar = document.getElementById('topbar');
    var bar = document.getElementById('scrollBar');
    var ticking = false;

    function onScroll() {
        var y = window.scrollY || window.pageYOffset;
        if (topbar) topbar.classList.toggle('is-scrolled', y > 12);
        if (bar) {
            var max = docEl.scrollHeight - window.innerHeight;
            var progress = max > 0 ? Math.min(y / max, 1) : 0;
            bar.style.transform = 'scaleX(' + progress.toFixed(4) + ')';
        }
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(onScroll);
        }
    }, { passive: true });

    onScroll();

    
    var revealItems = document.querySelectorAll('[data-reveal]');

    if ('IntersectionObserver' in window && !reduced) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

        revealItems.forEach(function (item) {
            observer.observe(item);
        });
    } else {
        revealItems.forEach(function (item) {
            item.classList.add('is-in');
        });
    }

    
    var hero = document.getElementById('hero');
    if (hero && !reduced && window.matchMedia('(hover: hover)').matches) {
        hero.addEventListener('pointermove', function (e) {
            var r = hero.getBoundingClientRect();
            hero.style.setProperty('--mx', (((e.clientX - r.left) / r.width) * 100).toFixed(1) + '%');
            hero.style.setProperty('--my', (((e.clientY - r.top) / r.height) * 100).toFixed(1) + '%');
        });
    }

    
    document.querySelectorAll('[data-copy]').forEach(function (button) {
        button.addEventListener('click', function () {
            var value = button.getAttribute('data-copy');
            if (!value) return;

            var done = function () {
                var label = button.querySelector('[data-label]');
                if (!label) return;
                var original = label.textContent;
                label.textContent = 'Скопировано';
                setTimeout(function () {
                    label.textContent = original;
                }, 1600);
            };

            var fallback = function () {
                var field = document.createElement('textarea');
                field.value = value;
                field.setAttribute('readonly', '');
                field.style.position = 'fixed';
                field.style.opacity = '0';
                document.body.appendChild(field);
                field.select();
                try {
                    document.execCommand('copy');
                    done();
                } catch (err) {}
                document.body.removeChild(field);
            };

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(value).then(done).catch(fallback);
            } else {
                fallback();
            }
        });
    });

    
    window.scrollSlider = function (buttonElement, direction) {
        var wrapper = buttonElement.closest('.rail') || buttonElement.closest('.slider-wrapper');
        if (!wrapper) return;
        var track = wrapper.querySelector('.rail__track') || wrapper.querySelector('.photo-tape-container');
        if (!track) return;
        var amount = Math.min(track.clientWidth * 0.8, 620);
        track.scrollBy({ left: direction * amount, behavior: reduced ? 'auto' : 'smooth' });
    };
})();
