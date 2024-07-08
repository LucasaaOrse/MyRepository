sexo = str(input("Digite seu sexo [M,F] ")).strip().upper()[0]
while sexo not in "MF":
    sexo = str(input("sexo invalido digite novamente ")).strip().upper()[0]
print(sexo)