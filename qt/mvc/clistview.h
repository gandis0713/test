#ifndef CLISTVIEW_H
#define CLISTVIEW_H

#include <QListWidget>

#include "ilistlistener.h"

class CListView : public QListWidget,  public IListListner
{
public:
    explicit CListView(QWidget *parent = NULL);
    ~CListView();

    void OnAdded(const QString &strNew) override;
    void OnDeleted(const int &nIndex) override;
};

#endif // CLISTVIEW_H
