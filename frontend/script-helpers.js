function compressImage(file, maxWidth = 1920, maxHeight = 1920, quality = 0.8) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                if (width > height) {
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error('Не удалось сжать изображение'));
                        return;
                    }
                    resolve(blob);
                }, 'image/jpeg', quality);
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

async function getPhotosFromInput(inputId) {
    const input = document.getElementById(inputId);
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

function showPhotoPreview(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    
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

async function getMyFoundItems(userId) {
    const query = `
        query GetMyFoundItems($userId: ID!) {
            myFoundItems(userId: $userId) {
                id
                title
                description
                location {
                    latitude
                    longitude
                    address
                }
                foundBy {
                    id
                    name
                }
                foundAt
                isClaimed
                isReturned
                returnedAt
                claimedBy {
                    name
                }
                phone
                photos
            }
        }
    `;
    const data = await graphqlRequest(query, { userId });
    return data.myFoundItems;
}

async function getMyLostItems(userId) {
    const query = `
        query GetMyLostItems($userId: ID!) {
            myLostItems(userId: $userId) {
                id
                title
                description
                location {
                    latitude
                    longitude
                    address
                }
                lostBy {
                    id
                    name
                }
                lostAt
                isFound
                foundItem {
                    title
                }
                phone
                photos
            }
        }
    `;
    const data = await graphqlRequest(query, { userId });
    return data.myLostItems;
}

async function getMyClaimedFoundItems(userId) {
    const query = `
        query GetMyClaimedFoundItems($userId: ID!) {
            myClaimedFoundItems(userId: $userId) {
                id
                title
                description
                location {
                    latitude
                    longitude
                    address
                }
                foundBy {
                    id
                    name
                }
                foundAt
                isClaimed
                isReturned
                returnedAt
                claimedBy {
                    id
                    name
                }
                claimedAt
                phone
                photos
            }
        }
    `;
    const data = await graphqlRequest(query, { userId });
    return data.myClaimedFoundItems;
}

async function updateFoundItem(id, title, description, phone, photos, isReturned) {
    const query = `
        mutation UpdateFoundItem($id: ID!, $title: String, $description: String, $phone: String, $photos: [String!], $isReturned: Boolean) {
            updateFoundItem(id: $id, title: $title, description: $description, phone: $phone, photos: $photos, isReturned: $isReturned) {
                id
                title
                description
                phone
                photos
                isReturned
                returnedAt
            }
        }
    `;
    const data = await graphqlRequest(query, { id, title, description, phone, photos, isReturned });
    return data.updateFoundItem;
}

async function updateLostItem(id, title, description, phone, photos) {
    const query = `
        mutation UpdateLostItem($id: ID!, $title: String, $description: String, $phone: String, $photos: [String!]) {
            updateLostItem(id: $id, title: $title, description: $description, phone: $phone, photos: $photos) {
                id
                title
                description
                phone
                photos
            }
        }
    `;
    const data = await graphqlRequest(query, { id, title, description, phone, photos });
    return data.updateLostItem;
}

async function markLostItemAsFoundSimple(lostItemId) {
    const query = `
        mutation MarkLostItemAsFoundSimple($lostItemId: ID!) {
            markLostItemAsFoundSimple(lostItemId: $lostItemId) {
                id
                title
                description
                isFound
            }
        }
    `;
    const data = await graphqlRequest(query, { lostItemId });
    return data.markLostItemAsFoundSimple;
}

async function claimFoundItem(foundItemId, claimedBy) {
    const query = `
        mutation ClaimFoundItem($foundItemId: ID!, $claimedBy: ID!) {
            claimFoundItem(foundItemId: $foundItemId, claimedBy: $claimedBy) {
                id
                title
                description
                isClaimed
                claimedBy {
                    id
                    name
                }
                claimedAt
            }
        }
    `;
    const data = await graphqlRequest(query, { foundItemId, claimedBy });
    return data.claimFoundItem;
}

async function foundItemsNearLocation(latitude, longitude, radius) {
    const query = `
        query FoundItemsNearLocation($latitude: Float!, $longitude: Float!, $radius: Float!) {
            foundItemsNearLocation(latitude: $latitude, longitude: $longitude, radius: $radius) {
                id
                title
                description
                location {
                    latitude
                    longitude
                    address
                }
                foundBy {
                    id
                    name
                }
                foundAt
                isClaimed
                isReturned
                claimedBy {
                    name
                }
                phone
                photos
            }
        }
    `;
    const data = await graphqlRequest(query, { latitude, longitude, radius });
    return data.foundItemsNearLocation;
}

async function lostItemsNearLocation(latitude, longitude, radius) {
    const query = `
        query LostItemsNearLocation($latitude: Float!, $longitude: Float!, $radius: Float!) {
            lostItemsNearLocation(latitude: $latitude, longitude: $longitude, radius: $radius) {
                id
                title
                description
                location {
                    latitude
                    longitude
                    address
                }
                lostBy {
                    id
                    name
                }
                lostAt
                isFound
                phone
                photos
            }
        }
    `;
    const data = await graphqlRequest(query, { latitude, longitude, radius });
    return data.lostItemsNearLocation;
}

async function deleteFoundItem(id) {
    const query = `
        mutation DeleteFoundItem($id: ID!) {
            deleteFoundItem(id: $id)
        }
    `;
    const data = await graphqlRequest(query, { id });
    return data.deleteFoundItem;
}

async function deleteLostItem(id) {
    const query = `
        mutation DeleteLostItem($id: ID!) {
            deleteLostItem(id: $id)
        }
    `;
    const data = await graphqlRequest(query, { id });
    return data.deleteLostItem;
}