from random import randint

computador = randint(0, 10)

jogador = int(input("Escolha um numero de 0 a 10 "))

tentativas = 1
while jogador != computador:
    tentativas += 1
    if jogador > computador:
        jogador = int(input("Errado, o numero q eu pensei é menor, tente de novo: "))
    elif jogador < computador:
        jogador = int(input("Errado, o numero q eu pensei é maior, tente de novo: "))
if jogador == computador:
    print("Parabens você acertou em {} tentativa(s), o numero era {}".format(tentativas, computador))
