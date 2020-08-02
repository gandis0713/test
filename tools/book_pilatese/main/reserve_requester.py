from abstract_requester import AbstractRequester

class ReserveRequester(AbstractRequester):
  def __init__(self, url, data = {}, headers = {}, cookies = {}):
    super().__init__(url, data, headers, cookies)

  def request_get(self):
    print("ReserveRequester get")

  def request_post(self):
    print("ReserveRequester port")
