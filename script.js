// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize GSAP and ScrollTrigger
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // Stopwatch functionality
    class Stopwatch {
        constructor(startDate) {
            this.startDate = new Date(startDate);
            this.isRunning = true;
            this.interval = null;
            this.elements = {
                days: document.getElementById('days'),
                hours: document.getElementById('hours'),
                minutes: document.getElementById('minutes'),
                seconds: document.getElementById('seconds')
            };
            
            this.init();
        }
        
        init() {
            this.updateDisplay();
            this.start();
        }
        
        start() {
            this.interval = setInterval(() => {
                this.updateDisplay();
            }, 1000); // Update every second
        }
        
        updateDisplay() {
            const now = new Date();
            const elapsed = now - this.startDate;
            
            if (elapsed < 0) {
                // If the start date is in the future, show zeros
                this.elements.days.textContent = '0';
                this.elements.hours.textContent = '0';
                this.elements.minutes.textContent = '0';
                this.elements.seconds.textContent = '0';
                return;
            }
            
            const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
            const hours = Math.floor((elapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
            
            this.elements.days.textContent = days;
            this.elements.hours.textContent = hours.toString().padStart(2, '0');
            this.elements.minutes.textContent = minutes.toString().padStart(2, '0');
            this.elements.seconds.textContent = seconds.toString().padStart(2, '0');
            
            this.updateStatus(days, hours, minutes);
        }
        
        updateStatus(days, hours, minutes) {
            const statusElement = document.querySelector('.status');
            if (!statusElement) return;
            
            let statusText = '';
            
            if (days > 0) {
                statusText = `It has been ${days} day${days > 1 ? 's' : ''} since sending the email.`;
            } else if (hours > 0) {
                statusText = `It has been ${hours} hour${hours > 1 ? 's' : ''} since sending the email.`;
            } else if (minutes > 0) {
                statusText = `It has been ${minutes} minute${minutes > 1 ? 's' : ''} since sending the email.`;
            } else {
                statusText = 'Just sent the email...';
            }
            
            statusElement.textContent = statusText;
        }
    }

    // Combined letter and timer scrolling animation
    function setupScrollAnimation() {
        const allLines = document.querySelectorAll('.letter-line, .timer-line');
        const letterContainer = document.querySelector('.letter-container');
        const timerContainer = document.querySelector('.timer-container');
        
        if (!allLines.length) return;
        
        // Skip the first line since it's already visible
        const scrollableLines = Array.from(allLines).slice(1);
        
        // Calculate scroll progress for each line - each line takes 2 scrolls
        scrollableLines.forEach((line, index) => {
            const lineNumber = parseInt(line.getAttribute('data-line'));
            // Each line takes 2 scrolls, so we multiply by 2
            const scrollProgress = (lineNumber - 2) * 2;
            
            // Determine which container to use as trigger
            const triggerContainer = line.classList.contains('timer-line') ? timerContainer : letterContainer;
            
            ScrollTrigger.create({
                trigger: triggerContainer,
                start: `top+=${scrollProgress * 10}% top`,
                end: `top+=${(scrollProgress + 2) * 10}% top`,
                onEnter: () => {
                    line.classList.add('revealed');
                },
                onEnterBack: () => {
                    line.classList.add('revealed');
                },
                onLeave: () => {
                    // Keep lines visible once revealed
                },
                onLeaveBack: () => {
                    // Keep lines visible once revealed
                }
            });
        });
    }

    // Initialize stopwatch with July 29, 2025 at 8:34 PM CST
    // Convert CST to UTC (CST is UTC-6, but during summer it's CDT which is UTC-5)
    // July 29, 2025 at 8:34 PM CDT = July 30, 2025 at 1:34 AM UTC
    const startDate = '2025-07-30T01:34:00.000Z';
    const stopwatch = new Stopwatch(startDate);
    
    // Setup scroll animation
    setupScrollAnimation();
}); 