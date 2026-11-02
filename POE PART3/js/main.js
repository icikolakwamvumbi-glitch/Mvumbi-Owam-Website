
document.documentElement.classList.add('js');

// Helper: create an element safely (textContent, never innerHTML)
function make(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
}

// Helper: format a number as South African Rand
function rand(n) {
    return 'R ' + Math.round(n).toLocaleString('en-ZA');
}

// Scroll reveal animation
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    revealItems.forEach((item) => observer.observe(item));
} else {
    revealItems.forEach((item) => item.classList.add('visible'));
}

// Accordion
document.querySelectorAll('.accordion-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
        const isOpen = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!isOpen));
        document.getElementById(btn.getAttribute('aria-controls')).hidden = isOpen;
    });
});