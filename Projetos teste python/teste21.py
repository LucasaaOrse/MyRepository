
lista = []

while True:

    a = int(input("Digite um numero: "))
    if a not in lista:
        lista.append(a)
    else:
        print("Digite novamente, esse numero já esta na lista")
    escolha = str(input("Quer continuar? [S/N] ")).upper().strip()[0]
    if escolha in "N":
        break
    
    
print(f"Os numeros digitados foram {sorted(lista)}")