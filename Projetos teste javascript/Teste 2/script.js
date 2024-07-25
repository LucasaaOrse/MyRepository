var inicial = document.getElementById('inicial')
var final = document.getElementById('final')
var passos = document.getElementById('passos')
var res = document.getElementById('res')

function contagem() {
    if (inicial.value.length === 0 || final.value.length === 0 || passos.value.length === 0){  
        alert("Valores faltando digite novamente")
    } else {
        var i = Number(inicial.value);
        var f = Number(final.value);
        var p = Number(passos.value);
        if (i < f) {
            for (var c = i; c <= f; c += p) {
                res.innerHTML += `${c} -> `

            }


        }
            
    }
        
    
        


}