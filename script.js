$(document).ready(function () {
    "use strict";

    var $track = $("#slider-track");
    var $slides = $(".slide-item");
    var $currentPage = $("#current-page");
    var $totalPages = $("#total-pages");
    var $pagerDots = $("#pager-dots");

    var totalSlides = $slides.length;
    var currentPage = 1;
    var totalPages = 1;
    var slidesPerPage = 3;

    function getSlidesPerPage() {
        if ($(window).width() <= 768) {
            return 1;
        }
        return 3;
    }

    function renderDots(total, current) {
        var html = "";
        var i;
        for (i = 1; i <= total; i += 1) {
            if (i === current) {
                html += '<button type="button" class="pager-dot active" data-page="' + i + '" aria-label="Страница ' + i + '"></button>';
            } else {
                html += '<button type="button" class="pager-dot" data-page="' + i + '" aria-label="Страница ' + i + '"></button>';
            }
        }
        $pagerDots.html(html);
    }

    function updatePager() {
        $currentPage.text(currentPage);
        $totalPages.text(totalPages);
        renderDots(totalPages, currentPage);
    }

    function moveToPage(pageNumber) {
        var maxStartIndex;
        var startIndex;
        var percentage;

        if (pageNumber < 1) {
            pageNumber = totalPages;
        } else if (pageNumber > totalPages) {
            pageNumber = 1;
        }

        currentPage = pageNumber;
        maxStartIndex = totalSlides - slidesPerPage;
        startIndex = (currentPage - 1) * slidesPerPage;

        if (startIndex > maxStartIndex) {
            startIndex = maxStartIndex;
        }
        if (startIndex < 0) {
            startIndex = 0;
        }

        percentage = -(startIndex * (100 / slidesPerPage));
        $track.css("transform", "translateX(" + percentage + "%)");
        updatePager();
    }

    function calculatePages() {
        slidesPerPage = getSlidesPerPage();
        totalPages = Math.ceil(totalSlides / slidesPerPage);
        if (currentPage > totalPages) {
            currentPage = totalPages;
        }
        moveToPage(currentPage);
    }

    $(".slider-arrow-prev").on("click", function () {
        moveToPage(currentPage - 1);
    });

    $(".slider-arrow-next").on("click", function () {
        moveToPage(currentPage + 1);
    });

    $(document).on("click", ".pager-dot", function () {
        var targetPage = parseInt($(this).data("page"), 10);
        moveToPage(targetPage);
    });

    $(window).on("resize", function () {
        calculatePages();
    });

    calculatePages();

    // --- ДОБАВЛЕНО: Логика открытия картинок (Lightbox) ---

    // Генерируем HTML модального окна и добавляем в body
    var $modal = $('<div class="modal" id="image-modal"><span class="modal-close">&times;</span><img class="modal-content" id="modal-img"></div>');
    $("body").append($modal);

    // При клике на карточку открываем модальное окно
    $(".slide-card").on("click", function () {
        var imgSrc = $(this).find(".slide-image").attr("src");
        $("#modal-img").attr("src", imgSrc);
        $modal.fadeIn(300).css("display", "flex"); // Плавное появление
    });

    // Закрываем окно при клике на крестик или темный фон вокруг картинки
    $modal.on("click", function (e) {
        if ($(e.target).is(".modal") || $(e.target).is(".modal-close")) {
            $modal.fadeOut(300, function() {
                $("#modal-img").attr("src", ""); // Очищаем src после закрытия
            });
        }
    });
});