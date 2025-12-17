// ============================================================================
// UI КОМПОНЕНТЫ 
// ============================================================================

function createItemElement(item, type) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item';
    if (item.isReturned) {
        itemDiv.classList.add('returned');
    }
    itemDiv.style.cursor = 'pointer';
    
    const locationText = formatLocationText(item);
    
    const photosHtml = item.photos && item.photos.length > 0
        ? (() => {
            const maxVisible = 5;
            const visiblePhotos = item.photos.slice(0, maxVisible);
            const remainingCount = item.photos.length - maxVisible;
            const photosHtml = visiblePhotos.map((photo, index) => 
                `<img loading="lazy" src="${photo}" alt="Фото" class="item-photo" data-photo-index="${index}" style="width: 60px; height: 60px; object-fit: cover; margin: 2px; border-radius: 4px; cursor: pointer; transition: transform 0.2s;" title="Нажмите для увеличения">`
            ).join('');
            const moreHtml = remainingCount > 0 
                ? `<div class="item-photo-more" style="width: 60px; height: 60px; margin: 2px; border-radius: 4px; background: rgba(0, 0, 0, 0.5); color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; cursor: pointer; border: 2px solid #e0e0e0;" title="Еще ${remainingCount} фото">+${remainingCount}</div>`
                : '';
            return `<div class="item-photos-preview" data-item-photos='${JSON.stringify(item.photos)}' style="display: flex; flex-wrap: wrap; align-items: center;">${photosHtml}${moreHtml}</div>`;
        })()
        : '';
    
    const phoneHtml = item.phone ? item.phone : '';
    
    if (type === 'found') {
        const status = item.isReturned ? 'returned' : 'available';
        const statusText = item.isReturned ? 'Возвращено' : 'Доступно';
        
        itemDiv.innerHTML = `
            <div class="item-header">
            <h3>${item.title}</h3>
                <span class="status ${status}">${statusText}</span>
            </div>
            ${photosHtml}
            <p class="item-description">${item.description || 'Нет описания'}</p>
            <div class="item-info">
                <div class="info-row">
                    <span class="info-icon">📅</span>
                    <span>Найдено: ${new Date(parseInt(item.foundAt)).toLocaleString('ru-RU')}</span>
                </div>
                <div class="info-row">
                    <span class="info-icon">👤</span>
                    <span>Нашел: ${item.foundBy.name}</span>
                </div>
                <div class="info-row">
                    <span class="info-icon">📍</span>
                    <span>${locationText}</span>
                </div>
                ${phoneHtml ? `<div class="info-row">
                    <span class="info-icon">📞</span>
                    <span>${item.phone}</span>
                </div>` : ''}
            </div>
        `;
    } else {
        const status = item.isFound ? 'found' : 'available';
        const statusText = item.isFound ? 'Найдено' : 'Ищется';
        const foundItem = item.foundItem ? ` (${item.foundItem.title})` : '';
        
        itemDiv.innerHTML = `
            <div class="item-header">
            <h3>${item.title}</h3>
                <span class="status ${status}">${statusText}${foundItem}</span>
            </div>
            ${photosHtml}
            <p class="item-description">${item.description}</p>
            <div class="item-info">
                <div class="info-row">
                    <span class="info-icon">📅</span>
                    <span>Потеряно: ${new Date(parseInt(item.lostAt)).toLocaleString('ru-RU')}</span>
                </div>
                <div class="info-row">
                    <span class="info-icon">👤</span>
                    <span>Потерял: ${item.lostBy.name}</span>
                </div>
                <div class="info-row">
                    <span class="info-icon">📍</span>
                    <span>${locationText}</span>
                </div>
                ${phoneHtml ? `<div class="info-row">
                    <span class="info-icon">📞</span>
                    <span>${item.phone}</span>
                </div>` : ''}
            </div>
        `;
    }
    
    const photoElements = itemDiv.querySelectorAll('.item-photo');
    const allPhotos = item.photos || [];
    
    if (photoElements.length > 0 && allPhotos.length > 0) {
        photoElements.forEach((photoEl) => {
            photoEl.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                
                const index = parseInt(this.getAttribute('data-photo-index')) || 0;
                if (allPhotos.length > 0 && index >= 0 && index < allPhotos.length) {
                    showPhotoModal(allPhotos, index);
                }
            }, true);
            
            photoEl.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const index = parseInt(this.getAttribute('data-photo-index')) || 0;
                if (allPhotos.length > 0 && index >= 0 && index < allPhotos.length) {
                    showPhotoModal(allPhotos, index);
                }
            });
        });
    }
    
    itemDiv.addEventListener('click', (e) => {
        if (!e.target.classList.contains('item-photo') && !e.target.closest('.item-photos-preview')) {
            showItemModal(item, type);
        }
    });
    
    return itemDiv;
}

function showPhotoModal(photos, currentIndex = 0) {
    const modal = document.createElement('div');
    modal.className = 'photo-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    `;
    
    const container = document.createElement('div');
    container.style.cssText = `
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    const loadingDiv = document.createElement('div');
    loadingDiv.style.cssText = `
        width: 100px;
        height: 100px;
        border: 4px solid rgba(255, 255, 255, 0.3);
        border-top: 4px solid white;
        border-radius: 50%;
        animation: photo-spin 1s linear infinite;
    `;
    
    if (!document.getElementById('photo-modal-styles')) {
        const style = document.createElement('style');
        style.id = 'photo-modal-styles';
        style.textContent = `
            @keyframes photo-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    const img = document.createElement('img');
    img.style.cssText = `
        max-width: 100%;
        max-height: 90vh;
        object-fit: contain;
        border-radius: 8px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        display: none;
    `;
    
    const imageCache = new Map();
    
    const preloadImage = (index) => {
        if (imageCache.has(index)) return;
        const imgPreload = new Image();
        imgPreload.src = photos[index];
        imageCache.set(index, imgPreload);
    };
    
    const loadPhoto = (index) => {
        if (imageCache.has(index)) {
            img.src = photos[index];
            img.style.display = 'block';
            loadingDiv.style.display = 'none';
            return;
        }
        
        loadingDiv.style.display = 'block';
        img.style.display = 'none';
        
        const newImg = new Image();
        newImg.onload = () => {
            imageCache.set(index, newImg);
            img.src = photos[index];
            img.style.display = 'block';
            loadingDiv.style.display = 'none';
        };
        newImg.onerror = () => {
            loadingDiv.style.display = 'none';
            img.style.display = 'block';
            img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="%23ddd"/><text x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999">Ошибка загрузки</text></svg>';
        };
        newImg.src = photos[index];
    };
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
        position: absolute;
        top: -40px;
        right: 0;
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        font-size: 32px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;
        z-index: 10001;
    `;
    closeBtn.onmouseover = () => closeBtn.style.background = 'rgba(255, 255, 255, 0.3)';
    closeBtn.onmouseout = () => closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
    
    let currentPhotoIndex = currentIndex;
    
    const preloadAdjacent = () => {
        preloadImage(currentPhotoIndex);
        if (photos.length > 1) {
            preloadImage((currentPhotoIndex + 1) % photos.length);
            preloadImage((currentPhotoIndex - 1 + photos.length) % photos.length);
        }
    };
    
    let updatePhoto = () => {
        loadPhoto(currentPhotoIndex);
        preloadAdjacent();
    };
    
    loadPhoto(currentPhotoIndex);
    preloadAdjacent();
    
    const prevBtn = photos.length > 1 ? document.createElement('button') : null;
    const nextBtn = photos.length > 1 ? document.createElement('button') : null;
    
    if (prevBtn) {
        prevBtn.innerHTML = '‹';
        prevBtn.style.cssText = `
            position: absolute;
            left: -50px;
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            font-size: 48px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
        `;
        prevBtn.onmouseover = () => prevBtn.style.background = 'rgba(255, 255, 255, 0.3)';
        prevBtn.onmouseout = () => prevBtn.style.background = 'rgba(255, 255, 255, 0.2)';
        prevBtn.onclick = (e) => {
            e.stopPropagation();
            currentPhotoIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
            updatePhoto();
        };
    }
    
    if (nextBtn) {
        nextBtn.innerHTML = '›';
        nextBtn.style.cssText = `
            position: absolute;
            right: -50px;
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            font-size: 48px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
        `;
        nextBtn.onmouseover = () => nextBtn.style.background = 'rgba(255, 255, 255, 0.3)';
        nextBtn.onmouseout = () => nextBtn.style.background = 'rgba(255, 255, 255, 0.2)';
        nextBtn.onclick = (e) => {
            e.stopPropagation();
            currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
            updatePhoto();
        };
    }
    
    const counter = photos.length > 1 ? document.createElement('div') : null;
    if (counter) {
        counter.style.cssText = `
            position: absolute;
            bottom: -40px;
            left: 50%;
            transform: translateX(-50%);
            color: white;
            font-size: 16px;
            background: rgba(0, 0, 0, 0.5);
            padding: 8px 16px;
            border-radius: 20px;
        `;
        const updateCounter = () => {
            counter.textContent = `${currentPhotoIndex + 1} / ${photos.length}`;
        };
        updateCounter();
        const originalUpdatePhoto = updatePhoto;
        updatePhoto = () => {
            originalUpdatePhoto();
            updateCounter();
        };
    }
    
    let closeModal = () => {
        modal.remove();
        document.body.style.overflow = '';
        document.removeEventListener('keydown', escapeHandler);
    };
    
    const escapeHandler = function(e) {
        if (e.key === 'Escape') {
            closeModal();
        } else if (e.key === 'ArrowLeft' && prevBtn) {
            prevBtn.click();
        } else if (e.key === 'ArrowRight' && nextBtn) {
            nextBtn.click();
        }
    };
    
    const originalCloseModal = closeModal;
    closeModal = () => {
        imageCache.clear();
        originalCloseModal();
    };
    
    closeBtn.onclick = (e) => {
        e.stopPropagation();
        closeModal();
    };
    
    modal.onclick = (e) => {
        if (e.target === modal) {
            closeModal();
        }
    };
    
    document.addEventListener('keydown', escapeHandler);
    
    container.appendChild(loadingDiv);
    container.appendChild(img);
    container.appendChild(closeBtn);
    if (prevBtn) container.appendChild(prevBtn);
    if (nextBtn) container.appendChild(nextBtn);
    if (counter) container.appendChild(counter);
    modal.appendChild(container);
    
    document.body.style.overflow = 'hidden';
    document.body.appendChild(modal);
}

function clearFieldErrors() {
    if (nameError) nameError.textContent = '';
    if (passwordError) passwordError.textContent = '';
    if (error) error.textContent = '';
}

function showFieldError(field, message) {
    clearFieldErrors();
    if (field === 'name' && nameError) {
        nameError.textContent = message;
    } else if (field === 'password' && passwordError) {
        passwordError.textContent = message;
    } else if (error) {
        error.textContent = message;
    }
}

function handleError(err, element = null) {
    const message = err.message || 'Произошла ошибка';
    
    if (message.includes('Имя') || message.includes('name')) {
        showFieldError('name', message.replace('Ошибка: ', ''));
    } else if (message.includes('Email') || message.includes('email') || message.includes('имейл')) {
        showFieldError('email', message.replace('Ошибка: ', ''));
    } else if (message.includes('Пароль') || message.includes('password')) {
        showFieldError('password', message.replace('Ошибка: ', ''));
    } else if (message.includes('уже существует')) {
        showFieldError('email', message.replace('Ошибка: ', ''));
    } else {
        if (element) {
            showMessage(element, message, 'error');
        } else {
            showToast(message, 'error');
        }
    }
}
