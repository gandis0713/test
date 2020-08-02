from abstract_requester import AbstractRequester
import requests
from time import sleep
from logger import *

class LoginRequester(AbstractRequester):

  def __init__(self, url = '', data = {}, headers = {}, cookies = {}):
    super().__init__(url, data, headers, cookies)

  def request_get(self):
    pass

  def request_post(self):

    print("로그인 중...")

    logined = False

    with requests.Session() as session:
      while self._max_try_count > self._try_count and \
            self._max_timeout_try_count > self._timeout_try_count:
        try:
          with session.post(self.url, data = self.data, timeout=self._timeout) as response: 
                       
            # if response is success
            if response.status_code <= 200:
              logined = True 
              self.cookies = response.cookies
              self.headers = session.headers
              print("로그인 성공!")
              break
            else:              
              PrintProgress('로그인 페이지 접속 실패... 다시 시도중', self._try_count)
              self._try_count += 1
              sleep(1)
        except requests.exceptions.Timeout:
          PrintProgress("로그인중 타임 아웃 에러 발생... 다시 시도중", self._timeout_try_count)
          self._timeout_try_count += 1
          sleep(1)

    if logined == False:
      print("\n로그인 실패ㅠㅠ 다시 실행해주세요.")

    return logined