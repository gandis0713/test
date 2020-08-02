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
    TIMEOUT = 5
    trainer = ''
    try_count = 0
    with requests.Session() as session:
      while trainer == '':
        with session.get(self.url, data = self.data, headers = self.headers, cookies = self.cookies) as response:
          html_elm = BeautifulSoup(response.text, features='html.parser')
          # print(html_elm)
          trainerItem = html_elm.find('input', attrs={'name' : 'Trainer'}) # TODO_
          if trainerItem == None:
            print("trainer none")
            try_count += 1
            if try_count >= TIMEOUT:
              break
            
            sleep(1)
          else:
            break
            

