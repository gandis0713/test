#include <iostream>
#include <unistd.h>
#include <pthread.h>

#define MAX_THREAD_COUNT 2

int nCount;


pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;


using namespace std;

void* task(void *data)
{
    int nThreadCount = *((int *)data);
    pthread_mutex_lock(&mutex);
    for(int i = 0; i < 10; i++)
    {
        cout << "Count " << nThreadCount << " : " << nCount << endl;
        nCount++;

        if(i == 10)
        {
            pthread_mutex_unlock(&mutex);
            return NULL;
        }
    }
    pthread_mutex_unlock(&mutex);
}

int main()
{
    pthread_t pThread[MAX_THREAD_COUNT];

    int nThreadID[MAX_THREAD_COUNT];

    nCount = 0;

    for(int i = 0; i < MAX_THREAD_COUNT; i++)
    {
        nThreadID[i] = pthread_create(&pThread[i], NULL, task, &i);
        if(nThreadID[i] < 0)
        {
            cout << "Failed to create Thread : " << i << endl;
            continue;
        }
    }

    for(int i = 0; i < MAX_THREAD_COUNT; i++)
    {
        if(nThreadID[i] >= 0)
        {
            int nStatus;
            pthread_join(pThread[i], (void**)nStatus);
            cout << "remove Thread, ID : " << nThreadID[i] << ", Status : " << nStatus << endl;
        }
    }

    return 0;
}

