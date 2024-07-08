mediai = 0
hmv = ""
mav = 0
idadev = 0
for i in range(1, 5):
    print("+_=-=-=-=-=-=-=-=-")
    nome = input("Digite o nome da {} pessoa: ".format(i))
    idade = int(input("Digite a idade da {} pessoa: ".format(i)))
    sexo = input("Digite o sexo da {} pessoa [M][F]".format(i)).strip().upper()
    mediai += idade
    

    if sexo == "M":
        if idade > idadev:
            idadev = idade
            hmv = nome
    elif sexo == "F" and idade > 20:
        mav += 1
mediai /= 4

print("A media de idade do grupo é de {:.2f} ano(s)".format(mediai))
if hmv:
    print("O homem mais velho é o {} com {} anos".format(hmv, idadev))
if mav != 0:
    print("A quantidade de mulhres acima de 20 anos é de {}".format(mav))