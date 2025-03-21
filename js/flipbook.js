// References to DOM Elements
const prevBtnBook = document.querySelector("#prev-btn-book");
const nextBtnBook = document.querySelector("#next-btn-book");
const book = document.querySelector("#book");

const paper1 = document.querySelector("#p1");
const paper2 = document.querySelector("#p2");

// Funktion zum Anpassen der Buchgröße und Button-Position
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

// Funktion zur dynamischen Positioning der Buttons
function adjustButtonPositions(bookWidth) {
    const buttonOffset = bookWidth / 2 + 20;
    prevBtnBook.style.transform = `translateX(-${buttonOffset}px)`;
    nextBtnBook.style.transform = `translateX(${buttonOffset}px)`;
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

// Buchgröße und Button-Position anpassen
adjustBookSizeAndButtons();
window.addEventListener("resize", adjustBookSizeAndButtons);

// Business Logic
let currentLocation = 1;
let numOfPapers = 2;
let maxLocation = numOfPapers + 1;

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
    }
}