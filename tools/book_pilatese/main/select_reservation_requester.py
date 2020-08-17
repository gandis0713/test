from abstract_requester import AbstractRequester

class SelectReservationRequester(AbstractRequester):
  def __init__(self, url, data = {}, headers = {}, cookies = {}):
    super().__init__(url, data, headers, cookies)

  def request_get(self):
    print("SelectReservationRequester get")

  def request_post(self):
    print("SelectReservationRequester port")