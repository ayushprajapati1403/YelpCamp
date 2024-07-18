document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll(' a');

    links.forEach(link => {
        link.addEventListener('click', function(event) {
            const href = event.target.getAttribute('href');

            if (!href.startsWith('#')) {
            
                // Handle external links
                event.preventDefault();

                const body = document.querySelector('body');
                body.classList.add('transition');

                // Change the location after the transition
                setTimeout(() => {
					body.classList.remove('transition');
                    location.href = href;
                }, 300); // Adjust the delay to match the transition duration
            }
        });
    });

});