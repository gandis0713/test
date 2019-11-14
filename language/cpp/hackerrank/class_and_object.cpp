

class Student
{
public:
    void input()
    {
        int nScore;
        for(int i = 0; i < 5; i++)
        {
            cin >> nScore;
            nTotalScore += nScore;
        }
    }

    int calculateTotalScore()
    {
        return nTotalScore;
    }

private:
    int nTotalScore;

};
// Write your Student class here