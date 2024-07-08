
escolha = 0
print("Digite dois numeros")
n1 = int(input("Digite o primeiro numero: "))
n2 = int(input("Digite o segundo numero: "))

while escolha != 5:
    print("Digite o que quer fazer com esse numeros?")
    print("""
    [1] Somar
    [2] Multiplicar
    [3] Maior
    [4] Novos numeros
    [5] Sair do programa
    """)
    escolha = int(input("Qual a sua opção?  "))
    if escolha == 1:
        s = n1 + n2
        print("A soma de {} e {} é de {}".format(n1, n2, s))
    elif escolha == 2:
        s = n1 * n2
        print("A soma dos dois numeros é {}".format(s))
    elif escolha == 3:
        if n1 > n2:
            print("O primeiro numero é maior")
        else:
            print("O segundo numero é maior")
    elif escolha == 4:
        n1 = int(input("Digite o primeiro numero novamente: "))
        n2 = int(input("Digite o segundo numero novamente: "))
    elif escolha == 5:
        print("Saindo do programa")
    else:
        print("Valor invalido, digite novamente")      
    print("=-=" * 10)
print("Fim")

