// ============================================================================
// РАБОТА С КАРТАМИ
// ============================================================================

function initYandexMap(containerId, center = [55.7558, 37.6176], zoom = 10) {
    return new Promise((resolve) => {
        if (typeof ymaps === 'undefined') {
            setTimeout(() => initYandexMap(containerId, center, zoom).then(resolve), 100);
            return;
        }
        
        ymaps.ready(() => {
            const map = new ymaps.Map(containerId, {
                center: center,
                zoom: zoom
            });
            resolve(map);
        });
    });
}

function addMarkerToMap(map, coords, item, type) {
    if (!map || !coords) return null;
    
    const coordKey = `${coords.lat.toFixed(6)}_${coords.lng.toFixed(6)}`;
    let offsetCount = markerCoordsMap.get(coordKey) || 0;
    markerCoordsMap.set(coordKey, offsetCount + 1);
    
    const offsetDistance = 0.0003;
    const angle = (offsetCount * 60) * (Math.PI / 180);
    const offsetLat = coords.lat + (offsetDistance * Math.cos(angle));
    const offsetLng = coords.lng + (offsetDistance * Math.sin(angle));
    
    const finalCoords = offsetCount > 0 ? { lat: offsetLat, lng: offsetLng } : coords;
    
    const locationText = item.location 
        ? (item.location.address || (item.location.latitude && item.location.longitude 
            ? `Координаты: ${item.location.latitude.toFixed(6)}, ${item.location.longitude.toFixed(6)}` 
            : 'Адрес указан'))
        : 'Место не указано';
    
    const photosText = item.photos && item.photos.length > 0 
        ? `${item.photos.length} фото` 
        : 'Фото не добавлены';
    
    const phoneText = item.phone ? item.phone : '';
    
    let statusText = '';
    let dateText = '';
    let userText = '';
    
    if (type === 'found') {
        statusText = item.isReturned ? 'Возвращено' : 'Доступно';
        dateText = `Найдено: ${new Date(parseInt(item.foundAt)).toLocaleString('ru-RU')}`;
        userText = `Нашел: ${item.foundBy.name}`;
    } else {
        statusText = item.isFound ? 'Найдено' : 'Ищется';
        dateText = `Потеряно: ${new Date(parseInt(item.lostAt)).toLocaleString('ru-RU')}`;
        userText = `Потерял: ${item.lostBy.name}`;
    }
    
    const statusClass = type === 'found' 
        ? (item.isReturned ? 'returned' : 'available')
        : (item.isFound ? 'found' : 'available');
    
    const statusGradient = statusClass === 'returned' 
        ? 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
        : statusClass === 'found'
        ? 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
        : 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)';
    
    const statusColor = statusClass === 'returned' 
        ? '#155724'
        : statusClass === 'found'
        ? '#721c24'
        : '#155724';
    
    const hintContent = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 16px; min-width: 280px; max-width: 600px; width: auto; background: white; box-shadow: 0 8px 30px rgba(102, 126, 234, 0.25), 0 4px 15px rgba(0, 0, 0, 0.1); overflow: hidden; box-sizing: border-box;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; gap: 12px;">
                <h3 style="margin: 0; font-size: 17px; font-weight: 700; color: #2c3e50; flex: 1; line-height: 1.3; word-wrap: break-word; overflow-wrap: break-word; min-width: 0;">${item.title}</h3>
                <span style="padding: 5px 12px; border-radius: 20px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; white-space: nowrap; flex-shrink: 0; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15); background: ${statusGradient}; color: ${statusColor};">${statusText}</span>
            </div>
            ${item.description ? `<div style="margin: 12px 0; padding: 10px; background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); border-radius: 6px; border-left: 3px solid #667eea; color: #34495e; font-size: 14px; line-height: 1.6; word-wrap: break-word; overflow-wrap: break-word; min-width: 0; width: 100%; box-sizing: border-box;">${item.description}</div>` : ''}
            <div style="margin-top: 12px; padding-top: 12px; border-top: 2px solid #ecf0f1;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px; color: #555; font-size: 13px;">
                    <span style="font-size: 16px; width: 20px; text-align: center; flex-shrink: 0;">📅</span>
                    <span>${dateText}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px; color: #555; font-size: 13px;">
                    <span style="font-size: 16px; width: 20px; text-align: center; flex-shrink: 0;">👤</span>
                    <span>${userText}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px; color: #555; font-size: 13px;">
                    <span style="font-size: 16px; width: 20px; text-align: center; flex-shrink: 0;">📍</span>
                    <span style="word-wrap: break-word; overflow-wrap: break-word; flex: 1;">${locationText}</span>
                </div>
                ${phoneText ? `<div style="display: flex; align-items: center; gap: 10px; color: #555; font-size: 13px;">
                    <span style="font-size: 16px; width: 20px; text-align: center; flex-shrink: 0;">📞</span>
                    <span style="word-wrap: break-word; overflow-wrap: break-word; flex: 1;">${phoneText}</span>
                </div>` : ''}
            </div>
        </div>
    `;
    
    const balloonContent = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; min-width: 320px; max-width: 600px; width: auto; background: white; box-shadow: 0 8px 30px rgba(102, 126, 234, 0.25), 0 4px 15px rgba(0, 0, 0, 0.1);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; gap: 15px;">
                <h3 style="margin: 0; font-size: 20px; font-weight: 700; color: #2c3e50; flex: 1; line-height: 1.3; word-wrap: break-word; overflow-wrap: break-word;">${item.title}</h3>
                <span style="padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; white-space: nowrap; flex-shrink: 0; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15); background: ${statusGradient}; color: ${statusColor};">${statusText}</span>
            </div>
            ${item.photos && item.photos.length > 0 ? (() => {
                const maxVisible = 5;
                const visiblePhotos = item.photos.slice(0, maxVisible);
                const remainingCount = item.photos.length - maxVisible;
                const photosHtml = visiblePhotos.map(photo => 
                    `<img src="${photo}" style="width: 90px; height: 90px; object-fit: cover; border-radius: 6px; border: 2px solid #e0e0e0; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">`
                ).join('');
                const moreHtml = remainingCount > 0 
                    ? `<div style="width: 90px; height: 90px; border-radius: 6px; background: rgba(0, 0, 0, 0.5); color: white; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; border: 2px solid #e0e0e0; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">+${remainingCount}</div>`
                    : '';
                return `<div style="margin: 12px 0; display: flex; gap: 8px; flex-wrap: wrap;">${photosHtml}${moreHtml}</div>`;
            })() : '<div style="margin: 12px 0; padding: 10px; color: #95a5a6; font-size: 13px; text-align: center; background: #f8f9fa; border-radius: 6px;">Фото не добавлены</div>'}
            ${item.description ? `<div style="margin: 15px 0; padding: 12px; background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); border-radius: 6px; border-left: 3px solid #667eea; color: #34495e; font-size: 15px; line-height: 1.6; word-wrap: break-word; overflow-wrap: break-word;">${item.description}</div>` : ''}
            <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #ecf0f1;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; color: #555; font-size: 14px;">
                    <span style="font-size: 18px; width: 24px; text-align: center; flex-shrink: 0;">📅</span>
                    <span>${dateText}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; color: #555; font-size: 14px;">
                    <span style="font-size: 18px; width: 24px; text-align: center; flex-shrink: 0;">👤</span>
                    <span>${userText}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; color: #555; font-size: 14px;">
                    <span style="font-size: 18px; width: 24px; text-align: center; flex-shrink: 0;">📍</span>
                    <span style="word-wrap: break-word; overflow-wrap: break-word; flex: 1;">${locationText}</span>
                </div>
                ${phoneText ? `<div style="display: flex; align-items: center; gap: 10px; color: #555; font-size: 14px;">
                    <span style="font-size: 18px; width: 24px; text-align: center; flex-shrink: 0;">📞</span>
                    <span style="word-wrap: break-word; overflow-wrap: break-word; flex: 1;">${phoneText}</span>
                </div>` : ''}
            </div>
        </div>
    `;
    
    const marker = new ymaps.Placemark(
        [finalCoords.lat, finalCoords.lng],
        {
            hintContent: hintContent,
            balloonContent: balloonContent
        },
        {
            preset: type === 'found' ? 'islands#blueDotIcon' : 'islands#redDotIcon',
            openHintOnHover: true,
            openBalloonOnClick: false,
            hideIconOnBalloonOpen: false
        }
    );
    
    marker.events.add('click', () => {
        showItemModal(item, type);
    });
    
    map.geoObjects.add(marker);
    return marker;
}

function clearMarkers(markers) {
    markers.forEach(marker => {
        if (marker && marker.getMap()) {
            marker.getMap().geoObjects.remove(marker);
        }
    });
    markers.length = 0;
}
