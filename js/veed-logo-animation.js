/**
 * VEED Logo Animation
 * Animates the VEED logo with GSAP - floating, rotation, and hover effects
 */

window.addEventListener('DOMContentLoaded', () => {
    // Gentle oscillation for the VEED logo
    if (typeof gsap !== 'undefined' && document.getElementById('logo-container')) {
        gsap.to("#logo-container", {
            y: -15,
            duration: 3,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1
        });

        // Subtle rotation for internal elements
        gsap.to("#veed-internals", {
            rotation: 3,
            transformOrigin: "center",
            duration: 4,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1
        });

        // Interactive hover effect
        const logoContainer = document.getElementById('logo-container');

        if (logoContainer) {
            logoContainer.style.pointerEvents = 'auto'; // Enable pointer events for hover

            logoContainer.addEventListener('mouseenter', () => {
                gsap.to("#veed-processor", {
                    scale: 1.05,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            logoContainer.addEventListener('mouseleave', () => {
                gsap.to("#veed-processor", {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        }
    }
});
