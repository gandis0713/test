

// Complete the has_cycle function below.

/*
 * For your reference:
 *
 * SinglyLinkedListNode {
 *     int data;
 *     SinglyLinkedListNode* next;
 * };
 *
 */
bool has_cycle(SinglyLinkedListNode* head) {

    SinglyLinkedListNode *pNode1 = head;
    SinglyLinkedListNode *pNode2 = head;
    while(pNode2 != nullptr && pNode2->next != nullptr)
    {
        pNode1 = pNode1->next;
        pNode2 = pNode2->next->next;
        if(pNode1 == pNode2)
        {
            return true;
        }
    }    

    return false;
}
