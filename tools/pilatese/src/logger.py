def PrintProgress(name, try_count):
  charactor = '...'
  charCount = try_count % 4

  for i in range(charCount):
    charactor = charactor + '.'
  print(f'                                                                             \r', end='')
  print(f'{name}{charactor}\r', end='')