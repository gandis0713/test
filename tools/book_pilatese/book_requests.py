import requests
import time
import sys
import datetime
import re
from bs4 import BeautifulSoup

# User Info
memberID = "7082"
memberPW = "7082"

# Site Info
baseURL = 'https://dagympilates2.flexgym.pro/mobile2'
headers = {}
cookies = {}

# Reservation Info
# ( Fixed )
payIdx = '2529299'
# ( Variable )
page = 1
idx = "63847"
SSIdx = '181896'
date = '2020-08-03'
no = "7"
LC = 'C'

# Setting
TIME_OUT = 5
SLEEP_TIME = 1

# login.
loginURL = baseURL + '/login.asp'
loginData = {'memberID': memberID, 'memberPW': memberPW}

loginedPageURL = baseURL + '/login_pay.asp'

reservationPageURL = baseURL + '/reservation.asp'
reservationPageData = {'codeSS033': payIdx}

confirmReservationURL = baseURL + '/reservationChk.asp'
confirmReservationData = {'params': "0|2020-07-09|36139|178531|24815|50274|2529299||||1|1"}

selectReservationURL = baseURL + '/reservation_appraise.asp'
selectReservationData = {'params': no + '|' + date + '|' + idx + '|' + SSIdx + '|24815|50274|2529299||||1|1'}

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
        print("로그인 성공!")
        print("이제 예약 시작합니다~~~")
  return logined

# function
def GetToday():
  return '2020-07-01'
  # return datetime.date.today().isoformat()

def PrintReservationStatus(count):
  charactor = '..'
  charCount = count % 4
  for i in range(charCount):
    charactor = charactor + '.'
  print(f'예약중{charactor}\r', end='')


def RequestReserve(url, data, headers, cookies):
  with requests.Session() as session:
    trainer = ''
    count = 0
    while trainer == '':
      with session.get(url, data = data, headers =  headers, cookies = cookies) as response:
        html = BeautifulSoup(response.text, features='html.parser')
        trainer = html.findAll('input', attrs={'name' : 'Trainer'})[0]['value']
        time.sleep(SLEEP_TIME)
        PrintReservationStatus(count)
        count = count + 1
        if count >= TIME_OUT:
          break

    # print(f'                   \r', end='')
    
    PrintReservationStatus(count)
    if trainer != '':
      print("축하합니다! 예약 성공했어요. 짝짝짝!! ")
    else:
      print("예약 실패했어요ㅠㅠ")

def Request(url, data, headers, cookies):
  with requests.Session() as session:
    with session.get(url, data = data, headers =  headers, cookies = cookies) as response:
      # print(response.status_code)
      print(response.text)

def RequestReservation(url, data, headers, cookies):
  with requests.Session() as session:
    with session.get(url, data = data, headers =  headers, cookies = cookies) as response:
      ## if response is success
      if response.status_code >= 200:

        html = BeautifulSoup(response.text, features='html.parser')
        # reserveList = html.findAll('div', attrs={'class' : 'timelabel01 timeBG20'})
        reserveList = html.find('ul', attrs={'id' : 'reserveList'})
        # print(reserveList.text)
        reserves = reserveList.findAll('div', attrs={'class' : 'timelabel01 timeBG20'})
        if len(reserves) > 0:
          for reserveItem in reserves:
            timeLabel = re.findall('\d+', reserveItem.text)
            if timeLabel[0] == '20':
              buttonItems = reserveItem.parent.findAll('button', attrs={'onclick' : lambda L: L and L.startswith('Reserve')})
              if len(buttonItems) > 0:    
                regex = re.compile(r"\'(.*?)\'")
                buttonData = re.findall(regex, buttonItems[0]["onclick"])
                print(buttonData)
                reserveURL = baseURL + '/reservation_appraise_ok.asp'
                reserveData = {'idx': buttonData[0], 'payIdx': payIdx, 'SSIdx': buttonData[1], 'Date': buttonData[3]}
                RequestReserve(reserveURL, reserveData, headers, cookies)

        else:
          print("오늘은 예약할수 있는 것이 없데요ㅠㅠ 오늘은 쉬어요")
      else:
        print("예약 사이트 접속이 안되는거 같아요!")

# logic
if LoginRequest(loginURL, loginData) == True:
  reservationSearchData = {'codeSS033': payIdx, 'page': page, 'Date': GetToday(), 'LC': 'R'}
  RequestReservation(reservationPageURL, reservationSearchData, headers, cookies)
  # Request(confirmReservationURL, confirmReservationData, headers, cookies)
  # Request(selectReservationURL, selectReservationData, headers, cookies)
  # RequestReserve(reserveURL, reserveData, headers, cookies)

print(len(sys.argv))
print(str(sys.argv))
