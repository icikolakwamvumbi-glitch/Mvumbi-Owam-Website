
(function () {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // The email will be addressed to this. Put YOUR OWN email here while testing.
    const RECIPIENT = 'sales@veloramotors.example';

    const preview = document.getElementById('email-preview');
    const text = document.getElementById('email-text');
    const sendLink = document.getElementById('send-email');
    const message = document.getElementById('message');
    const counter = document.getElementById('message-count');

    Validate.live(form);

    // Live character counter
    message.addEventListener('input', () => {
        counter.textContent = message.value.length + ' / 500';
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!Validate.validateForm(form)) return;

        const data = Object.fromEntries(new FormData(form).entries());
        const subject = '[' + data['message-type'] + '] Message from ' + data.name;
        const body =
            'Name: ' + data.name + '\n' +
            'Email: ' + data.email + '\n' +
            'Phone: ' + (data.phone || 'Not provided') + '\n' +
            'Type: ' + data['message-type'] + '\n\n' +
            data.message;

        // Show the compiled email on the page
        text.textContent = 'To: ' + RECIPIENT + '\nSubject: ' + subject + '\n\n' + body;

        // Build the link the customer clicks to send it from their email app
        sendLink.href = 'mailto:' + RECIPIENT +
            '?subject=' + encodeURIComponent(subject) +
            '&body=' + encodeURIComponent(body);

        preview.hidden = false;
        preview.focus();
        preview.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    form.addEventListener('reset', () => {
        preview.hidden = true;
        counter.textContent = '0 / 500';
        Validate.clear(form);
    });
})();