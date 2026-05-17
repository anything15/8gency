// Hand Animation Script for Human-Agent Interaction
document.addEventListener('DOMContentLoaded', function() {
    // Organic swarm formation positions (tighter at front near human hand, spread at back to edge)
    // Format: { left%, top%, delay, parallaxSpeed, rotation }
    const agentHandPositions = [
        // Front row
        { left: 45, top: 50, delay: 0.18, speed: 0.025, rotation: -10 },

        // Second row
        { left: 39.5, top: 52, delay: 0.29, speed: 0.032, rotation: -10 },
        { left: 39, top: 46, delay: 0.31, speed: 0.033, rotation: 6 },

        // Third row
        { left: 36, top: 50, delay: 0.34, speed: 0.035, rotation: 0 },
        { left: 34, top: 40, delay: 0.36, speed: 0.037, rotation: 15 },
        { left: 34, top: 60, delay: 0.36, speed: 0.037, rotation: -15 },
        { left: 33, top: 46, delay: 0.38, speed: 0.04, rotation: 8 },
        { left: 33, top: 55, delay: 0.38, speed: 0.04, rotation: -8 },

        // Fourth row
        { left: 28, top: 45, delay: 0.41, speed: 0.043, rotation: 0 },
        { left: 27, top: 33, delay: 0.43, speed: 0.045, rotation: 18 },
        { left: 27, top: 65, delay: 0.43, speed: 0.045, rotation: -18 },
        { left: 26, top: 38, delay: 0.45, speed: 0.048, rotation: 10 },
        { left: 25, top: 58, delay: 0.45, speed: 0.048, rotation: -10 },

        // Fifth row
        { left: 21, top: 53, delay: 0.48, speed: 0.052, rotation: 0 },
        { left: 20, top: 20, delay: 0.5, speed: 0.055, rotation: 20 },
        { left: 20, top: 80, delay: 0.5, speed: 0.055, rotation: -20 },
        { left: 18, top: 33, delay: 0.52, speed: 0.058, rotation: 12 },
        { left: 18, top: 67, delay: 0.52, speed: 0.058, rotation: -12 },

        // Back row
        { left: 12, top: 50, delay: 0.55, speed: 0.062, rotation: 0 },
        { left: 10, top: 18, delay: 0.57, speed: 0.065, rotation: 22 },
        { left: 10, top: 85, delay: 0.57, speed: 0.065, rotation: -22 },
        { left: 9, top: 25, delay: 0.6, speed: 0.068, rotation: 15 },
        { left: 8, top: 71, delay: 0.6, speed: 0.068, rotation: -15 },

        // Final row
        { left: 2, top: 40, delay: 0.63, speed: 0.072, rotation: 10 },
        { left: 2, top: 60, delay: 0.63, speed: 0.072, rotation: -10 },
        { left: 3, top: 20, delay: 0.66, speed: 0.075, rotation: 18 },
        { left: 3, top: 77, delay: 0.66, speed: 0.075, rotation: -18 }
    ];

    // Dynamically create agent hand elements based on positions array
    const handContainer = document.querySelector('.hand-animation-container');
    const humanHand = document.querySelector('.human-hand'); // Get human hand before we create agent hands

    // Create agent hand elements
    agentHandPositions.forEach((pos, index) => {
        const agentHand = document.createElement('img');
        agentHand.className = 'agent-hand';
        agentHand.src = 'handofAgent.png';
        agentHand.alt = 'Agent Hand';
        // Insert before human hand to maintain proper z-order
        handContainer.insertBefore(agentHand, humanHand);
    });

    // Now get all the agent hands we just created
    const agentHands = document.querySelectorAll('.agent-hand');

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
        right: '32%',
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

    // Particle Globe Animation in Center
    const particleContainer = document.querySelector('.particle-lines-container');

    // Create particle globe container
    const globeContainer = document.createElement('div');
    globeContainer.className = 'particle-globe';
    particleContainer.appendChild(globeContainer);

    // Create particles for the globe
    const particleCount = 300;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'globe-particle';
        globeContainer.appendChild(particle);
        particles.push(particle);

        // Random position on sphere
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const radius = 300; // Globe radius in pixels

        // Store spherical coordinates
        particle.dataset.theta = theta;
        particle.dataset.phi = phi;
        particle.dataset.radius = radius;

        // Random animation delay and speed
        particle.dataset.animSpeed = 0.5 + Math.random() * 1;
        particle.dataset.animDelay = Math.random() * 2;

        // Start invisible
        gsap.set(particle, { opacity: 0 });
    }

    // Position globe in center of viewport
    gsap.set(globeContainer, {
        position: 'absolute',
        left: '50%',
        top: '50%',
        xPercent: -50,
        yPercent: -50,
        width: 500,
        height: 500
    });

    // Animate the particle globe
    let globeRotation = 0;

    function animateGlobe() {
        globeRotation += 0.003;

        particles.forEach((particle, index) => {
            const theta = parseFloat(particle.dataset.theta) + globeRotation;
            const phi = parseFloat(particle.dataset.phi);
            const radius = parseFloat(particle.dataset.radius);
            const animSpeed = parseFloat(particle.dataset.animSpeed);
            const animDelay = parseFloat(particle.dataset.animDelay);

            // Add some floating movement
            const floatRadius = radius + Math.sin(Date.now() * 0.001 * animSpeed + animDelay) * 10;

            // Convert spherical to cartesian coordinates
            const x = floatRadius * Math.sin(phi) * Math.cos(theta);
            const y = floatRadius * Math.sin(phi) * Math.sin(theta);
            const z = floatRadius * Math.cos(phi);

            // Apply perspective (particles in front are larger/brighter)
            const scale = (z + radius) / (radius * 2);
            // Don't set opacity here - it's controlled by the fade-in animation

            gsap.set(particle, {
                x: x,
                y: y,
                scale: scale,
                zIndex: Math.floor(z)
            });
        });

        requestAnimationFrame(animateGlobe);
    }

    // Start globe animation after hands are in position
    setTimeout(() => {
        // Fade in the globe particles with proper depth-based opacity
        particles.forEach((particle, index) => {
            const phi = parseFloat(particle.dataset.phi);
            const radius = parseFloat(particle.dataset.radius);
            const z = radius * Math.cos(phi);
            const scale = (z + radius) / (radius * 2);
            const targetOpacity = 0.3 + scale * 0.5;

            gsap.to(particle, {
                opacity: targetOpacity,
                duration: 2,
                delay: index * 0.01,
                ease: 'power2.out'
            });
        });

        // Start the rotation animation
        animateGlobe();
    }, 3000); // Wait for hands to animate in
});