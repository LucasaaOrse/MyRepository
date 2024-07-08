escolha = " "
maior = 0
menor = 0
t = 0
cont = 0
while escolha not in "Nn":
    num = int(input("Digite um numero: "))
    if cont == 0:
        maior = num
        menor = num
    else:
        if num > maior:
            maior = num
        elif num < menor:
            menor = num
    t += num
    cont += 1 
    escolha = str(input("Deseja continuar? [S,N]")).strip().upper()[0]
print("A media dos {} valores digitados foi {} ".format(cont, t/cont), end="") 
print("O maior valor digitado foi {} e o menor foi {}".format(maior, menor))