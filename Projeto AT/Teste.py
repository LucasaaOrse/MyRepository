from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Configurar o driver
options = webdriver.ChromeOptions()
options.add_argument("--headless")  # Executar sem interface gráfica
driver = webdriver.Chrome(options=options)

try:
    # Abrir o Google
    driver.get("https://www.google.com")
    
    # Encontrar o campo de busca e realizar a pesquisa
    search_box = driver.find_element(By.NAME, "q")
    search_query = "Ordem Paranormal"
    search_box.send_keys(search_query)
    search_box.send_keys(Keys.RETURN)

    # Aguardar o primeiro resultado carregar
    wait = WebDriverWait(driver, 10)  # Esperar até 10 segundos
    first_result = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "h3")))

    # Capturar e exibir o texto do primeiro resultado
    print("Primeiro resultado:", first_result.text)

finally:
    driver.quit()
