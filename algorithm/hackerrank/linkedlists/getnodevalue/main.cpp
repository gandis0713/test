

// Complete the getNode function below.

/*
 * For your reference:
 *
 * SinglyLinkedListNode {
 *     int data;
 *     SinglyLinkedListNode* next;
 * };
 *
 */
int getNode(SinglyLinkedListNode* head, int positionFromTail) {

int index = 0;

SinglyLinkedListNode *pNode = head;
while(pNode != nullptr)
{
    pNode = pNode->next;
    index++;
}

index -= positionFromTail;
int curIndex = 1;
pNode = head;

while(curIndex < index)
{
    pNode = pNode->next;
    curIndex++;
}

return pNode->data;

}
