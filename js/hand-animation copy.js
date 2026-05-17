// Hand Animation Script for Human-Agent Interaction
document.addEventListener('DOMContentLoaded', function() {
    // Organic swarm formation positions (tighter at front near human hand, spread at back to edge)
    // Format: { left%, top%, delay, parallaxSpeed, rotation }
    const agentHandPositions = [
        // Front row
        { left: 54, top: 50, delay: 0.18, speed: 0.025, rotation: -10 },



        // Second row


        { left: 49.5, top: 52, delay: 0.29, speed: 0.032, rotation: -10 },
        { left: 49, top: 46, delay: 0.31, speed: 0.033, rotation: 6 },


        // Third row
        { left: 46, top: 50, delay: 0.34, speed: 0.035, rotation: 0 },
        { left: 44, top: 40, delay: 0.36, speed: 0.037, rotation: 15 },
        { left: 44, top: 60, delay: 0.36, speed: 0.037, rotation: -15 },
        { left: 43, top: 46, delay: 0.38, speed: 0.04, rotation: 8 },
        { left: 43, top: 55, delay: 0.38, speed: 0.04, rotation: -8 },

        // Fourth row
        { left: 38, top: 45, delay: 0.41, speed: 0.043, rotation: 0 },
        { left: 37, top: 33, delay: 0.43, speed: 0.045, rotation: 18 },
        { left: 37, top: 65, delay: 0.43, speed: 0.045, rotation: -18 },
        { left: 36, top: 38, delay: 0.45, speed: 0.048, rotation: 10 },
        { left: 35, top: 58, delay: 0.45, speed: 0.048, rotation: -10 },

        // Fifth row
        { left: 31, top: 53, delay: 0.48, speed: 0.052, rotation: 0 },
        { left: 30, top: 20, delay: 0.5, speed: 0.055, rotation: 20 },
        { left: 30, top: 80, delay: 0.5, speed: 0.055, rotation: -20 },
        { left: 28, top: 33, delay: 0.52, speed: 0.058, rotation: 12 },
        { left: 28, top: 67, delay: 0.52, speed: 0.058, rotation: -12 },

        // Back row
        { left: 22, top: 50, delay: 0.55, speed: 0.062, rotation: 0 },
        { left: 20, top: 18, delay: 0.57, speed: 0.065, rotation: 22 },
        { left: 20, top: 85, delay: 0.57, speed: 0.065, rotation: -22 },
        { left: 15, top: 25, delay: 0.6, speed: 0.068, rotation: 15 },
        { left: 15, top: 71, delay: 0.6, speed: 0.068, rotation: -15 },

        // Final row
        { left: 12, top: 40, delay: 0.63, speed: 0.072, rotation: 10 },
        { left: 12, top: 60, delay: 0.63, speed: 0.072, rotation: -10 },
        { left: 8, top: 20, delay: 0.66, speed: 0.075, rotation: 18 },
        { left: 8, top: 77, delay: 0.66, speed: 0.075, rotation: -18 }
    ];

    const agentHands = document.querySelectorAll('.agent-hand');
    const humanHand = document.querySelector('.human-hand');

    // Set initial positions and animate agent hands
    agentHands.forEach((hand, index) => {
        const pos = agentHandPositions[index];

        // Set starting position (off screen to the left)
        gsap.set(hand, {
            left: '-100px',
            top: pos.top + '%',
            opacity: 0,
            rotation: 0
        });

        // Animate to final position
        gsap.to(hand, {
            left: pos.left + '%',
            top: pos.top + '%',
            opacity: 0.65,
            rotation: pos.rotation,
            duration: 2.8,
            delay: pos.delay,
            ease: 'power2.out'
        });

        // Store parallax speed on element
        hand.dataset.parallaxSpeed = pos.speed;
    });

    // Animate human hand from right - positioned to just touch leader
    gsap.to(humanHand, {
        right: '25%',
        opacity: 0.85,
        duration: 2.8,
        delay: 0.5,
        ease: 'power2.out'
    });

    humanHand.dataset.parallaxSpeed = 0.02;

    // Mouse movement parallax effect
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Smooth animation loop for parallax
    function animateParallax() {
        currentX += (mouseX - currentX) * 0.3;
        currentY += (mouseY - currentY) * 0.3;

        // Apply parallax to agent hands
        agentHands.forEach((hand) => {
            const speed = parseFloat(hand.dataset.parallaxSpeed);
            const x = currentX * speed * 100;
            const y = currentY * speed * 100;

            gsap.to(hand, {
                x: x,
                y: y,
                duration: 0.3,
                ease: 'power1.out'
            });
        });

        // Apply parallax to human hand (opposite direction for interaction)
        const humanSpeed = parseFloat(humanHand.dataset.parallaxSpeed);
        const humanX = -currentX * humanSpeed * 100;
        const humanY = -currentY * humanSpeed * 100;

        gsap.to(humanHand, {
            x: humanX,
            y: humanY,
            duration: 0.3,
            ease: 'power1.out'
        });

        requestAnimationFrame(animateParallax);
    }

    animateParallax();

    // Particle Line Animation
    const particleContainer = document.querySelector('.particle-lines-container');
    let particleLines = [];
    let activeTargetIndices = [];

    // Create lightning lines (3 active at a time)
    for (let i = 0; i < 3; i++) {
        const line = document.createElement('div');
        line.className = 'particle-line';
        particleContainer.appendChild(line);
        particleLines.push(line);

        // Add electric spark dot at the end of each line
        const dot = document.createElement('div');
        dot.className = 'particle-dot';
        particleContainer.appendChild(dot);
        line.dot = dot;

        // Add lightning branches for more electric effect
        line.branches = [];
        for (let j = 0; j < 3; j++) {
            const branch = document.createElement('div');
            branch.className = 'lightning-branch';
            particleContainer.appendChild(branch);
            line.branches.push(branch);
        }
    }

    // Wait for hands to be positioned before starting particles
    setTimeout(() => {
        // Function to update particle targets based on mouse position
        function updateParticleTargets() {
            const mouseAngle = Math.atan2(currentY, currentX);
            const normalizedAngle = (mouseAngle + Math.PI) / (2 * Math.PI); // 0 to 1

            // Select different agent hands based on mouse position
            const sectorSize = Math.floor(agentHands.length / 3);
            activeTargetIndices = [];

            // Choose 3 hands from different sectors based on mouse position
            for (let i = 0; i < 3; i++) {
                const baseIndex = Math.floor(normalizedAngle * sectorSize) + (i * sectorSize);
                const targetIndex = Math.min(baseIndex % agentHands.length, agentHands.length - 1);
                activeTargetIndices.push(targetIndex);
            }
        }

        // Function to animate particle lines
        function animateParticleLines() {
            if (!humanHand || agentHands.length === 0) return;

            const humanRect = humanHand.getBoundingClientRect();
            const humanCenterX = humanRect.left + (humanRect.width * 0.3); // Start from fingertip area
            const humanCenterY = humanRect.top + humanRect.height / 2;

            particleLines.forEach((line, index) => {
                const targetIndex = activeTargetIndices[index] || index;
                const targetHand = agentHands[targetIndex];

                if (targetHand) {
                    const targetRect = targetHand.getBoundingClientRect();
                    const targetCenterX = targetRect.left + targetRect.width / 2;
                    const targetCenterY = targetRect.top + targetRect.height / 2;

                    // Calculate distance and angle
                    const dx = targetCenterX - humanCenterX;
                    const dy = targetCenterY - humanCenterY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

                    // Position and rotate the main lightning bolt
                    gsap.set(line, {
                        left: humanCenterX,
                        top: humanCenterY,
                        width: distance,
                        rotation: angle,
                        transformOrigin: '0 50%'
                    });

                    // Animate opacity based on mouse movement with electric flicker
                    const baseOpacity = 0.4 + (Math.abs(currentX) + Math.abs(currentY)) * 0.3;
                    const flickerOpacity = baseOpacity * (0.8 + Math.random() * 0.4);

                    // Set CSS variable for animation
                    line.style.setProperty('--line-opacity', flickerOpacity);

                    gsap.to(line, {
                        opacity: Math.min(flickerOpacity, 0.8),
                        duration: 0.1,
                        ease: 'none'
                    });

                    // Animate electric spark along the line
                    const progress = (Date.now() % 1500) / 1500; // Faster loop for electricity
                    const dotX = humanCenterX + dx * progress;
                    const dotY = humanCenterY + dy * progress;

                    // Add random jitter for electric effect
                    const jitterX = (Math.random() - 0.5) * 10;
                    const jitterY = (Math.random() - 0.5) * 10;

                    gsap.set(line.dot, {
                        left: dotX + jitterX,
                        top: dotY + jitterY,
                        opacity: 0.9 * (1 - Math.abs(progress - 0.5) * 2) // Fade in/out
                    });

                    // Animate lightning branches
                    line.branches.forEach((branch, branchIndex) => {
                        const branchProgress = 0.3 + (branchIndex * 0.2);
                        const branchX = humanCenterX + dx * branchProgress;
                        const branchY = humanCenterY + dy * branchProgress;

                        // Random branch angle and length
                        const branchAngle = angle + (Math.random() - 0.5) * 60;
                        const branchLength = 20 + Math.random() * 30;

                        gsap.set(branch, {
                            left: branchX,
                            top: branchY,
                            width: branchLength,
                            rotation: branchAngle,
                            opacity: Math.random() > 0.5 ? 0.4 : 0
                        });
                    });
                }
            });

            requestAnimationFrame(animateParticleLines);
        }

        // Update targets when mouse moves significantly
        let lastUpdateX = 0;
        let lastUpdateY = 0;
        setInterval(() => {
            const moveDistance = Math.sqrt(
                Math.pow(currentX - lastUpdateX, 2) +
                Math.pow(currentY - lastUpdateY, 2)
            );

            if (moveDistance > 0.1) {
                updateParticleTargets();
                lastUpdateX = currentX;
                lastUpdateY = currentY;
            }
        }, 200);

        // Start the particle animation
        updateParticleTargets();
        animateParticleLines();

    }, 3000); // Wait for hands to animate in
});