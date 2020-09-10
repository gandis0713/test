#!/usr/bin/python

import sys
import binascii
import moviepy.editor as moviepy
import glob, os


os.chdir(str(sys.argv[1]))
for file in glob.glob("*.avi"):
  extension = os.path.splitext(file)[1]
  fileName = os.path.splitext(file)[0]

  reader = open(fileName +'.avi', 'rb')
  data = reader.read()
  byteData = bytearray(data)
  byteData.reverse()

  writer = open('converted/' + fileName + '.avi','wb')
  writer.write(byteData)
  writer.close()

  clip = moviepy.VideoFileClip('converted/' + fileName + '.avi')
  clip.write_videofile('converted/' + fileName + '.mp4')
  print(fileName)

