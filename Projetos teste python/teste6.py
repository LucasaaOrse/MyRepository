n1 = int(input("Digite o primeiro numero: "))
n2 = int(input("Digite a razão: "))

termo = n1
cont = 1
amais = 10
total = 0

while amais != 0:
    total += amais
    while cont <= total:
        print(" {} > ".format(termo), end="")
        termo += n1
        cont += 1
    print("Pausa")
    amais = int(input("Quantos termos a mais vc quer? "))
print("Fim, o total de termos mostrados foi {} ".format(total))