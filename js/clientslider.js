(function ($) {
    "use strict";
  
    // Client Slider One
    var clientSliderOne = new Swiper('.client-slider', {
      slidesPerView: 2,
      spaceBetween: 30,
      loop: true,
      navigation: {
        nextEl: '.slider-next',
        prevEl: '.slider-prev',
      },
      autoplay: {
        speeds: 2000,
        delay: 4000,
      },
      speed: 1000,
      breakpoints: {
        991: {
          slidesPerView: 1,
        },
        767: {
          slidesPerView: 1,
        },
        175: {
          slidesPerView: 1,
        },
      }
    });
  
    // Client Slider Two
    var clientSliderTwo = new Swiper('.client-slider-two', {
        slidesPerView: 3,
        spaceBetween: 30,
        loop: true,
        navigation: {
          nextEl: '.slider-nav-area .slider-next',
          prevEl: '.slider-nav-area .slider-prev',
        },
        autoplay: {
          delay: 4000,
        },
        speed: 1000,
        breakpoints: {
          991: {
            slidesPerView: 2,
          },
          767: {
            slidesPerView: 2,
          },
          175: {
            slidesPerView: 1,
          },
        },
      });
      
  
  })(jQuery);
  