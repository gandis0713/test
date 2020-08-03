from abstract_requester import AbstractRequester
import requests
from time import sleep
from logger import *

class ReservationContentRequester(AbstractRequester):

  def __init__(self, connection, url = '', data = {}, headers = {}, cookies = {}):
    super().__init__(connection, url, data, headers, cookies)

  def request_get(self):

    is_content = False

    with requests.Session() as session:
      
      while self._connection.get_max_try_count() > self._try_count and \
            self._connection.get_max_waiting_count() > self._waiting_count and \
            self._connection.get_max_timeout_try_count() > self._timeout_try_count:
        try:
          with session.get(self.url, data = self.data, headers = self.headers, \
                            cookies = self.cookies, timeout=self._connection.get_timeout()) as response:

            # if response is success
            if response.status_code <= 200:
              # if need, implement
              is_content = True
              break
            else:              
              PrintProgress('예약내용 불러오기 실패... 다시 시도중', self._try_count)
              self._try_count += 1
              sleep(1)

        except requests.exceptions.Timeout:
          PrintProgress('예약내용 불러오던 중 타임 아웃 에러 발생... 다시 시도중', self._timeout_try_count)
          self._timeout_try_count += 1
          sleep(1)
    
    return is_content

  def request_post(self):
    pass
            

