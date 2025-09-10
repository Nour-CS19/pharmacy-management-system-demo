// Fixed Complete Working Mobile Navigation with CRUD System
// All form inputs and buttons now work properly

class MobileNavigation {
    constructor() {
        this.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        this.mainNav = document.querySelector('.main-nav');
        this.dropdowns = document.querySelectorAll('.dropdown');
        this.init();
    }

    init() {
        if (!this.mobileMenuToggle || !this.mainNav) {
            console.warn('Mobile navigation elements not found');
            return;
        }
        
        this.mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
        
        this.dropdowns.forEach(dropdown => {
            const dropdownLink = dropdown.querySelector('a');
            if (dropdownLink) {
                dropdownLink.addEventListener('click', (e) => this.handleDropdownClick(e, dropdown));
            }
        });

        document.addEventListener('click', (e) => this.handleOutsideClick(e));
        window.addEventListener('resize', () => this.handleResize());
    }

    toggleMobileMenu() {
        this.mobileMenuToggle.classList.toggle('active');
        this.mainNav.classList.toggle('mobile-active');
    }

    handleDropdownClick(e, dropdown) {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            const submenu = dropdown.querySelector('.submenu');
            if (submenu) {
                submenu.classList.toggle('show');
            }
        }
    }

    handleOutsideClick(e) {
        if (!e.target.closest('.header') && this.mainNav.classList.contains('mobile-active')) {
            this.toggleMobileMenu();
        }
    }

    handleResize() {
        if (window.innerWidth > 768) {
            this.mainNav.classList.remove('mobile-active');
            this.mobileMenuToggle.classList.remove('active');
        }
    }
}

class ModalSystem {
    constructor() {
        this.modals = new Map();
        this.isInitialized = false;
        this.init();
    }

    init() {
        // Create modal structure if it doesn't exist
        this.ensureModalExists();
        
        // Initialize existing modals
        document.querySelectorAll('.modal').forEach(modal => {
            this.registerModal(modal);
        });

        this.setupEventListeners();
        this.setupMobileOptimizations();
        this.isInitialized = true;
        console.log('ModalSystem initialized successfully');
    }

    ensureModalExists() {
        if (!document.getElementById('crudModal')) {
            const modalHTML = `
                <div id="crudModal" class="modal half-page-modal">
                    <div class="modal-backdrop"></div>
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3 id="crudTitle">إدارة البيانات</h3>
                            <button class="modal-close" type="button" aria-label="Close">&times;</button>
                        </div>
                        <div class="modal-body" id="crudBody">
                            <!-- Content will be inserted here -->
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }
    }

    registerModal(modal) {
        this.modals.set(modal.id, {
            element: modal,
            content: modal.querySelector('.modal-content'),
            body: modal.querySelector('.modal-body'),
            isOpen: false
        });
    }

    setupEventListeners() {
        // Use event delegation to handle dynamically created buttons
        document.addEventListener('click', (e) => {
            // Handle close buttons
            if (e.target.matches('.modal-close') || e.target.innerHTML === '×') {
                e.preventDefault();
                e.stopPropagation();
                const modal = e.target.closest('.modal');
                if (modal) {
                    console.log('Close button clicked for modal:', modal.id);
                    this.closeModal(modal.id);
                }
                return;
            }

            // Handle backdrop clicks
            if (e.target.matches('.modal-backdrop')) {
                e.preventDefault();
                e.stopPropagation();
                const modal = e.target.closest('.modal');
                if (modal) {
                    console.log('Backdrop clicked for modal:', modal.id);
                    this.closeModal(modal.id);
                }
                return;
            }

            // Handle modal trigger buttons
            if (e.target.matches('[data-modal]') || e.target.closest('[data-modal]')) {
                e.preventDefault();
                e.stopPropagation();
                const trigger = e.target.closest('[data-modal]') || e.target;
                const modalId = trigger.getAttribute('data-modal');
                console.log('Modal trigger clicked:', modalId);
                this.openModal(modalId);
                return;
            }
        });

        // ESC key events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    setupMobileOptimizations() {
        // Touch events for mobile
        let startY = 0;
        let currentY = 0;
        let isDragging = false;

        document.addEventListener('touchstart', (e) => {
            const modalContent = e.target.closest('.modal-content');
            if (modalContent && modalContent.closest('.half-page-modal')) {
                startY = e.touches[0].clientY;
                isDragging = true;
            }
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            currentY = e.touches[0].clientY;
            const diff = currentY - startY;
            
            if (diff > 0) {
                const modalContent = e.target.closest('.modal-content');
                if (modalContent) {
                    modalContent.style.transform = `translateY(${Math.min(diff, 100)}px)`;
                }
            }
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            const diff = currentY - startY;
            const modalContent = e.target.closest('.modal-content');
            
            if (diff > 100 && modalContent) {
                const modal = modalContent.closest('.modal');
                if (modal) this.closeModal(modal.id);
            } else if (modalContent) {
                modalContent.style.transform = '';
            }
            
            isDragging = false;
        }, { passive: true });

        // Viewport changes (keyboard handling)
        this.setupViewportHandler();
    }

    setupViewportHandler() {
        let lastHeight = window.innerHeight;
        
        const handleResize = () => {
            const currentHeight = window.innerHeight;
            const heightDiff = lastHeight - currentHeight;
            
            if (heightDiff > 150) {
                document.body.classList.add('keyboard-open');
            } else {
                document.body.classList.remove('keyboard-open');
            }
            
            lastHeight = currentHeight;
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', () => {
            setTimeout(handleResize, 500);
        });
    }

    openModal(modalId, content = null) {
        console.log('Opening modal:', modalId);
        const modal = this.modals.get(modalId);
        if (!modal) {
            console.error(`Modal ${modalId} not found`);
            return;
        }

        // Set content if provided
        if (content && modal.body) {
            modal.body.innerHTML = content;
        }

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        document.body.classList.add('modal-open');
        
        // Show modal
        modal.element.style.display = 'block';
        modal.element.classList.add('modal-active');
        modal.isOpen = true;
        
        // Trigger reflow
        modal.element.offsetHeight;
        
        // Focus management
        setTimeout(() => {
            const firstInput = modal.element.querySelector('input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])');
            if (firstInput) {
                firstInput.focus();
            }
        }, 300);

        console.log(`Modal ${modalId} opened successfully`);
    }

    closeModal(modalId) {
        console.log('Closing modal:', modalId);
        const modal = this.modals.get(modalId);
        if (!modal || !modal.isOpen) {
            console.log('Modal not found or not open');
            return;
        }

        modal.element.classList.remove('modal-active');
        modal.isOpen = false;
        
        setTimeout(() => {
            modal.element.style.display = 'none';
            
            // Check if any other modals are open
            const hasOpenModal = Array.from(this.modals.values()).some(m => m.isOpen);
            if (!hasOpenModal) {
                document.body.style.overflow = '';
                document.body.classList.remove('modal-open', 'keyboard-open');
            }
        }, 300);

        console.log(`Modal ${modalId} closed successfully`);
    }

    closeAllModals() {
        this.modals.forEach((modal, id) => {
            if (modal.isOpen) this.closeModal(id);
        });
    }
}

class CrudSystem {
    constructor(modalSystem) {
        this.modalSystem = modalSystem;
        this.currentData = new Map();
        this.init();
    }

    init() {
        this.loadSampleData();
        this.setupEventListeners();
        console.log('CrudSystem initialized');
    }

    loadSampleData() {
        // Sample data for demonstration
        this.currentData.set('pharmacy', [
            { id: 1, name: 'الحساب الرئيسي', balance: 5000, date: '2025-09-10' },
            { id: 2, name: 'حساب التوفير', balance: 3000, date: '2025-09-05' }
        ]);

        this.currentData.set('customer', [
            { id: 1, name: 'محمد أحمد', phone: '0598056654', address: 'غزة', lastVisit: '2025-09-10' },
            { id: 2, name: 'سارة محمود', phone: '0599123456', address: 'رفح', lastVisit: '2025-09-08' }
        ]);

        this.currentData.set('staff', [
            { id: 1, name: 'أحمد خالد', position: 'صيدلي', phone: '0598056654', hireDate: '2024-01-15' },
            { id: 2, name: 'فاطمة علي', position: 'ممرضة', phone: '0597654321', hireDate: '2024-03-20' }
        ]);
    }

    setupEventListeners() {
        // Use event delegation for better handling of dynamic content
        document.addEventListener('click', (e) => {
            // Handle CRUD action buttons
            const crudButton = e.target.closest('[data-crud]');
            if (crudButton) {
                e.preventDefault();
                e.stopPropagation();
                const action = crudButton.getAttribute('data-crud');
                const type = crudButton.getAttribute('data-type');
                const itemId = crudButton.getAttribute('data-item-id');
                console.log('CRUD button clicked:', { action, type, itemId });
                this.handleCrudAction(action, type, itemId);
                return;
            }
        });

        // Handle form submissions using event delegation
        document.addEventListener('submit', (e) => {
            if (e.target.matches('.crud-form')) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Form submitted');
                this.handleFormSubmit(e);
                return;
            }
        });
    }

    handleCrudAction(action, type, itemId) {
        console.log(`CRUD Action: ${action}, Type: ${type}, ID: ${itemId}`);
        
        const title = this.getModalTitle(action, type);
        const content = this.generateContent(action, type, itemId);
        
        // Update modal title
        const titleElement = document.getElementById('crudTitle');
        if (titleElement) titleElement.textContent = title;
        
        // Open modal with content
        this.modalSystem.openModal('crudModal', content);
    }

    getModalTitle(action, type) {
        const titles = {
            pharmacy: {
                add: 'إضافة حساب جديد',
                edit: 'تعديل الحساب',
                delete: 'حذف الحساب',
                view: 'عرض الحسابات'
            },
            customer: {
                add: 'إضافة عميل جديد',
                edit: 'تعديل بيانات العميل',
                delete: 'حذف العميل',
                view: 'عرض العملاء'
            },
            staff: {
                add: 'إضافة موظف جديد',
                edit: 'تعديل بيانات الموظف',
                delete: 'حذف الموظف',
                view: 'عرض الموظفين'
            }
        };

        return titles[type]?.[action] || 'إدارة البيانات';
    }

    generateContent(action, type, itemId) {
        switch (action) {
            case 'view':
                return this.generateViewContent(type);
            case 'add':
                return this.generateFormContent(type, 'add');
            case 'edit':
                return this.generateFormContent(type, 'edit', itemId);
            case 'delete':
                return this.generateDeleteContent(type, itemId);
            default:
                return '<p>المحتوى غير متاح</p>';
        }
    }

    generateViewContent(type) {
        const data = this.currentData.get(type) || [];
        const headers = this.getTableHeaders(type);
        
        let tableRows = '';
        data.forEach(item => {
            const row = this.generateTableRow(type, item);
            tableRows += row;
        });

        return `
            <div class="crud-view-container">
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                ${headers.map(header => `<th>${header}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows || '<tr><td colspan="' + headers.length + '" style="text-align: center; padding: 20px;">لا توجد بيانات</td></tr>'}
                        </tbody>
                    </table>
                </div>
                <div class="view-actions">
                    <button type="button" class="btn btn-primary" data-crud="add" data-type="${type}">
                        <i class="fas fa-plus"></i>
                        <span>إضافة جديد</span>
                    </button>
                </div>
            </div>
        `;
    }

    getTableHeaders(type) {
        const headers = {
            pharmacy: ['اسم الحساب', 'الرصيد', 'التاريخ', 'الإجراءات'],
            customer: ['الاسم', 'الهاتف', 'العنوان', 'الإجراءات'],
            staff: ['الاسم', 'المنصب', 'الهاتف', 'الإجراءات']
        };
        return headers[type] || [];
    }

    generateTableRow(type, item) {
        const actionButtons = `
            <div class="action-buttons">
                <button type="button" class="btn btn-sm btn-edit" data-crud="edit" data-type="${type}" data-item-id="${item.id}">
                    <i class="fas fa-edit"></i>
                    <span>تعديل</span>
                </button>
                <button type="button" class="btn btn-sm btn-delete" data-crud="delete" data-type="${type}" data-item-id="${item.id}">
                    <i class="fas fa-trash"></i>
                    <span>حذف</span>
                </button>
            </div>
        `;

        let cells = '';
        switch (type) {
            case 'pharmacy':
                cells = `
                    <td >${item.name}</td>
                    <td>${item.balance} د.أ</td>
                    <td>${item.date}</td>
                    <td>${actionButtons}</td>
                `;
                break;
            case 'customer':
                cells = `
                    <td>${item.name}</td>
                    <td>${item.phone}</td>
                    <td>${item.address || '-'}</td>
                    <td>${actionButtons}</td>
                `;
                break;
            case 'staff':
                cells = `
                    <td>${item.name}</td>
                    <td>${item.position}</td>
                    <td>${item.phone}</td>
                    <td>${actionButtons}</td>
                `;
                break;
        }

        return `<tr>${cells}</tr>`;
    }

    generateFormContent(type, action, itemId = null) {
        const item = itemId ? this.currentData.get(type)?.find(i => i.id == itemId) : {};
        const isEdit = action === 'edit';

        let formFields = '';
        switch (type) {
            case 'pharmacy':
                formFields = `
                    <div class="form-row">
                        <div class="form-group">
                            <label for="pharmacy-name">اسم الحساب <span class="required">*</span></label>
                            <input type="text" id="pharmacy-name" name="name" value="${item.name || ''}" 
                                   placeholder="أدخل اسم الحساب" required autocomplete="off">
                        </div>
                        <div class="form-group">
                            <label for="pharmacy-balance">الرصيد <span class="required">*</span></label>
                            <input type="number" id="pharmacy-balance" name="balance" value="${item.balance || ''}" 
                                   placeholder="أدخل الرصيد" required step="0.01" min="0" autocomplete="off">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="pharmacy-date">التاريخ</label>
                            <input type="date" id="pharmacy-date" name="date" value="${item.date || new Date().toISOString().split('T')[0]}" autocomplete="off">
                        </div>
                    </div>
                `;
                break;
            case 'customer':
                formFields = `
                    <div class="form-row">
                        <div class="form-group">
                            <label for="customer-name">اسم العميل <span class="required">*</span></label>
                            <input type="text" id="customer-name" name="name" value="${item.name || ''}" 
                                   placeholder="أدخل اسم العميل" required autocomplete="off">
                        </div>
                        <div class="form-group">
                            <label for="customer-phone">رقم الهاتف <span class="required">*</span></label>
                            <input type="tel" id="customer-phone" name="phone" value="${item.phone || ''}" 
                                   placeholder="أدخل رقم الهاتف" required autocomplete="off">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="customer-address">العنوان</label>
                            <input type="text" id="customer-address" name="address" value="${item.address || ''}" 
                                   placeholder="أدخل العنوان" autocomplete="off">
                        </div>
                        <div class="form-group">
                            <label for="customer-lastVisit">آخر زيارة</label>
                            <input type="date" id="customer-lastVisit" name="lastVisit" value="${item.lastVisit || ''}" autocomplete="off">
                        </div>
                    </div>
                `;
                break;
            case 'staff':
                formFields = `
                    <div class="form-row">
                        <div class="form-group">
                            <label for="staff-name">اسم الموظف <span class="required">*</span></label>
                            <input type="text" id="staff-name" name="name" value="${item.name || ''}" 
                                   placeholder="أدخل اسم الموظف" required autocomplete="off">
                        </div>
                        <div class="form-group">
                            <label for="staff-position">المنصب <span class="required">*</span></label>
                            <select id="staff-position" name="position" required autocomplete="off">
                                <option value="">اختر المنصب</option>
                                <option value="صيدلي" ${item.position === 'صيدلي' ? 'selected' : ''}>صيدلي</option>
                                <option value="ممرض" ${item.position === 'ممرض' ? 'selected' : ''}>ممرض</option>
                                <option value="ممرضة" ${item.position === 'ممرضة' ? 'selected' : ''}>ممرضة</option>
                                <option value="مساعد" ${item.position === 'مساعد' ? 'selected' : ''}>مساعد</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="staff-phone">رقم الهاتف <span class="required">*</span></label>
                            <input type="tel" id="staff-phone" name="phone" value="${item.phone || ''}" 
                                   placeholder="أدخل رقم الهاتف" required autocomplete="off">
                        </div>
                        <div class="form-group">
                            <label for="staff-hireDate">تاريخ التعيين</label>
                            <input type="date" id="staff-hireDate" name="hireDate" value="${item.hireDate || ''}" autocomplete="off">
                        </div>
                    </div>
                `;
                break;
        }

        return `
            <div class="crud-form-container">
                <form class="crud-form" data-action="${action}" data-type="${type}" data-item-id="${itemId || ''}" novalidate>
                    ${formFields}
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i>
                            <span>${isEdit ? 'تحديث' : 'حفظ'}</span>
                        </button>
                        <button type="button" class="btn btn-secondary modal-close">
                            <i class="fas fa-times"></i>
                            <span>إلغاء</span>
                        </button>
                    </div>
                </form>
            </div>
        `;
    }

    generateDeleteContent(type, itemId) {
        const item = this.currentData.get(type)?.find(i => i.id == itemId);
        const itemName = item?.name || 'العنصر';

        return `
            <div class="delete-confirmation">
                <div class="delete-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h4>تأكيد الحذف</h4>
                <p class="delete-message">هل أنت متأكد من حذف <strong>"${itemName}"</strong>؟</p>
                <p class="delete-warning">لا يمكن التراجع عن هذا الإجراء.</p>
                <div class="form-actions">
                    <button type="button" class="btn btn-danger" data-crud="confirm-delete" data-type="${type}" data-item-id="${itemId}">
                        <i class="fas fa-trash"></i>
                        <span>حذف</span>
                    </button>
                    <button type="button" class="btn btn-secondary modal-close">
                        <i class="fas fa-times"></i>
                        <span>إلغاء</span>
                    </button>
                </div>
            </div>
        `;
    }

    handleFormSubmit(e) {
        console.log('handleFormSubmit called');
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const action = form.getAttribute('data-action');
        const type = form.getAttribute('data-type');
        const itemId = form.getAttribute('data-item-id');

        console.log('Form data:', data);
        console.log('Action:', action, 'Type:', type, 'ItemId:', itemId);

        // Clear previous error states
        form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

        // Validate required fields
        const requiredInputs = form.querySelectorAll('input[required], select[required]');
        let hasErrors = false;

        requiredInputs.forEach(input => {
            const value = input.value.trim();
            if (!value) {
                input.classList.add('error');
                hasErrors = true;
                console.log('Required field empty:', input.name);
            } else {
                input.classList.remove('error');
            }
        });

        if (hasErrors) {
            this.showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
            return;
        }

        // Process data based on action
        let items = this.currentData.get(type) || [];
        
        try {
            if (action === 'add') {
                const maxId = items.length > 0 ? Math.max(...items.map(item => item.id)) : 0;
                data.id = maxId + 1;
                
                // Convert numeric fields
                if (data.balance) data.balance = parseFloat(data.balance);
                
                items.push(data);
                this.currentData.set(type, items);
                this.showNotification('تم إضافة العنصر بنجاح', 'success');
                console.log('Item added successfully:', data);
                
            } else if (action === 'edit' && itemId) {
                const index = items.findIndex(item => item.id == itemId);
                if (index !== -1) {
                    data.id = parseInt(itemId);
                    if (data.balance) data.balance = parseFloat(data.balance);
                    items[index] = { ...items[index], ...data };
                    this.currentData.set(type, items);
                    this.showNotification('تم تحديث العنصر بنجاح', 'success');
                    console.log('Item updated successfully:', data);
                } else {
                    this.showNotification('العنصر غير موجود', 'error');
                    return;
                }
            }

            // Close modal and refresh view
            this.modalSystem.closeModal('crudModal');
            
            setTimeout(() => {
                this.handleCrudAction('view', type);
            }, 500);
            
        } catch (error) {
            console.error('Error saving data:', error);
            this.showNotification('حدث خطأ أثناء الحفظ', 'error');
        }
    }

    handleDelete(type, itemId) {
        console.log('handleDelete called:', type, itemId);
        try {
            let items = this.currentData.get(type) || [];
            const index = items.findIndex(item => item.id == itemId);
            
            if (index !== -1) {
                const deletedItem = items.splice(index, 1)[0];
                this.currentData.set(type, items);
                this.showNotification('تم حذف العنصر بنجاح', 'success');
                console.log('Item deleted successfully:', deletedItem);
                
                this.modalSystem.closeModal('crudModal');
                
                setTimeout(() => {
                    this.handleCrudAction('view', type);
                }, 500);
            } else {
                this.showNotification('العنصر غير موجود', 'error');
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            this.showNotification('حدث خطأ أثناء الحذف', 'error');
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notification
        const existing = document.getElementById('notification');
        if (existing) existing.remove();

        // Create notification element
        const notification = document.createElement('div');
        notification.id = 'notification';
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Hide notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing systems...');
    
    try {
        window.mobileNav = new MobileNavigation();
        window.modalSystem = new ModalSystem();
        window.crudSystem = new CrudSystem(window.modalSystem);

        // Add additional event delegation for confirm-delete buttons specifically
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-crud="confirm-delete"]') || e.target.closest('[data-crud="confirm-delete"]')) {
                e.preventDefault();
                e.stopPropagation();
                const button = e.target.closest('[data-crud="confirm-delete"]') || e.target;
                const type = button.getAttribute('data-type');
                const itemId = button.getAttribute('data-item-id');
                console.log('Confirm delete clicked:', type, itemId);
                window.crudSystem.handleDelete(type, itemId);
                return;
            }
        });

        // Add test buttons if they don't exist
        if (!document.querySelector('[data-crud]')) {
            const testContainer = document.createElement('div');
            testContainer.style.cssText = 'padding: 20px; text-align: center;';
            testContainer.innerHTML = `
                <h2>نظام إدارة الصيدلية - عرض توضيحي</h2>
                <div style="margin: 20px 0; display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                    <button class="btn btn-primary" data-crud="view" data-type="pharmacy">
                        <i class="fas fa-eye"></i> عرض الحسابات
                    </button>
                    <button class="btn btn-primary" data-crud="view" data-type="customer">
                        <i class="fas fa-users"></i> عرض العملاء
                    </button>
                    <button class="btn btn-primary" data-crud="view" data-type="staff">
                        <i class="fas fa-user-tie"></i> عرض الموظفين
                    </button>
                </div>
            `;
            document.body.appendChild(testContainer);
        }

        console.log('All systems initialized successfully');
        
    } catch (error) {
        console.error('Error initializing systems:', error);
    }
});

// Add the CSS styles
const css = `
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 16px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.2s ease;
    min-height: 40px;
    white-space: nowrap;
    background: #007bff;
    color: white;
}

.btn:hover {
    background: #0056b3;
    transform: translateY(-1px);
}

.btn-sm {
    padding: 6px 12px;
    font-size: 12px;
    min-height: 32px;
}

.btn-secondary {
    background: #6c757d;
}

.btn-secondary:hover {
    background: #545b62;
}

.btn-danger {
    background: #dc3545;
}

.btn-danger:hover {
    background: #c82333;
}

.btn-edit {
    background: #28a745;
}

.btn-edit:hover {
    background: #1e7e34;
}

.btn-delete {
    background: #dc3545;
}

/* Modal Styles */
.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}

.modal.modal-active {
    opacity: 1;
    visibility: visible;
}

.modal-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
}

.modal-content {
    position: relative;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    max-width: 90vw;
    max-height: 90vh;
    margin: 20px auto;
    display: flex;
    flex-direction: column;
    transform: translateY(-50px) scale(0.9);
    transition: all 0.3s ease;
}

.modal.modal-active .modal-content {
    transform: translateY(0) scale(1);
}

.half-page-modal .modal-content {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    max-width: 100%;
    height: 70vh;
    max-height: 70vh;
    margin: 0;
    border-radius: 20px 20px 0 0;
    transform: translateY(100%);
}

.half-page-modal.modal-active .modal-content {
    transform: translateY(0);
}

@media (min-width: 768px) {
    .modal-content {
        width: 80vw;
        max-width: 800px;
        margin: 5% auto;
        height: auto;
        max-height: 80vh;
    }
    
    .half-page-modal .modal-content {
        position: relative;
        bottom: auto;
        left: auto;
        right: auto;
        width: 80vw;
        max-width: 800px;
        height: 60vh;
        max-height: 60vh;
        margin: 5% auto;
        border-radius: 12px;
        transform: translateY(-50px) scale(0.9);
    }
    
    .half-page-modal.modal-active .modal-content {
        transform: translateY(0) scale(1);
    }
}

/* Modal Header */
.modal-header {
    padding: 20px 24px 15px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
}

.modal-header h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #ffffff;
}

.modal-close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
    padding: 5px;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
}

.modal-close:hover {
    background-color: #f5f5f5;
}

.modal-body {
    flex: 1;
    padding: 20px 24px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}

.crud-form-container {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.crud-form {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;
}

@media (max-width: 480px) {
    .form-row {
        grid-template-columns: 1fr;
        gap: 12px;
    }
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group label {
    font-weight: 600;
    margin-bottom: 8px;
    color: #333;
    font-size: 14px;
}

.required {
    color: #dc3545;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e1e5e9;
    border-radius: 8px;
    font-size: 16px;
    font-family: inherit;
    transition: all 0.2s ease;
    background-color: #fff;
    box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.form-group input.error,
.form-group select.error {
    border-color: #dc3545;
    box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.form-group input::placeholder {
    color: #999;
}

.form-group select {
    cursor: pointer;
}

/* Form Actions */
.form-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    padding-top: 20px;
    border-top: 1px solid #eee;
    margin-top: auto;
    flex-shrink: 0;
}

.form-actions .btn {
    min-width: 100px;
    font-size: 14px;
}

.form-actions .btn span {
    display: inline-block;
    color: inherit;
    font-weight: 500;
}

@media (max-width: 768px) {
    .form-actions {
        justify-content: center;
    }
    
    .form-actions .btn {
        flex: 1;
        max-width: 120px;
        font-size: 13px;
    }
}

.table-responsive {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    max-height: 400px;
    overflow-y: auto;
}

.data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
    margin: 0;
}

.data-table th,
.data-table td {
    padding: 12px;
    text-align: right;
    border-bottom: 1px solid #dee2e6;
    vertical-align: middle;
}

.data-table th {
    background-color: #f8f9fa;
    font-weight: 600;
    color:#ffffff;
    position: sticky;
    top: 0;
    z-index: 10;
}

.data-table tbody tr:hover {
    background-color: #f8f9fa;
}

.data-table tbody tr:last-child td {
    border-bottom: none;
}

/* Action Buttons in Table */
.action-buttons {
    display: flex;
    gap: 6px;
    justify-content: center;
    flex-wrap: wrap;
}

@media (max-width: 768px) {
    .data-table {
        font-size: 12px;
    }
    
    .data-table th,
    .data-table td {
        padding: 8px 6px;
    }
    
    .action-buttons {
        flex-direction: column;
        gap: 4px;
        min-width: 80px;
    }
}

.view-actions {
    text-align: center;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #eee;
}

.delete-confirmation {
    text-align: center;
    padding: 20px 0;
}

.delete-icon {
    font-size: 48px;
    color: #ffc107;
    margin-bottom: 20px;
}

.delete-confirmation h4 {
    margin: 0 0 15px 0;
    color: #333;
    font-size: 20px;
}

.delete-message {
    font-size: 16px;
    margin-bottom: 10px;
    color: #333;
}

.delete-warning {
    color: #666;
    margin-bottom: 30px;
    font-size: 14px;
}

.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    max-width: 300px;
    transform: translateX(350px);
    transition: transform 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.notification.show {
    transform: translateX(0);
}

.notification-success {
    background-color: #28a745;
}

.notification-error {
    background-color: #dc3545;
}

.notification-info {
    background-color: #007bff;
}

.notification-warning {
    background-color: #ffc107;
    color: #212529;
}

@media (max-width: 768px) {
    .notification {
        right: 10px;
        left: 10px;
        max-width: none;
        transform: translateY(-100px);
        top: 10px;
    }
    
    .notification.show {
        transform: translateY(0);
    }
}

.modal-open {
    overflow: hidden !important;
}

.keyboard-open .half-page-modal .modal-content {
    height: 80vh !important;
    max-height: 80vh !important;
}

.mobile-menu-toggle.active {
    background-color: rgba(255,255,255,0.1);
}

.main-nav.mobile-active {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

/* RTL Support */
[dir="rtl"] .notification {
    right: auto;
    left: 20px;
    transform: translateX(-350px);
}

[dir="rtl"] .notification.show {
    transform: translateX(0);
}

@media (max-width: 768px) {
    [dir="rtl"] .notification {
        left: 10px;
        right: 10px;
        transform: translateY(-100px);
    }
    
    [dir="rtl"] .notification.show {
        transform: translateY(0);
    }
}

/* Responsive Design */
@media (max-width: 480px) {
    .modal-header {
        padding: 15px 20px 12px;
    }
    
    .modal-header h3 {
        font-size: 16px;
    }
    
    .modal-body {
        padding: 15px 20px;
    }
    
    .form-group label {
        font-size: 13px;
    }
}

.btn:focus,
.form-group input:focus,
.form-group select:focus,
.modal-close:focus {
    outline: 2px solid #007bff;
    outline-offset: 2px;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
}

/* Animation Performance */
@media (prefers-reduced-motion: reduce) {
    * {
        transition: none !important;
        animation: none !important;
    }
}
`;

// Apply styles
if (!document.getElementById('mobile-nav-styles')) {
    const style = document.createElement('style');
    style.id = 'mobile-nav-styles';
    style.textContent = css;
    document.head.appendChild(style);
}