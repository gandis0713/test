#include "mainwindow.h"
#include "ui_mainwindow.h"

#include "RequestSender.h"

#include <QThreadPool>

MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    QThreadPool *pThreadPool = new QThreadPool();

    CRequestSender *sender = new CRequestSender();
    pThreadPool->start(sender);
}

MainWindow::~MainWindow()
{
    delete ui;
}
