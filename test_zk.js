const ZKLib = require('zkteco-js');

async function testDevice() {
    // إعدادات الجهاز
    const ip = '192.168.0.201'; // الآي بي الذي يعمل معك في الـ Ping
    const port = 4370;          // المنفذ الافتراضي
    const commKey = 0;          // مفتاح الاتصال الافتراضي

    console.log(`--- بدء اختبار الاتصال بـ ${ip}:${port} ---`);
    console.log(`استخدام Comm Key: ${commKey}`);

    const zk = new ZKLib(ip, port, 10000, 4000);

    // محاولة ضبط Comm Key (بعض الأجهزة تتطلب هذا قبل الاتصال)
    zk.commKey = commKey;

    try {
        console.log('1. جاري محاولة إنشاء اتصال TCP...');
        await zk.createSocket();
        console.log('✅ تم إنشاء الاتصال بنجاح!');

        console.log('2. جاري جلب المعلومات...');
        const serial = await zk.getSerialNumber();
        console.log(`✅ الرقم التسلسلي: ${serial}`);

        const firmware = await zk.getFirmware();
        console.log(`✅ إصدار النظام: ${firmware}`);

        const time = await zk.getTime();
        console.log(`⏰ وقت الجهاز: ${time}`);

        await zk.disconnect();
        console.log('--- انتهى الاختبار بنجاح ---');

    } catch (e) {
        console.error('❌ فشل الاتصال. التفاصيل:');
        console.error(e);

        if (e.code === 'ETIMEDOUT') {
            console.log('\n⚠️  تنبيه: المهلة انتهت. هذا يعني غالباً:');
            console.log('1. المنفذ (Port) في الجهاز ليس 4370.');
            console.log('2. يوجد جدار حماية (Firewall) يمنع البرنامج.');
            console.log('3. جهاز البصمة معلق، جرب إعادة تشغيله.');
        } else if (e.code === 'ECONNREFUSED') {
            console.log('\n⚠️  تنبيه: تم رفض الاتصال. الجهاز يمنع هذا المنفذ.');
        }
    }
}

testDevice();
