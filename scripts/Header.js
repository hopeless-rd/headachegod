class Header {
    selectors = {
        root: '[data-js-header]',
        overlay: '[data-js-header-overlay]',
        burgerButton: '[data-js-header-burger-button]',
    };

    stateClasses = {
        isActive: 'is-active',
        isLock: 'is-lock',
    };

    constructor() {
        this.rootElement = document.querySelector(this.selectors.root);
        this.overlayElement = document.querySelector(this.selectors.overlay);
        this.burgerButtonElement = document.querySelector(this.selectors.burgerButton); 
        this.themeToggleCheckbox = document.getElementById('theme-toggle');
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.applyTheme();
        this.addEventListeners();
        this.bindEvents();
    }

    applyTheme() {
        document.body.classList.toggle('light-theme', this.currentTheme === 'light');
        this.themeToggleCheckbox.checked = this.currentTheme === 'light';
    }

    /**
     @param {boolean} isOpen 
     */
    toggleOverlay(isOpen) {
        this.updateClass(this.burgerButtonElement, this.stateClasses.isActive, isOpen);
        this.updateClass(this.overlayElement, this.stateClasses.isActive, isOpen);
        this.updateClass(document.documentElement, this.stateClasses.isLock, isOpen);

        if (isOpen) {
            this.overlayElement.focus();
            this.trapFocus();
        } else {
            this.releaseFocus();
        }
    }

    onBurgerButtonClick = () => {
        const isOpen = !this.overlayElement.classList.contains(this.stateClasses.isActive);
        this.toggleOverlay(isOpen);
    };

    /**
     @param {KeyboardEvent} e 
     */
    onKeydownPress = (e) => {
        if (e.key === 'Escape') {
            this.toggleOverlay(false);
        }
    };

    trapFocus() {
        const focusableSelectors = 'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])';
        const focusableElements = this.overlayElement.querySelectorAll(focusableSelectors);

        if (!focusableElements.length) {
            this.overlayElement.tabIndex = -1;
            this.overlayElement.addEventListener('keydown', this.onKeydownPress);
            return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        this.handleTabPress = (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        };

        this.overlayElement.addEventListener('keydown', this.handleTabPress);
    }

    releaseFocus() {
        if (this.handleTabPress) {
            this.overlayElement.removeEventListener('keydown', this.handleTabPress);
            this.handleTabPress = null;
        }

        this.overlayElement.removeEventListener('keydown', this.onKeydownPress);
        this.overlayElement.tabIndex = ''; 
    }
    /**
     @param {HTMLElement} element - Элемент, у которого нужно обновить класс
     @param {string} className - Класс для добавления/удаления
     @param {boolean} shouldAdd - Добавить класс или удалить
     */
    updateClass(element, className, shouldAdd) {
        if (element) {
            element.classList.toggle(className, shouldAdd);
        }
    }

    bindEvents() {
        this.burgerButtonElement.addEventListener('click', this.onBurgerButtonClick);
        document.addEventListener('keydown', this.onKeydownPress);
    }

    unbindEvents() {
        this.burgerButtonElement.removeEventListener('click', this.onBurgerButtonClick);
        document.removeEventListener('keydown', this.onKeydownPress);
    }

    addEventListeners() {
        this.themeToggleCheckbox.addEventListener('change', () => {
          this.currentTheme = this.themeToggleCheckbox.checked ? 'light' : 'dark';
          document.body.classList.toggle('light-theme', this.currentTheme === 'light');
          localStorage.setItem('theme', this.currentTheme);
        });
    }
}

export default Header;
