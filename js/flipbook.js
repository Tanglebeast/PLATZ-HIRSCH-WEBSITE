// References to DOM Elements
const prevBtnBook = document.querySelector("#prev-btn-book");
const nextBtnBook = document.querySelector("#next-btn-book");
const book = document.querySelector("#book");
const currentPageEl = document.querySelector("#current-page");
const totalPagesEl = document.querySelector("#total-pages");
const zoomInBtn = document.querySelector("#zoom-in-btn");
const zoomOutBtn = document.querySelector("#zoom-out-btn");
const fullscreenBtn = document.querySelector("#fullscreen-btn");
const flipbookContainer = document.querySelector(".flipbook-container");

const paper1 = document.querySelector("#p1");
const paper2 = document.querySelector("#p2");

// Zoom functionality
function setupZoom() {
    const zoomableContainers = document.querySelectorAll('.zoomable-container');
    
    zoomableContainers.forEach(container => {
        const img = container.querySelector('img');
        let scale = 1;
        let isDragging = false;
        let startX, startY, translateX = 0, translateY = 0;

        zoomInBtn.addEventListener('click', () => {
            if (scale < 3) {
                scale += 0.5;
                updateZoom();
            }
        });

        zoomOutBtn.addEventListener('click', () => {
            if (scale > 1) {
                scale -= 0.5;
                updateZoom();
            }
        });

        function updateZoom() {
            container.classList.toggle('zoomed', scale > 1);
            img.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
        }

        // Mouse events for dragging when zoomed
        container.addEventListener('mousedown', (e) => {
            if (scale > 1) {
                isDragging = true;
                startX = e.clientX - translateX;
                startY = e.clientY - translateY;
                container.style.cursor = 'grabbing';
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging && scale > 1) {
                translateX = e.clientX - startX;
                translateY = e.clientY - startY;
                updateZoom();
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            container.style.cursor = scale > 1 ? 'grab' : 'default';
        });

        // Reset zoom when clicking outside
        container.addEventListener('click', (e) => {
            if (scale > 1 && e.target === img) {
                scale = 1;
                translateX = 0;
                translateY = 0;
                updateZoom();
            }
        });
    });
}

// Fullscreen functionality
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        if (flipbookContainer.requestFullscreen) {
            flipbookContainer.requestFullscreen();
        } else if (flipbookContainer.mozRequestFullScreen) { // Firefox
            flipbookContainer.mozRequestFullScreen();
        } else if (flipbookContainer.webkitRequestFullscreen) { // Chrome, Safari and Opera
            flipbookContainer.webkitRequestFullscreen();
        } else if (flipbookContainer.msRequestFullscreen) { // Internet Explorer/Edge
            flipbookContainer.msRequestFullscreen();
        }
        flipbookContainer.classList.add('fullscreen');
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // Internet Explorer/Edge
            document.msExitFullscreen();
        }
        flipbookContainer.classList.remove('fullscreen');
    }
}

// Existing size and button adjustment functions
function adjustBookSizeAndButtons() {
    const firstImage = document.querySelector("#f1 img");
    const maxWidth = Math.min(600, window.innerWidth * 0.9);
    const maxHeight = Math.min(800, window.innerHeight * 0.8);
    let bookWidth;

    firstImage.onload = function() {
        let width = firstImage.naturalWidth;
        let height = firstImage.naturalHeight;

        if (width > maxWidth || height > maxHeight) {
            const aspectRatio = width / height;
            if (width / maxWidth > height / maxHeight) {
                width = maxWidth;
                height = width / aspectRatio;
            } else {
                height = maxHeight;
                width = height * aspectRatio;
            }
        }

        book.style.width = `${width}px`;
        book.style.height = `${height}px`;
        bookWidth = width;

        adjustButtonPositions(bookWidth);
    };

    if (firstImage.complete) {
        let width = firstImage.naturalWidth;
        let height = firstImage.naturalHeight;

        if (width > maxWidth || height > maxHeight) {
            const aspectRatio = width / height;
            if (width / maxWidth > height / maxHeight) {
                width = maxWidth;
                height = width / aspectRatio;
            } else {
                height = maxHeight;
                width = height * aspectRatio;
            }
        }

        book.style.width = `${width}px`;
        book.style.height = `${height}px`;
        bookWidth = width;

        adjustButtonPositions(bookWidth);
    }
}

function adjustButtonPositions(bookWidth) {
    const buttonOffset = bookWidth / 2 + 20;
    prevBtnBook.style.transform = `translateX(-${buttonOffset}px)`;
    nextBtnBook.style.transform = `translateX(${buttonOffset}px)`;
}

function adjustBookStyles() {
    const isMobile = window.innerWidth <= 768;
    const papers = document.querySelectorAll('.paper');
    
    papers.forEach((paper, index) => {
        const back = paper.querySelector('.back');
        if (isMobile && index !== 0 && index !== papers.length - 1) {
            back.style.width = '50%';
            back.style.height = '100%';
            back.style.backgroundColor = 'transparent';
        } else {
            back.style.width = '';
            back.style.height = '';
            back.style.backgroundColor = '';
        }
    });
}

function openBook() {
    const bookWidth = parseFloat(book.style.width);
    const buttonOffset = bookWidth / 2 + 20;
    book.style.transform = "translateX(50%)";
    prevBtnBook.style.transform = `translateX(-${buttonOffset}px)`;
    nextBtnBook.style.transform = `translateX(${buttonOffset}px)`;
}

function closeBook(isAtBeginning) {
    const bookWidth = parseFloat(book.style.width);
    const buttonOffset = bookWidth / 2 + 20;
    if (isAtBeginning) {
        book.style.transform = "translateX(0%)"; // Erste Seite
    }
    prevBtnBook.style.transform = `translateX(-${buttonOffset}px)`;
    nextBtnBook.style.transform = `translateX(${buttonOffset}px)`;
}

// Event Listener für Buttons
prevBtnBook.addEventListener("click", goPrevPage);
nextBtnBook.addEventListener("click", goNextPage);
fullscreenBtn.addEventListener("click", toggleFullscreen);

// Touch-Events für Swipen
let touchStartX = 0;
let touchEndX = 0;

book.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

book.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    if (touchStartX - touchEndX > swipeThreshold) {
        goNextPage();
    } else if (touchEndX - touchStartX > swipeThreshold) {
        goPrevPage();
    }
}

// Business Logic
let currentLocation = 1;
let numOfPapers = 2;
let maxLocation = numOfPapers + 1;

function updatePageIndicator() {
    currentPageEl.textContent = currentLocation;
    totalPagesEl.textContent = maxLocation - 0;
}

function goNextPage() {
    if (currentLocation < maxLocation) {
        switch (currentLocation) {
            case 1:
                openBook();
                paper1.classList.add("flipped");
                paper1.style.zIndex = 1;
                break;
            case 2:
                // Letzte Seite: Buch komplett nach rechts verschieben
                paper2.classList.add("flipped");
                paper2.style.zIndex = 2;
                book.style.transform = "translateX(100%)";
                break;
            default:
                throw new Error("unknown state");
        }
        currentLocation++;
        updatePageIndicator();
    }
}

function goPrevPage() {
    if (currentLocation > 1) {
        switch (currentLocation) {
            case 2:
                closeBook(true);
                paper1.classList.remove("flipped");
                paper1.style.zIndex = 2;
                break;
            case 3:
                // Zurück zur Doppelseite: Zentrierung beibehalten
                paper2.classList.remove("flipped");
                paper2.style.zIndex = 1;
                book.style.transform = "translateX(50%)";
                break;
            default:
                throw new Error("unknown state");
        }
        currentLocation--;
        updatePageIndicator();
    }
}

// Initialisierung und Resize-Handler
function init() {
    adjustBookSizeAndButtons();
    adjustBookStyles();
    setupZoom();
    updatePageIndicator();
}

init();
window.addEventListener("resize", () => {
    adjustBookSizeAndButtons();
    adjustBookStyles();
});