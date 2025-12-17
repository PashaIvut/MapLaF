// ============================================================================
// ОСНОВНАЯ ЛОГИКА ПРИЛОЖЕНИЯ
// ============================================================================

function showSection(section) {
    [foundSection, lostSection, addFoundSection, addLostSection, 
     document.getElementById('my-found-section'), document.getElementById('my-lost-section'),
     document.getElementById('my-claimed-section')].forEach(s => {
        if (s) s.classList.add('hidden');
    });
    
    [navFound, navLost].forEach(btn => {
        if (btn) btn.classList.remove('active');
    });
    
    if (nearbyMode) {
        nearbyMode = false;
        const findNearbyBtn = getElementById('find-nearby-btn');
        if (findNearbyBtn) {
            findNearbyBtn.style.background = '#667eea';
            findNearbyBtn.textContent = '📍 Вещи рядом';
        }
        if (foundItemsMap && nearbySearchMarker) {
            foundItemsMap.geoObjects.remove(nearbySearchMarker);
            nearbySearchMarker = null;
        }
        if (foundItemsMap && nearbySearchCircle) {
            foundItemsMap.geoObjects.remove(nearbySearchCircle);
            nearbySearchCircle = null;
        }
    }
    if (nearbyModeLost) {
        nearbyModeLost = false;
        const findNearbyLostBtn = getElementById('find-nearby-lost-btn');
        if (findNearbyLostBtn) {
            findNearbyLostBtn.style.background = '#667eea';
            findNearbyLostBtn.textContent = '📍 Вещи рядом';
        }
        if (lostItemsMap && nearbySearchMarkerLost) {
            lostItemsMap.geoObjects.remove(nearbySearchMarkerLost);
            nearbySearchMarkerLost = null;
        }
        if (lostItemsMap && nearbySearchCircleLost) {
            lostItemsMap.geoObjects.remove(nearbySearchCircleLost);
            nearbySearchCircleLost = null;
        }
    }
    
    const config = SECTIONS[section];
    if (!config) return;
    
    const sectionElement = document.getElementById(config.section);
    
    sectionElement.classList.remove('hidden');
    
    if (section === 'found' && navFound) {
        navFound.classList.add('active');
    } else if (section === 'lost' && navLost) {
        navLost.classList.add('active');
    }
    
    const actionMap = {
        'loadFoundItems': loadFoundItems,
        'loadLostItems': loadLostItems,
        'loadMyFoundItems': loadMyFoundItems,
        'loadMyLostItems': loadMyLostItems,
        'loadMyClaimedFoundItems': loadMyClaimedFoundItems,
        'initAddFoundMap': initAddFoundMap,
        'initAddLostMap': initAddLostMap
    };
    
    const action = actionMap[config.action];
    if (action) action();
}

async function initAddFoundMap() {
    if (foundMap) {
        foundMap.geoObjects.removeAll();
        foundMapMarker = null;
        foundMapCoords = null;
        return;
    }
    
    foundMap = await initYandexMap('found-map');
    
    const searchControl = new ymaps.control.SearchControl({
        options: {
            placeholder: 'Найти город или адрес',
            size: 'large',
            noPlacemark: true
        }
    });
    foundMap.controls.add(searchControl);
    
    searchControl.events.add('resultselect', (e) => {
        const index = e.get('index');
        const results = searchControl.getResultsArray();
        if (results[index]) {
            const coords = results[index].geometry.getCoordinates();
            foundMapCoords = { lat: coords[0], lng: coords[1] };
            foundMap.setCenter(coords, 16);
            
            const marker = new ymaps.Placemark(coords, {}, {
                preset: 'islands#blueDotIcon',
                draggable: true
            });
            
            foundMap.geoObjects.removeAll();
            foundMap.geoObjects.add(marker);
            foundMapMarker = marker;
            
            updateFoundAddressFromCoords(coords);
            
            marker.events.add('dragend', () => {
                const newCoords = marker.geometry.getCoordinates();
                foundMapCoords = { lat: newCoords[0], lng: newCoords[1], address: foundMapCoords?.address || null };
                updateFoundAddressFromCoords(newCoords);
            });
        }
    });
    
    const updateFoundAddressFromCoords = (coords) => {
        ymaps.geocode(coords, { results: 1 }).then((res) => {
            const firstGeoObject = res.geoObjects.get(0);
            if (firstGeoObject) {
                const address = firstGeoObject.getAddressLine();
                if (foundMapCoords) {
                    foundMapCoords.address = address;
                }
                const addressText = getElementById('found-address-text');
                const addressContainer = getElementById('found-selected-address');
                if (addressText && addressContainer) {
                    addressText.textContent = address;
                    addressContainer.style.display = 'block';
                }
            }
        });
    };
    
    foundMap.events.add('click', (e) => {
        const coords = e.get('coords');
        foundMapCoords = { lat: coords[0], lng: coords[1], address: null };
        
        
        const marker = new ymaps.Placemark(coords, {}, {
            preset: 'islands#blueDotIcon',
            draggable: true
        });
        
        foundMap.geoObjects.removeAll();
        foundMap.geoObjects.add(marker);
        foundMapMarker = marker;
        
        updateFoundAddressFromCoords(coords);
        
        marker.events.add('dragend', () => {
            const newCoords = marker.geometry.getCoordinates();
            foundMapCoords = { lat: newCoords[0], lng: newCoords[1] };
            updateFoundAddressFromCoords(newCoords);
        });
    });
}

async function initAddLostMap() {
    if (lostMap) {
        lostMap.geoObjects.removeAll();
        lostMapMarker = null;
        lostMapCoords = null;
        return;
    }
    
    lostMap = await initYandexMap('lost-map');
    
    const searchControl = new ymaps.control.SearchControl({
        options: {
            placeholder: 'Найти город или адрес',
            size: 'large',
            noPlacemark: true
        }
    });
    lostMap.controls.add(searchControl);
    
    searchControl.events.add('resultselect', (e) => {
        const index = e.get('index');
        const results = searchControl.getResultsArray();
        if (results[index]) {
            const coords = results[index].geometry.getCoordinates();
            lostMapCoords = { lat: coords[0], lng: coords[1] };
            lostMap.setCenter(coords, 16);
            
            const marker = new ymaps.Placemark(coords, {}, {
                preset: 'islands#redDotIcon',
                draggable: true
            });
            
            lostMap.geoObjects.removeAll();
            lostMap.geoObjects.add(marker);
            lostMapMarker = marker;
            
            updateLostAddressFromCoords(coords);
            
            marker.events.add('dragend', () => {
                const newCoords = marker.geometry.getCoordinates();
                lostMapCoords = { lat: newCoords[0], lng: newCoords[1], address: lostMapCoords?.address || null };
                updateLostAddressFromCoords(newCoords);
            });
        }
    });
    
    const updateLostAddressFromCoords = (coords) => {
        ymaps.geocode(coords, { results: 1 }).then((res) => {
            const firstGeoObject = res.geoObjects.get(0);
            if (firstGeoObject) {
                const address = firstGeoObject.getAddressLine();
                if (lostMapCoords) {
                    lostMapCoords.address = address;
                }
                const addressText = getElementById('lost-address-text');
                const addressContainer = getElementById('lost-selected-address');
                if (addressText && addressContainer) {
                    addressText.textContent = address;
                    addressContainer.style.display = 'block';
                }
            }
        });
    };
    
    lostMap.events.add('click', (e) => {
        const coords = e.get('coords');
        lostMapCoords = { lat: coords[0], lng: coords[1], address: null };
        
        
        const marker = new ymaps.Placemark(coords, {}, {
            preset: 'islands#redDotIcon',
            draggable: true
        });
        
        lostMap.geoObjects.removeAll();
        lostMap.geoObjects.add(marker);
        lostMapMarker = marker;
        
        updateLostAddressFromCoords(coords);
        
        marker.events.add('dragend', () => {
            const newCoords = marker.geometry.getCoordinates();
            lostMapCoords = { lat: newCoords[0], lng: newCoords[1] };
            updateLostAddressFromCoords(newCoords);
        });
    });
}

async function handleUrlTokens() {
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get('reset-password');
    
    if (resetToken) {
        showResetPasswordForm(resetToken);
    }
}

function updateUI() {
    if (!currentUser) {
        auth.classList.remove('hidden');
        app.classList.add('hidden');
        clearFieldErrors();
        if (nameInput) nameInput.value = '';
        if (passwordInput) passwordInput.value = '';
        return;
    }
    
    auth.classList.add('hidden');
    app.classList.remove('hidden');
    const userNameText = document.querySelector('.user-name-text');
    if (userNameText) {
        userNameText.textContent = currentUser.name;
    } else {
    userName.textContent = currentUser.name;
    }
    
    const isAdmin = currentUser.role === 'admin';
    
    const addBtn = document.getElementById('add-btn');
    if (addBtn) {
        addBtn.style.display = isAdmin ? 'none' : '';
    }
    
    const navMyFound = document.getElementById('nav-my-found');
    const navMyLost = document.getElementById('nav-my-lost');
    const navMyClaimed = document.getElementById('nav-my-claimed');
    
    if (navMyFound) {
        navMyFound.style.display = isAdmin ? 'none' : '';
    }
    if (navMyLost) {
        navMyLost.style.display = isAdmin ? 'none' : '';
    }
    if (navMyClaimed) {
        navMyClaimed.style.display = 'none';
    }
    
    showSection('found');
}

// ============================================================================
// ИНИЦИАЛИЗАЦИЯ И ОБРАБОТЧИКИ СОБЫТИЙ
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        if (!currentUser.role) {
            currentUser.role = 'user';
        }
    }
    updateUI();
    
    setupSearchHandlers('found-search', 'found-search-clear', 'found-section', loadFoundItems, 'currentFoundSearchQuery');
    setupSearchHandlers('lost-search', 'lost-search-clear', 'lost-section', loadLostItems, 'currentLostSearchQuery');
    
    if (registerBtn) {
        registerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showRegisterModal();
        });
    }
    
    if (loginBtn) {
        loginBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            if (nameInput) nameInput.setCustomValidity('');
            if (passwordInput) passwordInput.setCustomValidity('');
            
            if (!nameInput || !nameInput.value || !nameInput.value.trim()) {
                if (nameInput) {
                    nameInput.setCustomValidity('Вы пропустили это поле!');
                    nameInput.focus();
                    nameInput.reportValidity();
                }
                return;
            }
            const name = nameInput.value.trim();
            
            if (!passwordInput || !passwordInput.value || !passwordInput.value.trim()) {
                if (passwordInput) {
                    passwordInput.setCustomValidity('Вы пропустили это поле!');
                    passwordInput.focus();
                    passwordInput.reportValidity();
                }
                return;
            }
            const passwordValue = passwordInput.value.trim();
            
            try {
                const result = await login(name, passwordValue);
                currentUser = result.user;
                localStorage.setItem('currentUser', JSON.stringify(result.user));
                localStorage.setItem('token', result.token);
                updateUI();
            } catch (err) {
                let errorMessage = 'Произошла ошибка';
                if (err.message) {
                    errorMessage = err.message;
                    if (errorMessage.toLowerCase().includes('unexpected error')) {
                        if (err.originalError && err.originalError.message) {
                            errorMessage = err.originalError.message;
                        } else if (err.cause && err.cause.message) {
                            errorMessage = err.cause.message;
                        }
                    }
                } else if (err.errors && err.errors[0] && err.errors[0].message) {
                    errorMessage = err.errors[0].message;
                } else if (typeof err === 'string') {
                    errorMessage = err;
                }
                
                const errorLower = errorMessage.toLowerCase();
                
                if (errorLower.includes('неверный никнейм') || 
                    errorLower.includes('неверное имя') || 
                    errorLower.includes('никнейм') || 
                    (errorLower.includes('имя') && errorLower.includes('пользователя'))) {
                    if (nameInput) {
                        nameInput.setCustomValidity(errorMessage);
                        nameInput.focus();
                        nameInput.reportValidity();
                    }
                    return;
                }
                
                if (errorLower.includes('неверный') && errorLower.includes('имя')) {
                    if (nameInput) {
                        nameInput.setCustomValidity(errorMessage);
                        nameInput.focus();
                        nameInput.reportValidity();
                    }
                    return;
                }
                
                if (errorLower.includes('имя') && 
                    !errorLower.includes('email') && 
                    !errorLower.includes('пароль') && 
                    !errorLower.includes('password')) {
                    if (nameInput) {
                        nameInput.setCustomValidity(errorMessage);
                        nameInput.focus();
                        nameInput.reportValidity();
                    }
                    return;
                }
                
                if (errorLower.includes('пароль') || errorLower.includes('password')) {
                    if (passwordInput) {
                        passwordInput.setCustomValidity(errorMessage);
                        passwordInput.focus();
                        passwordInput.reportValidity();
                    }
                    return;
                }
                
                if (errorLower.includes('никнейм') || errorLower.includes('name')) {
                    if (nameInput) {
                        nameInput.setCustomValidity(errorMessage);
                        nameInput.focus();
                        nameInput.reportValidity();
                    }
                    return;
                }
                
                if (nameInput) {
                    nameInput.setCustomValidity(errorMessage);
                    nameInput.focus();
                    nameInput.reportValidity();
                }
            }
        });
    }
    
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            showPasswordResetForm();
        });
    }
    
    handleUrlTokens();
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            currentUser = null;
            localStorage.removeItem('currentUser');
            localStorage.removeItem('token');
            updateUI();
        });
    }
    
    if (navFound) navFound.addEventListener('click', () => showSection('found'));
    if (navLost) navLost.addEventListener('click', () => showSection('lost'));
    if (navMyFound) navMyFound.addEventListener('click', () => showSection('my-found'));
    if (navMyLost) navMyLost.addEventListener('click', () => showSection('my-lost'));
    if (navMyClaimed) navMyClaimed.addEventListener('click', () => showSection('my-claimed'));
    if (navAddFound) navAddFound.addEventListener('click', () => showSection('add-found'));
    if (navAddLost) navAddLost.addEventListener('click', () => showSection('add-lost'));
    
    setupNearbyModeToggle('find-nearby-btn', false, 'foundItemsMap', 'nearbySearchMarker', 'nearbySearchCircle', loadFoundItems);
    setupNearbyModeToggle('find-nearby-lost-btn', true, 'lostItemsMap', 'nearbySearchMarkerLost', 'nearbySearchCircleLost', loadLostItems);
    
    const foundPhotosInput = getElementById('found-photos');
    if (foundPhotosInput) {
        foundPhotosInput.addEventListener('change', () => {
            showPhotoPreview('found-photos', 'found-photos-preview');
        });
    }
    
    const lostPhotosInput = getElementById('lost-photos');
    if (lostPhotosInput) {
        lostPhotosInput.addEventListener('change', () => {
            showPhotoPreview('lost-photos', 'lost-photos-preview');
        });
    }
    
    
    setupPhoneInputHandlers('found-phone');
    setupPhoneInputHandlers('lost-phone');
    
    if (addFoundForm) {
        addFoundForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const foundPhoneInput = getElementById('found-phone');
            if (foundPhoneInput) {
                foundPhoneInput.setCustomValidity('');
            }
            
            try {
                const title = validateRequired(getElementById('found-title').value, 'Название');
                const description = validateRequired(getElementById('found-description').value, 'Описание');
                
                const phoneInput = getElementById('found-phone').value.trim();
                if (!phoneInput) {
                    return;
                }
                if (foundPhoneInput) {
                    foundPhoneInput.setCustomValidity('');
                }
                let phone = null;
                try {
                    phone = validatePhone(phoneInput);
                    if (foundPhoneInput) {
                        foundPhoneInput.setCustomValidity('');
                    }
                } catch (phoneErr) {
                    if (foundPhoneInput) {
                        foundPhoneInput.classList.add('error');
                        foundPhoneInput.setCustomValidity(phoneErr.message);
                        foundPhoneInput.reportValidity();
                    }
                    return;
                }
                
                if (!foundMapCoords) {
                    showToast('Пожалуйста, укажите место на карте', 'error');
                    return;
                }
                
                const latitude = foundMapCoords.lat;
                const longitude = foundMapCoords.lng;
                const address = foundMapCoords.address || null;
                
                const photos = await getPhotosFromInput('found-photos');
                
                await createFoundItem(title, description, latitude, longitude, address || null, currentUser.id, phone || null, photos);
                addFoundForm.reset();
                getElementById('found-photos-preview').innerHTML = '';
                if (foundMap) {
                    foundMap.geoObjects.removeAll();
                    foundMapMarker = null;
                    foundMapCoords = null;
                }
                showToast('Объявление успешно создано!', 'success');
                showSection('found');
                loadFoundItems();
            } catch (err) {
                if (!err.message || !err.message.includes('Телефон должен быть')) {
                handleError(err);
                }
            }
        });
    }
    
    if (addLostForm) {
        addLostForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const lostPhoneInput = getElementById('lost-phone');
            if (lostPhoneInput) {
                lostPhoneInput.setCustomValidity('');
            }
            try {
                const title = validateRequired(getElementById('lost-title').value, 'Название');
                const description = validateRequired(getElementById('lost-description').value, 'Описание');
                
                const phoneInput = getElementById('lost-phone').value.trim();
                if (!phoneInput) {
                    return;
                }
                
                let phone = null;
                try {
                    phone = validatePhone(phoneInput);
                } catch (phoneErr) {
                    if (lostPhoneError) {
                        lostPhoneError.textContent = phoneErr.message;
                    }
                    if (lostPhoneInput) {
                        lostPhoneInput.classList.add('error');
                        lostPhoneInput.setCustomValidity(phoneErr.message);
                        lostPhoneInput.reportValidity();
                    }
                    return;
                }
                
                if (!lostMapCoords) {
                    showToast('Пожалуйста, укажите место на карте', 'error');
                    return;
                }
                
                const latitude = lostMapCoords.lat;
                const longitude = lostMapCoords.lng;
                const address = lostMapCoords.address || null;
                
                const photos = await getPhotosFromInput('lost-photos');
                
                await createLostItem(title, description, latitude, longitude, address || null, currentUser.id, phone || null, photos);
                addLostForm.reset();
                getElementById('lost-photos-preview').innerHTML = '';
                if (lostMap) {
                    lostMap.geoObjects.removeAll();
                    lostMapMarker = null;
                    lostMapCoords = null;
                }
                showToast('Объявление успешно создано!', 'success');
                showSection('lost');
                loadLostItems();
            } catch (err) {
                if (!err.message || !err.message.includes('Телефон должен быть')) {
                handleError(err);
                }
            }
        });
    }
    
    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
        });
    }
});
