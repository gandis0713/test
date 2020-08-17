from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By

options = webdriver.ChromeOptions()
options.add_argument("--start-maximized")
options.add_argument("--incognito")
# options.headless = True # Option that don't open chrome browser.
driver = webdriver.Chrome("./chromedriver.exe", chrome_options=options)
driver.get("http://dagympilates2.flexgym.pro/mobile") # open chrome browser.
wait = WebDriverWait(driver, 10)

idPath = '//input[@id="memberID"]'
driver.find_element_by_xpath(idPath).send_keys("7082") # write ID
pwPath = '//input[@id="memberPW"]'
driver.find_element_by_xpath(pwPath).send_keys("7082") # write PW
loginPath = '//button[@class="btnLogin"]'
driver.find_element_by_xpath(loginPath).click() # Login

popCheckPath = '/html/body/span/form/div/div[3]/div[1]'
driver.find_element_by_xpath(popCheckPath).click() # check close pop up
closePath = '/html/body/span/form/div/div[3]/div[2]'
driver.find_element_by_xpath(closePath).click() # click close pop up

bookPath = '//*[@id="paymentList"]/li'
element = wait.until(EC.element_to_be_clickable((By.XPATH, bookPath))) # Click books list
element.click()

