class CPeople 
{
public:
    CPeople();
    static CPeople& GetInstance();
    void AddAge(int nAge);
    int GetAge();

private:
    int m_nAge;
};