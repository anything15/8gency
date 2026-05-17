/**
 * Typing Effect
 * Creates a typewriter effect that cycles through different words
 */

window.addEventListener('DOMContentLoaded', () => {
    const typingElement = document.getElementById('typingText');

    if (!typingElement) {
        console.warn('Typing element not found');
        return;
    }

    // Words to cycle through
    const words = ['Insights', 'Video Chat', 'Video Flashcards', 'Video Decks', 'Smart Scenes'];
    let currentWordIndex = 0;
    let isDeleting = false;
    let currentText = '';
    let charIndex = 0;

    // Timing settings
    const typingSpeed = 100; // milliseconds per character when typing
    const deletingSpeed = 50; // milliseconds per character when deleting
    const pauseAfterComplete = 2000; // pause after typing complete word
    const pauseAfterDelete = 500; // pause after deleting complete word

    function typeEffect() {
        const currentWord = words[currentWordIndex];

        if (isDeleting) {
            // Deleting characters
            currentText = currentWord.substring(0, charIndex);
            charIndex--;

            if (charIndex < 0) {
                // Finished deleting, move to next word
                isDeleting = false;
                currentWordIndex = (currentWordIndex + 1) % words.length;
                charIndex = 0;
                setTimeout(typeEffect, pauseAfterDelete);
                return;
            }
        } else {
            // Typing characters
            currentText = currentWord.substring(0, charIndex + 1);
            charIndex++;

            if (charIndex > currentWord.length) {
                // Finished typing, start deleting after pause
                isDeleting = true;
                charIndex = currentWord.length;
                setTimeout(typeEffect, pauseAfterComplete);
                return;
            }
        }

        // Update the text
        typingElement.textContent = currentText;

        // Continue typing/deleting
        const speed = isDeleting ? deletingSpeed : typingSpeed;
        setTimeout(typeEffect, speed);
    }

    // Start with "Insights" already displayed, then wait before starting the cycle
    setTimeout(() => {
        isDeleting = true;
        charIndex = words[0].length;
        typeEffect();
    }, pauseAfterComplete);
});
