import requests

# User Info
memberID = "7082"
memberPW = "7082"

# Site Info
BaseURL = 'https://dagympilates2.flexgym.pro/mobile2'

# Reservation Info
# ( Fixed )
payIdx = '2529299'
# ( Variable )
idx = "53924"
SSIdx = '179556'
Date = '2020-08-03'
no = "6"

# login.
logURL = BaseURL + '/login.asp'
logData = {'memberID': memberID, 'memberPW': memberPW}

loginedPageURL = BaseURL + '/login_pay.asp'

reservationPageURL = BaseURL + '/reservation.asp'
reservationPageData = {'codeSS033': payIdx}

ConfirmReservationURL = BaseURL + '/reservationChk.asp'
ConfirmReservationData = {'params': "0|2020-07-09|36139|178531|24815|50274|2529299||||1|1"}

selectReservationURL = BaseURL + '/reservation_appraise.asp'
selectReservationData = {'params': no + '|' + Date + '|' + idx + '|' + SSIdx + '|24815|50274|2529299||||1|1'}

reserveURL = BaseURL + '/reservation_appraise_ok.asp'
reserveData = {'idx': idx, 'payIdx': payIdx, 'SSIdx': SSIdx, 'Date': Date}

# # Login
with requests.Session() as session:
  with session.post(logURL, data = logData) as response:
    cookies = response.cookies
    headers = session.headers

# # Load Logined Page
# with requests.Session() as session:
#   with session.get(loginedPageURL, headers = headers, cookies = cookies) as response:
#     print(response.text)

# Load reservation Page
with requests.Session() as session:
  with session.get(reservationPageURL, data = reservationPageData, headers = headers, cookies = cookies) as response:
    print(response.text)

# # Confirm reservation
# with requests.Session() as session:
#   with session.get(ConfirmReservationURL, data = ConfirmReservationData, headers = headers, cookies = cookies) as response:
#     print(response.text)

# # select reservation
# with requests.Session() as session:
#   with session.get(selectReservationURL, data = selectReservationData, headers =  headers, cookies = cookies) as response:
#     print(response.text)

# # reserve
# with requests.Session() as session:
#   with session.get(reserveURL, data = reserveData, headers =  headers, cookies = cookies) as response:
#     print(response.text)
