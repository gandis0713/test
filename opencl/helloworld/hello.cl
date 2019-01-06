__kernel void hello_opencl(__global char* str)
{
    str[0] = 'h';
    str[1] = 'e';
    str[2] = 'l';
    str[3] = 'l';
    str[4] = 'o';
    str[5] = ' ';
    str[6] = 'o';
    str[7] = 'p';
    str[8] = 'e';
    str[9] = 'n';
    str[10] = 'c';
    str[11] = 'l';
    str[12] = '\0';
}