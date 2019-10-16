#ifndef CLISTVIEW_H
#define CLISTVIEW_H

#include <QListWidget>

#include "ilistwidgetview.h"

class CListWidgetView : public QListWidget,  public IListWidgetView
{
public:
    explicit CListWidgetView(QWidget *parent = NULL);
    ~CListWidgetView();

    void Add(const QString &strNew) override;
    void Delete(const int &nIndex) override;

    int GetSelectedIndex() override;
};

#endif // CLISTVIEW_H
