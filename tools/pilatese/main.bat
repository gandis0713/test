@ECHO OFF

IF "%1" == "" (
  GOTO ABORT
)

SET time="%1"

:RUN
  CALL python3 ./src/main.py %time%
  GOTO END

:ABORT
  ECHO 예약할 시간을 입력해주세요~!
  ECHO 만약, 저녁 8시 수업을 예약하고 싶으면 아래와 같이 입력해주세요.
  ECHO main.bat 20

:END
  EXIT /b 0