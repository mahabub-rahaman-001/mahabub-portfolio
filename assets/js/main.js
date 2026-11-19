(function ($) {
  $(document).ready(function () {
    $(document).on("click", ".header-area .show-menu", function () {
      $(this).toggleClass("active");
      $(".header-area .navbar").toggleClass("active");
    });
    // $(document).on('click', '.header-area .navbar .close-menu', function() {
    //     $(".header-area .navbar").removeClass('active');
    // });

    AOS.init({
      duration: 1500,
      once: true,
    });

    // Close mobile menu when a nav link is clicked
    $(document).on("click", ".header-area .navbar .menu a", function () {
      $(".header-area .navbar").removeClass("active");
      $(".header-area .show-menu").removeClass("active");
    });

    // Scroll-to-top button
    var $scrollBtn = $(
      '<button id="scroll-top" aria-label="Scroll to top"><i class="iconoir-arrow-up"></i></button>'
    ).appendTo("body");

    $(window).on("scroll", function () {
      if ($(window).scrollTop() > 400) {
        $scrollBtn.addClass("show");
      } else {
        $scrollBtn.removeClass("show");
      }
    });

    $scrollBtn.on("click", function () {
      $("html, body").animate({ scrollTop: 0 }, 500);
    });
  });
})(jQuery);

var div = document.createElement("div");
(div.id = "preloader"),
  (div.className = "preloader"),
  (div.innerHTML = '<div class="black_wall"></div><div class="loader"></div>'),
  document.body.insertBefore(div, document.body.firstChild),
  (window.onload = function () {
    document.getElementById("preloader").classList.add("off");
  });
