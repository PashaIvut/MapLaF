// ============================================================================
// МОДАЛЬНЫЕ ОКНА
// ============================================================================

function showRecoveryCodeModal(recoveryCode) {
    const modal = `
        <div id="recovery-code-modal" class="modal">
            <div class="auth register-auth">
                <div class="auth-logo">
                    <div class="logo-icon">🗺️</div>
                    <div class="logo-text">MapLaF</div>
                </div>
                <h1>Код восстановления</h1>
                <div style="text-align: center; padding: 20px 0;">
                    <p style="color: #e74c3c; font-weight: bold; margin-bottom: 15px; font-size: 1.1rem;">
                        ⚠️ Сохраните этот код в безопасном месте!
                    </p>
                    <p style="color: #e74c3c; font-weight: bold; margin-bottom: 20px;">
                        Этот код нужен для восстановления пароля. Если вы его потеряете, восстановление будет невозможно.
                    </p>
                    <div style="background: #f8f9fa; border: 2px solid #ddd; border-radius: 8px; padding: 20px; margin: 20px 0;">
                        <div style="font-size: 1.5rem; font-weight: bold; letter-spacing: 3px; color: #2c3e50; font-family: 'Courier New', monospace;" id="recovery-code-display">
                            ${recoveryCode}
                        </div>
                    </div>
                    <button type="button" id="copy-recovery-code-btn" style="background: #e74c3c; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin-bottom: 15px;">
                        📋 Скопировать код
                    </button>
                    <p style="color: #999; font-size: 0.85rem; margin-top: 10px;">
                        Рекомендуем сохранить код в надежном месте (заметки, менеджер паролей)
                    </p>
                </div>
                <div class="auth-buttons">
                    <button type="button" id="close-recovery-code-btn" style="width: 100%;">Понятно, я сохранил код</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modal);
    document.body.style.overflow = 'hidden';
    
    const modalEl = document.getElementById('recovery-code-modal');
    const copyBtn = document.getElementById('copy-recovery-code-btn');
    const closeBtn = document.getElementById('close-recovery-code-btn');
    
    const closeModal = () => {
        modalEl.remove();
        document.body.style.overflow = '';
    };
    
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(recoveryCode).then(() => {
            copyBtn.textContent = '✓ Скопировано!';
            copyBtn.style.background = '#27ae60';
            setTimeout(() => {
                copyBtn.textContent = '📋 Скопировать код';
                copyBtn.style.background = '#e74c3c';
            }, 2000);
        }).catch(() => {
            showToast('Не удалось скопировать код', 'error');
        });
    });
    
    closeBtn.addEventListener('click', closeModal);
    modalEl.addEventListener('click', (e) => {
        if (e.target === modalEl) {
            closeModal();
        }
    });
}

function showPasswordResetForm() {
    const name = nameInput?.value || '';
    const resetForm = `
        <div id="password-reset-modal" class="modal">
            <div class="auth register-auth">
                <div class="auth-logo">
                    <div class="logo-icon">🗺️</div>
                    <div class="logo-text">MapLaF</div>
                </div>
                <h1>Восстановление пароля</h1>
                <form id="password-reset-form">
                <div class="input-wrapper">
                        <input type="text" id="reset-name" placeholder="Никнейм" value="${name}" required>
                    <span class="field-error" id="reset-name-error"></span>
                </div>
                <div class="input-wrapper">
                        <input type="text" id="reset-recovery-code" placeholder="Код восстановления" required style="text-transform: uppercase;">
                    <span class="field-error" id="reset-recovery-code-error"></span>
                </div>
                    <p style="font-size: 0.85rem; color: #666; margin: -0.5rem 0 1rem 0; text-align: center;">Введите никнейм и код восстановления, который вы получили при регистрации</p>
                    <div class="auth-buttons">
                        <button type="submit" id="send-reset-btn">Продолжить</button>
                        <button type="button" id="cancel-reset-btn">Отмена</button>
                </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', resetForm);
    document.body.style.overflow = 'hidden';
    
    const modal = document.getElementById('password-reset-modal');
    const form = document.getElementById('password-reset-form');
    const sendBtn = document.getElementById('send-reset-btn');
    const cancelBtn = document.getElementById('cancel-reset-btn');
    const resetNameInput = document.getElementById('reset-name');
    const resetRecoveryCodeInput = document.getElementById('reset-recovery-code');
    const resetNameError = document.getElementById('reset-name-error');
    const resetRecoveryCodeError = document.getElementById('reset-recovery-code-error');
    
    if (resetRecoveryCodeInput) {
        resetRecoveryCodeInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
        });
    }
    
    const closeModal = () => {
            modal.remove();
        document.body.style.overflow = '';
    };
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (resetNameInput) resetNameInput.setCustomValidity('');
        if (resetRecoveryCodeInput) resetRecoveryCodeInput.setCustomValidity('');
        
        const nameValue = resetNameInput.value.trim();
        if (!nameValue) {
            if (resetNameInput) {
                resetNameInput.setCustomValidity('Вы пропустили это поле!');
                resetNameInput.reportValidity();
            }
            return;
        }
        
        const recoveryCodeValue = resetRecoveryCodeInput.value.trim().toUpperCase();
        if (!recoveryCodeValue) {
            if (resetRecoveryCodeInput) {
                resetRecoveryCodeInput.setCustomValidity('Вы пропустили это поле!');
                resetRecoveryCodeInput.reportValidity();
            }
            return;
        }
        
        try {
            const resetToken = await requestPasswordReset(nameValue, recoveryCodeValue);
            closeModal();
            showResetPasswordForm(resetToken);
        } catch (err) {
            const errorMessage = err.message || 'Произошла ошибка';
            
            if (errorMessage.includes('код') || errorMessage.includes('Код') || errorMessage.includes('recovery')) {
                if (resetRecoveryCodeInput) {
                    resetRecoveryCodeInput.setCustomValidity(errorMessage);
                    resetRecoveryCodeInput.reportValidity();
                }
            } else if (errorMessage.includes('никнейм') || errorMessage.includes('name') || errorMessage.includes('не найден')) {
                if (resetNameInput) {
                    resetNameInput.setCustomValidity(errorMessage);
                    resetNameInput.reportValidity();
                }
            } else {
                if (resetNameInput) {
                    resetNameInput.setCustomValidity(errorMessage);
                    resetNameInput.reportValidity();
                }
            }
            
            showToast(errorMessage, 'error');
        }
    });
    
    cancelBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function showResetPasswordForm(token) {
    const resetForm = `
        <div id="reset-password-modal" class="modal">
            <div class="auth register-auth">
                <div class="auth-logo">
                    <div class="logo-icon">🗺️</div>
                    <div class="logo-text">MapLaF</div>
                </div>
                <h1>Создание нового пароля</h1>
                <form id="reset-password-form">
                <div class="input-wrapper">
                        <input type="password" id="new-password" placeholder="Новый пароль" required>
                    <span class="field-error" id="new-password-error"></span>
                </div>
                <div class="input-wrapper">
                        <input type="password" id="confirm-password" placeholder="Подтвердите пароль" required>
                    <span class="field-error" id="confirm-password-error"></span>
                </div>
                    <div class="auth-buttons">
                        <button type="submit" id="submit-reset-btn">Изменить пароль</button>
                        <button type="button" id="cancel-reset-password-btn">Отмена</button>
                </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', resetForm);
    document.body.style.overflow = 'hidden';
    
    const modal = document.getElementById('reset-password-modal');
    const form = document.getElementById('reset-password-form');
    const submitBtn = document.getElementById('submit-reset-btn');
    const cancelBtn = document.getElementById('cancel-reset-password-btn');
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const newPasswordError = document.getElementById('new-password-error');
    const confirmPasswordError = document.getElementById('confirm-password-error');
    
    const closeModal = () => {
        modal.remove();
        document.body.style.overflow = '';
        window.history.replaceState({}, document.title, window.location.pathname);
    };
    
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', () => {
            newPasswordInput.setCustomValidity('');
            if (newPasswordError) newPasswordError.textContent = '';
        });
    }
    
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', () => {
            confirmPasswordInput.setCustomValidity('');
            if (confirmPasswordError) confirmPasswordError.textContent = '';
        });
    }
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (newPasswordInput) newPasswordInput.setCustomValidity('');
        if (confirmPasswordInput) confirmPasswordInput.setCustomValidity('');
        if (newPasswordError) newPasswordError.textContent = '';
        if (confirmPasswordError) confirmPasswordError.textContent = '';
        
        const newPasswordValue = newPasswordInput.value;
        const confirmPasswordValue = confirmPasswordInput.value;
        
        if (!newPasswordValue || !newPasswordValue.trim()) {
            if (newPasswordInput) {
                newPasswordInput.setCustomValidity('Вы пропустили это поле!');
                newPasswordInput.reportValidity();
            }
            return;
        }
        if (!confirmPasswordValue || !confirmPasswordValue.trim()) {
            if (confirmPasswordInput) {
                confirmPasswordInput.setCustomValidity('Вы пропустили это поле!');
                confirmPasswordInput.reportValidity();
            }
            return;
        }
        
        const trimmedNewPassword = newPasswordValue.trim();
        const trimmedConfirmPassword = confirmPasswordValue.trim();
            
        if (trimmedNewPassword.length < 6) {
            if (newPasswordInput) {
                newPasswordInput.setCustomValidity('Пароль должен содержать минимум 6 символов');
                newPasswordInput.reportValidity();
            }
            return;
        }
            
        if (trimmedNewPassword !== trimmedConfirmPassword) {
            if (confirmPasswordInput) {
                confirmPasswordInput.setCustomValidity('Пароли не совпадают');
                confirmPasswordInput.reportValidity();
            }
            if (confirmPasswordError) {
                confirmPasswordError.textContent = 'Пароли не совпадают';
            }
                return;
            }
            
        if (confirmPasswordInput) {
            confirmPasswordInput.setCustomValidity('');
        }
        if (confirmPasswordError) {
            confirmPasswordError.textContent = '';
        }
        
        try {
            await resetPassword(token, trimmedNewPassword);
            closeModal();
            showToast('Пароль успешно изменен. Теперь вы можете войти с новым паролем.', 'success');
        } catch (err) {
            if (newPasswordInput) {
                newPasswordInput.setCustomValidity(err.message);
                newPasswordInput.reportValidity();
            }
        }
    });
    
    cancelBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function showRegisterModal() {
    const registerModal = `
        <div id="register-modal" class="modal">
            <div class="auth register-auth">
                <div class="auth-logo">
                    <div class="logo-icon">🗺️</div>
                    <div class="logo-text">MapLaF</div>
                </div>
                <h1>Регистрация</h1>
                <form id="register-form">
                    <div class="input-wrapper">
                        <input type="text" id="register-name" placeholder="Никнейм" required>
                        <span class="field-error" id="register-name-error"></span>
                    </div>
                    <div class="input-wrapper">
                        <input type="password" id="register-password" placeholder="Пароль (минимум 6 символов)" required>
                        <span class="field-error" id="register-password-error"></span>
                    </div>
                    <div class="auth-buttons">
                        <button type="submit">Зарегистрироваться</button>
                        <button type="button" id="cancel-register-btn">Отмена</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', registerModal);
    document.body.style.overflow = 'hidden';
    
    const modal = document.getElementById('register-modal');
    const form = document.getElementById('register-form');
    const cancelBtn = document.getElementById('cancel-register-btn');
    
    const closeModal = () => {
        modal.remove();
        document.body.style.overflow = '';
    };
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nameInput = document.getElementById('register-name');
        const passwordInput = document.getElementById('register-password');
        
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
        
        if (passwordValue.length < 6) {
            if (passwordInput) {
                passwordInput.setCustomValidity('Пароль должен содержать минимум 6 символов');
                passwordInput.reportValidity();
            }
            return;
        }
        
        try {
            const result = await register(name, passwordValue);
            currentUser = result.user;
            localStorage.setItem('currentUser', JSON.stringify(result.user));
            localStorage.setItem('token', result.token);
            
            showRecoveryCodeModal(result.recoveryCode);
            
            closeModal();
            updateUI();
        } catch (err) {
            if (err.message.includes('Пароль') || err.message.includes('password')) {
                if (passwordInput) {
                    passwordInput.setCustomValidity(err.message);
                    passwordInput.reportValidity();
                }
            } else if (err.message.includes('уже существует') || err.message.includes('никнейм')) {
                if (nameInput) {
                    nameInput.setCustomValidity(err.message);
                    nameInput.reportValidity();
                }
            } else {
                handleError(err.message, nameInput);
            }
        }
    });
    
    cancelBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function showConfirmModal(message, confirmText = 'Подтвердить', cancelText = 'Отмена') {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content confirm-modal">
                <h2>Подтверждение</h2>
                <p>${message}</p>
                <div class="modal-buttons">
                    <button class="confirm-btn">${confirmText}</button>
                    <button class="cancel-btn">${cancelText}</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        const closeModal = () => {
            modal.remove();
            document.body.style.overflow = '';
        };
        
        const confirmBtn = modal.querySelector('.confirm-btn');
        const cancelBtn = modal.querySelector('.cancel-btn');
        
        confirmBtn.addEventListener('click', () => {
            closeModal();
            resolve(true);
        });
        
        cancelBtn.addEventListener('click', () => {
            closeModal();
            resolve(false);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
                resolve(false);
            }
        });
    });
}

function showItemModal(item, type) {
    const locationText = item.location 
        ? (item.location.address || (item.location.latitude && item.location.longitude 
            ? `Координаты: ${item.location.latitude.toFixed(6)}, ${item.location.longitude.toFixed(6)}` 
            : 'Адрес указан'))
        : 'Место не указано';
    
    const allPhotos = item.photos || [];
    
    const photosHtml = allPhotos.length > 0
        ? `<div class="modal-photos" style="display: flex; flex-wrap: wrap; gap: 10px; margin: 15px 0;">${allPhotos.map((photo, index) => `<img loading="lazy" src="${photo}" alt="Фото" class="modal-photo" data-photo-index="${index}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; cursor: pointer; transition: transform 0.2s, border-color 0.2s; border: 2px solid #e0e0e0;" title="Нажмите для увеличения">`).join('')}</div>`
        : '<p>Фото не добавлены</p>';
    
    const phoneHtml = item.phone ? `<p><strong>Телефон для связи:</strong> ${item.phone}</p>` : '';
    
    let content = '';
    let claimButtonHtml = '';
    let deleteButtonHtml = '';
    
    const isAdmin = currentUser && currentUser.role === 'admin';
    
    if (type === 'found') {
        const status = item.isReturned ? 'Возвращено' : 'Доступно';
        const canClaim = currentUser && 
                        currentUser.role !== 'admin' &&
                        !item.isReturned && 
                        !item.isClaimed && 
                        item.foundBy.id !== currentUser.id;
        
        if (false && canClaim) {
            claimButtonHtml = `
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                    <button id="claim-found-item-btn" class="claim-btn" style="
                        background: #27ae60;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: 600;
                        width: 100%;
                        transition: background 0.3s;
                    ">Я владелец этой вещи</button>
                </div>
            `;
        }
        
        if (isAdmin) {
            deleteButtonHtml = `
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                    <button id="delete-found-item-btn" class="delete-btn" style="
                        background: #e74c3c;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: 600;
                        width: 100%;
                        transition: background 0.3s;
                    ">🗑️ Удалить объявление</button>
                </div>
            `;
        }
        
        content = `
            <h2>${item.title}</h2>
            ${photosHtml}
            <p><strong>Описание:</strong> ${item.description || 'Нет описания'}</p>
            <p><strong>Найдено:</strong> ${new Date(parseInt(item.foundAt)).toLocaleString('ru-RU')}</p>
            <p><strong>Нашел:</strong> ${item.foundBy.name}</p>
            <p><strong>Место:</strong> ${locationText}</p>
            ${phoneHtml}
            <p><strong>Статус:</strong> ${status}</p>
            ${claimButtonHtml}
            ${deleteButtonHtml}
        `;
    } else {
        const status = item.isFound ? 'Найдено' : 'Ищется';
        
        if (isAdmin) {
            deleteButtonHtml = `
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                    <button id="delete-lost-item-btn" class="delete-btn" style="
                        background: #e74c3c;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: 600;
                        width: 100%;
                        transition: background 0.3s;
                    ">🗑️ Удалить объявление</button>
                </div>
            `;
        }
        
        content = `
            <h2>${item.title}</h2>
            ${photosHtml}
            <p><strong>Описание:</strong> ${item.description}</p>
            <p><strong>Потеряно:</strong> ${new Date(parseInt(item.lostAt)).toLocaleString('ru-RU')}</p>
            <p><strong>Потерял:</strong> ${item.lostBy.name}</p>
            <p><strong>Место:</strong> ${locationText}</p>
            ${phoneHtml}
            <p><strong>Статус:</strong> ${status}</p>
            ${deleteButtonHtml}
        `;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            ${content}
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow-y: auto;
    `;
    
    const modalContentEl = modal.querySelector('.modal-content');
    if (modalContentEl) {
        modalContentEl.style.cssText = `
            background: white;
            padding: 20px;
            border-radius: 8px;
            max-width: 600px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            margin: 20px;
        `;
    }
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    const closeModal = () => {
        modal.remove();
        document.body.style.overflow = '';
    };
    
    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.style.cssText = 'position: absolute; top: 10px; right: 15px; font-size: 28px; cursor: pointer; color: #999; z-index: 10;';
        closeBtn.addEventListener('click', closeModal);
    }
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    if (modalContentEl && allPhotos.length > 0) {
        modalContentEl.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-photo')) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                
                const index = parseInt(e.target.getAttribute('data-photo-index')) || 0;
                if (allPhotos.length > 0 && index >= 0 && index < allPhotos.length) {
                    showPhotoModal(allPhotos, index);
                }
                return false;
            }
        }, true);
        
        modalContentEl.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-photo')) {
                e.preventDefault();
                e.stopPropagation();
                
                const index = parseInt(e.target.getAttribute('data-photo-index')) || 0;
                if (allPhotos.length > 0 && index >= 0 && index < allPhotos.length) {
                    showPhotoModal(allPhotos, index);
                }
                return false;
            }
        });
        
        const modalPhotos = modal.querySelectorAll('.modal-photo');
        modalPhotos.forEach((photoEl) => {
            photoEl.addEventListener('mouseenter', () => {
                photoEl.style.transform = 'scale(1.1)';
                photoEl.style.borderColor = '#3498db';
            });
            
            photoEl.addEventListener('mouseleave', () => {
                photoEl.style.transform = 'scale(1)';
                photoEl.style.borderColor = '#e0e0e0';
            });
            
            photoEl.style.pointerEvents = 'auto';
            photoEl.style.cursor = 'pointer';
            photoEl.style.position = 'relative';
            photoEl.style.zIndex = '1000';
        });
    }
    
    if (modalContentEl) {
        modalContentEl.addEventListener('click', (e) => {
            if (!e.target.classList.contains('modal-photo')) {
                e.stopPropagation();
            }
        });
    }
    
    if (type === 'found') {
        const claimBtn = modalContentEl?.querySelector('#claim-found-item-btn');
        if (claimBtn) {
            claimBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                if (!currentUser) {
                    showToast('Необходимо войти в систему', 'error');
                    return;
                }
                
                const confirmed = await showConfirmModal(
                    `Вы уверены, что вы владелец вещи "${item.title}"? После подтверждения другие пользователи не смогут заявить права на эту вещь.`,
                    'Подтвердить',
                    'Отмена'
                );
                
                if (confirmed) {
                    try {
                        claimBtn.disabled = true;
                        claimBtn.textContent = 'Обработка...';
                        
                        await claimFoundItem(item.id, currentUser.id);
                        
                        showToast('Вы успешно подтвердили, что являетесь владельцем этой вещи!', 'success');
                        closeModal();
                        
                        if (foundSection && !foundSection.classList.contains('hidden')) {
                            await loadFoundItems();
                        }
                    } catch (error) {
                        showToast(error.message || 'Ошибка при подтверждении владения вещью', 'error');
                        claimBtn.disabled = false;
                        claimBtn.textContent = 'Я владелец этой вещи';
                    }
                }
            });
        }
    }
    
    if (isAdmin) {
        if (type === 'found') {
            const deleteBtn = modalContentEl?.querySelector('#delete-found-item-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const confirmed = await showConfirmModal(
                        `Вы уверены, что хотите удалить объявление "${item.title}"? Это действие нельзя отменить.`,
                        'Удалить',
                        'Отмена'
                    );
                    
                    if (confirmed) {
                        try {
                            deleteBtn.disabled = true;
                            deleteBtn.textContent = 'Удаление...';
                            
                            await deleteFoundItem(item.id);
                            
                            showToast('Объявление успешно удалено', 'success');
                            closeModal();
                            
                            if (foundSection && !foundSection.classList.contains('hidden')) {
                                await loadFoundItems();
                            }
                        } catch (error) {
                            showToast(error.message || 'Ошибка при удалении объявления', 'error');
                            deleteBtn.disabled = false;
                            deleteBtn.textContent = '🗑️ Удалить объявление';
                        }
                    }
                });
            }
        } else if (type === 'lost') {
            const deleteBtn = modalContentEl?.querySelector('#delete-lost-item-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const confirmed = await showConfirmModal(
                        `Вы уверены, что хотите удалить объявление "${item.title}"? Это действие нельзя отменить.`,
                        'Удалить',
                        'Отмена'
                    );
                    
                    if (confirmed) {
                        try {
                            deleteBtn.disabled = true;
                            deleteBtn.textContent = 'Удаление...';
                            
                            await deleteLostItem(item.id);
                            
                            showToast('Объявление успешно удалено', 'success');
                            closeModal();
                            
                            if (lostSection && !lostSection.classList.contains('hidden')) {
                                await loadLostItems();
                            }
                        } catch (error) {
                            showToast(error.message || 'Ошибка при удалении объявления', 'error');
                            deleteBtn.disabled = false;
                            deleteBtn.textContent = '🗑️ Удалить объявление';
                        }
                    }
                });
            }
        }
    }
}

function showEditModal(item, type) {
    const existingPhotosHtml = item.photos && item.photos.length > 0
        ? `<div class="existing-photos">
            <label>Текущие фото (нажмите на фото, чтобы удалить):</label>
            <div class="photos-preview">${item.photos.map((photo, index) => `
                <div class="photo-item" data-index="${index}" style="position: relative; display: inline-block; margin: 5px; cursor: pointer;">
                    <img src="${photo}" alt="Фото" style="width: 100px; height: 100px; object-fit: cover; border-radius: 4px; border: 2px solid #ddd;">
                    <div class="photo-overlay" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; opacity: 0; transition: opacity 0.2s;">Удалить</div>
                </div>
            `).join('')}</div>
        </div>`
        : '';
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <span class="close-modal">&times;</span>
            <h2>Редактировать ${type === 'found' ? 'найденную' : 'потерянную'} вещь</h2>
            <form id="edit-item-form" class="form">
                <input type="text" id="edit-title" placeholder="Название" value="${item.title}" required>
                <textarea id="edit-description" placeholder="Описание" ${type === 'lost' ? 'required' : ''}>${item.description || ''}</textarea>
                <div class="input-wrapper">
                    <input type="tel" id="edit-phone" placeholder="Например, 8-911-678-90-90" value="${item.phone || ''}">
                    <span class="field-error" id="edit-phone-error"></span>
                </div>
                ${existingPhotosHtml}
                <div class="photo-upload">
                    <label for="edit-photos">Добавить фото:</label>
                    <input type="file" id="edit-photos" multiple accept="image/*">
                    <div id="edit-photos-preview" class="photos-preview"></div>
                </div>
                ${type === 'found' ? `
                    <div style="margin: 15px 0;">
                        <label style="display: flex; align-items: center; cursor: pointer;">
                            <input type="checkbox" id="edit-is-returned" ${item.isReturned ? 'checked' : ''} style="margin-right: 8px; width: auto;">
                            <span>Отметить как возвращенную</span>
                        </label>
                    </div>
                ` : ''}
                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button type="submit" style="flex: 1;">Сохранить</button>
                    <button type="button" class="cancel-btn" style="flex: 1;">Отмена</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const form = modal.querySelector('#edit-item-form');
    const closeBtn = modal.querySelector('.close-modal');
    const cancelBtn = modal.querySelector('.cancel-btn');
    
    let currentPhotos = [...(item.photos || [])];
    
    modal.querySelectorAll('.photo-item').forEach(photoItem => {
        const index = parseInt(photoItem.dataset.index);
        const overlay = photoItem.querySelector('.photo-overlay');
        
        photoItem.addEventListener('mouseenter', () => {
            overlay.style.opacity = '1';
        });
        
        photoItem.addEventListener('mouseleave', () => {
            overlay.style.opacity = '0';
        });
        
        photoItem.addEventListener('click', () => {
            currentPhotos.splice(index, 1);
            showEditModal({ ...item, photos: currentPhotos }, type);
            modal.remove();
        });
    });
    
    const photosInput = modal.querySelector('#edit-photos');
    if (photosInput) {
        photosInput.addEventListener('change', () => {
            showPhotoPreview('edit-photos', 'edit-photos-preview');
        });
    }
    
    const editPhoneInput = modal.querySelector('#edit-phone');
    const editPhoneError = modal.querySelector('#edit-phone-error');
    if (editPhoneInput) {
        editPhoneInput.addEventListener('input', (e) => {
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
                    if (editPhoneError) editPhoneError.textContent = '';
                } catch (phoneErr) {
                    e.target.classList.add('error');
                    if (editPhoneError) editPhoneError.textContent = phoneErr.message;
                }
            } else {
                const currentError = editPhoneError ? editPhoneError.textContent : '';
                if (currentError && !currentError.includes('Вы пропустили')) {
                    e.target.classList.remove('error');
                    if (editPhoneError) editPhoneError.textContent = '';
                }
            }
        });
        editPhoneInput.addEventListener('focus', (e) => {
            const currentError = editPhoneError ? editPhoneError.textContent : '';
            if (currentError && !currentError.includes('Вы пропустили')) {
                e.target.classList.remove('error');
                if (editPhoneError) editPhoneError.textContent = '';
            }
            
            if (!e.target.value || e.target.value.trim() === '') {
                e.target.value = '8';
            }
        });
        editPhoneInput.addEventListener('keydown', (e) => {
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
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const editPhoneInput = modal.querySelector('#edit-phone');
        const editPhoneError = modal.querySelector('#edit-phone-error');
        if (editPhoneError) editPhoneError.textContent = '';
        
        try {
            const title = validateRequired(modal.querySelector('#edit-title').value, 'Название');
            const description = type === 'lost' 
                ? validateRequired(modal.querySelector('#edit-description').value, 'Описание')
                : modal.querySelector('#edit-description').value.trim();
            const phoneInput = modal.querySelector('#edit-phone').value.trim();
            let phone = null;
            if (phoneInput) {
                try {
                    phone = validatePhone(phoneInput);
                } catch (phoneErr) {
                    if (editPhoneInput) {
                        editPhoneInput.classList.add('error');
                    }
                    if (editPhoneError) {
                        editPhoneError.textContent = phoneErr.message;
                    }
                    return;
                }
            }
            const isReturned = type === 'found' ? modal.querySelector('#edit-is-returned').checked : null;
            
            const newPhotos = await getPhotosFromInput('edit-photos');
            const allPhotos = [...currentPhotos, ...newPhotos];
            
            if (type === 'found') {
                await updateFoundItem(item.id, title, description, phone, allPhotos, isReturned);
                loadMyFoundItems();
            } else {
                await updateLostItem(item.id, title, description, phone, allPhotos);
                loadMyLostItems();
            }
            
            modal.remove();
        } catch (err) {
            if (!err.message || !err.message.includes('Телефон должен быть')) {
                handleError(err);
            }
        }
    });
    
    closeBtn.addEventListener('click', () => modal.remove());
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => modal.remove());
    }
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}
