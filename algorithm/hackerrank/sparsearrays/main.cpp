#include <bits/stdc++.h>

using namespace std;

inline bool compare(string src1, string src2)
{
    if(src1.length() != src2.length())
    {
        return false;
    }
    else
    {
        const char *c1 = src1.c_str();
        const char *c2 = src2.c_str();
        
        for(int i = 0; i < src1.length(); i++)
        {
            if(c1[i] != c2[i])
                return false;
        }
    }

    return true;
}

// Complete the matchingStrings function below.
vector<int> matchingStrings(vector<string> strings, vector<string> queries) {
    
    vector<int> result;
    for(string strQ : queries)
    {
        int count = 0;
        for(string strS : strings)
        {
            if(compare(strS, strQ))
                count++;
        }        
        result.push_back(count);
    }

    return result;

}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));

    int strings_count;
    cin >> strings_count;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    vector<string> strings(strings_count);

    for (int i = 0; i < strings_count; i++) {
        string strings_item;
        getline(cin, strings_item);

        strings[i] = strings_item;
    }

    int queries_count;
    cin >> queries_count;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    vector<string> queries(queries_count);

    for (int i = 0; i < queries_count; i++) {
        string queries_item;
        getline(cin, queries_item);

        queries[i] = queries_item;
    }

    vector<int> res = matchingStrings(strings, queries);

    for (int i = 0; i < res.size(); i++) {
        fout << res[i];

        if (i != res.size() - 1) {
            fout << "\n";
        }
    }

    fout << "\n";

    fout.close();

    return 0;
}