#include "maincontroller.h"
#include "ui_mainwindow.h"

MainController::MainController(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    m_lstModel.setListListener(ui->listWidget);

    connect(ui->btnNew, &QPushButton::clicked, this, [&](bool bState){ Q_UNUSED(bState); m_lstModel.append(ui->editNew->text());});
    connect(ui->btnDelete, &QPushButton::clicked, this, [&](bool bState){ Q_UNUSED(bState); m_lstModel.removeAt(ui->listWidget->currentIndex().row());});
}

MainController::~MainController()
{
    delete ui;
}
