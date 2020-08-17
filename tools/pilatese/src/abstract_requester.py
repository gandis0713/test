from abc import abstractmethod

class AbstractRequester:

  url = ''
  data = {}
  headers = {}
  cookies = {}

  _timeout_try_count = 0
  _try_count = 0
  _waiting_count = 0

  _connection = None

  def __init__(self, connection, url = '', data = {}, headers = {}, cookies = {}):
    self._connection = connection
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

  def set_connection(self, connection):
    self._connection = connection

  @abstractmethod
  def request_get(self):
    pass
  
  @abstractmethod
  def request_post(self):
    pass

  def PrintReservationStatus(self, name, count):
    charactor = '...'
    charCount = count % 3

    if charCount == 0:
      print(f'                 \r', end='')

    for i in range(charCount):
      charactor = charactor + '.'
    print(f'{name}{charactor}\r', end='')