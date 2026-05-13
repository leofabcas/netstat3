// --- Typing Effect ---
const typingElement = document.getElementById('typing-text');
if (typingElement) {
    const text = "ANALIZANDO NODOS... ELIMINANDO CUELLOS DE BOTELLA... OPTIMIZANDO TRANSMISION DE DATOS... PROTOCOLO ACTIVO.";
    const contentSpan = typingElement.querySelector('.content');
    let i = 0;
    function type() {
        if (i < text.length) {
            contentSpan.textContent += text.charAt(i);
            i++;
            setTimeout(type, 30 + Math.random() * 40);
        } else {
            setTimeout(() => {
                contentSpan.textContent = "";
                i = 0;
                type();
            }, 3000);
        }
    }
    type();
}

// --- Protocolos Carousel (Dynamic bottom-to-top) ---
const cards = document.querySelectorAll('.exp-card');
let activeIndex = 0;
if (cards.length > 0) {
    function rotateCards() {
        cards.forEach((card, i) => {
            if (i === activeIndex) {
                // Active card: Centered and visible
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
                card.style.zIndex = '20';
            } else if (i === (activeIndex + 1) % cards.length) {
                // Next card: Peak from bottom
                card.style.opacity = '0.3';
                card.style.transform = 'translateY(120px) scale(0.9)';
                card.style.zIndex = '10';
            } else {
                // Previous/Others: Exit to top
                card.style.opacity = '0';
                card.style.transform = 'translateY(-120px) scale(0.8)';
                card.style.zIndex = '0';
            }
        });
        activeIndex = (activeIndex + 1) % cards.length;
    }
    // Initialize first state
    rotateCards();
    // Start interval
    setInterval(rotateCards, 2500);
}

// --- Global Connectivity Animation ---
const canvas = document.getElementById('fiber-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    
    // Define nodes as percentages of canvas width/height to align with world map
    const nodeLocations = [
        { x: 0.22, y: 0.35, name: 'North America' },
        { x: 0.28, y: 0.65, name: 'South America' },
        { x: 0.48, y: 0.28, name: 'Europe' },
        { x: 0.52, y: 0.55, name: 'Africa' },
        { x: 0.70, y: 0.32, name: 'Asia' },
        { x: 0.85, y: 0.75, name: 'Australia' },
        { x: 0.78, y: 0.45, name: 'SE Asia' },
        { x: 0.15, y: 0.40, name: 'West Coast US' }
    ];
    let nodes = [];
    
    function resize() {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
        // Update pixel coordinates
        nodes = nodeLocations.map(loc => ({
            x: loc.x * width,
            y: loc.y * height
        }));
    }
    window.addEventListener('resize', resize);
    resize();
    
    const pulses = [];
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Draw static connections (dim lines)
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(169, 199, 255, 0.15)`;
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                // Connect all nodes slightly
                ctx.beginPath();
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                ctx.stroke();
                
                // Randomly spawn pulses
                if (Math.random() < 0.005) {
                    pulses.push({
                        start: nodes[i],
                        end: nodes[j],
                        progress: 0,
                        speed: 0.01 + Math.random() * 0.02
                    });
                }
                // Reverse pulse randomly
                if (Math.random() < 0.005) {
                    pulses.push({
                        start: nodes[j],
                        end: nodes[i],
                        progress: 0,
                        speed: 0.01 + Math.random() * 0.02
                    });
                }
            }
        }
        
        // Draw pulses (Bright & Glowing)
        pulses.forEach((p, index) => {
            p.progress += p.speed;
            if (p.progress >= 1) {
                pulses.splice(index, 1);
                return;
            }
            
            const px = p.start.x + (p.end.x - p.start.x) * p.progress;
            const py = p.start.y + (p.end.y - p.start.y) * p.progress;
            
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#a9c7ff';
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(px, py, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // Tail effect
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            const tx = p.start.x + (p.end.x - p.start.x) * Math.max(0, p.progress - 0.1);
            const ty = p.start.y + (p.end.y - p.start.y) * Math.max(0, p.progress - 0.1);
            ctx.moveTo(tx, ty);
            ctx.lineTo(px, py);
            ctx.stroke();
        });

        // Draw nodes
        nodes.forEach(node => {
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#a9c7ff';
            ctx.fillStyle = '#a9c7ff';
            ctx.beginPath();
            ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // Outer pulse circle
            ctx.strokeStyle = `rgba(169, 199, 255, ${0.2 + Math.sin(Date.now() / 300) * 0.2})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
            ctx.stroke();
        });
        
        requestAnimationFrame(animate);
    }
    animate();
}

// --- Mobile Menu Toggle ---
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const menuIcon = document.getElementById('menu-icon');
const mobileMenuLinks = document.getElementById('mobile-menu-links');
const mobileLinks = document.querySelectorAll('.mobile-link');

if (mobileMenuBtn && mobileMenu) {
    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
            mobileMenuLinks.classList.remove('translate-y-8');
            menuIcon.textContent = 'close';
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        } else {
            mobileMenu.classList.add('opacity-0', 'pointer-events-none');
            mobileMenuLinks.classList.add('translate-y-8');
            menuIcon.textContent = 'menu';
            document.body.style.overflow = ''; // Restore scrolling
        }
    }

    mobileMenuBtn.addEventListener('click', toggleMenu);

    // Close menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) toggleMenu();
        });
    });
}

console.log('NETSTAT-AR Final Animations Initialized');