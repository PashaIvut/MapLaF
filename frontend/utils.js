// ============================================================================
// УТИЛИТЫ И ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================================

function showToast(message, type = 'info', duration = 5000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ'
    };
    
    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-icon">${icons[type] || icons.info}</div>
            <div class="toast-message">${message}</div>
            <button class="toast-close" aria-label="Закрыть">×</button>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    const closeBtn = toast.querySelector('.toast-close');
    const closeToast = () => {
        toast.classList.add('slide-out');
        setTimeout(() => {
            toast.remove();
        }, 300);
    };
    
    closeBtn.addEventListener('click', closeToast);
    
    if (duration > 0) {
        setTimeout(closeToast, duration);
    }
    
    return toast;
}

function getElementById(id) {
    return document.getElementById(id);
}

function showMessage(element, message, type = 'info') {
    element.innerHTML = `<div class="message ${type}">${message}</div>`;
}

function formatLocationText(item) {
    if (!item.location) return 'Место не указано';
    if (item.location.address) return item.location.address;
    if (item.location.latitude && item.location.longitude) {
        return `(${item.location.latitude.toFixed(4)}, ${item.location.longitude.toFixed(4)})`;
    }
    return 'Адрес указан';
}

function setupPhoneInputHandlers(inputId) {
    const phoneInput = getElementById(inputId);
    if (!phoneInput) return;
    
    phoneInput.addEventListener('input', (e) => {
        const oldValue = e.target.value;
        const newValue = formatPhoneInput(oldValue, e.target);
        if (oldValue !== newValue) {
            e.target.value = newValue;
        }
        
        const phoneValue = e.target.value.trim();
        if (phoneValue && phoneValue !== '8') {
            try {
                validatePhone(phoneValue);
                e.target.classList.remove('error');
                e.target.setCustomValidity('');
            } catch (phoneErr) {
                e.target.classList.add('error');
                e.target.setCustomValidity(phoneErr.message);
                e.target.reportValidity();
            }
        } else {
            e.target.classList.remove('error');
            e.target.setCustomValidity('');
        }
    });
    
    phoneInput.addEventListener('focus', (e) => {
        if (e.target.value && e.target.value.trim() !== '') {
            e.target.classList.remove('error');
            e.target.setCustomValidity('');
        }
    });
    
    phoneInput.addEventListener('keydown', (e) => {
        if ((!e.target.value || e.target.value.trim() === '') && 
            e.keyCode >= 48 && e.keyCode <= 57) {
            e.preventDefault();
            e.target.value = '8-' + String.fromCharCode(e.keyCode);
            return;
        }
        
        if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
            (e.keyCode === 65 && e.ctrlKey === true) ||
            (e.keyCode === 67 && e.ctrlKey === true) ||
            (e.keyCode === 86 && e.ctrlKey === true) ||
            (e.keyCode === 88 && e.ctrlKey === true) ||
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            return;
        }
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
}

function setupSearchHandlers(inputId, clearId, section, loadFunction, queryVar) {
    const searchInput = getElementById(inputId);
    const searchClear = getElementById(clearId);
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        window[queryVar] = query;
        
        if (searchClear) {
            searchClear.style.display = query ? 'flex' : 'none';
        }
        
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const sectionEl = getElementById(section);
            if (sectionEl && !sectionEl.classList.contains('hidden')) {
                loadFunction(query || null);
            }
        }, 300);
    });
    
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            clearTimeout(searchTimeout);
            const sectionEl = getElementById(section);
            if (sectionEl && !sectionEl.classList.contains('hidden')) {
                loadFunction(window[queryVar] || null);
            }
        }
    });
    
    if (searchClear) {
        searchClear.addEventListener('click', () => {
            searchInput.value = '';
            window[queryVar] = '';
            searchClear.style.display = 'none';
            const sectionEl = getElementById(section);
            if (sectionEl && !sectionEl.classList.contains('hidden')) {
                loadFunction();
            }
        });
    }
}

function setupNearbyModeToggle(btnId, isLost, mapVar, markerVar, circleVar, loadFunction) {
    const btn = getElementById(btnId);
    if (!btn) return;
    
    btn.addEventListener('click', () => {
        const modeVar = isLost ? 'nearbyModeLost' : 'nearbyMode';
        window[modeVar] = !window[modeVar];
        
        if (window[modeVar]) {
            btn.style.background = '#27ae60';
            btn.textContent = '📍 Отменить поиск';
            showToast('Кликните на карте, чтобы найти вещи рядом', 'info');
        } else {
            btn.style.background = '#667eea';
            btn.textContent = '📍 Вещи рядом';
            const map = window[mapVar];
            const marker = window[markerVar];
            const circle = window[circleVar];
            if (map && marker) {
                map.geoObjects.remove(marker);
                window[markerVar] = null;
            }
            if (map && circle) {
                map.geoObjects.remove(circle);
                window[circleVar] = null;
            }
            loadFunction();
        }
    });
}

function setupNearbySearchClick(map, isLost = false) {
    map.events.add('click', (e) => {
        const nearbyModeActive = isLost ? nearbyModeLost : nearbyMode;
        if (!nearbyModeActive) return;
        
        const coords = e.get('coords');
        const latitude = coords[0];
        const longitude = coords[1];
        
        let currentMarker = isLost ? nearbySearchMarkerLost : nearbySearchMarker;
        let currentCircle = isLost ? nearbySearchCircleLost : nearbySearchCircle;
        
        if (currentMarker) {
            map.geoObjects.remove(currentMarker);
        }
        if (currentCircle) {
            map.geoObjects.remove(currentCircle);
        }
        
        const marker = new ymaps.Placemark(coords, {
            balloonContent: 'Точка поиска'
        }, {
            preset: 'islands#redIcon',
            draggable: false
        });
        map.geoObjects.add(marker);
        
        const radius = 0.01;
        const circle = new ymaps.Circle([coords, radius], {}, {
            fillColor: '#667eea',
            fillOpacity: 0.2,
            strokeColor: '#667eea',
            strokeWidth: 2
        });
        map.geoObjects.add(circle);
        
        if (isLost) {
            nearbySearchMarkerLost = marker;
            nearbySearchCircleLost = circle;
            findNearbyLostItems(latitude, longitude, radius);
        } else {
            nearbySearchMarker = marker;
            nearbySearchCircle = circle;
            findNearbyItems(latitude, longitude, radius);
        }
    });
}

function showPhotoPreview(inputId, previewId) {
    const input = getElementById(inputId);
    const preview = getElementById(previewId);
    
    if (!input || !preview) return;
    
    preview.innerHTML = '';
    
    if (input.files && input.files.length > 0) {
        Array.from(input.files).forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.width = '100px';
                img.style.height = '100px';
                img.style.objectFit = 'cover';
                img.style.margin = '5px';
                img.style.borderRadius = '4px';
                preview.appendChild(img);
            };
            reader.readAsDataURL(file);
        });
    }
}

async function getPhotosFromInput(inputId) {
    const input = getElementById(inputId);
    if (!input || !input.files || input.files.length === 0) {
        return [];
    }
    
    const photos = [];
    const maxSize = 5 * 1024 * 1024;
    
    for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        
        if (file.size > maxSize * 2) {
            throw new Error(`Фотография "${file.name}" слишком большая. Максимальный размер: 10MB.`);
        }
        
        try {
            if (file.type.startsWith('image/')) {
                const compressedBlob = await compressImage(file);
                const base64 = await convertFileToBase64(compressedBlob);
                
                if (base64.length > maxSize * 2) {
                    const moreCompressed = await compressImage(file, 1280, 1280, 0.6);
                    const base64Compressed = await convertFileToBase64(moreCompressed);
                    photos.push(base64Compressed);
                } else {
                    photos.push(base64);
                }
            } else {
                const base64 = await convertFileToBase64(file);
                photos.push(base64);
            }
        } catch (err) {
            throw new Error(`Ошибка при обработке фотографии "${file.name}": ${err.message}`);
        }
    }
    
    return photos;
}
