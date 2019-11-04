#ifndef IMAINWINDOW_H
#define IMAINWINDOW_H


class IMainWindowView
{
private:
    virtual void Add() = 0;
    virtual void Delete() = 0;
};

#endif // IMAINWINDOW_H
