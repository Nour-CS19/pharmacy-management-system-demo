// Enhanced Mobile Navigation
class MobileNavigation {
    constructor() {
        this.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        this.mainNav = document.querySelector('.main-nav');
        this.dropdowns = document.querySelectorAll('.dropdown');
        this.init();
    }

    init() {
        if (!this.mobileMenuToggle || !this.mainNav) return;
        
        // Mobile menu toggle
        this.mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
        
        // Handle dropdown clicks on mobile
        this.dropdowns.forEach(dropdown => {
            const dropdownLink = dropdown.querySelector('a');
            if (dropdownLink) {
                dropdownLink.addEventListener('click', (e) => this.handleDropdownClick(e, dropdown));
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => this.handleOutsideClick(e));
        
        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
    }

    toggleMobileMenu() {
        this.mobileMenuToggle.classList.toggle('active');
        
        if (this.mainNav.classList.contains('mobile-nav')) {
            // Close mobile menu
            this.mainNav.classList.remove('active');
            setTimeout(() => {
                this.mainNav.classList.remove('mobile-nav');
                this.hideAllSubmenus();
            }, 300);
        } else {
            // Open mobile menu
            this.mainNav.classList.add('mobile-nav');
            setTimeout(() => {
                this.mainNav.classList.add('active');
            }, 10);
        }
    }

    handleDropdownClick(e, dropdown) {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            const submenu = dropdown.querySelector('.submenu');
            if (submenu) {
                const isOpen = submenu.style.display === 'grid';
                this.hideAllSubmenus();
                if (!isOpen) {
                    submenu.style.display = 'grid';
                    submenu.style.opacity = '1';
                    submenu.style.visibility = 'visible';
                }
            }
        }
    }

    handleOutsideClick(e) {
        if (!e.target.closest('.header') && this.mainNav.classList.contains('active')) {
            this.toggleMobileMenu();
        }
    }

    handleResize() {
        if (window.innerWidth > 768) {
            this.mainNav.classList.remove('mobile-nav', 'active');
            this.mobileMenuToggle.classList.remove('active');
            this.hideAllSubmenus();
        }
    }

    hideAllSubmenus() {
        const submenus = document.querySelectorAll('.submenu');
        submenus.forEach(submenu => {
            submenu.style.display = '';
            submenu.style.opacity = '';
            submenu.style.visibility = '';
        });
    }
}

// Enhanced Modal System
class ModalSystem {
    constructor() {
        this.modals = new Map();
        this.init();
    }

    init() {
        // Initialize all modals
        document.querySelectorAll('.modal').forEach(modal => {
            this.modals.set(modal.id, {
                element: modal,
                content: modal.querySelector('.modal-content'),
                isOpen: false
            });
        });

        // Handle modal close buttons
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) this.closeModal(modal.id);
            });
        });

        // Handle background clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    openModal(modalId, content = null) {
        const modal = this.modals.get(modalId);
        if (!modal) return;

        if (content) {
            const bodyElement = modal.element.querySelector('#crudBody') || modal.element.querySelector('.modal-body');
            if (bodyElement) bodyElement.innerHTML = content;
        }

        modal.element.style.display = 'block';
        modal.isOpen = true;
        
        // Prevent body scrolling
        document.body.style.overflow = 'hidden';
        
        // Animate in
        setTimeout(() => {
            modal.content.style.transform = 'translateY(0) scale(1)';
            modal.content.style.opacity = '1';
        }, 10);
    }

    closeModal(modalId) {
        const modal = this.modals.get(modalId);
        if (!modal || !modal.isOpen) return;

        modal.content.style.transform = 'translateY(-50px) scale(0.8)';
        modal.content.style.opacity = '0';
        
        setTimeout(() => {
            modal.element.style.display = 'none';
            modal.isOpen = false;
            
            // Re-enable body scrolling if no modals are open
            if (!Array.from(this.modals.values()).some(m => m.isOpen)) {
                document.body.style.overflow = '';
            }
        }, 300);
    }

    closeAllModals() {
        this.modals.forEach((modal, id) => {
            if (modal.isOpen) this.closeModal(id);
        });
    }
}

// Enhanced Card Flip System
class CardFlipSystem {
    constructor() {
        this.cards = document.querySelectorAll('.flip-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            // Add click event for manual toggle
            card.addEventListener('click', () => this.toggleCard(card));
            
            // Add keyboard support
            card.setAttribute('tabindex', '0');
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleCard(card);
                }
            });
        });
    }

    toggleCard(card) {
        card.classList.toggle('flipped');
        
        // Add haptic feedback if available
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }

    flipAll() {
        this.cards.forEach(card => card.classList.add('flipped'));
    }

    resetAll() {
        this.cards.forEach(card => card.classList.remove('flipped'));
    }
}

// Enhanced CRUD System
class CrudSystem {
    constructor(modalSystem) {
        this.modalSystem = modalSystem;
        this.currentData = new Map();
        this.init();
    }

    init() {
        // Initialize with sample data
        this.loadSampleData();
    }

    loadSampleData() {
        this.currentData.set('pharmacy', [
            { id: 1, name: 'الحساب الرئيسي', balance: '5000 د.أ', lastTransaction: '2025-09-10' },
            { id: 2, name: 'حساب التوفير', balance: '3000 د.أ', lastTransaction: '2025-09-05' }
        ]);

        this.currentData.set('customer', [
            { id: 1, name: 'محمد أحمد', phone: '0598056654', lastVisit: '2025-09-10', address: 'غزة' },
            { id: 2, name: 'سارة محمود', phone: '0599123456', lastVisit: '2025-09-08', address: 'رفح' }
        ]);

        this.currentData.set('staff', [
            { id: 1, name: 'أحمد خالد', position: 'صيدلي', phone: '0598056654', hireDate: '2024-01-15' },
            { id: 2, name: 'فاطمة علي', position: 'ممرضة', phone: '0597654321', hireDate: '2024-03-20' }
        ]);

        this.currentData.set('inventory', [
            { id: 1, name: 'باراسيتامول', quantity: 100, expiryDate: '2026-12-31', supplier: 'شركة الأدوية' },
            { id: 2, name: 'إيبوبروفين', quantity: 75, expiryDate: '2026-08-15', supplier: 'شركة الصحة' }
        ]);

        this.currentData.set('expense', [
            { id: 1, type: 'إيجار', amount: '1000 د.أ', date: '2025-09-01', description: 'إيجار الصيدلية الشهري' },
            { id: 2, type: 'رواتب', amount: '2500 د.أ', date: '2025-09-01', description: 'رواتب الموظفين' }
        ]);
    }

    openCrudDialog(action, type, itemId = null) {
        const crudModal = document.getElementById('crudModal');
        const crudTitle = document.getElementById('crudTitle');
        
        if (!crudModal || !crudTitle) {
            console.error('CRUD modal elements not found');
            return;
        }

        const titles = {
            pharmacy: { add: 'إضافة حساب صيدلية جديد', view: 'عرض حسابات الصيدلية', edit: 'تعديل حساب صيدلية', delete: 'حذف حساب صيدلية' },
            customer: { add: 'إضافة عميل جديد', view: 'عرض العملاء', edit: 'تعديل بيانات عميل', delete: 'حذف عميل' },
            staff: { add: 'إضافة موظف جديد', view: 'عرض الموظفين', edit: 'تعديل بيانات موظف', delete: 'حذف موظف' },
            inventory: { add: 'إضافة دواء جديد', view: 'عرض المخزون', edit: 'تعديل بيانات دواء', delete: 'حذف دواء' },
            expense: { add: 'إضافة مصروف جديد', view: 'عرض المصاريف', edit: 'تعديل مصروف', delete: 'حذف مصروف' },
            reports: { view: 'عرض التقارير' }
        };

        const title = titles[type]?.[action] || 'إدارة البيانات';
        const content = this.generateContent(action, type, itemId);

        crudTitle.textContent = title;
        this.modalSystem.openModal('crudModal', content);
    }

    generateContent(action, type, itemId = null) {
        if (action === 'view') {
            return this.generateViewContent(type);
        } else if (action === 'add' || action === 'edit') {
            return this.generateFormContent(type, action, itemId);
        } else if (action === 'delete') {
            return this.generateDeleteContent(type, itemId);
        } else if (type === 'reports') {
            return this.generateReportsContent();
        }
        return '<p>المحتوى غير متاح</p>';
    }

    generateViewContent(type) {
        const data = this.currentData.get(type) || [];
        
        const headers = {
            pharmacy: ['اسم الحساب', 'الرصيد', 'آخر معاملة', 'الإجراءات'],
            customer: ['اسم العميل', 'رقم الهاتف', 'آخر زيارة', 'الإجراءات'],
            staff: ['اسم الموظف', 'الوظيفة', 'رقم الهاتف', 'الإجراءات'],
            inventory: ['اسم الدواء', 'الكمية', 'تاريخ الصلاحية', 'الإجراءات'],
            expense: ['نوع المصروف', 'المبلغ', 'التاريخ', 'الإجراءات']
        };

        const headerRow = headers[type] || [];
        const rows = data.map(item => this.generateTableRow(type, item)).join('');

        return `
            <div class="table-container" style="overflow-x: auto;">
                <table class="data-table">
                    <thead>
                        <tr>
                            ${headerRow.map(header => `<th>${header}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
                <div class="crud-buttons" style="margin-top: 20px;">
                    <button class="btn btn-add btn-crud" onclick="crudSystem.openCrudDialog('add', '${type}')">
                        <i class="fas fa-plus"></i><span>إضافة جديد</span>
                    </button>
                </div>
            </div>
        `;
    }

    generateTableRow(type, item) {
        const actionButtons = `
            <div class="action-buttons">
                <button class="btn btn-edit btn-crud" onclick="crudSystem.openCrudDialog('edit', '${type}', ${item.id})">
                    <i class="fas fa-edit"></i><span>تعديل</span>
                </button>
                <button class="btn btn-delete btn-crud" onclick="crudSystem.openCrudDialog('delete', '${type}', ${item.id})">
                    <i class="fas fa-trash"></i><span>حذف</span>
                </button>
            </div>
        `;

        const rowData = {
            pharmacy: [item.name, item.balance, item.lastTransaction, actionButtons],
            customer: [item.name, item.phone, item.lastVisit, actionButtons],
            staff: [item.name, item.position, item.phone, actionButtons],
            inventory: [item.name, item.quantity, item.expiryDate, actionButtons],
            expense: [item.type, item.amount, item.date, actionButtons]
        };

        const cells = rowData[type] || [];
        return `<tr>${cells.map(cell => `<td>${cell}</td>`).join('')}</tr>`;
    }

    generateFormContent(type, action, itemId = null) {
        const isEdit = action === 'edit' && itemId;
        const item = isEdit ? this.currentData.get(type)?.find(i => i.id === itemId) : null;

        const forms = {
            pharmacy: `
                <form onsubmit="crudSystem.handleFormSubmit(event, '${type}', '${action}', ${itemId})">
                    <div class="form-group">
                        <label>اسم الحساب</label>
                        <input type="text" name="name" value="${item?.name || ''}" placeholder="أدخل اسم الحساب" required>
                    </div>
                    <div class="form-group">
                        <label>الرصيد الافتتاحي</label>
                        <input type="number" name="balance" value="${item?.balance?.replace(' د.أ', '') || ''}" placeholder="أدخل الرصيد" required>
                    </div>
                    <div class="form-group">
                        <label>تاريخ الإنشاء</label>
                        <input type="date" name="date" value="${item?.lastTransaction || ''}">
                    </div>
                    <div class="dialog-buttons">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i><span>حفظ</span>
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="modalSystem.closeModal('crudModal')">
                            <i class="fas fa-times"></i><span>إلغاء</span>
                        </button>
                    </div>
                </form>
            `,
            customer: `
                <form onsubmit="crudSystem.handleFormSubmit(event, '${type}', '${action}', ${itemId})">
                    <div class="form-row">
                        <div class="form-group">
                            <label>اسم العميل</label>
                            <input type="text" name="name" value="${item?.name || ''}" placeholder="أدخل اسم العميل" required>
                        </div>
                        <div class="form-group">
                            <label>رقم الهاتف</label>
                            <input type="tel" name="phone" value="${item?.phone || ''}" placeholder="أدخل رقم الهاتف" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>العنوان</label>
                        <input type="text" name="address" value="${item?.address || ''}" placeholder="أدخل العنوان">
                    </div>
                    <div class="form-group">
                        <label>تاريخ آخر زيارة</label>
                        <input type="date" name="lastVisit" value="${item?.lastVisit || ''}">
                    </div>
                    <div class="dialog-buttons">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i><span>حفظ</span>
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="modalSystem.closeModal('crudModal')">
                            <i class="fas fa-times"></i><span>إلغاء</span>
                        </button>
                    </div>
                </form>
            `,
            staff: `
                <form onsubmit="crudSystem.handleFormSubmit(event, '${type}', '${action}', ${itemId})">
                    <div class="form-row">
                        <div class="form-group">
                            <label>اسم الموظف</label>
                            <input type="text" name="name" value="${item?.name || ''}" placeholder="أدخل اسم الموظف" required>
                        </div>
                        <div class="form-group">
                            <label>الوظيفة</label>
                            <select name="position" required>
                                <option value="صيدلي" ${item?.position === 'صيدلي' ? 'selected' : ''}>صيدلي</option>
                                <option value="ممرض" ${item?.position === 'ممرض' ? 'selected' : ''}>ممرض</option>
                                <option value="مندوب توصيل" ${item?.position === 'مندوب توصيل' ? 'selected' : ''}>مندوب توصيل</option>
                                <option value="موظف مبيعات" ${item?.position === 'موظف مبيعات' ? 'selected' : ''}>موظف مبيعات</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>رقم الهاتف</label>
                        <input type="tel" name="phone" value="${item?.phone || ''}" placeholder="أدخل رقم الهاتف" required>
                    </div>
                    <div class="form-group">
                        <label>تاريخ التعيين</label>
                        <input type="date" name="hireDate" value="${item?.hireDate || ''}">
                    </div>
                    <div class="dialog-buttons">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i><span>حفظ</span>
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="modalSystem.closeModal('crudModal')">
                            <i class="fas fa-times"></i><span>إلغاء</span>
                        </button>
                    </div>
                </form>
            `,
            inventory: `
                <form onsubmit="crudSystem.handleFormSubmit(event, '${type}', '${action}', ${itemId})">
                    <div class="form-row">
                        <div class="form-group">
                            <label>اسم الدواء</label>
                            <input type="text" name="name" value="${item?.name || ''}" placeholder="أدخل اسم الدواء" required>
                        </div>
                        <div class="form-group">
                            <label>الكمية</label>
                            <input type="number" name="quantity" value="${item?.quantity || ''}" placeholder="أدخل الكمية" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>تاريخ الصلاحية</label>
                        <input type="date" name="expiryDate" value="${item?.expiryDate || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>اسم المورد</label>
                        <input type="text" name="supplier" value="${item?.supplier || ''}" placeholder="أدخل اسم المورد">
                    </div>
                    <div class="dialog-buttons">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i><span>حفظ</span>
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="modalSystem.closeModal('crudModal')">
                            <i class="fas fa-times"></i><span>إلغاء</span>
                        </button>
                    </div>
                </form>
            `,
            expense: `
                <form onsubmit="crudSystem.handleFormSubmit(event, '${type}', '${action}', ${itemId})">
                    <div class="form-row">
                        <div class="form-group">
                            <label>نوع المصروف</label>
                            <select name="type" required>
                                <option value="إيجار" ${item?.type === 'إيجار' ? 'selected' : ''}>إيجار</option>
                                <option value="رواتب" ${item?.type === 'رواتب' ? 'selected' : ''}>رواتب</option>
                                <option value="فواتير خدمات" ${item?.type === 'فواتير خدمات' ? 'selected' : ''}>فواتير خدمات</option>
                                <option value="مشتريات" ${item?.type === 'مشتريات' ? 'selected' : ''}>مشتريات</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>المبلغ</label>
                            <input type="number" name="amount" value="${item?.amount?.replace(' د.أ', '') || ''}" placeholder="أدخل المبلغ" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>التاريخ</label>
                        <input type="date" name="date" value="${item?.date || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>الوصف</label>
                        <textarea name="description" placeholder="أدخل وصف المصروف">${item?.description || ''}</textarea>
                    </div>
                    <div class="dialog-buttons">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i><span>حفظ</span>
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="modalSystem.closeModal('crudModal')">
                            <i class="fas fa-times"></i><span>إلغاء</span>
                        </button>
                    </div>
                </form>
            `
        };

        return forms[type] || '<p>نموذج غير متاح</p>';
    }

    generateDeleteContent(type, itemId) {
        const item = this.currentData.get(type)?.find(i => i.id === itemId);
        const itemName = item?.name || item?.type || 'العنصر';
        
        return `
            <div class="text-center">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: var(--warning-color); margin-bottom: 20px;"></i>
                <p style="font-size: 18px; margin-bottom: 30px;">هل أنت متأكد من حذف "${itemName}"؟</p>
                <p style="color: var(--text-light); margin-bottom: 30px;">لا يمكن التراجع عن هذا الإجراء</p>
                <div class="dialog-buttons">
                    <button class="btn btn-danger" onclick="crudSystem.handleDelete('${type}', ${itemId})">
                        <i class="fas fa-trash"></i><span>حذف</span>
                    </button>
                    <button class="btn btn-secondary" onclick="modalSystem.closeModal('crudModal')">
                        <i class="fas fa-times"></i><span>إلغاء</span>
                    </button>
                </div>
            </div>
        `;
    }

    generateReportsContent() {
        return `
            <div class="reports-container">
                <div class="report-filters" style="margin-bottom: 20px; padding: 20px; background: var(--bg-light); border-radius: var(--border-radius);">
                    <h4 style="margin-bottom: 15px; color: var(--primary-color);">فلاتر التقارير</h4>
                    <div class="form-row">
                        <div class="form-group">
                            <label>نوع التقرير</label>
                            <select id="reportType">
                                <option value="sales">تقرير المبيعات</option>
                                <option value="inventory">تقرير المخزون</option>
                                <option value="expenses">تقرير المصاريف</option>
                                <option value="staff">تقرير الموظفين</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>من تاريخ</label>
                            <input type="date" id="startDate">
                        </div>
                        <div class="form-group">
                            <label>إلى تاريخ</label>
                            <input type="date" id="endDate">
                        </div>
                    </div>
                    <button class="btn btn-primary" onclick="crudSystem.generateReport()">
                        <i class="fas fa-chart-bar"></i><span>إنشاء التقرير</span>
                    </button>
                </div>
                <div id="reportResults">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>نوع التقرير</th>
                                <th>التاريخ</th>
                                <th>الحالة</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>تقرير المبيعات الشهري</td>
                                <td>2025-09-10</td>
                                <td><span style="color: var(--secondary-color);">جاهز</span></td>
                                <td class="action-buttons">
                                    <button class="btn btn-view btn-crud" onclick="crudSystem.viewReport('sales')">
                                        <i class="fas fa-eye"></i><span>عرض</span>
                                    </button>
                                    <button class="btn btn-primary btn-crud" onclick="crudSystem.exportReport('sales')">
                                        <i class="fas fa-download"></i><span>تصدير</span>
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>تقرير المخزون</td>
                                <td>2025-09-10</td>
                                <td><span style="color: var(--secondary-color);">جاهز</span></td>
                                <td class="action-buttons">
                                    <button class="btn btn-view btn-crud" onclick="crudSystem.viewReport('inventory')">
                                        <i class="fas fa-eye"></i><span>عرض</span>
                                    </button>
                                    <button class="btn btn-primary btn-crud" onclick="crudSystem.exportReport('inventory')">
                                        <i class="fas fa-download"></i><span>تصدير</span>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    handleFormSubmit(event, type, action, itemId) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        
        // Generate unique ID for new items
        if (action === 'add') {
            const existingData = this.currentData.get(type) || [];
            const maxId = existingData.length > 0 ? Math.max(...existingData.map(item => item.id)) : 0;
            data.id = maxId + 1;
        } else {
            data.id = itemId;
        }

        // Format data based on type
        if (type === 'pharmacy' || type === 'expense') {
            if (data.balance) data.balance += ' د.أ';
            if (data.amount) data.amount += ' د.أ';
        }

        // Update data
        let items = this.currentData.get(type) || [];
        if (action === 'add') {
            items.push(data);
            this.showNotification('تم إضافة العنصر بنجاح', 'success');
        } else if (action === 'edit') {
            const index = items.findIndex(item => item.id === itemId);
            if (index !== -1) {
                items[index] = { ...items[index], ...data };
                this.showNotification('تم تحديث العنصر بنجاح', 'success');
            }
        }
        
        this.currentData.set(type, items);
        this.modalSystem.closeModal('crudModal');
        
        // Refresh the view if it's currently open
        setTimeout(() => {
            this.openCrudDialog('view', type);
        }, 500);
    }

    handleDelete(type, itemId) {
        let items = this.currentData.get(type) || [];
        const index = items.findIndex(item => item.id === itemId);
        
        if (index !== -1) {
            items.splice(index, 1);
            this.currentData.set(type, items);
            this.showNotification('تم حذف العنصر بنجاح', 'success');
            this.modalSystem.closeModal('crudModal');
            
            // Refresh the view
            setTimeout(() => {
                this.openCrudDialog('view', type);
            }, 500);
        }
    }

    generateReport() {
        const reportType = document.getElementById('reportType')?.value;
        const startDate = document.getElementById('startDate')?.value;
        const endDate = document.getElementById('endDate')?.value;
        
        if (!reportType) {
            this.showNotification('يرجى اختيار نوع التقرير', 'warning');
            return;
        }
        
        this.showNotification('جاري إنشاء التقرير...', 'info');
        
        // Simulate report generation
        setTimeout(() => {
            this.showNotification('تم إنشاء التقرير بنجاح', 'success');
        }, 2000);
    }

    viewReport(reportType) {
        this.showNotification(`عرض تقرير ${reportType}`, 'info');
        // Here you would implement actual report viewing logic
    }

    exportReport(reportType) {
        this.showNotification(`جاري تصدير تقرير ${reportType}...`, 'info');
        
        // Simulate export process
        setTimeout(() => {
            this.showNotification('تم تصدير التقرير بنجاح', 'success');
            // Here you would implement actual export logic
        }, 1500);
    }

    showNotification(message, type = 'info') {
        // Create notification element if it doesn't exist
        let notification = document.getElementById('notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'notification';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: var(--border-radius);
                color: white;
                font-weight: 600;
                z-index: 10001;
                transform: translateX(400px);
                transition: var(--transition);
                max-width: 350px;
                box-shadow: var(--shadow-hover);
            `;
            document.body.appendChild(notification);
        }

        // Set notification style based on type
        const colors = {
            success: 'var(--secondary-color)',
            error: 'var(--danger-color)',
            warning: 'var(--warning-color)',
            info: 'var(--primary-color)'
        };

        notification.style.backgroundColor = colors[type] || colors.info;
        notification.textContent = message;
        
        // Show notification
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
        }, 3000);
    }
}

// Smooth Scrolling System
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        // Handle anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    this.scrollToElement(target);
                }
            });
        });
    }

    scrollToElement(element, offset = 80) {
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
}

// Performance Optimization System
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        // Lazy load images
        this.setupLazyLoading();
        
        // Debounce resize events
        this.setupResizeDebounce();
        
        // Preload critical resources
        this.preloadResources();
        
        // Setup intersection observer for animations
        this.setupAnimationObserver();
    }

    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    setupResizeDebounce() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Trigger resize events
                window.dispatchEvent(new CustomEvent('optimizedResize'));
            }, 250);
        });
    }

    preloadResources() {
        // Preload critical CSS and JS
        const criticalResources = [
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = resource.endsWith('.css') ? 'style' : 'script';
            link.href = resource;
            document.head.appendChild(link);
        });
    }

    setupAnimationObserver() {
        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            }, { threshold: 0.1 });

            document.querySelectorAll('.animate-on-scroll').forEach(element => {
                animationObserver.observe(element);
            });
        }
    }
}

// Accessibility Enhancement System
class AccessibilityEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupAriaLabels();
        this.setupFocusManagement();
        this.setupScreenReaderSupport();
    }

    setupKeyboardNavigation() {
        // Enhanced keyboard navigation for modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this.handleTabNavigation(e);
            }
        });
    }

    handleTabNavigation(e) {
        const modal = document.querySelector('.modal[style*="block"]');
        if (modal) {
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    }

    setupAriaLabels() {
        // Add aria labels to interactive elements
        document.querySelectorAll('.mobile-menu-toggle').forEach(toggle => {
            toggle.setAttribute('aria-label', 'فتح/إغلاق القائمة');
            toggle.setAttribute('aria-expanded', 'false');
        });

        document.querySelectorAll('.flip-card').forEach(card => {
            card.setAttribute('aria-label', 'اضغط للمزيد من المعلومات');
        });
    }

    setupFocusManagement() {
        // Manage focus for better accessibility
        const originalFocus = { element: null };

        // Store focus before opening modal
        document.addEventListener('modalOpen', (e) => {
            originalFocus.element = document.activeElement;
            setTimeout(() => {
                const firstInput = e.target.querySelector('input, button');
                if (firstInput) firstInput.focus();
            }, 100);
        });

        // Restore focus after closing modal
        document.addEventListener('modalClose', () => {
            if (originalFocus.element) {
                originalFocus.element.focus();
                originalFocus.element = null;
            }
        });
    }

    setupScreenReaderSupport() {
        // Add screen reader support for dynamic content
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
        document.body.appendChild(announcer);

        // Function to announce messages to screen readers
        window.announceToScreenReader = (message) => {
            announcer.textContent = message;
            setTimeout(() => {
                announcer.textContent = '';
            }, 1000);
        };
    }
}

// Theme System
class ThemeSystem {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.setupThemeToggle();
    }

    setupThemeToggle() {
        // Create theme toggle button
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--primary-color);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: var(--shadow);
            transition: var(--transition);
            z-index: 1000;
        `;
        
        themeToggle.addEventListener('click', () => this.toggleTheme());
        document.body.appendChild(themeToggle);
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
    }

    applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.style.setProperty('--bg-light', '#1a1a1a');
            document.documentElement.style.setProperty('--bg-white', '#2d2d2d');
            document.documentElement.style.setProperty('--bg-dark', '#0d1117');
            document.documentElement.style.setProperty('--text-dark', '#e6e6e6');
            document.documentElement.style.setProperty('--text-light', '#b3b3b3');
        } else {
            document.documentElement.style.setProperty('--bg-light', '#f8f9fa');
            document.documentElement.style.setProperty('--bg-white', '#ffffff');
            document.documentElement.style.setProperty('--bg-dark', '#2c3e50');
            document.documentElement.style.setProperty('--text-dark', '#333');
            document.documentElement.style.setProperty('--text-light', '#666');
        }
    }
}

// Initialize all systems when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize core systems
    window.mobileNav = new MobileNavigation();
    window.modalSystem = new ModalSystem();
    window.cardFlipSystem = new CardFlipSystem();
    window.crudSystem = new CrudSystem(window.modalSystem);
    window.smoothScroll = new SmoothScroll();
    window.performanceOptimizer = new PerformanceOptimizer();
    window.accessibilityEnhancer = new AccessibilityEnhancer();
    window.themeSystem = new ThemeSystem();

    // Global functions for backward compatibility
    window.toggleCard = (element) => window.cardFlipSystem.toggleCard(element);
    window.openModal = (modalId) => window.modalSystem.openModal(modalId);
    window.closeModal = (modalId) => window.modalSystem.closeModal(modalId);
    window.openCrudDialog = (action, type, itemId) => window.crudSystem.openCrudDialog(action, type, itemId);

    // Setup error handling
    window.addEventListener('error', (e) => {
        console.error('JavaScript Error:', e.error);
        if (window.crudSystem) {
            window.crudSystem.showNotification('حدث خطأ في النظام', 'error');
        }
    });

    // Setup performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log(`Page Load Time: ${perfData.loadEventEnd - perfData.loadEventStart}ms`);
            }, 0);
        });
    }

    // Add loading animation removal
    const loader = document.querySelector('.loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
            }, 500);
        }, 1000);
    }

    // Initialize tooltips
    document.querySelectorAll('[data-tooltip]').forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });

    console.log('🚀 Website JavaScript initialized successfully');
});

// Utility Functions
function showTooltip(e) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = e.target.getAttribute('data-tooltip');
    tooltip.style.cssText = `
        position: absolute;
        background: var(--bg-dark);
        color: var(--bg-white);
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        white-space: nowrap;
        z-index: 10002;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    tooltip.style.left = rect.left + (rect.width - tooltip.offsetWidth) / 2 + 'px';
    
    setTimeout(() => tooltip.style.opacity = '1', 10);
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.style.opacity = '0';
        setTimeout(() => tooltip.remove(), 300);
    }
}

// Add CSS for animations
const animationCSS = `
.animate-on-scroll {
    opacity: 0;
    transform: translateY(50px);
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-in {
    opacity: 1 !important;
    transform: translateY(0) !important;
}

.lazy {
    filter: blur(5px);
    transition: filter 0.3s;
}

.loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--bg-white);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
}

.loader::after {
    content: '';
    width: 50px;
    height: 50px;
    border: 5px solid var(--bg-light);
    border-top: 5px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;

const style = document.createElement('style');
style.textContent = animationCSS;
document.head.appendChild(style);

