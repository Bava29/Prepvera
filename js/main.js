/* =========================================
   PREPVERA
   MAIN JAVASCRIPT
========================================= */

/* =========================================
   DARK MODE + RTL STATE
========================================= */

(function () {

    const THEME_KEY = "prepvera-theme";
    const DIRECTION_KEY = "prepvera-direction";
    const DARK_CLASS = "dark-mode";
    const LIGHT_LOGO = "images/logo.png";
    const DARK_LOGO = "images/logo-light.png";

    const root = document.documentElement;

    function readStorage(key) {

        try {
            return localStorage.getItem(key);
        } catch (error) {
            return null;
        }

    }

    function writeStorage(key, value) {

        try {
            localStorage.setItem(key, value);
        } catch (error) {
            /* Ignore storage failures */
        }

    }

    function getThemeButtons() {

        return document.querySelectorAll(
            "#themeToggle, .theme-toggle, .auth-control[aria-label='Toggle dark mode'], .dashboard-header-action[aria-label='Dark mode']"
        );

    }

    function getDirectionButtons() {

        return document.querySelectorAll(
            "#rtlToggle, .rtl-toggle, .auth-control[aria-label='Toggle RTL'], .dashboard-header-action[aria-label='RTL mode']"
        );

    }

    function syncButtonState(buttons, isActive) {

        buttons.forEach(function (button) {

            button.classList.toggle("active", isActive);
            button.setAttribute("aria-pressed", isActive ? "true" : "false");

        });

    }

    function syncThemeIcons(isDark) {

        getThemeButtons().forEach(function (button) {

            const icon = button.querySelector("i");

            if (!icon) return;

            icon.classList.toggle("fa-moon", !isDark);
            icon.classList.toggle("fa-sun", isDark);

        });

    }

    function syncThemeLogos(isDark) {

        const logoSrc = isDark ? DARK_LOGO : LIGHT_LOGO;

        document.querySelectorAll(".site-logo img, .auth-logo img").forEach(function (logo) {

            logo.src = logoSrc;

        });

    }

    function applyTheme(theme, shouldPersist) {

        const isDark = theme === "dark";

        root.classList.toggle(DARK_CLASS, isDark);
        syncButtonState(getThemeButtons(), isDark);
        syncThemeIcons(isDark);
        syncThemeLogos(isDark);

        if (shouldPersist) {
            writeStorage(THEME_KEY, isDark ? "dark" : "light");
        }

    }

    function applyDirection(direction, shouldPersist) {

        const isRtl = direction === "rtl";

        root.dir = isRtl ? "rtl" : "ltr";
        syncButtonState(getDirectionButtons(), isRtl);

        if (shouldPersist) {
            writeStorage(DIRECTION_KEY, isRtl ? "rtl" : "ltr");
        }

    }

    function initSavedState() {

        applyTheme(readStorage(THEME_KEY) === "dark" ? "dark" : "light", false);
        applyDirection(readStorage(DIRECTION_KEY) === "rtl" ? "rtl" : "ltr", false);

    }

    function initControls() {

        const themeButtons = getThemeButtons();
        const directionButtons = getDirectionButtons();

        if (themeButtons.length) {

            themeButtons.forEach(function (button) {

                button.addEventListener("click", function () {

                    applyTheme(
                        root.classList.contains(DARK_CLASS) ? "light" : "dark",
                        true
                    );

                });

            });

        }

        if (directionButtons.length) {

            directionButtons.forEach(function (button) {

                button.addEventListener("click", function () {

                    applyDirection(
                        root.dir === "rtl" ? "ltr" : "rtl",
                        true
                    );

                });

            });

        }

    }

    function bootstrapThemeAndDirection() {

        initSavedState();
        initControls();

    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", bootstrapThemeAndDirection, { once: true });
    } else {
        bootstrapThemeAndDirection();
    }

})();

document.addEventListener("DOMContentLoaded", function () {

    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");
    const headerActions = document.querySelector(".header-actions");
    const themeToggle = document.getElementById("themeToggle");
    const rtlToggle = document.getElementById("rtlToggle");
    const loginButton = document.querySelector(".login-btn");

    const dropdownToggles = document.querySelectorAll(".dropdown-toggle");
    const mobileBreakpoint = 1199;
    const mobileNavActions = document.createElement("div");

    mobileNavActions.className = "mobile-nav-actions";


    function syncMobileHeaderActions() {

        if (!mainNav || !headerActions) return;

        const isMobileLayout = window.innerWidth <= mobileBreakpoint;

        if (isMobileLayout) {

            if (!mainNav.contains(mobileNavActions)) {
                mainNav.appendChild(mobileNavActions);
            }

            [themeToggle, rtlToggle, loginButton].forEach(function (element) {

                if (element && element.parentElement !== mobileNavActions) {
                    mobileNavActions.appendChild(element);
                }

            });

        } else {

            if (themeToggle && themeToggle.parentElement !== headerActions) {
                headerActions.insertBefore(themeToggle, menuToggle);
            }

            if (rtlToggle && rtlToggle.parentElement !== headerActions) {
                headerActions.insertBefore(rtlToggle, menuToggle);
            }

            if (loginButton && loginButton.parentElement !== headerActions) {
                headerActions.insertBefore(loginButton, menuToggle);
            }

            if (mobileNavActions.parentElement) {
                mobileNavActions.parentElement.removeChild(mobileNavActions);
            }

        }

    }


    /* =========================================
       MOBILE MENU TOGGLE
    ========================================= */

    if (menuToggle && mainNav) {

        menuToggle.addEventListener("click", function () {

            mainNav.classList.toggle("active");

            const isOpen = mainNav.classList.contains("active");

            menuToggle.setAttribute("aria-expanded", isOpen);


            /* Change hamburger icon */

            const icon = menuToggle.querySelector("i");

            if (icon) {

                if (isOpen) {
                    icon.classList.remove("fa-bars");
                    icon.classList.add("fa-xmark");
                } else {
                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");
                }

            }

        });

    }


    /* =========================================
       MOBILE DROPDOWN
    ========================================= */

    dropdownToggles.forEach(function (toggle) {

        toggle.addEventListener("click", function (event) {

            /* Only use click dropdown on mobile */

            if (window.innerWidth <= mobileBreakpoint) {

                event.preventDefault();

                const parent = toggle.closest(".has-dropdown");

                if (!parent) return;


                /* Close other dropdowns */

                document
                    .querySelectorAll(".has-dropdown.dropdown-open")
                    .forEach(function (item) {

                        if (item !== parent) {
                            item.classList.remove("dropdown-open");
                        }

                    });


                /* Toggle current dropdown */

                parent.classList.toggle("dropdown-open");

            }

        });

    });


    /* =========================================
       CLOSE MENU AFTER CLICKING NORMAL LINK
    ========================================= */

    document.querySelectorAll(".nav-link:not(.dropdown-toggle)").forEach(function (link) {

        link.addEventListener("click", function () {

            if (window.innerWidth <= mobileBreakpoint && mainNav) {

                mainNav.classList.remove("active");

                if (menuToggle) {
                    menuToggle.setAttribute("aria-expanded", "false");
                }

                const icon = menuToggle?.querySelector("i");

                if (icon) {
                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");
                }

            }

        });

    });


    /* =========================================
       CLOSE MENU WHEN WINDOW RESIZES
    ========================================= */

    window.addEventListener("resize", function () {

        syncMobileHeaderActions();

        if (window.innerWidth > mobileBreakpoint) {

            if (mainNav) {
                mainNav.classList.remove("active");
            }

            if (menuToggle) {
                menuToggle.setAttribute("aria-expanded", "false");

                const icon = menuToggle.querySelector("i");

                if (icon) {
                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");
                }
            }


            /* Close mobile dropdowns */

            document
                .querySelectorAll(".has-dropdown.dropdown-open")
                .forEach(function (item) {

                    item.classList.remove("dropdown-open");

                });

        }

    });


    syncMobileHeaderActions();

});

/* =========================================
   HERO SLIDER
========================================= */

const heroSlides =
    document.querySelectorAll(".hero-slide");

const heroDots =
    document.querySelectorAll(".hero-dot");

const heroPrev =
    document.getElementById("heroPrev");

const heroNext =
    document.getElementById("heroNext");

let currentHeroSlide = 0;
let heroAutoPlay;


function showHeroSlide(index) {

    if (!heroSlides.length) return;

    if (index >= heroSlides.length) {
        currentHeroSlide = 0;
    } else if (index < 0) {
        currentHeroSlide = heroSlides.length - 1;
    } else {
        currentHeroSlide = index;
    }


    heroSlides.forEach(function (slide, i) {

        slide.classList.toggle(
            "active",
            i === currentHeroSlide
        );

    });


    heroDots.forEach(function (dot, i) {

        dot.classList.toggle(
            "active",
            i === currentHeroSlide
        );

    });

}


function nextHeroSlide() {
    showHeroSlide(currentHeroSlide + 1);
}


function previousHeroSlide() {
    showHeroSlide(currentHeroSlide - 1);
}


/* Next */

if (heroNext) {

    heroNext.addEventListener(
        "click",
        function () {

            nextHeroSlide();
            restartHeroAutoPlay();

        }
    );

}


/* Previous */

if (heroPrev) {

    heroPrev.addEventListener(
        "click",
        function () {

            previousHeroSlide();
            restartHeroAutoPlay();

        }
    );

}


/* Dots */

heroDots.forEach(function (dot) {

    dot.addEventListener(
        "click",
        function () {

            const slideIndex =
                Number(dot.dataset.slide);

            showHeroSlide(slideIndex);

            restartHeroAutoPlay();

        }
    );

});


/* =========================================
   AUTO PLAY
========================================= */

function startHeroAutoPlay() {

    heroAutoPlay = setInterval(
        nextHeroSlide,
        6000
    );

}


function restartHeroAutoPlay() {

    clearInterval(heroAutoPlay);

    startHeroAutoPlay();

}


if (heroSlides.length > 1) {

    startHeroAutoPlay();

}


document.addEventListener("DOMContentLoaded", function () {

    const faqItems =
        document.querySelectorAll(".courses-faq-item");

    faqItems.forEach(item => {

        const question =
            item.querySelector(".courses-faq-question");

        question.addEventListener("click", function () {

            const isActive =
                item.classList.contains("active");


            /* Close all */

            faqItems.forEach(otherItem => {
                otherItem.classList.remove("active");
            });


            /* Open clicked */

            if (!isActive) {
                item.classList.add("active");
            }

        });

    });

});
