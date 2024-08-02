document.addEventListener("DOMContentLoaded", function() {
    var menuButton = document.getElementById('menuButton');
    var closeButton = document.getElementById('closeButton');
    var sidebar = document.getElementById('sidebar');
    var themeButton = document.querySelector('.theme-icon');
    var currentTheme = 'light-theme'; // Tema inicial

    menuButton.addEventListener('click', function() {
        sidebar.style.width = "250px";
    });

    closeButton.addEventListener('click', function() {
        sidebar.style.width = "0";
    });

    function switchTheme(newTheme) {
        document.body.classList.remove(currentTheme);
        document.body.classList.add(newTheme);
        currentTheme = newTheme;

        // Atualiza o ícone do tema
        themeButton.innerHTML = currentTheme === 'light-theme' ? 'dark_mode' : 'light_mode';
        
        // Atualiza a classe dos itens de menu
        var navItems = document.querySelectorAll('.nav-item a');
        navItems.forEach(function(item) {
            item.classList.remove('light-theme', 'dark-theme');
            item.classList.add(currentTheme);
        });

    }

    themeButton.addEventListener('click', function() {
        // Alterna entre os temas
        if (currentTheme === 'light-theme') {
            switchTheme('dark-theme');
        } else {
            switchTheme('light-theme');
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const prevButton = document.querySelector('.carousel-control.prev');
    const nextButton = document.querySelector('.carousel-control.next');
    const carouselInner = document.querySelector('.carousel-inner');
    const carouselItems = document.querySelectorAll('.carousel-item');
    let currentIndex = 0;

    function updateCarousel() {
        carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    prevButton.addEventListener('click', function() {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : carouselItems.length - 1;
        updateCarousel();
    });

    nextButton.addEventListener('click', function() {
        currentIndex = (currentIndex < carouselItems.length - 1) ? currentIndex + 1 : 0;
        updateCarousel();
    });

    updateCarousel(); // Certifique-se de que a primeira imagem esteja visível
});