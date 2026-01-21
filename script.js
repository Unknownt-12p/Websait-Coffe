document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu navigation
    var navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            var href = this.getAttribute('href');
            if (href.startsWith('#')) {
                var target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Menu card hover effect
    var menuCards = document.querySelectorAll('.menu-card');
    menuCards.forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Contact WhatsApp link
    var whatsappLink = document.querySelector('.contact-item:last-child a');
    if (whatsappLink) {
        whatsappLink.setAttribute('href', 'https://wa.me/628996293084');
        whatsappLink.textContent = '+62 899 6293 084';
    }
});