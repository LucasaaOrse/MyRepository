lista = ("Casa", "Carro", "Árvore", 
         "Computador", "Livro", "Telefone", 
         "Mesa", "Cadeira", "Janela", "Relógio")

for n in lista:
    print(f"\nNa palavra {n.upper()} temos ", end="")
    for letra in n:
        if letra.lower() in "aáàâãeéèêiíìoôu":
            print(letra, end=" ")