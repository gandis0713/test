from abstract_requester import AbstractRequester
import requests
from time import sleep
from bs4 import BeautifulSoup
from logger import *

class ReservationRequester(AbstractRequester):

  _waiting_count = 0
  _max_waiting_count = 5 # TODO_

  def __init__(self, url = '', data = {}, headers = {}, cookies = {}):
    super().__init__(url, data, headers, cookies)

  def request_get(self):
    pass

  def request_post(self):

    with requests.Session() as session:
      while self._max_try_count > self._try_count and \
            self._max_waiting_count > self._waiting_count and \
            self._max_timeout_try_count > self._timeout_try_count:
        try:
          with session.post(self.url, data = self.data, headers = self.headers, \
                            cookies = self.cookies, timeout=self._timeout) as response:

            # if response is success
            if response.status_code <= 200:
              html_elm = BeautifulSoup(response.text, features='html.parser')

              trainer_item = html_elm.find('input', attrs={'name' : 'Trainer'}) # TODO_            
              if trainer_item != None:
                print("예약완료!") # TODO_
                break
              else:
                PrintProgress('예약시도중', self._waiting_count)
                self._waiting_count += 1              
                sleep(1)
            else:              
              PrintProgress('예약 전송 실패... 다시 시도중', self._try_count)
              self._try_count += 1
              sleep(1)

        except requests.exceptions.Timeout:
          PrintProgress('예약 전송중 타임 아웃 에러 발생... 다시 시도중', self._timeout_try_count)
          self._timeout_try_count += 1
          sleep(1)
            

