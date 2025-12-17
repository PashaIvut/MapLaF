// ============================================================================
// ВАЛИДАЦИЯ И ФОРМАТИРОВАНИЕ
// ============================================================================

function validateRequired(value, fieldName) {
    if (!value || value.trim() === '') {
        throw new Error(`Поле "${fieldName}" обязательно для заполнения`);
    }
    return value.trim();
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error('Некорректный email адрес');
    }
    return email.toLowerCase().trim();
}

function validatePhone(phone) {
    if (!phone || phone.trim() === '') {
        return null;
    }
    
    const phoneRegex = /^8-\d{3}-\d{3}-\d{2}-\d{2}$/;
    if (!phoneRegex.test(phone.trim())) {
        throw new Error('Телефон должен быть в формате 8-XXX-XXX-XX-XX');
    }
    
    return phone.trim();
}

function formatPhoneInput(value, inputElement) {
    const digitsOnly = value.replace(/\D/g, '');
    
    if (digitsOnly.length === 0) return '';
    
    let limited = digitsOnly.substring(0, 11);
    if (limited[0] !== '8') {
        limited = '8' + limited.substring(0, 10);
    }
    
    let formatted = '';
    if (limited.length <= 1) {
        formatted = limited;
    } else if (limited.length <= 4) {
        formatted = `${limited.substring(0, 1)}-${limited.substring(1)}`;
    } else if (limited.length <= 7) {
        formatted = `${limited.substring(0, 1)}-${limited.substring(1, 4)}-${limited.substring(4)}`;
    } else if (limited.length <= 9) {
        formatted = `${limited.substring(0, 1)}-${limited.substring(1, 4)}-${limited.substring(4, 7)}-${limited.substring(7)}`;
    } else {
        formatted = `${limited.substring(0, 1)}-${limited.substring(1, 4)}-${limited.substring(4, 7)}-${limited.substring(7, 9)}-${limited.substring(9, 11)}`;
    }
    
    if (inputElement) {
        const cursorPosition = inputElement.selectionStart;
        const oldLength = value.length;
        const newLength = formatted.length;
        const lengthDiff = newLength - oldLength;
        
        setTimeout(() => {
            let newCursorPosition = cursorPosition + lengthDiff;
            if (formatted[cursorPosition] === '-') {
                newCursorPosition = cursorPosition + 1;
            }
            inputElement.setSelectionRange(newCursorPosition, newCursorPosition);
        }, 0);
    }
    
    return formatted;
}
