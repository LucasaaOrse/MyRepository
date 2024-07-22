document.addEventListener("DOMContentLoaded", function() {
    var button = document.getElementById('botao');

    button.addEventListener('click', function() { 
        button.classList.toggle('clicked')

    });

});