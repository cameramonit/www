document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');

            // Toggle the hamburger icon
            const spans = this.querySelectorAll('span');
            if (nav.classList.contains('active')) {
                spans[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Header scroll effect
    const header = document.querySelector('header');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Active nav link based on section
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav ul li a');

    window.addEventListener('scroll', function() {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Testimonial Slider
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    let currentTestimonial = 0;

    function showTestimonial(index) {
        testimonials.forEach(testimonial => {
            testimonial.style.display = 'none';
        });

        dots.forEach(dot => {
            dot.classList.remove('active');
        });

        testimonials[index].style.display = 'block';
        dots[index].classList.add('active');
    }

    if (testimonials.length > 0 && dots.length > 0) {
        showTestimonial(0);

        dots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                showTestimonial(index);
                currentTestimonial = index;
            });
        });

        // Auto slide
        setInterval(function() {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }, 5000);
    }

    // ROI Calculator
    const calculateBtn = document.getElementById('calculate-roi');

    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            const numCameras = parseInt(document.getElementById('num-cameras').value) || 0;
            const falseAlarms = parseInt(document.getElementById('false-alarms').value) || 0;
            const staffCost = parseFloat(document.getElementById('staff-cost').value) || 0;
            const incidentTime = parseInt(document.getElementById('incident-time').value) || 0;

            // Calculate the results
            // Each false alarm takes X minutes to verify
            const dailyMinutesSaved = falseAlarms * incidentTime;
            const monthlyHoursSaved = (dailyMinutesSaved * 30) / 60;
            const monthlyCostSavings = monthlyHoursSaved * staffCost;
            const annualCostSavings = monthlyCostSavings * 12;

            // Assuming a cost of $50 per camera per month for CameraMonit service
            const monthlyCost = numCameras * 50;
            const roiMonths = monthlyCost > 0 ? Math.ceil(monthlyCost / monthlyCostSavings) : 0;

            // Update the results
            document.getElementById('hours-saved').textContent = monthlyHoursSaved.toFixed(1);
            document.getElementById('cost-savings').textContent = '$' + monthlyCostSavings.toFixed(2);
            document.getElementById('annual-savings').textContent = '$' + annualCostSavings.toFixed(2);
            document.getElementById('roi-months').textContent = roiMonths;

            // Animate the numbers
            animateValue('hours-saved', 0, monthlyHoursSaved, 1000);
            animateValue('cost-savings', 0, monthlyCostSavings, 1000, true);
            animateValue('annual-savings', 0, annualCostSavings, 1000, true);
            animateValue('roi-months', 0, roiMonths, 1000);
        });
    }

    function animateValue(id, start, end, duration, isCurrency = false) {
        const obj = document.getElementById(id);
        const range = end - start;
        const minTimer = 50;
        let stepTime = Math.abs(Math.floor(duration / range));

        stepTime = Math.max(stepTime, minTimer);

        const startTime = new Date().getTime();
        const endTime = startTime + duration;
        let timer;

        function run() {
            const now = new Date().getTime();
            const remaining = Math.max((endTime - now) / duration, 0);
            const value = Math.round(end - (remaining * range));

            if (isCurrency) {
                obj.textContent = '$' + value.toFixed(2);
            } else {
                obj.textContent = value.toFixed(1);
            }

            if (value === end) {
                clearInterval(timer);
            }
        }

        timer = setInterval(run, stepTime);
        run();
    }

    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(this);

            fetch('contact.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                const formMessage = document.getElementById('form-message');

                if (data.success) {
                    formMessage.textContent = data.message;
                    formMessage.className = 'success';
                    contactForm.reset();
                } else {
                    formMessage.textContent = data.message;
                    formMessage.className = 'error';
                }

                // Hide the message after 5 seconds
                setTimeout(function() {
                    formMessage.style.display = 'none';
                }, 5000);
            })
            .catch(error => {
                console.error('Error:', error);
                const formMessage = document.getElementById('form-message');
                formMessage.textContent = 'An error occurred. Please try again later.';
                formMessage.className = 'error';
            });
        });
    }
});