// ============================================================================
// API ЗАПРОСЫ
// ============================================================================

async function graphqlRequest(query, variables = {}) {
    try {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ query, variables })
        });

        if (!response.ok) {
            throw new Error('Не удалось выполнить запрос. Попробуйте позже.');
        }

        const data = await response.json();
        
        if (data.errors) {
            const error = data.errors[0];
            let errorMessage = error.message;
            
            const technicalErrors = [
                'fail to fetch',
                'failed to fetch',
                'network error',
                'offset is out of range',
                'rangeerror',
                'typeerror',
                'syntaxerror',
                'unexpected token',
                'unexpected error',
                'internal server error',
                '500',
                '502',
                '503',
                '504'
            ];
            
            const errorLower = errorMessage.toLowerCase();
            const isTechnicalError = technicalErrors.some(techError => errorLower.includes(techError));
            
            if (isTechnicalError) {
                errorMessage = 'Произошла ошибка при выполнении запроса. Пожалуйста, попробуйте позже.';
            } else if (error.extensions) {
                const originalMessage = error.extensions.originalError?.message ||
                                      error.extensions.exception?.message ||
                                      error.extensions.message;
                if (originalMessage && originalMessage !== 'Unexpected error.' && !technicalErrors.some(techError => originalMessage.toLowerCase().includes(techError))) {
                    errorMessage = originalMessage;
                }
            }
            
            if (!errorMessage || errorMessage === 'Unexpected error.' || technicalErrors.some(techError => errorMessage.toLowerCase().includes(techError))) {
                errorMessage = 'Произошла ошибка. Пожалуйста, попробуйте позже.';
            }
            
            throw new Error(errorMessage);
        }
        
        return data.data;
    } catch (error) {
        if (error.message && (error.message.toLowerCase().includes('fetch') || error.message.toLowerCase().includes('network'))) {
            throw new Error('Не удалось подключиться к серверу. Проверьте подключение к интернету и попробуйте позже.');
        }
        throw error;
    }
}

async function register(name, password) {
    const query = `
        mutation Register($name: String!, $password: String!) {
            register(name: $name, password: $password) {
                token
                recoveryCode
                user {
                    id
                    name
                    role
                    createdAt
                }
            }
        }
    `;
    const data = await graphqlRequest(query, { name, password });
    return data.register;
}

async function login(name, password) {
    const query = `
        mutation Login($name: String!, $password: String!) {
            login(name: $name, password: $password) {
                token
                user {
                    id
                    name
                    role
                    createdAt
                }
            }
        }
    `;
    const data = await graphqlRequest(query, { name, password });
    return data.login;
}

async function requestPasswordReset(name, recoveryCode) {
    const query = `
        mutation RequestPasswordReset($name: String!, $recoveryCode: String!) {
            requestPasswordReset(name: $name, recoveryCode: $recoveryCode)
        }
    `;
    const data = await graphqlRequest(query, { name, recoveryCode });
    return data.requestPasswordReset;
}

async function resetPassword(token, newPassword) {
    const query = `
        mutation ResetPassword($token: String!, $newPassword: String!) {
            resetPassword(token: $token, newPassword: $newPassword)
        }
    `;
    const data = await graphqlRequest(query, { token, newPassword });
    return data.resetPassword;
}

async function getFoundItems() {
    const query = `
        query GetFoundItems {
            foundItems {
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
    const data = await graphqlRequest(query);
    return data.foundItems;
}

async function getLostItems() {
    const query = `
        query GetLostItems {
            lostItems {
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
    const data = await graphqlRequest(query);
    return data.lostItems;
}

async function searchFoundItems(query) {
    if (!query || query.trim() === '') {
        return getFoundItems();
    }
    
    const searchQuery = `
        query SearchFoundItems($query: String!) {
            searchFoundItems(query: $query) {
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
    const data = await graphqlRequest(searchQuery, { query: query.trim() });
    return data.searchFoundItems;
}

async function searchLostItems(query) {
    if (!query || query.trim() === '') {
        return getLostItems();
    }
    
    const searchQuery = `
        query SearchLostItems($query: String!) {
            searchLostItems(query: $query) {
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
    const data = await graphqlRequest(searchQuery, { query: query.trim() });
    return data.searchLostItems;
}

async function createFoundItem(title, description, latitude, longitude, address, foundBy, phone, photos) {
    const query = `
        mutation CreateFoundItem($title: String!, $description: String, $latitude: Float, $longitude: Float, $address: String, $foundBy: ID!, $phone: String, $photos: [String!]) {
            createFoundItem(title: $title, description: $description, latitude: $latitude, longitude: $longitude, address: $address, foundBy: $foundBy, phone: $phone, photos: $photos) {
                id
                title
                description
                location {
                    latitude
                    longitude
                    address
                }
                foundBy {
                    name
                }
                foundAt
                phone
                photos
            }
        }
    `;
    const data = await graphqlRequest(query, { title, description, latitude, longitude, address, foundBy, phone, photos });
    return data.createFoundItem;
}

async function createLostItem(title, description, latitude, longitude, address, lostBy, phone, photos) {
    const query = `
        mutation CreateLostItem($title: String!, $description: String!, $latitude: Float, $longitude: Float, $address: String, $lostBy: ID!, $phone: String, $photos: [String!]) {
            createLostItem(title: $title, description: $description, latitude: $latitude, longitude: $longitude, address: $address, lostBy: $lostBy, phone: $phone, photos: $photos) {
                id
                title
                description
                location {
                    latitude
                    longitude
                    address
                }
                lostBy {
                    name
                }
                lostAt
                phone
                photos
            }
        }
    `;
    const data = await graphqlRequest(query, { title, description, latitude, longitude, address, lostBy, phone, photos });
    return data.createLostItem;
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
