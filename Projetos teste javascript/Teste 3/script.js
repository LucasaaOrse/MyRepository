let num = document.getElementById('inum')
let lista = document.getElementById('icaixa')
let res = document.getElementById('res')
let valores = []

function isNumero(n ) {
    if(Number(n) >= 1 && Number(n) <= 100){
        return true
    }else {
        return false
    }

}

function inLista(n, l){
    if (l.indexOf(Number(n)) != -1){
        return true
    }else {
        return false
    }

}


function adicionar() {
    if(isNumero(num.value) && !inLista(num.value, valores)){
        valores.push(Number(num.value))
        let item = document.createElement('option')
        item.text = `Valor ${num.value} adicionado`
        lista.appendChild(item)

    }else {
        alert('Numero invalido ou ja presente na lista')

    }
    num.value = " "
    num.focus()
    res.innerHTML = ''
 }

 function finalizar(){
    if (valores.length == 0) {
        alert('Digite algum valor para finalizar')

    }else {
        let total = valores.length
        let soma = 0
        let media = 0
        let maior = valores[0]
        let menor = valores[0]
        for (let pos in valores) {
            soma += valores[pos]
            if (maior < valores[pos]) {
                maior = valores[pos]
            }if (menor > valores[pos]) {
                menor = valores[pos]
            }
            media = soma / total
        }
        res.innerHTML += `<p>O total de valores digitados foi ${total}.</p> `
        res.innerHTML += `<p>A soma dos valores dá ${soma}.</p>`
        res.innerHTML += `<p>O menor e maior valores respectivamente são ${menor} e ${maior}.</p>`
        res.innerHTML += `<p>A media entre os valores é ${media}.</p> `



    }   

 
 }