

// Complete the insertNodeAtTail function below.

/*
 * For your reference:
 *
 * SinglyLinkedListNode {
 *     int data;
 *     SinglyLinkedListNode* next;
 * };
 *
 */
SinglyLinkedListNode* insertNodeAtTail(SinglyLinkedListNode* head, int data) {

if(head == nullptr)
{
    head = new SinglyLinkedListNode(data);
    return head;
}

SinglyLinkedListNode* pNode = head;
SinglyLinkedListNode* pNewNode = new SinglyLinkedListNode(data);

while(pNode != nullptr && pNode->next != nullptr)
{
    pNode = pNode->next;
}

pNode->next = pNewNode;

return head;
}
