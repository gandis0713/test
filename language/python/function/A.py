def func():
    print("function A.py")

print("top-level A.py")

if __name__ == "__main__":
    print("A.py 직접 실행")
else:
    print("A.py가 임포트되어 사용됨")

class AClass:
    def __init__(self):
        print("create A Class")