
(function () {
    const mapEl = document.getElementById('map');
    if (!mapEl || typeof L === 'undefined') return;

    // Showroom location (Rosebank, Johannesburg). Change it to your own if you like.
    const position = [-26.1450, 28.0407];

    const map = L.map('map').setView(position, 15);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker(position).addTo(map)
        .bindPopup('<strong>Velora Motors</strong><br>Showroom visits by appointment')
        .openPopup();
})();