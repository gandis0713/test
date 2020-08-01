import requests
import time
import sys
from bs4 import BeautifulSoup

# User Info
memberID = "7082"
memberPW = "7082"

# Site Info
baseURL = 'https://dagympilates2.flexgym.pro/mobile2'
headers = ''
cookies = ''

# Reservation Info
# ( Fixed )
payIdx = '2529299'
# ( Variable )
idx = "53924"
SSIdx = '179556'
date = '2020-08-03'
no = "6"

# Setting
TIME_OUT = 5
SLEEP_TIME = 1

# login.
loginURL = baseURL + '/login.asp'
loginData = {'memberID': memberID, 'memberPW': memberPW}

loginedPageURL = baseURL + '/login_pay.asp'

reservationPageURL = baseURL + '/reservation.asp'
reservationPageData = {'codeSS033': payIdx}

ConfirmReservationURL = baseURL + '/reservationChk.asp'
ConfirmReservationData = {'params': "0|2020-07-09|36139|178531|24815|50274|2529299||||1|1"}

selectReservationURL = baseURL + '/reservation_appraise.asp'
selectReservationData = {'params': no + '|' + date + '|' + idx + '|' + SSIdx + '|24815|50274|2529299||||1|1'}

reserveURL = baseURL + '/reservation_appraise_ok.asp'
reserveData = {'idx': idx, 'payIdx': payIdx, 'SSIdx': SSIdx, 'Date': date}

def LoginRequest(url, data):
  global cookies
  global headers

  logined = False

  with requests.Session() as session:
    with session.post(url, data = data) as response:
      if response.status_code <= 200:
        logined = True 
        cookies = response.cookies
        headers = session.headers
        print("Succeed to login.")
  return logined

def PrintReservationStatus(count):
  charactor = '..'
  charCount = count % 4
  for i in range(charCount):
    charactor = charactor + '.'
  print(f'Reserving{charactor}\r', end='')


def RequestReserve(url, data, headers, cookies):
  with requests.Session() as session:
    trainer = ''
    count = 0
    while trainer == '':
      with session.get(url, data = data, headers =  headers, cookies = cookies) as response:
        html = BeautifulSoup(response.text, features='html.parser')
        trainer = html.find('input', attrs={'name' : 'Trainer'})['value']
        time.sleep(SLEEP_TIME)
        PrintReservationStatus(count)
        count = count + 1
        if count >= TIME_OUT:
          break

    print(f'                   \r', end='')
    if trainer != '':
      print("Succese!!!")
    else:
      print("Failed... TT")

def Request(url, data, headers, cookies):
  with requests.Session() as session:
    with session.get(url, data = data, headers =  headers, cookies = cookies) as response:
      # print(response.status_code)
      print(response.text)
  
if LoginRequest(loginURL, loginData) == True:
  # Request(ConfirmReservationURL, ConfirmReservationData, headers, cookies)
  RequestReserve(reserveURL, reserveData, headers, cookies)
