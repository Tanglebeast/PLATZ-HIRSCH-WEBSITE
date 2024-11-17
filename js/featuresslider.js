var featureSwiper = new Swiper('.features-slider', {
    loop: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    slidesPerView: 3,
    spaceBetween: 10,
    breakpoints: {
        576: {
            slidesPerView: 2,
            spaceBetween: 15,
        },
        768: {
            slidesPerView: 3,
            spaceBetween: 20,
        },
        992: {
            slidesPerView: 4,
            spaceBetween: 30,
        },
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
});
