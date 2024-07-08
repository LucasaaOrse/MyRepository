lista = ("Arroz", 10.00,
"Feijão", 15.50,
"Macarrão", 7.75,
"Leite", 20.00,
"Pão", 12.30,
"Ovos", 9.99,
"Açúcar", 18.45,
"Sal", 22.10,
"Café", 5.60,
"Manteiga", 30.00,)

print("_" * 40)
print(f"{'Lista de preços':^40}")
print("_" * 40)
for pos in range(0 , len(lista)):
    if pos % 2 == 0:
        print(f'{lista[pos]:.<30}', end="")
    else:
        print(f"R${lista[pos]:>7.2f}")
print("_" * 40)