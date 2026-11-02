
(function () {
    const form = document.getElementById('enquiry-form');
    if (!form) return;

    // Paste your Formspree address here after you create a form there.
    // Until then, the enquiry is processed on the page only.
    const ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
    const ANNUAL_RATE = 0.1175; // assumed interest rate for the estimate

    const vehicleSelect = document.getElementById('vehicle');
    const typeSelect = document.getElementById('enquiry-type');
    const financeFields = document.getElementById('finance-fields');
    const dateInput = document.getElementById('viewing-date');
    const status = document.getElementById('form-status');
    const result = document.getElementById('quote-result');

    // Fill the vehicle dropdown from the data
    VEHICLES.forEach((v) => {
        const opt = make('option', '', v.name);
        opt.value = v.id;
        vehicleSelect.appendChild(opt);
    });

    // Preselect from the link (?vehicle=...) used by the "Enquire" buttons
    const preselect = new URLSearchParams(window.location.search).get('vehicle');
    if (preselect) vehicleSelect.value = preselect;

    // Show deposit and term only for finance estimates
    function toggleFinance() {
        financeFields.hidden = typeSelect.value !== 'finance';
    }
    typeSelect.addEventListener('change', toggleFinance);
    toggleFinance();

    // A viewing date cannot be in the past
    const now = new Date();
    dateInput.min = now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0');

    Validate.live(form);

    function buildQuote(vehicle, data) {
        const quote = { vehicle: vehicle, type: data['enquiry-type'], date: data['viewing-date'] };
        if (quote.type === 'finance') {
            const depositPct = Number(data.deposit || 0);
            const months = Number(data.term);
            const deposit = vehicle.price * depositPct / 100;
            const financed = vehicle.price - deposit;
            const r = ANNUAL_RATE / 12;
            quote.depositPct = depositPct;
            quote.deposit = deposit;
            quote.financed = financed;
            quote.months = months;
            quote.monthly = financed * r / (1 - Math.pow(1 + r, -months));
        }
        return quote;
    }

    function renderQuote(q, name) {
        result.replaceChildren();
        result.appendChild(make('h2', '', 'Thank you, ' + name.split(' ')[0]));
        result.appendChild(make('h3', '', q.vehicle.name));

        const list = make('dl', 'result-list');
        const row = (label, value) => {
            list.appendChild(make('dt', '', label));
            list.appendChild(make('dd', '', value));
        };
        row('Price', rand(q.vehicle.price));
        row('Availability', q.vehicle.availability);
        if (q.date) row('Preferred viewing date', q.date);

        if (q.type === 'finance') {
            row('Deposit (' + q.depositPct + '%)', rand(q.deposit));
            row('Amount financed', rand(q.financed));
            row('Term', q.months + ' months');
            row('Estimated monthly instalment', rand(q.monthly));
        }
        result.appendChild(list);

        if (q.type === 'finance') {
            result.appendChild(make('p', '', 'This is an indicative estimate at ' +
                (ANNUAL_RATE * 100).toFixed(2) + '% per year. Final terms depend on credit approval.'));
        }
        result.appendChild(make('p', '', 'A member of our team will contact you shortly.'));
        result.hidden = false;
        result.focus();
        result.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // AJAX submission with fetch (the page does not reload)
    async function sendToServer(data) {
        if (ENDPOINT.includes('YOUR_FORM_ID')) return { ok: true }; // not set up yet
        const response = await fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(data)
        });
        return { ok: response.ok };
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!Validate.validateForm(form)) {
            status.textContent = 'Please fix the highlighted fields and try again.';
            return;
        }

        const data = Object.fromEntries(new FormData(form).entries());
        const vehicle = VEHICLES.find((v) => v.id === data.vehicle);
        status.textContent = 'Sending your enquiry...';

        try {
            const response = await sendToServer(data);
            if (!response.ok) throw new Error('Server error');
            status.textContent = 'Your enquiry was sent successfully.';
            renderQuote(buildQuote(vehicle, data), data.name);
        } catch (err) {
            status.textContent = 'Sorry, we could not send your enquiry. Please try again or use the contact page.';
        }
    });

    form.addEventListener('reset', () => {
        result.hidden = true;
        status.textContent = '';
        Validate.clear(form);
        setTimeout(toggleFinance, 0);
    });
})();