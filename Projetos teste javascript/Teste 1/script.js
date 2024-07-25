document.addEventListener("DOMContentLoaded", function() {
    var button = document.getElementById('botao');
    var body = document.getElementById('body');
    var image = document.getElementById('img')
    
    button.addEventListener('click', function() { 
        body.classList.toggle('clicked')

        var currentColor = window.getComputedStyle(body).backgroundColor;

        if (image.src.includes('imagens/Nascerdosol.jpg')) {
            image.src = 'imagens/Pordosol.jpg'
        } else {
            image.src = 'imagens/Nascerdosol.jpg'

        }

    });

});