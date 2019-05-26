#ifndef WINDOW_H
#define WINDOW_H

#include "qtheader.h"

namespace Ui
{
class Window;
}

class Window : public QWidget
{
    Q_OBJECT
public:
    explicit Window(QWidget *parent = nullptr);
    ~Window();

signals:

public slots:

private:
    Ui::Window *ui;
};

#endif // WINDOW_H
