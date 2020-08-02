from abstract_requester import AbstractRequester
import requests
import re
from time import sleep
from bs4 import BeautifulSoup

class ReservationSelector(AbstractRequester):

  _idx = ''
  _sSIdx = ''
  _date = ''
  _no = ''

  _time = ''

  def __init__(self, url = '', data = {}, headers = {}, cookies = {}):
    super().__init__(url, data, headers, cookies)

  def get_idx(self):
    return self._idx

  def get_ssidx(self):
    return self._sSIdx

  def get_date(self):
    return self._date

  def get_no(self):
    return self._no

  def set_time(self, time):
    self._time = time

  def request_get(self):

    is_success = False
    TIME_OUT = 5 # TODO_
    try_count = 0
    
    with requests.Session() as session:
      while TIME_OUT > try_count:
        with session.get(self.url, data = self.data, headers = self.headers, cookies = self.cookies) as response:

          ## if response is success
          if response.status_code >= 200:
            # select time
            html_elm = BeautifulSoup(response.text, features='html.parser')
            rev_elm_lst = html_elm.find('ul', attrs={'id' : 'reserveList'})
            time_elm_lst = rev_elm_lst.findAll('div', attrs={'class' : 'timelabel01 timeBG' + self._time}) # TODO_
            time_elm_lst_length = len(time_elm_lst)
            print(time_elm_lst_length)

            if time_elm_lst_length == 0:
              self._PrintReservationStatus(try_count)
              sleep(1)
              try_count += 1
              continue

            elif time_elm_lst_length == 2: # TODO_
              time_elm = re.findall('\d+', time_elm_lst[0].text)

              if time_elm[0] == self._time:
                # get selected reservation info
                btn_elm = time_elm_lst[0].parent.findAll('button', attrs={'onclick' : lambda L: L and L.startswith('Reserve')}) # TODO_
                
                if len(btn_elm) == 1: 
                  regex = re.compile(r"\'(.*?)\'")
                  btn_elm_val = re.findall(regex, btn_elm[0]["onclick"])
                  print(btn_elm_val) # TODO_
                  self._idx = btn_elm_val[0]
                  self._sSIdx = btn_elm_val[1]
                  self._no = btn_elm_val[2]
                  self._date = btn_elm_val[3]
                  is_success = True
                  break

            else:
              print(self._time + "시에 예약할 수 있는 수업이 여러개 있어요.")
              break
          else:
            print("예약 사이트에 접속이 안되고 있어요ㅠㅠ")
    return is_success

  def request_post(self):
    pass

  def _PrintReservationStatus(self, count):
    charactor = '...'
    charCount = count % 3

    if charCount == 0:
      print(f'                 \r', end='')

    for i in range(charCount):
      charactor = charactor + '.'
    print(f'예약 대기중{charactor}\r', end='')