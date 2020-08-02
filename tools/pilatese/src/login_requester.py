from abstract_requester import AbstractRequester
import requests

class LoginRequester(AbstractRequester):

  def __init__(self, url = '', data = {}, headers = {}, cookies = {}):
    super().__init__(url, data, headers, cookies)

  def request_get(self):
    pass

  def request_post(self):
    logined = False

    with requests.Session() as session:
      with session.post(self.url, data = self.data) as response:
        if response.status_code <= 200:
          logined = True 
          self.cookies = response.cookies
          self.headers = session.headers
          print("로그인 성공!")
        else:          
          print("로그인 실패ㅠㅠ 다시 한번 실행해주세요.")
    return logined