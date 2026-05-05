#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <QSplitter>
#include <QVBoxLayout>
#include <QWidget>
#include <QLabel>
#include <QMenuBar>
#include <QPushButton>
#include <QListWidget>
#include <QProgressBar>
#include <QSettings>

extern "C" {
    #include "HCNetSDK.h"
}

class MainWindow : public QMainWindow {
    Q_OBJECT

public:
    MainWindow(QWidget *parent = nullptr);
    ~MainWindow();

private:
    void setupUI();      // Hàm dựng giao diện
    void createMenuBar(); // Hàm tạo menu trên cùng
    
    // Các Widget con đại diện cho 3 cột
    QWidget* createMapWidget();
    QWidget* createVideoWidget();
    QWidget* createSidebarWidget();

    // Helper functions for sidebar widgets
    QWidget* createChart1Widget();
    QWidget* createChart2Widget();

    // HCNetSDK functions
    void initSDK();
    void loginToDevices();
    void startRealPlay();

    LONG lUserId[3];       // Handles cho 3 camera sau khi login
    LONG lPlayHandle[3];   // Handles cho 3 luồng video đang phát
    QWidget* videoWidgets[3]; // Con trỏ đến 3 widget hiển thị video
};

#endif // MAINWINDOW_H
