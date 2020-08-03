from abstract_requester import AbstractRequester
import requests
from time import sleep
from bs4 import BeautifulSoup
from logger import *
import re

class ReservationRequester(AbstractRequester):

  def __init__(self, connection, url = '', data = {}, headers = {}, cookies = {}):
    super().__init__(connection, url, data, headers, cookies)

  def request_get(self):
    pass

  def request_post(self):

    is_reserved = False

    with requests.Session() as session:
      while self._connection.get_max_try_count() > self._try_count and \
            self._connection.get_max_waiting_count() > self._waiting_count and \
            self._connection.get_max_timeout_try_count() > self._timeout_try_count:
        try:
          with session.get(self.url, data = self.data, headers = self.headers, \
                            cookies = self.cookies, timeout=self._connection.get_timeout()) as response:

            # if response is success
            if response.status_code <= 200:
              html_elm = BeautifulSoup(response.text, features='html.parser')
              
              regex = re.compile(r"\'(.*?)\'")
              result_elm_lst = re.findall(regex, str(html_elm))
              result_elm_len = len(result_elm_lst)
              if len(result_elm_lst[result_elm_len - 1]) == 14:
                print("예약 성공! 열심히 운동해요~ 으쌰으쌰!")
                is_reserved = True
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

    return is_reserved
            

