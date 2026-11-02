
const Validate = (function () {
    function getError(field) {
        if (field.type === 'checkbox') {
            return field.required && !field.checked ? 'You must agree to continue.' : '';
        }

        const value = field.value.trim();
        if (field.required && !value) return 'This field is required.';
        if (!value) return '';

        switch (field.dataset.validate) {
            case 'name':
                return /^[A-Za-zÀ-ÿ'’\- ]{2,60}$/.test(value)
                    ? '' : 'Enter your full name using letters only (2 to 60 characters).';
            case 'email':
                return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
                    ? '' : 'Enter a valid email address, e.g. name@example.com.';
            case 'phone':
                return /^(\+27|0)[1-9]\d{8}$/.test(value.replace(/[\s-]/g, ''))
                    ? '' : 'Enter a valid South African number, e.g. 082 123 4567.';
            case 'message':
                if (value.length < 10) return 'Please write at least 10 characters.';
                if (value.length > 500) return 'Please keep your message under 500 characters.';
                return '';
            case 'deposit': {
                const n = Number(value);
                return Number.isFinite(n) && n >= 0 && n <= 90
                    ? '' : 'Enter a deposit between 0 and 90 percent.';
            }
            case 'date': {
                const chosen = new Date(value + 'T00:00:00');
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return chosen >= today ? '' : 'Please choose today or a future date.';
            }
            default:
                return '';
        }
    }

    function setState(field, message) {
        const out = document.getElementById(field.id + '-error');
        field.setAttribute('aria-invalid', message ? 'true' : 'false');
        field.classList.toggle('invalid', Boolean(message));
        if (out) out.textContent = message;
        return !message;
    }

    function validateField(field) {
        return setState(field, getError(field));
    }

    // Fields that are currently visible (hidden finance fields are skipped)
    function fields(form) {
        return [...form.querySelectorAll('input, select, textarea')]
            .filter((f) => f.type !== 'hidden' && !f.closest('[hidden]'));
    }

    function validateForm(form) {
        let firstInvalid = null;
        fields(form).forEach((f) => {
            if (!validateField(f) && !firstInvalid) firstInvalid = f;
        });
        if (firstInvalid) firstInvalid.focus();
        return !firstInvalid;
    }

    // Check a field when the user leaves it, and re-check as they fix it
    function live(form) {
        form.querySelectorAll('input, select, textarea').forEach((f) => {
            f.addEventListener('blur', () => { if (!f.closest('[hidden]')) validateField(f); });
            f.addEventListener('input', () => { if (f.classList.contains('invalid')) validateField(f); });
            f.addEventListener('change', () => { if (f.classList.contains('invalid')) validateField(f); });
        });
    }

    // Remove all error messages (used when the form is reset)
    function clear(form) {
        form.querySelectorAll('input, select, textarea').forEach((f) => {
            f.classList.remove('invalid');
            f.setAttribute('aria-invalid', 'false');
            const out = document.getElementById(f.id + '-error');
            if (out) out.textContent = '';
        });
    }

    return { validateField, validateForm, live, clear };
})();