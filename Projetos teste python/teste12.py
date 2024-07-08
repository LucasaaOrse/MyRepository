total = m = cont = menor = 0
barato = ""

while True:
    nome = str(input("digite o nome do produto: "))
    preço = float(input("Digite o preço do produto: "))
    
    total += preço
    cont += 1
    if preço > 1000.00: 
        m += 1
    if cont == 1 or preço < menor:
        menor = preço
        barato = nome
    escolha = " "
    while escolha not in "SN":
        escolha = str(input("Deseja continuar? ")).strip().upper()[0]
    if escolha == "N":
        break

print(f"O valor da compra deu {total}, {m} produtos custam mais de 1000, o produto mais barato foi o {barato}")

