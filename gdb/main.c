int i = 0;
char* pcVideoMemory = (char*) 0xB8000;

void _start()
{
	for (int i = 0; i < 10; i++)
	{
		pcVideoMemory[i] = 0;
		break;
	}
}
