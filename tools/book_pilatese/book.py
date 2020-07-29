from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By

options = webdriver.ChromeOptions()
options.add_argument("--start-maximized")
driver = webdriver.Chrome("./chromedriver.exe", chrome_options=options)
driver.get("http://dagympilates2.flexgym.pro/mobile")
wait = WebDriverWait(driver, 10)

idPath = '//input[@id="memberID"]'
driver.find_element_by_xpath(idPath).send_keys("7082")
pwPath = '//input[@id="memberPW"]'
driver.find_element_by_xpath(pwPath).send_keys("7082")
loginPath = '//button[@class="btnLogin"]'
driver.find_element_by_xpath(loginPath).click()

closePath = '/html/body/span/form/div/div[3]/div[2]'
driver.find_element_by_xpath(closePath).click()

bookPath = '//*[@id="paymentList"]/li'
element = wait.until(EC.element_to_be_clickable((By.XPATH, bookPath)))
element.click()

