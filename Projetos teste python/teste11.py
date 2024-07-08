maiores = m = h = 0


while True:
    idade = int(input("Digite a idade da pessoa: "))
    sexo = str(input("Digite o sexo da pessoa [M/F]: ")).strip().upper()[0]
    escolha = str(input("Gostaria de continuar? [S/N]: ")).strip().upper()[0]
        
    if idade > 18:
        maiores += 1
    if sexo == "M":
        h += 1
    if sexo == "F" and idade > 20:
        m += 1
        
    if escolha == "N":
        break
print(f"A quantidade de pessoas maiores de 18 é de {maiores}, a quantidade de homens cadastrados foi de {h} e de mulhres acima de 20 foi de {m}")

