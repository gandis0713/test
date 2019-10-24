
// Complete the mergeLists function below.

/*
 * For your reference:
 *
 * SinglyLinkedListNode {
 *     int data;
 *     SinglyLinkedListNode* next;
 * };
 *
 */
SinglyLinkedListNode* mergeLists(SinglyLinkedListNode* head1, SinglyLinkedListNode* head2)
{

SinglyLinkedListNode *pHead = nullptr;
SinglyLinkedListNode *pPreNode1 = nullptr;
SinglyLinkedListNode *pNode1 = nullptr;
SinglyLinkedListNode *pNode2 = nullptr;
if(head1->data <= head2->data)
{
    pHead = head1;
    pNode1 = head1;
    pNode2 = head2;
}
else
{
    pHead = head2;
    pNode1 = head2;
    pNode2 = head1;
}

while(pNode1 != nullptr && pNode2 != nullptr)
{
    if(pNode1->data < pNode2->data)
    {
        pPreNode1 = pNode1;
        pNode1 = pNode1->next;
    }
    else
    {   
        SinglyLinkedListNode *pTemp2 = pNode2->next;

        pPreNode1->next = pNode2;
        pPreNode1 = pNode2;
        pNode2->next = pNode1;
        
        pNode2 = pTemp2;
    }
}

if(pNode2 != nullptr)
    pPreNode1->next = pNode2;


return pHead;
}