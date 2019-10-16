#ifndef CLISTMODEL_H
#define CLISTMODEL_H

#include <QList>

class CListModel : public QList<QString>
{
public:
    explicit CListModel();
    virtual ~CListModel();

    virtual void Add(const QString &strNew);
    virtual void Delete(int nIndex);
};

#endif // CLISTMODEL_H
