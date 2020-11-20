from abstract_requester import AbstractRequester
import requests

class LoginRequester(AbstractRequester):
  def __init__(self, url, data = {}, headers = {}, cookies = {}):
    super().__init__(url, data, headers, cookies)

  def request_get(self):
    print("LoginRequester get")

    logined = False

    with requests.Session() as session:
      with session.post(url, data = data) as response:
        if response.status_code <= 200:
          logined = True 
          self.cookies = response.cookies
          self.headers = session.headers
          print("ë¡œê·¸?¸ ?„±ê³?!")
          print("?´? œ ?˜ˆ?•½ ?‹œ?ž‘?•©?‹ˆ?‹¤~~~")
    return logined

  def request_post(self):
    print("LoginRequester port")