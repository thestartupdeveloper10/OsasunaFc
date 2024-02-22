var swiper = new Swiper(".mySwiper", {
    loop: true,
    effect:"fade",
    lazyLoading: true,
    disableOnInteraction: false,
    autoplay:{
      delay:5000
    },
    pagination: {
      el: ".swiper-pagination",
      dynamicBullets: true,
    },
    navigation: {
        nextEl: "#nav-right",
        prevEl: "#nav-left",
      },
  });
  var swiper2 = new Swiper(".mySwiper2", {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 10,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
        768: {
            slidesPerView: 3
        },
        1400: {
            slidesPerView: 4.5
        }
    }
  });