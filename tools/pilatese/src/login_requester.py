from abstract_requester import AbstractRequester
import requests

class LoginRequester(AbstractRequester):
  def __init__(self, url = '', data = {}, headers = {}, cookies = {}):
    super().__init__(url, data, headers, cookies)

  def request_get(self):

    logined = False

    with requests.Session() as session:
      with session.post(self.url, data = self.data) as response:
        if response.status_code <= 200:
          logined = True 
          self.cookies = response.cookies
          self.headers = session.headers
          # print("�α�??? ?????!")
          # print("?????? ?????? ???????????????~~~")
    return logined

  def request_post(self):
    pass