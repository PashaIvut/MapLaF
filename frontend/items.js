// ============================================================================
// ЗАГРУЗКА И ОТОБРАЖЕНИЕ ЭЛЕМЕНТОВ
// ============================================================================

async function loadFoundItems(searchQuery = null) {
    showMessage(foundList, 'Загрузка...', 'info');
    
    try {
        if (!foundItemsMap) {
            foundItemsMap = await initYandexMap('found-items-map');
            setupNearbySearchClick(foundItemsMap, false);
        }
        
        const items = searchQuery !== null 
            ? await searchFoundItems(searchQuery)
            : await getFoundItems();
        
        if (items.length === 0) {
            const message = searchQuery 
                ? `По запросу "${searchQuery}" ничего не найдено`
                : 'Пока ничего не найдено';
            showMessage(foundList, message, 'info');
            if (foundItemsMap) foundItemsMap.geoObjects.removeAll();
            return;
        }
        
        foundList.innerHTML = '';
        
        clearMarkers(foundMapMarkers);
        markerCoordsMap.clear();
        if (foundItemsMap) {
            foundItemsMap.geoObjects.removeAll();
            
            const bounds = [];
            const geocodePromises = [];
            
            items.forEach(item => {
                if (item.location) {
                    if (item.location.latitude && item.location.longitude) {
                    const coords = [item.location.latitude, item.location.longitude];
                    bounds.push(coords);
                    const marker = addMarkerToMap(
                        foundItemsMap,
                        { lat: item.location.latitude, lng: item.location.longitude },
                            item,
                            'found'
                    );
                    if (marker) foundMapMarkers.push(marker);
                }
                    else if (item.location.address) {
                        const geocodePromise = new Promise((resolve) => {
                            if (typeof ymaps === 'undefined') {
                                resolve(null);
                                return;
                            }
                            
                            ymaps.ready(() => {
                                try {
                                    ymaps.geocode(item.location.address, {
                                        results: 1
                                    }).then((res) => {
                                        try {
                                            if (!res || !res.geoObjects) {
                                                resolve(null);
                                                return;
                                            }
                                            const firstGeoObject = res.geoObjects.get(0);
                                            if (firstGeoObject) {
                                                const coords = firstGeoObject.geometry.getCoordinates();
                                                const addressComponents = firstGeoObject.properties.get('metaDataProperty.GeocoderMetaData.Address.Components');
                                                
                                                let isValidLocation = true;
                                                
                                                if (coords[0] < 40 || coords[0] > 82 || coords[1] < 19 || coords[1] > 180) {
                                                    isValidLocation = false;
                                                }
                                                
                                                if (isValidLocation && addressComponents && addressComponents.length > 0) {
                                                    const localityKinds = ['locality', 'area', 'district'];
                                                    const hasLocality = addressComponents.some(component => {
                                                        const kind = component.kind;
                                                        return localityKinds.includes(kind);
                                                    });
                                                    
                                                    if (!hasLocality) {
                                                        const localityName = addressComponents.find(comp => 
                                                            comp.kind === 'locality' || 
                                                            comp.name && (
                                                                comp.name.toLowerCase().includes('город') ||
                                                                comp.name.toLowerCase().includes('поселок') ||
                                                                comp.name.toLowerCase().includes('деревня') ||
                                                                comp.name.toLowerCase().includes('село')
                                                            )
                                                        );
                                                        
                                                        if (!localityName) {
                                                            isValidLocation = false;
                                                        }
                                                    }
                                                }
                                                
                                                if (isValidLocation) {
                                                    bounds.push(coords);
                                                    const marker = addMarkerToMap(
                                                        foundItemsMap,
                                                        { lat: coords[0], lng: coords[1] },
                                                        item,
                                                        'found'
                                                    );
                                                    if (marker) foundMapMarkers.push(marker);
                                                    resolve(coords);
                                                } else {
                                                    resolve(null);
                                                }
                                            } else {
                                                resolve(null);
                                            }
                                        } catch (err) {
                                            resolve(null);
                                        }
                                    }).catch((error) => {
                                        resolve(null);
                                    });
                                } catch (err) {
                                    resolve(null);
                                }
                            });
                        });
                        geocodePromises.push(geocodePromise);
                    }
                }
            });
            
            Promise.all(geocodePromises).then(() => {
                if (bounds.length > 0 && foundItemsMap) {
                    foundItemsMap.setBounds(foundItemsMap.geoObjects.getBounds());
                }
            });
            
            if (bounds.length > 0 && geocodePromises.length === 0) {
                foundItemsMap.setBounds(foundItemsMap.geoObjects.getBounds());
            }
        }
        
        items.forEach(item => {
            foundList.appendChild(createItemElement(item, 'found'));
        });
    } catch (error) {
        handleError(error, foundList);
    }
}

async function findNearbyItems(latitude, longitude, radius = 0.01) {
    showMessage(foundList, 'Поиск вещей рядом...', 'info');
    
    try {
        const items = await foundItemsNearLocation(latitude, longitude, radius);
        
        if (items.length === 0) {
            showMessage(foundList, 'В радиусе поиска ничего не найдено', 'info');
            return;
        }
        
        foundList.innerHTML = '';
        
        clearMarkers(foundMapMarkers);
        markerCoordsMap.clear();
        
        if (foundItemsMap) {
            const allObjects = foundItemsMap.geoObjects;
            allObjects.each((obj) => {
                if (obj !== nearbySearchMarker && obj !== nearbySearchCircle) {
                    allObjects.remove(obj);
                }
            });
            
            items.forEach(item => {
                if (item.location && item.location.latitude && item.location.longitude) {
                    const coords = [item.location.latitude, item.location.longitude];
                    const marker = addMarkerToMap(
                        foundItemsMap,
                        { lat: item.location.latitude, lng: item.location.longitude },
                        item,
                        'found'
                    );
                    if (marker) foundMapMarkers.push(marker);
                }
            });
        }
        
        items.forEach(item => {
            foundList.appendChild(createItemElement(item, 'found'));
        });
        
        showToast(`Найдено вещей: ${items.length}`, 'success');
    } catch (error) {
        handleError(error, foundList);
    }
}

async function findNearbyLostItems(latitude, longitude, radius = 0.01) {
    showMessage(lostList, 'Поиск вещей рядом...', 'info');
    
    try {
        const items = await lostItemsNearLocation(latitude, longitude, radius);
        
        if (items.length === 0) {
            showMessage(lostList, 'В радиусе поиска ничего не найдено', 'info');
            return;
        }
        
        lostList.innerHTML = '';
        
        clearMarkers(lostMapMarkers);
        markerCoordsMap.clear();
        
        if (lostItemsMap) {
            const allObjects = lostItemsMap.geoObjects;
            allObjects.each((obj) => {
                if (obj !== nearbySearchMarkerLost && obj !== nearbySearchCircleLost) {
                    allObjects.remove(obj);
                }
            });
            
            items.forEach(item => {
                if (item.location && item.location.latitude && item.location.longitude) {
                    const coords = [item.location.latitude, item.location.longitude];
                    const marker = addMarkerToMap(
                        lostItemsMap,
                        { lat: item.location.latitude, lng: item.location.longitude },
                        item,
                        'lost'
                    );
                    if (marker) lostMapMarkers.push(marker);
                }
            });
        }
        
        items.forEach(item => {
            lostList.appendChild(createItemElement(item, 'lost'));
        });
        
        showToast(`Найдено вещей: ${items.length}`, 'success');
    } catch (error) {
        handleError(error, lostList);
    }
}

async function loadLostItems(searchQuery = null) {
    showMessage(lostList, 'Загрузка...', 'info');
    
    try {
        if (!lostItemsMap) {
            lostItemsMap = await initYandexMap('lost-items-map');
            setupNearbySearchClick(lostItemsMap, true);
        }
        
        const items = searchQuery !== null 
            ? await searchLostItems(searchQuery)
            : await getLostItems();
        
        if (items.length === 0) {
            const message = searchQuery 
                ? `По запросу "${searchQuery}" ничего не найдено`
                : 'Пока ничего не потеряно';
            showMessage(lostList, message, 'info');
            if (lostItemsMap) lostItemsMap.geoObjects.removeAll();
            return;
        }
        
        lostList.innerHTML = '';
        
        clearMarkers(lostMapMarkers);
        markerCoordsMap.clear();
        if (lostItemsMap) {
            lostItemsMap.geoObjects.removeAll();
            
            const bounds = [];
            const geocodePromises = [];
            
            items.forEach(item => {
                if (item.location) {
                    if (item.location.latitude && item.location.longitude) {
                    const coords = [item.location.latitude, item.location.longitude];
                    bounds.push(coords);
                    const marker = addMarkerToMap(
                        lostItemsMap,
                        { lat: item.location.latitude, lng: item.location.longitude },
                            item,
                            'lost'
                    );
                    if (marker) lostMapMarkers.push(marker);
                }
                    else if (item.location.address) {
                        const geocodePromise = new Promise((resolve) => {
                            if (typeof ymaps === 'undefined') {
                                resolve(null);
                                return;
                            }
                            
                            ymaps.ready(() => {
                                try {
                                    ymaps.geocode(item.location.address, {
                                        results: 1
                                    }).then((res) => {
                                        try {
                                            if (!res || !res.geoObjects) {
                                                resolve(null);
                                                return;
                                            }
                                            const firstGeoObject = res.geoObjects.get(0);
                                            if (firstGeoObject) {
                                                const coords = firstGeoObject.geometry.getCoordinates();
                                                const addressComponents = firstGeoObject.properties.get('metaDataProperty.GeocoderMetaData.Address.Components');
                                                
                                                let isValidLocation = true;
                                                
                                                if (coords[0] < 40 || coords[0] > 82 || coords[1] < 19 || coords[1] > 180) {
                                                    isValidLocation = false;
                                                }
                                                
                                                if (isValidLocation && addressComponents && addressComponents.length > 0) {
                                                    const localityKinds = ['locality', 'area', 'district'];
                                                    const hasLocality = addressComponents.some(component => {
                                                        const kind = component.kind;
                                                        return localityKinds.includes(kind);
                                                    });
                                                    
                                                    if (!hasLocality) {
                                                        const localityName = addressComponents.find(comp => 
                                                            comp.kind === 'locality' || 
                                                            comp.name && (
                                                                comp.name.toLowerCase().includes('город') ||
                                                                comp.name.toLowerCase().includes('поселок') ||
                                                                comp.name.toLowerCase().includes('деревня') ||
                                                                comp.name.toLowerCase().includes('село')
                                                            )
                                                        );
                                                        
                                                        if (!localityName) {
                                                            isValidLocation = false;
                                                        }
                                                    }
                                                }
                                                
                                                if (isValidLocation) {
                                                    bounds.push(coords);
                                                    const marker = addMarkerToMap(
                                                        lostItemsMap,
                                                        { lat: coords[0], lng: coords[1] },
                                                        item,
                                                        'lost'
                                                    );
                                                    if (marker) lostMapMarkers.push(marker);
                                                    resolve(coords);
                                                } else {
                                                    resolve(null);
                                                }
                                            } else {
                                                resolve(null);
                                            }
                                        } catch (err) {
                                            resolve(null);
                                        }
                                    }).catch((error) => {
                                        resolve(null);
                                    });
                                } catch (err) {
                                    resolve(null);
                                }
                            });
                        });
                        geocodePromises.push(geocodePromise);
                    }
                }
            });
            
            Promise.all(geocodePromises).then(() => {
                if (bounds.length > 0 && lostItemsMap) {
                    lostItemsMap.setBounds(lostItemsMap.geoObjects.getBounds());
                }
            });
            
            if (bounds.length > 0 && geocodePromises.length === 0) {
                lostItemsMap.setBounds(lostItemsMap.geoObjects.getBounds());
            }
        }
        
        items.forEach(item => {
            lostList.appendChild(createItemElement(item, 'lost'));
        });
    } catch (error) {
        handleError(error, lostList);
    }
}

async function loadMyFoundItems() {
    const list = document.getElementById('my-found-list');
    if (!list) return;
    
    showMessage(list, 'Загрузка...', 'info');
    
    try {
        const items = await getMyFoundItems(currentUser.id);
        
        if (items.length === 0) {
            showMessage(list, 'Вы еще не добавили найденные вещи', 'info');
            return;
        }
        
        list.innerHTML = '';
        items.forEach(item => {
            list.appendChild(createMyItemElement(item, 'found'));
        });
    } catch (error) {
        handleError(error, list);
    }
}

async function loadMyLostItems() {
    const list = document.getElementById('my-lost-list');
    if (!list) return;
    
    showMessage(list, 'Загрузка...', 'info');
    
    try {
        const items = await getMyLostItems(currentUser.id);
        
        if (items.length === 0) {
            showMessage(list, 'Вы еще не добавили потерянные вещи', 'info');
            return;
        }
        
        list.innerHTML = '';
        items.forEach(item => {
            list.appendChild(createMyItemElement(item, 'lost'));
        });
    } catch (error) {
        handleError(error, list);
    }
}

async function loadMyClaimedFoundItems() {
    const list = document.getElementById('my-claimed-list');
    if (!list) return;
    
    showMessage(list, 'Загрузка...', 'info');
    
    try {
        const items = await getMyClaimedFoundItems(currentUser.id);
        
        if (items.length === 0) {
            showMessage(list, 'Вы еще не заявили права ни на одну вещь', 'info');
            return;
        }
        
        list.innerHTML = '';
        items.forEach(item => {
            list.appendChild(createItemElement(item, 'found'));
        });
    } catch (error) {
        handleError(error, list);
    }
}

function createMyItemElement(item, type) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item my-item';
    if (item.isReturned || item.isFound) {
        itemDiv.classList.add('returned');
    }
    
    const locationText = formatLocationText(item);
    
    const photosHtml = item.photos && item.photos.length > 0
        ? `<div class="item-photos-preview">${item.photos.map((photo, index) => `<img loading="lazy" src="${photo}" alt="Фото" class="item-photo" data-photo-index="${index}" style="width: 80px; height: 80px; object-fit: cover; margin: 5px; border-radius: 4px; cursor: pointer; transition: transform 0.2s;" title="Нажмите для увеличения">`).join('')}</div>`
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
                    <span class="info-icon">📍</span>
                    <span>${locationText}</span>
                </div>
                ${phoneHtml ? `<div class="info-row">
                    <span class="info-icon">📞</span>
                    <span>${phoneHtml}</span>
                </div>` : ''}
            </div>
            <div class="item-actions">
                ${item.isReturned 
                    ? '<div style="padding: 10px; background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); border-radius: 8px; text-align: center; font-weight: 600; color: #155724;">🎉 История завершена! Вещь возвращена владельцу</div>'
                    : `<button class="edit-btn" data-id="${item.id}" data-type="found">Редактировать</button>
                       <button class="return-btn" data-id="${item.id}">Отметить как возвращенную</button>`}
            </div>
        `;
    } else {
        const status = item.isFound ? 'found' : 'available';
        const statusText = item.isFound ? 'Найдено' : 'Ищется';
        
        itemDiv.innerHTML = `
            <div class="item-header">
                <h3>${item.title}</h3>
                <span class="status ${status}">${statusText}</span>
            </div>
            ${photosHtml}
            <p class="item-description">${item.description}</p>
            <div class="item-info">
                <div class="info-row">
                    <span class="info-icon">📅</span>
                    <span>Потеряно: ${new Date(parseInt(item.lostAt)).toLocaleString('ru-RU')}</span>
                </div>
                <div class="info-row">
                    <span class="info-icon">📍</span>
                    <span>${locationText}</span>
                </div>
                ${phoneHtml ? `<div class="info-row">
                    <span class="info-icon">📞</span>
                    <span>${phoneHtml}</span>
                </div>` : ''}
            </div>
            <div class="item-actions">
                ${item.isFound 
                    ? '<div style="padding: 10px; background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); border-radius: 8px; text-align: center; font-weight: 600; color: #155724;">✅ Миссия выполнена! Вещь найдена</div>'
                    : `<button class="edit-btn" data-id="${item.id}" data-type="lost">Редактировать</button>
                       <button class="found-btn" data-id="${item.id}">Отметить как найденную</button>`}
            </div>
        `;
    }
    
    const editBtn = itemDiv.querySelector('.edit-btn');
    if (editBtn && !item.isReturned && !item.isFound) {
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showEditModal(item, type);
        });
    }
    
    const returnBtn = itemDiv.querySelector('.return-btn');
    if (returnBtn) {
        returnBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const confirmed = await showConfirmModal('Отметить вещь как возвращенную?', 'Подтвердить', 'Отмена');
            if (confirmed) {
                try {
                    await updateFoundItem(item.id, null, null, null, null, true);
                    loadMyFoundItems();
                } catch (err) {
                    handleError(err);
                }
            }
        });
    }
    
    const foundBtn = itemDiv.querySelector('.found-btn');
    if (foundBtn) {
        foundBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const confirmed = await showConfirmModal('Отметить вещь как найденную?', 'Подтвердить', 'Отмена');
            if (confirmed) {
                try {
                    await markLostItemAsFoundSimple(item.id);
                    loadMyLostItems();
                } catch (err) {
                    handleError(err);
                }
            }
        });
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
        if (!e.target.closest('.item-actions') && !e.target.classList.contains('item-photo') && !e.target.closest('.item-photos-preview')) {
            showItemModal(item, type);
        }
    });
    
    return itemDiv;
}
