from random import randint

v = 0
while True:
    jogador = int(input("Diga um valor: "))
    computador = randint(0, 10)
    total = jogador + computador
    tipo = " "
    while tipo not in "PI":
        tipo = str(input("Par ou Impar? [P/I] ")).strip().upper()[0]
    print(f"Voce jogou {jogador} e o computador {computador}. Total de {total}", end=" ")
    print("Deu par" if total % 2 == 0 else "Deu impar")
    if tipo == "P":
        if total % 2 == 0:
            print("Voce venceu")
            v += 1
        else:
            print("Voce perdeu")
        break
    elif tipo == "I":
        if total % 2 == 1:
            print("Voce venceu")
            v += 1
        else:
            print("Voce perdeu")
            break
    print("Vamos jogar denovo...")
print(f"Game over voce venceu {v} vezes.")