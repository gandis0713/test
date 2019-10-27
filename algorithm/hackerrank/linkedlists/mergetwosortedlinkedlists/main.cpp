

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
if(head1->data < head2->data)
{
    pHead = head1;
    pPreNode1 = head1;
    pNode1 = head1->next;
    pNode2 = head2;
}
else
{
    pHead = head2;
    pPreNode1 = head2;
    pNode1 = head2->next;
    pNode2 = head1;
}



while(pNode1 != nullptr && pNode2 != nullptr)
{
    if(pPreNode1->data > pNode2->data)
    {
        SinglyLinkedListNode *pNextNode2 = pNode2->next;
        pNode2->next = pPreNode1;

        pNode1 = pPreNode1;
        pPreNode1 = pNode2;

        pNode2 = pNextNode2;
    }
    else if(pPreNode1->data <= pNode2->data && pNode1->data >= pNode2->data)
    {        
        SinglyLinkedListNode *pNextNode2 = pNode2->next;

        pNode2->next = pNode1;
        pPreNode1->next = pNode2;

        pNode1 = pNode2;
        pNode2 = pNextNode2;
    }
    else
    {
        pPreNode1 = pNode1;
        pNode1 = pNode1->next;
    }
}

if(pNode2 != nullptr)
    pPreNode1->next = pNode2;


return pHead;
}