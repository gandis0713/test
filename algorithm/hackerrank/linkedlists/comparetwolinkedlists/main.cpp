

// Complete the compare_lists function below.

/*
 * For your reference:
 *
 * SinglyLinkedListNode {
 *     int data;
 *     SinglyLinkedListNode* next;
 * };
 *
 */
bool compare_lists(SinglyLinkedListNode* head1, SinglyLinkedListNode* head2) {

    if(head1 == nullptr || head2 == nullptr)
    {
        return false;
    }

    SinglyLinkedListNode *pNode1 = head1;
    SinglyLinkedListNode *pNode2 = head2;
    while(pNode1 != nullptr && pNode2 != nullptr)
    {
        if(pNode1->data != pNode2->data)
        {
            return false;
        }

        pNode1 = pNode1->next;
        pNode2 = pNode2->next;
    }

    if(pNode1 == NULL && pNode2 == NULL)
    {
        return true;
    }

    return false;
}
