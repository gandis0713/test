# -*- encoding: utf-8 -*-

import requests, json
from bs4 import BeautifulSoup as bs

# login.
logURL = 'https://dagympilates2.flexgym.pro/mobile2/login.asp'
logData = {'memberID': '7082', 'memberPW': '7082'}

loginPayURL = 'https://dagympilates2.flexgym.pro/mobile2/login_pay.asp'

reservationURL = 'https://dagympilates2.flexgym.pro/mobile2/reservation.asp'
reservationData = {'codeSS033': '2529299'}
reservationListData = {'codeSS033': '2529299', 'page': 1, 'Date': '2020-08-03', 'LC': 'C'}

reserveCheckURL = 'https://dagympilates2.flexgym.pro/mobile2/reservationChk.asp'
reserveCheckData = {'params': "0|2020-07-09|36139|178531|24815|50274|2529299||||1|1"}

reserveURL = 'https://dagympilates2.flexgym.pro/mobile2/reservation_appraise.asp'
reserveData = {'params': "6|2020-08-03|53924|179556|24815|50274|2529299||||1|1"}

reserveConfirmURL = 'https://dagympilates2.flexgym.pro/mobile2/reservation_appraise_ok.asp'
reserveConfirmData = {'idx': "53924", 'payIdx': '2529299', 'SSIdx': '179556', 'Date': '2020-08-03'}

with requests.Session() as session:

  with session.post(logURL, data=logData) as response:
    cookies = response.cookies
    headers = session.headers
  # with session.post(loginPayURL, data=loginPayData, headers = headers, cookies=cookies) as response:
    # print(session.cookies.get_dict())
    # print(response.text)
  # with session.post(reservationURL, data=reservationData, headers = headers, cookies=cookies) as response:
  #   print(session.cookies.get_dict())
  #   print(response.text)
  # with session.post(reservationURL, data=reservationListData, headers = headers, cookies=cookies) as response:
    # print(session.cookies.get_dict())
    # print(response.text)

# with requests.Session() as session:
#   with session.get(reserveCheckURL, data=reserveCheckData, headers= headers, cookies = cookies) as response:
#     print(response.text)

with requests.Session() as session:
  with session.get(reserveURL, data=reserveData, headers= headers, cookies = cookies) as response:
    print(response.text)

with requests.Session() as session:
  with session.get(reserveConfirmURL, data=reserveConfirmData, headers= headers, cookies = cookies) as response:
    print(response.status_code)
    print(response.reason)
    # print(response.text)
    # print(response.text)
