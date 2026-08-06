# نظام إدارة طلبات المطعم

## المتطلبات

- Node.js 18+
- npm أو yarn

## التثبيت المحلي

1. تثبيت حزم السيرفر:
```bash
cd server
npm install
```

2. تثبيت حزم الكلاينت:
```bash
cd ../client
npm install
```

## التشغيل المحلي

1. تشغيل السيرفر (المنفذ 5000):
```bash
cd server
npm start
```

2. تشغيل الكلاينت (المنفذ 3000):
```bash
cd client
npm run dev
```

## النشر المجاني على Render

### الخطوات:

1. **رفع المشروع على GitHub**:
   - أنشئ مستودع جديد على GitHub
   - ارفع الملفات بواسطة Git:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/restaurant-order-system.git
   git push -u origin main
   ```

2. **إنشاء حساب على [Render](https://render.com)** (مجاني)

3. **في Render**:
   - اضغط **New +** → **Web Service**
   - اختر المستودع من GitHub
   - الإعدادات:
     - **Name**: `restaurant-order-system`
     - **Build Command**: `cd server && npm install && npm run build`
     - **Start Command**: `cd server && npm start`
   - اضبط المتغيرات البيئية:
     - `NODE_ENV` = `production`
     - `PORT` = `10000`
   - أضف **Disk**:
     - **Name**: `data`
     - **Mount Path**: `/opt/render/project/src/server/data`
     - **Size**: `1 GB`
   - اضغط **Create Web Service**

4. **بعد النشر**:
   - ستحصل على رابط مثل: `https://restaurant-order-system.onrender.com`
   - صفحة الزبون: `https://your-app.onrender.com/menu?table={table_id}`
   - لوحة التحكم: `https://your-app.onrender.com/admin`
   - رموز QR: `https://your-app.onrender.com/admin/qr`

## الاستخدام

### للزبون:
1. امسح QR Code الموجود على الطاولة
2. اختر ما تريد من القائمة
3. أضف للسلة ثم تأكيد الطلب

### للإدارة:
1. ادخل لوحة التحكم `/admin`
2. تابع الطلبات وتحديث حالاتها
3. أدر القائمة والطاولات
4. اطبع رموز QR للطاولات

## الميزات

- ✅ قائمة طعام مع تصنيفات (كراب، حلويات، مثلجات، مشروبات)
- ✅ سلة مشتريات تفاعلية
- ✅ إرسال طلبات مرتبطة برقم الطاولة
- ✅ لوحة تحكم لإدارة الطلبات
- ✅ إحصائيات المبيعات
- ✅ إدارة القائمة (إضافة/تعديل/حذف)
- ✅ إدارة الطاولات
- ✅ توليد QR Code لكل طاولة
- ✅ واجهة عربية بالكامل
- ✅ تصميم متجاوب للموبايل
