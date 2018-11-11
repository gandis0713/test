#include <sys/stat.h> 
#include <arpa/inet.h> 
#include <stdio.h> 
#include <string.h> 
#include <stdlib.h> 
#include <unistd.h> 
 
#define MAX_BUFFER_SIZE 2
 
int main(int argc, char **argv) 
{ 
    struct sockaddr_in serveraddr; 
    int server_sockfd; 
    int client_len; 
    char cReciveBuffer[MAX_BUFFER_SIZE];
    char cSendBuffer[MAX_BUFFER_SIZE];
 
 
    if ((server_sockfd = socket(AF_INET, SOCK_STREAM, 0)) < 0) 
    { 
        perror("error :"); 
        exit(0); 
    } 
 
    server_sockfd = socket(AF_INET, SOCK_STREAM, 0); 
    serveraddr.sin_family = AF_INET; 
    serveraddr.sin_addr.s_addr = inet_addr(argv[1]); 
    serveraddr.sin_port = htons(atoi(argv[2])); 
 
    client_len = sizeof(serveraddr); 
 
    printf("server_sockfd : %d \n", server_sockfd);
    int state = connect(server_sockfd, (struct sockaddr *)&serveraddr, client_len);
    printf("state : %d \n", state);
    if (state < 0) 
    { 
        perror("connect error :"); 
        exit(0); 
    } 

    int nResultRead = 0;
    int nResultWrite = 0;

    while(1)
    {
        cSendBuffer[0] = 'b';
        cSendBuffer[1] = 0x00;

        nResultWrite = write(server_sockfd, cSendBuffer, MAX_BUFFER_SIZE);
        if (nResultWrite <= 0) 
        { 
            perror("write error : "); 
            break;
        } 

        memset(cReciveBuffer, 0x00, MAX_BUFFER_SIZE); 

        nResultRead = read(server_sockfd, cReciveBuffer, MAX_BUFFER_SIZE);
        if (nResultRead <= 0) 
        { 
           perror("read error : "); 
           break;
        }
        
        for(int i = 0; i < nResultRead - 1; i++)
        {
            //printf("cReciveBuffer %d : %s, \n", i, cReciveBuffer);
        }
         
    } 
    close(server_sockfd); 
    return 0;
} 