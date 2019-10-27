#include <iostream>

using namespace std;

vector<string> split_string(string);

// Complete the solve function below.
long solve(vector<int> arr) {

    long size = arr.size();
    long index = 0;
    long mulValue;
    long count = 0;
    long max = 0;

    for(int i = 0; i <size; i++)
    {
        if(arr[i] > max)
            max = arr[i];
    }
    while(index < size)
    {
        mulValue = max / arr[index];
        for(int i = index + 1; i <size; i++)
        {
            if(arr[i] <= mulValue)
                count++;
        }
        index++;
    }
    return count;
}

int main()
{


    return 0;
}
