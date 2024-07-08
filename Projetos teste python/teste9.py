n = int(input(" Digite qual numero da tabua: "))
a = 1

while n > 0:
    for i in range(1 , 11):
        print(f"{n} x {i} = {n*i}")
        a += 1
    n = int(input(" Digite qual numero da tabua: "))
print("Acabou")
