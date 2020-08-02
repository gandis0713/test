from abstract_requester import AbstractRequester

class LoginRequester(AbstractRequester):
  def __init__(self, url, data = {}, headers = {}, cookies = {}):
    super().__init__(url, data, headers, cookies)

  def request_get(self):
    print("LoginRequester get")

  def request_post(self):
    print("LoginRequester port")