document.getElementById('connectBtn').addEventListener('click', async () => {
    try {
        // 1. 请求用户选择蓝牙设备
        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ['0000ffe0-0000-1000-8000-00805f9b34fb'] // 与单片机服务UUID一致
        });
        
        // 2. 连接设备
        const server = await device.gatt.connect();
        
        // 3. 获取蓝牙服务
        const service = await server.getPrimaryService('0000ffe0-0000-1000-8000-00805f9b34fb');
        
        // 4. 获取特征值（用于接收数据）
        const characteristic = await service.getCharacteristic('0000ffe1-0000-1000-8000-00805f9b34fb');
        
        // 5. 监听数据变化
        characteristic.addEventListener('characteristicvaluechanged', event => {
            const value = new TextDecoder().decode(event.target.value);
            document.getElementById('dataDisplay').textContent = `接收数据: ${value}`;
        });
        
        // 6. 启动通知
        await characteristic.startNotifications();
        
        console.log('蓝牙已连接，等待数据...');
    } catch (error) {
        alert('连接失败: ' + error);
    }
});