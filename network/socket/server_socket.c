#include <sys/socket.h> 
#include <sys/stat.h> 
#include <arpa/inet.h> 
#include <stdio.h> 
#include <string.h> 
 
#define MAX_BUFFER_SIZE 2 

int main(int argc, char **argv) 
{ 
    int server_sockfd, client_sockfd; 
    int client_len; 

    struct sockaddr_in clientaddr, serveraddr; 
 
    client_len = sizeof(clientaddr); 
 
    server_sockfd = socket(AF_INET, SOCK_STREAM, 0);
    printf("server_sockfd : %d \n", server_sockfd);
    if (server_sockfd < 0) 
    { 
        perror("Failed to create socket. error message : "); 
        return 0; 
    } 

    memset(&serveraddr, 0x00, sizeof(serveraddr)); 
    serveraddr.sin_family = AF_INET; 
    serveraddr.sin_addr.s_addr = htonl(INADDR_ANY); 
    serveraddr.sin_port = htons(atoi(argv[1])); 

    int nResultBind = bind(server_sockfd, (struct sockaddr *)&serveraddr, sizeof(serveraddr));
    if (nResultBind < 0) 
    { 
        perror("Failed to bind. error message : "); 
        return 0; 
    } 

    int nResultListen = listen(server_sockfd, 5);
    if (nResultListen < 0) 
    { 
        perror("Failed to create listen. error message : "); 
        return 0; 
    }
 
    int nResultRead = 0;
    int nResultWrite = 0;
    char cReciveBuffer[MAX_BUFFER_SIZE]; 
    char cSendBuffer[MAX_BUFFER_SIZE]; 
    
    while(1) 
    { 
        printf("waiting for accept... \n");
        client_sockfd = accept(server_sockfd, (struct sockaddr *)&clientaddr, &client_len); 
        printf("client_sockfd : %d \n", client_sockfd);
        printf("client_len : %d \n", client_len);
        printf("client_sockfd : %d \n", client_sockfd);
        printf("client_sockfd : %d \n", client_sockfd);
        while(1)
        {
            memset(&cReciveBuffer, 0x00, MAX_BUFFER_SIZE); 
            nResultRead = read(client_sockfd, cReciveBuffer, MAX_BUFFER_SIZE);

            for(int i = 0; i < nResultRead - 1; i++)
            {
                //printf("cReciveBuffer %d : %s, \n", i, cReciveBuffer);
            }
            
            if (nResultRead <= 0) 
            { 
                close(client_sockfd); 
                break;
            }
            
            cSendBuffer[0] = 'a';
            cSendBuffer[1] = 0x00;

            nResultWrite = write(client_sockfd, cSendBuffer, MAX_BUFFER_SIZE);
            if (nResultWrite <=0) 
            { 
                perror("write error : "); 
                close(client_sockfd); 
                break;
            } 
        }
        close(client_sockfd); 
    } 
} 