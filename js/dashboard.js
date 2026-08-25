/* =========================================
   LOGOUT CONFIRMATION
========================================= */

/* =========================================
   DARK MODE + RTL STATE
========================================= */

(function () {

    const THEME_KEY = "prepvera-theme";
    const DIRECTION_KEY = "prepvera-direction";
    const DARK_CLASS = "dark-mode";

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

    function applyTheme(theme, shouldPersist) {

        const isDark = theme === "dark";

        root.classList.toggle(DARK_CLASS, isDark);
        syncButtonState(getThemeButtons(), isDark);
        syncThemeIcons(isDark);

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

    const logoutTrigger = document.getElementById("logoutTrigger");
    const logoutModal = document.getElementById("logoutModal");
    const logoutCancel = document.getElementById("logoutCancel");
    const logoutConfirm = document.getElementById("logoutConfirm");
    const logoutOverlay = document.querySelector(".logout-modal-overlay");


    /* Open Popup */

    if (logoutTrigger) {

        logoutTrigger.addEventListener("click", function (event) {

            event.preventDefault();

            logoutModal.classList.add("active");

            document.body.style.overflow = "hidden";

        });

    }


    /* Close Popup */

    function closeLogoutModal() {

        logoutModal.classList.remove("active");

        document.body.style.overflow = "";

    }


    /* No / Stay */

    if (logoutCancel) {

        logoutCancel.addEventListener("click", function () {

            closeLogoutModal();

        });

    }


    /* Overlay Click */

    if (logoutOverlay) {

        logoutOverlay.addEventListener("click", function () {

            closeLogoutModal();

        });

    }


    /* Yes / Logout */

    if (logoutConfirm) {

        logoutConfirm.addEventListener("click", function () {

            window.location.href = "login.html";

        });

    }


    /* ESC Key */

    document.addEventListener("keydown", function (event) {

        if (
            event.key === "Escape" &&
            logoutModal.classList.contains("active")
        ) {

            closeLogoutModal();

        }

    });

});

/* =========================================
   DASHBOARD MOBILE MENU
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const dashboard = document.querySelector(".student-dashboard");

    const menuToggle =
        document.getElementById("dashboardMobileMenuToggle");

    const menuClose =
        document.getElementById("dashboardMobileMenuClose");

    const menuOverlay =
        document.getElementById("dashboardMobileOverlay");


    if (!dashboard || !menuToggle) {
        return;
    }


    /* =========================================
       OPEN MENU
    ========================================= */

    function openDashboardMenu() {

        dashboard.classList.add("mobile-menu-open");

        menuToggle.setAttribute(
            "aria-expanded",
            "true"
        );

        document.body.style.overflow = "hidden";

    }


    /* =========================================
       CLOSE MENU
    ========================================= */

    function closeDashboardMenu() {

        dashboard.classList.remove("mobile-menu-open");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        document.body.style.overflow = "";

    }


    /* =========================================
       TOGGLE
    ========================================= */

    menuToggle.addEventListener(
        "click",
        function () {

            if (
                dashboard.classList.contains(
                    "mobile-menu-open"
                )
            ) {

                closeDashboardMenu();

            } else {

                openDashboardMenu();

            }

        }
    );


    /* =========================================
       CLOSE BUTTON
    ========================================= */

    if (menuClose) {

        menuClose.addEventListener(
            "click",
            closeDashboardMenu
        );

    }


    /* =========================================
       OVERLAY
    ========================================= */

    if (menuOverlay) {

        menuOverlay.addEventListener(
            "click",
            closeDashboardMenu
        );

    }


    /* =========================================
       CLOSE AFTER MENU LINK CLICK
    ========================================= */

    const dashboardLinks =
        document.querySelectorAll(
            ".dashboard-nav-link"
        );


    dashboardLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                closeDashboardMenu();

            }
        );

    });


    /* =========================================
       ESC KEY
    ========================================= */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                dashboard.classList.contains(
                    "mobile-menu-open"
                )
            ) {

                closeDashboardMenu();

            }

        }
    );


    /* =========================================
       RESET WHEN SCREEN BECOMES DESKTOP
    ========================================= */

    window.addEventListener(
        "resize",
        function () {

            if (window.innerWidth > 767) {

                closeDashboardMenu();

            }

        }
    );

});
