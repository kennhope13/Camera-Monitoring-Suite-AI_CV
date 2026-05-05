#include "MainWindow.h"
#include <QDebug>
#include <QSettings>

MainWindow::MainWindow(QWidget *parent) : QMainWindow(parent) {
    setWindowTitle("TITSMART - Substation Specialized Anomaly Detector");
    createMenuBar();
    setupUI();

    // Khởi tạo các biến handle
    for (int i = 0; i < 3; ++i) {
        lUserId[i] = -1;
        lPlayHandle[i] = -1;
        videoWidgets[i] = nullptr;
    }

    initSDK();
    loginToDevices();
    startRealPlay();
}

MainWindow::~MainWindow() {
    // Giải phóng tài nguyên khi đóng ứng dụng
    for (int i = 0; i < 3; ++i) {
        if (lPlayHandle[i] >= 0) {
            NET_DVR_StopRealPlay(lPlayHandle[i]);
        }
        if (lUserId[i] >= 0) {
            NET_DVR_Logout(lUserId[i]);
        }
    }
    NET_DVR_Cleanup();
}

void MainWindow::initSDK() {
    if (NET_DVR_Init()) {
        qDebug() << "NET_DVR_Init success!";
    } else {
        qDebug() << "NET_DVR_Init failed! Error code:" << NET_DVR_GetLastError();
    }
}

void MainWindow::loginToDevices() {
    QSettings settings("config.ini", QSettings::IniFormat);

    for (int i = 0; i < 3; ++i) {
        QString groupName = QString("Camera%1").arg(i + 1);
        settings.beginGroup(groupName);

        QString ip = settings.value("IP").toString();
        int port = settings.value("Port").toInt();
        QString user = settings.value("User").toString();
        QString password = settings.value("Password").toString();

        settings.endGroup();

        if (ip.isEmpty()) {
            qDebug() << "Skipping Camera" << i + 1 << ": No IP address configured.";
            continue;
        }

        NET_DVR_USER_LOGIN_INFO struLoginInfo = {0};
        struLoginInfo.bUseAsynLogin = 0; // Login đồng bộ
        strcpy(struLoginInfo.sDeviceAddress, ip.toStdString().c_str());
        struLoginInfo.wPort = port;
        strcpy(struLoginInfo.sUserName, user.toStdString().c_str());
        strcpy(struLoginInfo.sPassword, password.toStdString().c_str());

        NET_DVR_DEVICEINFO_V40 struDeviceInfoV40 = {0};

        lUserId[i] = NET_DVR_Login_V40(&struLoginInfo, &struDeviceInfoV40);

        if (lUserId[i] >= 0) {
            qDebug() << "Login to Camera" << i + 1 << "(" << ip << ") success!";
        } else {
            qDebug() << "Login to Camera" << i + 1 << "(" << ip << ") failed! Error:" << NET_DVR_GetLastError();
        }
    }
}

void MainWindow::startRealPlay() {
    for (int i = 0; i < 3; ++i) {
        if (lUserId[i] < 0 || videoWidgets[i] == nullptr) {
            continue;
        }

        NET_DVR_PREVIEWINFO struPreviewInfo = {0};
        struPreviewInfo.hPlayWnd = (HWND)videoWidgets[i]->winId(); // Lấy handle của widget Qt
        struPreviewInfo.lChannel = 1; // Kênh số 1
        struPreviewInfo.dwStreamType = 0; // Luồng chính (Main stream)
        struPreviewInfo.dwLinkMode = 0; // TCP
        struPreviewInfo.bBlocked = 1;

        lPlayHandle[i] = NET_DVR_RealPlay_V40(lUserId[i], &struPreviewInfo, nullptr, nullptr);

        if (lPlayHandle[i] >= 0) {
            qDebug() << "Start RealPlay for Camera" << i + 1 << "success!";
        } else {
            qDebug() << "Start RealPlay for Camera" << i + 1 << "failed! Error:" << NET_DVR_GetLastError();
        }
    }
}

void MainWindow::createMenuBar() {
    QMenu *fileMenu = menuBar()->addMenu("File");
    QMenu *viewMenu = menuBar()->addMenu("View");
    QMenu *reportsMenu = menuBar()->addMenu("Specialized Reports");
    QMenu *maintenanceMenu = menuBar()->addMenu("Specialized Maintenance");
}

void MainWindow::setupUI() {
    // QSplitter cho phép chia khung và kéo thả kích thước
    QSplitter *mainSplitter = new QSplitter(Qt::Horizontal, this);

    // Tạo 3 cột
    QWidget *mapWidget = createMapWidget();
    QWidget *videoWidget = createVideoWidget();
    QWidget *sidebarWidget = createSidebarWidget();

    // Thêm 3 cột vào Splitter
    mainSplitter->addWidget(mapWidget);
    mainSplitter->addWidget(videoWidget);
    mainSplitter->addWidget(sidebarWidget);

    // Thiết lập tỷ lệ độ rộng mặc định (Ví dụ: 30% - 40% - 30%)
    mainSplitter->setStretchFactor(0, 3);
    mainSplitter->setStretchFactor(1, 4);
    mainSplitter->setStretchFactor(2, 3);

    setCentralWidget(mainSplitter);
}

QWidget* MainWindow::createMapWidget() {
    QWidget *widget = new QWidget;
    QVBoxLayout *layout = new QVBoxLayout(widget);
    layout->setContentsMargins(5, 5, 5, 5);

    QLabel *title = new QLabel("Site Map", widget);
    title->setStyleSheet("font-weight: bold; font-size: 14px; background: transparent; border: none;");
    
    // Vùng chứa bản đồ
    QLabel *mapPlaceholder = new QLabel("Cable Trencheo Muong Cap\n\n(Site Map Schematic View)\n\n- Insulator Stack Sứ Cách Điện\n- Electrical Cabinet\n- Cabinet 3B\n- Insulator 4A\n- Sensor\n- Carra", widget);
    mapPlaceholder->setAlignment(Qt::AlignCenter);
    mapPlaceholder->setStyleSheet("background-color: #2a2a2a; border: 1px solid #444; color: #ccc;");

    layout->addWidget(title);
    layout->addWidget(mapPlaceholder, 1); // stretch = 1 để chiếm hết không gian

    return widget;
}

QWidget* MainWindow::createVideoWidget() {
    QWidget *widget = new QWidget;
    QVBoxLayout *layout = new QVBoxLayout(widget);
    layout->setContentsMargins(5, 5, 5, 5);
    layout->setSpacing(5); // Khoảng cách giữa các video

    QLabel *title = new QLabel("Nhật Ký Cảnh Báo Chuyên Biệt", widget);
    title->setStyleSheet("font-weight: bold; font-size: 14px; background: transparent; border: none;");
    layout->addWidget(title);

    QStringList videoTitles = {
        "Camera Rãnh Cáp (Cable Trench Cam)",
        "Camera Tủ Điện (Electrical Cabinet)",
        "Camera Sứ Cách Điện (Insulator Cam)"
    };

    for (int i = 0; i < 3; ++i) {
        QWidget *videoContainer = new QWidget(widget);
        QVBoxLayout *videoLayout = new QVBoxLayout(videoContainer);
        videoLayout->setContentsMargins(0, 0, 0, 0);
        videoLayout->setSpacing(0);

        QLabel *videoTitle = new QLabel(videoTitles[i], videoContainer);
        videoTitle->setStyleSheet("background-color: #333; color: white; padding: 2px;");
        
        // Thay QLabel bằng QWidget để hiển thị video
        videoWidgets[i] = new QWidget(videoContainer);
        videoWidgets[i]->setStyleSheet("background-color: #000000; border: 1px solid #555;");
        videoWidgets[i]->setSizePolicy(QSizePolicy::Expanding, QSizePolicy::Expanding);

        QLabel *status = new QLabel("Status: Monitoring (Clear)", videoContainer);
        status->setStyleSheet("background-color: rgba(0, 0, 0, 0.5); color: #0f0; padding: 2px;");

        videoLayout->addWidget(videoTitle);
        videoLayout->addWidget(videoWidgets[i]);
        videoLayout->addWidget(status);

        layout->addWidget(videoContainer, 1);
    }

    return widget;
}

QWidget* MainWindow::createChart1Widget() {
    QWidget *widget = new QWidget;
    QVBoxLayout *layout = new QVBoxLayout(widget);
    layout->setContentsMargins(0, 0, 0, 0);

    QLabel *title = new QLabel("Anomaly Alert Summary", widget);
    title->setStyleSheet("font-weight: bold; font-size: 14px; background: transparent; border: none;");
    layout->addWidget(title);

    QLabel *chartPlaceholder = new QLabel("(Bar Chart Placeholder)\n\nTia Điện Sứ (0)\nVật Thể Lạ Tủ (0)\nVật Thể Lạ Rãnh (0)", widget);
    chartPlaceholder->setAlignment(Qt::AlignCenter);
    chartPlaceholder->setStyleSheet("background-color: #2a2a2a; border: 1px solid #444; color: #ccc;");
    layout->addWidget(chartPlaceholder, 1);

    return widget;
}

QWidget* MainWindow::createChart2Widget() {
    QWidget *widget = new QWidget;
    QVBoxLayout *layout = new QVBoxLayout(widget);
    layout->setContentsMargins(0, 0, 0, 0);

    QLabel *title = new QLabel("Tóm tắt cảnh báo (30 Ngày)", widget);
    title->setStyleSheet("font-weight: bold; font-size: 14px; background: transparent; border: none;");
    layout->addWidget(title);

    QLabel *chartPlaceholder = new QLabel("(Summary Chart Placeholder)\n\nTia Điện Sứ (AA)\nVật Thể Lạ Tủ (0)\nVật Thể Lạ Rãnh (0)", widget);
    chartPlaceholder->setAlignment(Qt::AlignCenter);
    chartPlaceholder->setStyleSheet("background-color: #2a2a2a; border: 1px solid #444; color: #ccc;");
    layout->addWidget(chartPlaceholder, 1);

    return widget;
}

QWidget* MainWindow::createSidebarWidget() {
    QWidget *widget = new QWidget;
    QVBoxLayout *mainLayout = new QVBoxLayout(widget);
    mainLayout->setContentsMargins(5, 5, 5, 5);
    
    QSplitter *vSplitter = new QSplitter(Qt::Vertical, widget);

    // --- Specialized Alert Log ---
    QWidget *alertLogWidget = new QWidget(widget);
    QVBoxLayout *alertLogLayout = new QVBoxLayout(alertLogWidget);
    alertLogLayout->setContentsMargins(0, 0, 0, 0);

    QLabel *alertLogTitle = new QLabel("Specialized Alert Log", alertLogWidget);
    alertLogTitle->setStyleSheet("font-weight: bold; font-size: 14px; background: transparent; border: none;");
    alertLogLayout->addWidget(alertLogTitle);

    QHBoxLayout *buttonLayout = new QHBoxLayout();
    QPushButton *alertsBtn = new QPushButton("Alerts", alertLogWidget);
    alertsBtn->setStyleSheet("background-color: #555; color: white; border: none; padding: 5px;");
    QPushButton *aiModelBtn = new QPushButton("AI Model", alertLogWidget);
    aiModelBtn->setStyleSheet("background-color: #333; color: white; border: none; padding: 5px;");
    buttonLayout->addWidget(alertsBtn);
    buttonLayout->addWidget(aiModelBtn);
    alertLogLayout->addLayout(buttonLayout);

    QListWidget *alertList = new QListWidget(alertLogWidget);
    alertList->setStyleSheet("background-color: #222; border: 1px solid #444;");
    
    // Sample Alert 1
    QListWidgetItem *item1 = new QListWidgetItem(alertList);
    QWidget *itemWidget1 = new QWidget();
    QVBoxLayout *itemLayout1 = new QVBoxLayout(itemWidget1);
    itemLayout1->setContentsMargins(5, 5, 5, 5);
    itemLayout1->setSpacing(2);
    itemLayout1->addWidget(new QLabel("● 03/03/2023 13:54:30"));
    itemLayout1->addWidget(new QLabel("  Camera ID: Insulator 4A"));
    itemLayout1->addWidget(new QLabel("  Location: Tia Điện Sứ"));
    itemLayout1->addWidget(new QLabel("  Confidence: 97%"));
    itemLayout1->addWidget(new QLabel("  Severity: Khẩn Cấp"));
    item1->setSizeHint(itemWidget1->sizeHint());
    alertList->setItemWidget(item1, itemWidget1);

    // Sample Alert 2
    QListWidgetItem *item2 = new QListWidgetItem(alertList);
    QWidget *itemWidget2 = new QWidget();
    QVBoxLayout *itemLayout2 = new QVBoxLayout(itemWidget2);
    itemLayout2->setContentsMargins(5, 5, 5, 5);
    itemLayout2->setSpacing(2);
    itemLayout2->addWidget(new QLabel("● 03/03/2023 11:51:30"));
    itemLayout2->addWidget(new QLabel("  Camera ID: Insulator 4A"));
    itemLayout2->addWidget(new QLabel("  Location: Vật Biến Sứ"));
    itemLayout2->addWidget(new QLabel("  Confidence: 95%"));
    itemLayout2->addWidget(new QLabel("  Severity: Khẩn Báo"));
    item2->setSizeHint(itemWidget2->sizeHint());
    alertList->setItemWidget(item2, itemWidget2);
    
    alertLogLayout->addWidget(alertList);

    QLabel *noActiveAlerts = new QLabel("No active alerts in this period.\nClear as of 03/03/2023 11:53:37", alertLogWidget);
    noActiveAlerts->setStyleSheet("background: transparent; border: none; color: #aaa; font-size: 12px;");
    alertLogLayout->addWidget(noActiveAlerts);
    // ---------------------------

    QWidget *chart1 = createChart1Widget();
    QWidget *chart2 = createChart2Widget();

    // --- System Load ---
    QWidget *sysLoadWidget = new QWidget(widget);
    QVBoxLayout *sysLoadLayout = new QVBoxLayout(sysLoadWidget);
    sysLoadLayout->setContentsMargins(0, 0, 0, 0);
    sysLoadLayout->setSpacing(5);

    QLabel *sysLoadTitle = new QLabel("System Load", sysLoadWidget);
    sysLoadTitle->setStyleSheet("font-weight: bold; font-size: 14px; background: transparent; border: none;");
    sysLoadLayout->addWidget(sysLoadTitle);

    QLabel *aiEngineStatus = new QLabel("AI Engine: Stanby, OK", sysLoadWidget);
    sysLoadLayout->addWidget(aiEngineStatus);

    QProgressBar *aiLoadBar = new QProgressBar(sysLoadWidget);
    aiLoadBar->setRange(0, 100);
    aiLoadBar->setValue(3); // Sample value
    aiLoadBar->setTextVisible(false);
    aiLoadBar->setStyleSheet("QProgressBar { border: 1px solid #555; background-color: #333; height: 10px; }"
                             "QProgressBar::chunk { background-color: #0f0; }");
    sysLoadLayout->addWidget(aiLoadBar);

    QLabel *aiLoadLabel = new QLabel("AI Load: 0/% 3%", sysLoadWidget);
    sysLoadLayout->addWidget(aiLoadLabel);
    // -------------------

    vSplitter->addWidget(alertLogWidget);
    vSplitter->addWidget(chart1);
    vSplitter->addWidget(chart2);
    vSplitter->addWidget(sysLoadWidget);

    // Tỷ lệ chiều cao
    vSplitter->setStretchFactor(0, 4);
    vSplitter->setStretchFactor(1, 2);
    vSplitter->setStretchFactor(2, 2);
    vSplitter->setStretchFactor(3, 1);

    mainLayout->addWidget(vSplitter);
    return widget;
}
