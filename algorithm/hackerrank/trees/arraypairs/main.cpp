#include <iostream>
#include <vector>
#include <algorithm>
#include <functional>

using namespace std;

vector<string> split_string(string);

// Complete the solve function below.
long solve(vector<int> arr) {

    long size = arr.size();
    long index = 0;
    long mulValue;
    long count = 0;
    long bigcount = 0;
    long max = 0;

    vector<int> vecSorted = arr;
    sort(vecSorted.begin(), vecSorted.end(), greater<int>());

    for(int i = 0; i <size; i++)
    {
        if(arr[i] > max)
            max = arr[i];
    }

    while(index < size)
    {
        if(max < arr[index])
            continue;

        bigcount = 0;
        mulValue = max / arr[index];
        cout << "mulValue : " << mulValue << endl;
        for(int i = 0; i <size; i++)
        {
            if(vecSorted[i] <= mulValue)
            {
                if(arr[index] == vecSorted[i])
                {
                    cout << "removed 1" <<  endl;
                    vecSorted.erase(vecSorted.begin() + i);
                    break;
                }
            }
            else
            {
                bigcount++;
                if(arr[index] == vecSorted[i])
                {
                    cout << "removed 2" <<  endl;
                    vecSorted.erase(vecSorted.begin() + i);
                    break;
                }
            }
        }

        count += size - index - bigcount - 1;
        cout << "index : " << index << endl;
        cout << "bigcout : " << bigcount << endl;
        cout << "count : " << count << endl;
        cout << endl;
        index++;
    }
    return count;
}

int main()
{
    vector<int> vec;
    vec.push_back(1);
    vec.push_back(1);
    vec.push_back(2);
    vec.push_back(4);
    vec.push_back(2);

    cout << solve(vec) << endl;

    return 0;
}
