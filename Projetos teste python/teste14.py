a = ("zero", "Um", "Dois", "Tres", "Quatro", "Cinco", "Seis", "Sete")

while True:
    escolha = int(input("Digite um numero de 0 a 7: "))
    if 0 <= escolha <= 20: 
        break
print(f"Voce digitou o numero {a[escolha]}")