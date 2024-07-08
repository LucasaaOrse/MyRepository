n = int(input("Digite quantos numeros vc quer mostrar: "))

p = 0
s = 1

print(" {} > {} > ".format(p, s), end="")

cont = 3

while cont <= n:
    t = p + s
    print("{} > ".format(t), end="")
    p = s
    s = t
    cont += 1
print(" Fim")




# 0 - 1 - 1 - 2 - 3 - 5