from abstract_requester import AbstractRequester
import requests
from time import sleep
from bs4 import BeautifulSoup

class ReservationRequester(AbstractRequester):

  def __init__(self, url = '', data = {}, headers = {}, cookies = {}):
    super().__init__(url, data, headers, cookies)

  def request_get(self):
    pass

  def request_post(self):

    with requests.Session() as session:

      while self._max_try_count > self._try_count:

        try:

          with session.get(self.url, data = self.data, headers = self.headers, cookies = self.cookies, timeout=self._timeout) as response:
            
            html_elm = BeautifulSoup(response.text, features='html.parser')
            # print(html_elm)
            trainer_item = html_elm.find('input', attrs={'name' : 'Trainer'}) # TODO_
            
            if trainer_item == None:
              print("trainer none")
              self._try_count += 1
              if self._try_count >= self._max_try_count:
                break
              
              sleep(1)
              
            else:
              # TODO_
              break
            
        except requests.exceptions.Timeout:
          self._try_count += 1
          print("예약도중 타임 아웃 에러 발생... 다시 시도합니다. 시도 횟수 : " + self._try_count)
          sleep(1)
            

