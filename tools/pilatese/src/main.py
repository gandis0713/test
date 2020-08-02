import sys

from reservator import Reservator

if __name__ == "__main__":

  time = sys.argv[1]

  reservator = Reservator()
  reservator.reserve(time)