from abstract_requester import AbstractRequester
import requests
import time
from bs4 import BeautifulSoup

class ReservationRequester(AbstractRequester):

  def __init__(self, url = '', data = {}, headers = {}, cookies = {}):
    super().__init__(url, data, headers, cookies)

  def request_get(self):
    pass

  def request_post(self):
    TIMEOUT = 5
    trainer = ''
    tryCount = 0
    with requests.Session() as session:
      while trainer == '':
        with session.get(self.url, data = self.data, headers = self.headers, cookies = self.cookies) as response:
          html = BeautifulSoup(response.text, features='html.parser')
          trainerItem = html.find('input', attrs={'name' : 'Trainer'})
          if trainerItem == None:
            print("trainer none")
          # trainer = html.findAll('input', attrs={'name' : 'Trainer'})[0]['value']
          # print(html)
          tryCount += 1
          if tryCount >= TIMEOUT:
            break
          
          time.sleep(1)
