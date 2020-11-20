from abc import *

class AbstractRequester:

  _url = ''
  _data = {}
  _headers = {}
  _cookies = {}

  def __init__(self, url, data = {}, headers = {}, cookies = {}):
      self._url = url
      self._data = data
      self._headers = headers
      self._cookies = cookies  

  def set_url(self, url):
    self._url = url

  def get_url(self):
    return self._url    

  def set_data(self, data):
    self._data = data

  def get_data(self):
    return self._data

  def set_headers(self, headers):
    self._headers = headers

  def get_headers(self):
    return self._headers

  def set_cookies(self, cookies):
    self._cookies = cookies
    
  def get_cookies(self):
    return self._cookies

  @abstractmethod
  def request_get(self):
    pass
  
  @abstractmethod
  def request_post(self):
    pass