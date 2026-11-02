
(function () {
    const grid = document.getElementById('vehicle-grid');
    if (!grid) return;

    const search = document.getElementById('search');
    const category = document.getElementById('category');
    const sort = document.getElementById('sort');
    const count = document.getElementById('result-count');

    // Build the category dropdown from the data
    [...new Set(VEHICLES.map((v) => v.category))].forEach((c) => {
        const opt = make('option', '', c);
        opt.value = c;
        category.appendChild(opt);
    });

    function buildCard(v, index) {
        const card = make('article', 'card card-in');
        card.style.animationDelay = index * 60 + 'ms';

        const img = document.createElement('img');
        img.src = 'images/' + v.id + '-800.jpg';
        img.setAttribute('srcset', 'images/' + v.id + '-800.jpg 800w, images/' + v.id + '-1600.jpg 1600w');
        img.sizes = '(min-width: 1024px) 380px, (min-width: 768px) 45vw, 92vw';
        img.width = 800;
        img.height = 533;
        img.alt = v.name;
        if (v.id === 'lamborghini-huracan') img.className = 'img-bottom';
        if (index > 2) img.loading = 'lazy';

        const body = make('div', 'card-body');
        body.appendChild(make('h4', '', v.name));
        body.appendChild(make('p', '', v.blurb));

        const specs = make('ul', 'specs');
        ['Category: ' + v.category, 'Brand: ' + v.brand, 'Model: ' + v.model,
         'Price: ' + rand(v.price), 'Availability: ' + v.availability]
            .forEach((t) => specs.appendChild(make('li', '', t)));
        body.appendChild(specs);

        const p = make('p');
        const link = make('a', 'btn btn-outline', 'Enquire About This Vehicle');
        link.href = 'enquiry.html?vehicle=' + encodeURIComponent(v.id);
        p.appendChild(link);
        body.appendChild(p);

        card.append(img, body);
        return card;
    }

    function update() {
        const q = search.value.trim().toLowerCase();

        const list = VEHICLES.filter((v) => {
            const matchesCategory = category.value === 'all' || v.category === category.value;
            const text = (v.name + ' ' + v.brand + ' ' + v.model + ' ' + v.category).toLowerCase();
            return matchesCategory && text.includes(q);
        });

        if (sort.value === 'price-asc') list.sort((a, b) => a.price - b.price);
        else if (sort.value === 'price-desc') list.sort((a, b) => b.price - a.price);
        else list.sort((a, b) => a.name.localeCompare(b.name));

        grid.replaceChildren(...list.map(buildCard));
        count.textContent = list.length
            ? list.length + ' vehicle' + (list.length === 1 ? '' : 's') + ' found'
            : 'No vehicles match your search. Try a different word or category.';
    }

    search.addEventListener('input', update);
    category.addEventListener('change', update);
    sort.addEventListener('change', update);
    update();
})();