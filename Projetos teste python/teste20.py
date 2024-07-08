lista = []
maior = menor = 0
for n in range(0,5):
    lista.append(int(input("Digite um numero: ")))
    if n == 0:
        maior = lista[0]
        menor = lista[0]
    elif n > 1:
        if maior < lista[n]:
            maior = lista[n]
        if menor > lista[n]:
            menor = lista[n]
print(maior, menor)
for i, v in enumerate(lista):
    if v == maior:
        print(f"{i}...", end="")
for i, v in enumerate(lista):
    if v == menor:
        print(f"{i}...", end="")
print("Acabou")

