from abstract_requester import AbstractRequester
import requests
import re
from time import sleep
from bs4 import BeautifulSoup
from logger import *

class ReservationSelector(AbstractRequester):

  _idx = ''
  _sSIdx = ''
  _date = ''
  _no = ''
  _time = ''

  def __init__(self, connection, url = '', data = {}, headers = {}, cookies = {}):
    super().__init__(connection, url, data, headers, cookies)
    self._max_waiting_count = 7200

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

    print("예약페이지 접속 중...")

    is_success = False
    is_duplicated = False

    with requests.Session() as session:
      while self._connection.get_max_try_count() > self._try_count and \
            self._connection.get_max_waiting_count() > self._waiting_count and \
            self._connection.get_max_timeout_try_count() > self._timeout_try_count:
        try:
          with session.get(self.url, data = self.data, headers = self.headers, \
                            cookies = self.cookies, timeout=self._connection.get_timeout()) as response:

            # if response is success
            if response.status_code <= 200:
              # select time
              html_elm = BeautifulSoup(response.text, features='html.parser')
              rev_elm_lst = html_elm.find('ul', attrs={'id' : 'reserveList'})
              time_elm_lst = rev_elm_lst.findAll('div', attrs={'class' : 'timelabel01 timeBG' + self._time})
              time_elm_lst_length = len(time_elm_lst)

              if time_elm_lst_length == 0:
                PrintProgress('예약목록 대기중', self._waiting_count)
                self._waiting_count += 1
                sleep(1)
                continue

              elif time_elm_lst_length == 1: # if there is one item that is for reservation.
                time_elm = re.findall('\d+', time_elm_lst[0].text)

                if time_elm[0] == self._time:
                  # get selected reservation info
                  btn_elm = time_elm_lst[0].parent.findAll( \
                    'button', attrs={'onclick' : lambda L: L and L.startswith('Reserve')} \
                  )
                  
                  if len(btn_elm) == 1: # if there is one item that is for reservation.
                    regex = re.compile(r"\'(.*?)\'")
                    btn_elm_val = re.findall(regex, btn_elm[0]["onclick"])
                    self._idx = btn_elm_val[0]
                    self._sSIdx = btn_elm_val[1]
                    self._no = btn_elm_val[2]
                    self._date = btn_elm_val[3]

                    # print reserve info
                    print("")
                    print("")
                    print("[예약 정보]")
                    regex = re.compile(r"div>(.*?)</div")    
                    rev_cls_name = html_elm.find('dd', attrs={'id' : 'cName' + self._no})
                    cls_name = re.findall(regex, str(rev_cls_name))
                    print("수업 : " + cls_name[0])        
                    rev_mem_name = html_elm.find('dd', attrs={'id' : 'mName' + self._no})
                    mem_name = re.findall(regex, str(rev_mem_name))
                    print("강사 : " + mem_name[0])         
                    rev_cls_time = html_elm.find('dd', attrs={'id' : 'rTime' + self._no})
                    cls_time = re.findall(regex, str(rev_cls_time))
                    print("시간 : " + cls_time[0])
                    print("")
                    print("")

                    is_success = True
                    break

              else:
                print(self._time + "시에 예약할 수 있는 수업이 여러개 있는거 같아요.")
                is_duplicated = True
                break
            else:
              PrintProgress('예약목록 불러오기 실패... 다시 시도중', self._try_count)
              self._try_count += 1
              sleep(1)
              continue
            
        except requests.exceptions.Timeout:
          PrintProgress('예약목록 불러오던중 타임 아웃 에러 발생... 다시 시도중', self._timeout_try_count)
          self._timeout_try_count += 1
          sleep(1)


    if is_success == False and is_duplicated == False:
      print("\n예약목록 불러오기 실패ㅠㅠ 다시 한번 실행해주세요.")

    return is_success

  def request_post(self):
    pass