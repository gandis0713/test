#include <iostream>
using namespace std;

int main() {

    int testcasecount;
    cin >> testcasecount;

    int index = 0;
    while(index < testcasecount)
    {
        int number;
        cin >> number;
        int current = 1;
        int count = 0;
        while((current * 3)<= number)
        {
            current *= 3;
            count++;
            cout << current << endl;
        }

        count += (number - current);

        cout << count << endl;
        index++;
    }
    //code
    return 0;
}
