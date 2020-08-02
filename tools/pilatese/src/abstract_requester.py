from abc import abstractmethod

class AbstractRequester:

  url = ''
  data = {}
  headers = {}
  cookies = {}

  _timeout = 3
  _max_try_count = 5
  _try_count = 0

  def __init__(self, url = '', data = {}, headers = {}, cookies = {}):
      self.url = url
      self.data = data
      self.headers = headers
      self.cookies = cookies  

  def set_url(self, url):
    self.url = url

  def get_url(self):
    return self.url    

  def set_data(self, data):
    self.data = data

  def get_data(self):
    return self.data

  def set_headers(self, headers):
    self.headers = headers

  def get_headers(self):
    return self.headers

  def set_cookies(self, cookies):
    self.cookies = cookies
    
  def get_cookies(self):
    return self.cookies

  @abstractmethod
  def request_get(self):
    pass
  
  @abstractmethod
  def request_post(self):
    pass