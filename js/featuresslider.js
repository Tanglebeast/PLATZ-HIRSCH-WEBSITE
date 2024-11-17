var featureSwiper = new Swiper('.features-slider', {
    loop: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    slidesPerView: 4,
    spaceBetween: 30,
    breakpoints: {
        // wenn die Fensterbreite >= 320px ist
        320: {
            slidesPerView: 1,
            spaceBetween: 10
        },
        // wenn die Fensterbreite >= 480px ist
        480: {
            slidesPerView: 2,
            spaceBetween: 20
        },
        // wenn die Fensterbreite >= 768px ist
        768: {
            slidesPerView: 3,
            spaceBetween: 30
        },
        // wenn die Fensterbreite >= 992px ist
        992: {
            slidesPerView: 4,
            spaceBetween: 30
        }
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    // Navigation Buttons (optional)
    /*
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    */
});