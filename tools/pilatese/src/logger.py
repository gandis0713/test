def PrintProgress(name, try_count):
  charactor = '...'
  charCount = try_count % 4

  if charCount == 0:
    print(f'                                                                      \r', end='')

  for i in range(charCount):
    charactor = charactor + '.'
  print(f'{name}{charactor}\r', end='')