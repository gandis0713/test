#include <stdlib.h>
#include <string.h>
#include <netinet/ip.h>
#include <netinet/ip_icmp.h>
#include <arpa/inet.h>
#include <errno.h>
#include <sys/socket.h>
#include <stdio.h>
#include <unistd.h>

int in_chsum(__u_short *p, int n);

int main(int argc, char **argv)
{
    int icmp_socket;
    struct icmp *p, *rp;

    return 0;
}