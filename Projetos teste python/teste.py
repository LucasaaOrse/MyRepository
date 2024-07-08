p = int(input("Digite o primeiro termo: "))
r = int(input("Digite a razão: "))

for i in range(0, 10):
    p += r
    print("{} > ".format(p), end="")
print("Acabou")