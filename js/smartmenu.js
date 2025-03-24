document.addEventListener('DOMContentLoaded', function() {
    const mainFilters = document.querySelectorAll('.ÜberMenü .filter');
    const subFilters = document.querySelectorAll('.sub-menu .sub-filter');
    const specialFilters = document.querySelectorAll('.special-filters .special-filter');
    const subMenus = document.querySelectorAll('.sub-menu');
    const menuItems = document.querySelectorAll('.single-menu');
    const sortAscButton = document.getElementById('sort-price-asc');
    const sortDescButton = document.getElementById('sort-price-desc');
    const sortResetButton = document.getElementById('sort-reset');
    const priceMinSlider = document.getElementById('price-min-slider');
    const priceMaxSlider = document.getElementById('price-max-slider');
    const priceMinDisplay = document.getElementById('price-min-display');
    const priceMaxDisplay = document.getElementById('price-max-display');
    const resetPriceFilterButton = document.getElementById('reset-price-filter');
    const pinnedItemsList = document.querySelector('.pinned-items-list');
    const totalPriceElement = document.getElementById('total-price');
    const clearPinnedButton = document.getElementById('clear-pinned');
    
    let activeMainFilter = 'all';
    let activeSubFilters = [];
    let activeSpecialFilters = [];
    let originalItemsOrder = Array.from(menuItems);
    let currentMinPrice = parseFloat(priceMinSlider.value);
    let currentMaxPrice = parseFloat(priceMaxSlider.value);
    let pinnedItems = [];

    // Funktion zum Aktualisieren der Preisanzeige
    function updatePriceDisplay() {
        priceMinDisplay.textContent = currentMinPrice.toFixed(2).replace('.', ',') + ' €';
        priceMaxDisplay.textContent = currentMaxPrice.toFixed(2).replace('.', ',') + ' €';
    }

    // Funktion zum Aktualisieren der Untermenü-Sichtbarkeit
    function updateSubMenuVisibility() {
        subMenus.forEach(menu => {
            if (activeMainFilter === 'all') {
                menu.style.display = 'block';
            } else if (menu.classList.contains(activeMainFilter.slice(1))) {
                menu.style.display = 'block';
            } else {
                menu.style.display = 'none';
            }
        });
    }

    // Funktion zum Filtern der Menüelemente
    function filterMenuItems() {
        menuItems.forEach(item => {
            const itemPrice = parseFloat(item.getAttribute('data-price'));
            item.style.display = 'none';
            
            const priceMatch = itemPrice >= currentMinPrice && itemPrice <= currentMaxPrice;
            let mainFilterMatch = activeMainFilter === 'all' || item.classList.contains(activeMainFilter.slice(1));
            let subFilterMatch = activeSubFilters.length === 0 || activeSubFilters.some(subFilter => item.classList.contains(subFilter.slice(1)));
            let specialFilterMatch = activeSpecialFilters.length === 0 || activeSpecialFilters.some(specialFilter => item.classList.contains(specialFilter.slice(1)));

            if (priceMatch && mainFilterMatch && subFilterMatch && specialFilterMatch) {
                item.style.display = 'block';
            }
        });
    }

    // Funktion zum Aktualisieren der gepinnten Liste und des Gesamtpreises
    function updatePinnedItems() {
        pinnedItemsList.innerHTML = '';
        let totalPrice = 0;

        pinnedItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('pinned-item');
            const fullTitle = `${item.number} ${item.title}`;
            itemElement.innerHTML = `
                <span>${fullTitle} - ${item.price.toFixed(2).replace('.', ',')} €</span>
                <button class="remove-pinned" data-number="${item.number}"><i class="fas fa-trash"></i></button>
            `;
            pinnedItemsList.appendChild(itemElement);
            totalPrice += item.price;
        });

        totalPriceElement.textContent = totalPrice.toFixed(2).replace('.', ',') + ' €';

        document.querySelectorAll('.remove-pinned').forEach(btn => {
            btn.addEventListener('click', function() {
                const number = this.getAttribute('data-number');
                pinnedItems = pinnedItems.filter(item => item.number !== number);
                document.querySelector(`.pin-btn[data-number="${number}"]`).classList.remove('pinned');
                updatePinnedItems();
            });
        });
    }

    // Event-Listener für Hauptkategorien
    mainFilters.forEach(filter => {
        filter.addEventListener('click', function(e) {
            e.stopPropagation(); // Verhindert Schließen des Dropdowns
            activeMainFilter = this.getAttribute('data-filter');
            activeSubFilters = [];
            subFilters.forEach(f => f.classList.remove('active'));
            mainFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            updateSubMenuVisibility();
            filterMenuItems();
        });
    });

    // Event-Listener für Unterkategorien
    subFilters.forEach(filter => {
        filter.addEventListener('click', function(e) {
            e.stopPropagation(); // Verhindert Schließen des Dropdowns
            const filterValue = this.getAttribute('data-filter');
            if (this.classList.contains('active')) {
                this.classList.remove('active');
                activeSubFilters = activeSubFilters.filter(f => f !== filterValue);
            } else {
                this.classList.add('active');
                activeSubFilters.push(filterValue);
            }
            filterMenuItems();
        });
    });

    // Event-Listener für spezielle Filter
    specialFilters.forEach(filter => {
        filter.addEventListener('click', function(e) {
            e.stopPropagation(); // Verhindert Schließen des Dropdowns
            const filterValue = this.getAttribute('data-filter');
            if (this.classList.contains('active')) {
                this.classList.remove('active');
                activeSpecialFilters = activeSpecialFilters.filter(f => f !== filterValue);
            } else {
                this.classList.add('active');
                activeSpecialFilters.push(filterValue);
            }
            filterMenuItems();
        });
    });

    // Event-Listener für Pinnen-Buttons
    menuItems.forEach(item => {
        const pinBtn = item.querySelector('.pin-btn');
        pinBtn.setAttribute('data-number', item.getAttribute('data-number'));
        pinBtn.addEventListener('click', function() {
            const number = this.getAttribute('data-number');
            const title = item.querySelector('h3').childNodes[2].textContent.trim();
            const priceText = item.querySelector('.menu-price').textContent.split(' / ')[0].replace(' €', '').replace(',', '.');
            const price = parseFloat(priceText);

            if (this.classList.contains('pinned')) {
                pinnedItems = pinnedItems.filter(pinned => pinned.number !== number);
                this.classList.remove('pinned');
            } else {
                pinnedItems.push({ number, title, price });
                this.classList.add('pinned');
            }
            updatePinnedItems();
        });
    });

    // Event-Listener für Liste leeren
    clearPinnedButton.addEventListener('click', function() {
        pinnedItems = [];
        document.querySelectorAll('.pin-btn').forEach(btn => btn.classList.remove('pinned'));
        updatePinnedItems();
    });

    // Event-Listener für Preissortierung
    sortAscButton.addEventListener('click', () => {
        sortMenuItemsByPrice(true);
    });
    sortDescButton.addEventListener('click', () => {
        sortMenuItemsByPrice(false);
    });
    sortResetButton.addEventListener('click', () => {
        const menuList = document.querySelector('.food-menu-list');
        originalItemsOrder.forEach(item => menuList.appendChild(item));
        filterMenuItems();
    });

    // Event-Listener für Preisfilter-Slider
    priceMinSlider.addEventListener('input', function() {
        currentMinPrice = parseFloat(this.value);
        if (currentMinPrice > currentMaxPrice) {
            currentMinPrice = currentMaxPrice;
            this.value = currentMinPrice;
        }
        updatePriceDisplay();
        filterMenuItems();
    });

    priceMaxSlider.addEventListener('input', function() {
        currentMaxPrice = parseFloat(this.value);
        if (currentMaxPrice < currentMinPrice) {
            currentMaxPrice = currentMinPrice;
            this.value = currentMaxPrice;
        }
        updatePriceDisplay();
        filterMenuItems();
    });

    // Event-Listener für Preisfilter zurücksetzen
    resetPriceFilterButton.addEventListener('click', function() {
        currentMinPrice = 2;
        currentMaxPrice = 25;
        priceMinSlider.value = currentMinPrice;
        priceMaxSlider.value = currentMaxPrice;
        updatePriceDisplay();
        filterMenuItems();
    });

    // Funktion zum Sortieren nach Preis
    function sortMenuItemsByPrice(ascending = true) {
        const menuList = document.querySelector('.food-menu-list');
        const items = Array.from(menuItems).filter(item => item.style.display !== 'none');
        
        items.sort((a, b) => {
            const priceA = parseFloat(a.getAttribute('data-price'));
            const priceB = parseFloat(b.getAttribute('data-price'));
            return ascending ? priceA - priceB : priceB - priceA;
        });
        
        items.forEach(item => menuList.appendChild(item));
    }

    // Event-Listener für Dropdowns
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        const btn = dropdown.querySelector('.dropdown-btn');
        const content = dropdown.querySelector('.dropdown-content') || dropdown.querySelector('.sub-menu-container');

        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const isOpen = content.style.display === 'block';
            document.querySelectorAll('.dropdown-content, .sub-menu-container').forEach(otherContent => {
                otherContent.style.display = 'none';
            });
            content.style.display = isOpen ? 'none' : 'block';
        });

        content.addEventListener('click', function(e) {
            e.stopPropagation(); // Verhindert Schließen bei Klicks im Dropdown
        });
    });

    // Schließe Dropdowns, wenn außerhalb geklickt wird
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-content, .sub-menu-container').forEach(content => {
                content.style.display = 'none';
            });
        }
    });

    // Initialisierung
    document.querySelector('.filter[data-filter="all"]').classList.add('active');
    updateSubMenuVisibility();
    updatePriceDisplay();
    filterMenuItems();
});