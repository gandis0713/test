import json
import os


# user
class User():

  _user_id = ''
  _user_pw = ''

  def __init__(self):
    self.load_user()

  def load_user(self):
    cur_dir = os.path.dirname(os.path.abspath(__file__))
    with open(cur_dir + '/../setting/user.json') as user_file:
      user_json = json.load(user_file)
      self._user_id = user_json["memberID"]
      self._user_pw = user_json["memberPW"]

  def get_id(self):
    return self._user_id

  def get_pw(self):
    return self._user_pw



# site
class Site():

  _base_url = ''
  _login_url = ''
  _rev_url = ''
  _rev_req_url = ''

  def __init__(self):
    self.load_site()

  def load_site(self):
    cur_dir = os.path.dirname(os.path.abspath(__file__))
    with open(cur_dir + '/../setting/site.json') as site_file:
      site_json = json.load(site_file)
      self._base_url = site_json["baseUrl"]
      self._login_url = site_json["loginUrl"]
      self._rev_url = site_json["revUrl"]
      self._rev_req_url = site_json["revReqUrl"]

  def get_base_url(self):
    return self._base_url

  def get_login_url(self):
    return self._base_url + self._login_url

  def get_rev_url(self):
    return self._base_url + self._rev_url

  def get_rev_req_url(self):
    return self._base_url + self._rev_req_url

# pay
class Pay():

  _pay_idx = ''

  def __init__(self):
    self.load_pay()

  def load_pay(self):
    cur_dir = os.path.dirname(os.path.abspath(__file__))
    with open(cur_dir + '/../setting/pay.json') as pay_file:
      pay_json = json.load(pay_file)
      self._pay_idx = pay_json["payIdx"]

  def get_pay_idx(self):
    return self._pay_idx