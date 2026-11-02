
(function () {
    const links = [...document.querySelectorAll('.gallery a')];
    const dialog = document.getElementById('lightbox');
    if (!dialog || !links.length) return;

    const img = dialog.querySelector('img');
    const caption = dialog.querySelector('figcaption');
    let current = 0;

    function show(n) {
        current = (n + links.length) % links.length;
        const link = links[current];
        img.src = link.href;
        img.alt = link.querySelector('img').alt;
        caption.textContent = link.dataset.caption || img.alt;
    }

    links.forEach((link, n) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            show(n);
            dialog.showModal();
        });
    });

    dialog.querySelector('.lb-close').addEventListener('click', () => dialog.close());
    dialog.querySelector('.lb-prev').addEventListener('click', () => show(current - 1));
    dialog.querySelector('.lb-next').addEventListener('click', () => show(current + 1));

    // Clicking the dark backdrop closes it
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });

    // Arrow keys
    dialog.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') show(current + 1);
        if (e.key === 'ArrowLeft') show(current - 1);
    });
})();