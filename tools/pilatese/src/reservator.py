from login_requester import LoginRequester
from reservation_selector import ReservationSelector
from reservation_content_requester import ReservationContentRequester
from reservation_requester import ReservationRequester
from setting import User
from setting import Site
from setting import Pay
from setting import Connection

import datetime

class Reservator():

  _user = None
  _site = None
  _pay = None
  _connection = None

  def __init__(self):
    self._user = User()
    self._site = Site()
    self._pay = Pay()
    self._connection = Connection()

  def reserve(self, time):

    # login
    login_url = self._site.get_login_url()
    login_data = {
      'memberID': self._user.get_id(),
      'memberPW': self._user.get_pw()
    }

    login_req = LoginRequester(self._connection, login_url, login_data)
    is_logined = login_req.request_post()

    if is_logined == True:
      headers = login_req.get_headers()
      cookies = login_req.get_cookies()

      # select reservation item
      pay_idx = self._pay.get_pay_idx()
      date = datetime.date.today().isoformat()

      rev_sel_url = self._site.get_rev_url()
      rev_sel_data = {'codeSS033': pay_idx, 'page': 1, 'Date': date, 'LC': 'C'}

      rev_sel = ReservationSelector(self._connection, rev_sel_url, rev_sel_data, headers, cookies)
      rev_sel.set_time(time)

      is_selected = rev_sel.request_get()
      if is_selected == True:
        # request reservation
        ssidx = rev_sel.get_ssidx()
        date = rev_sel.get_date()
        # idx = rev_sel.get_idx()
        # no = rev_sel.get_no()
        # unknown1 = self._pay.get_unknown1()
        # unknown2 = self._pay.get_unknown2()
        
        # rev_con_req_url = self._site.get_rev_con_req_url()
        # rev_con_req_data = {'params': no + '|' + date + '|' + idx + '|' + ssidx + \
        #                 '|' + unknown1 + '|' + unknown2 + '|' + pay_idx + '||||1|1'}

        # rev_con_req = ReservationContentRequester(self._connection, rev_con_req_url, rev_con_req_data, headers, cookies)
        # is_content = rev_con_req.request_get()
        is_content = True
        if is_content == True:

          rev_req_url = self._site.get_rev_req_url()
          rev_req_data = {'flag': 'N', 'idx': '', 'payIdx': pay_idx, 'SSIdx': ssidx, 'ReserveDate': date}

          rev_req = ReservationRequester(self._connection, rev_req_url, rev_req_data, headers, cookies)
          is_reserved = rev_req.request_post()

