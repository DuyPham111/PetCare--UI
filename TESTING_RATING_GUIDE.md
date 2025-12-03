# 🧪 Hướng Dẫn Test Tính Năng Đánh Giá

## 📋 Tóm Tắt Data Đã Có Sẵn

### Customer: john@example.com / customer123

**7 Service Instances đã hoàn thành (có invoice):**

| ID | Date | Service Type | Pet | Vet | Đã Rated? |
|----|------|--------------|-----|-----|-----------|
| service-inst-1 | Nov 15, 2024 | Medical Exam | Max | Dr. Smith | ❌ Chưa |
| service-inst-2 | Nov 20, 2024 | Single Vaccine | Bella | Dr. Smith | ✅ Đã (5⭐) |
| service-inst-3 | Nov 25, 2024 | Vaccine Package | Max | Dr. Johnson | ❌ Chưa |
| service-inst-5 | Dec 1, 2024 | Medical Exam | Bella | Dr. Johnson | ❌ Chưa |
| service-inst-6 | Nov 10, 2024 | Single Vaccine | Max | Dr. Smith | ❌ Chưa |
| service-inst-7 | Oct 25, 2024 | Medical Exam | Max | Dr. Johnson | ❌ Chưa |

**Có 5 dịch vụ chưa rated** để test!

---

## 🚀 Cách Test Nhanh (Development Testing Panel)

### Bước 1: Khởi động server và reset data

```bash
# Terminal 1: Chạy dev server
pnpm dev
```

```javascript
// Terminal 2 hoặc Browser Console: Reset mock data
// Mở http://localhost:8080 trong browser
// Press F12 để mở DevTools Console
// Paste và chạy lệnh sau:

localStorage.clear();
window.location.reload();

// Hoặc chỉ reset service data:
import { resetMockData } from './lib/mockData';
resetMockData();
```

### Bước 2: Login với customer account

```
Email: john@example.com
Password: customer123
```

### Bước 3: Vào "My Services"

- Click vào avatar ở góc trên phải
- Chọn **"My Services"**
- Bạn sẽ thấy **6 dịch vụ** hiển thị (5 chưa rated + 1 đã rated)

### Bước 4: Test với Development Testing Panel

#### 🎯 Test Case 1: Quick Fill "Good Service"

1. Click vào service **"Medical Exam - Max"** (Nov 15, 2024)
2. Tìm khung màu cam **"🧪 DEVELOPMENT MODE - RATING TESTING"** ở đầu trang
3. Click button **"Good Service (5 stars)"**
   - ✅ Tự động fill: 5⭐ cho cả 3 ratings
   - ✅ Tự động fill comment: "Excellent service!..."
4. (Optional) Điều chỉnh ratings bằng stars hoặc sliders
5. Click **"Submit Rating"**
6. Kiểm tra:
   - ✅ Toast hiện: "Thank you for your feedback!"
   - ✅ Form biến mất, hiện thẻ "Your Rating" với màu xanh
   - ✅ 3 ratings hiển thị đúng với icons
   - ✅ Comment hiển thị trong bordered card

#### 🎯 Test Case 2: Quick Fill "Neutral Service"

1. Trong Development Testing Panel, click dropdown **"Switch to Service"**
2. Chọn **"Single-Dose Injection - Max"** (Nov 10, 2024)
3. Page navigate tới service mới
4. Click button **"Neutral Service (3 stars)"**
   - ✅ Tự động fill: 3⭐ cho cả 3 ratings
   - ✅ Tự động fill comment: "The service was okay..."
5. Click **"Submit Rating"**

#### 🎯 Test Case 3: Quick Fill "Bad Service"

1. Trong Development Testing Panel, click dropdown **"Switch to Service"**
2. Chọn **"Vaccine Package - Max"** (Nov 25, 2024)
3. Click button **"Bad Service (1 star)"**
   - ✅ Tự động fill: 1⭐ cho cả 3 ratings
   - ✅ Tự động fill comment: "Service could be improved..."
4. Click **"Submit Rating"**

#### 🎯 Test Case 4: Manual Rating (Không dùng template)

1. Navigate tới service **"Medical Exam - Bella"** (Dec 1, 2024)
2. **Không** click template buttons
3. Manual rating:
   - Click trực tiếp vào stars hoặc kéo sliders
   - Service Quality: 4 stars
   - Staff Attitude: 5 stars
   - Overall Satisfaction: 4 stars
4. Nhập comment tùy ý (max 500 chars)
5. Click **"Submit Rating"**

---

## 📊 Kiểm Tra Kết Quả

### A. Trong "My Services" List

Quay lại `/customer/services`:

1. **Stats Cards** (đầu trang):
   - Total Services: 6
   - Rated Services: 5 (sau khi test xong)
   - Pending Reviews: 1
   - Your Feedback: 5 (có comments)

2. **Table Badges**:
   - ✅ Rated services có badge **"Rated"** (màu xanh, icon CheckCircle2)
   - ❌ Unrated service có badge **"Not Rated"** (màu vàng, icon Star)

3. **Action Buttons**:
   - ✅ Rated services: button **"View Rating"**
   - ❌ Unrated service: button **"Rate Service"**

### B. Trong Service Detail Page

Click **"View"** trên service đã rated:

1. **Green Success Banner** hiển thị:
   - Icon: CheckCircle
   - Text: "Rating Submitted"
   - Subtext: "Thank you for taking the time..."

2. **Rating Summary Card** (màu xám nhạt):
   - 3 sections với icons riêng:
     - ThumbsUp + Service Quality
     - Smile + Staff Attitude
     - Sparkles + Overall Satisfaction
   - Stars hiển thị đúng (filled/unfilled)
   - Rating numbers hiển thị (X/5)

3. **Comment** hiển thị trong bordered card

4. **NO Development Panel** (vì đã rated)

### C. Trong Sales Module

Login với sales account:
```
Email: sales@petcare.com
Password: sales123
```

Navigate to `/sales/invoices/services`:

1. Tìm invoices của customer John Doe
2. Cột **"Rating"** hiển thị:
   - ⭐ X/5 (average của overallSatisfaction)
3. Click **"View"** invoice detail:
   - Section **"Customer Ratings"** hiển thị:
     - Staff Attitude Rating: X/5 (với stars)
     - Overall Satisfaction: X/5 (với stars)

---

## 🔍 Validation Tests

### Test Validation Rules

1. **Rating Required**:
   - Không click stars nào
   - Nhập comment
   - Click Submit → Toast error: "Please provide all three ratings"

2. **Comment Required**:
   - Click stars (chọn ratings)
   - Để trống comment
   - Click Submit → Toast error: "Please provide a comment"

3. **Comment Max Length**:
   - Nhập comment > 500 characters
   - Click Submit → Toast error: "Comment must be 500 characters or less"
   - Character counter hiển thị: "XXX/500 characters"

4. **All Fields Valid**:
   - Chọn ratings > 0
   - Nhập comment 1-500 chars
   - Click Submit → ✅ Success

---

## 🎨 UI/UX Tests

### Interactive Elements

1. **Star Buttons**:
   - Click star → Rating thay đổi
   - Hover → Scale 110%
   - Selected stars: fill-yellow-400
   - Unselected stars: fill-gray-200

2. **Sliders**:
   - Kéo slider → Stars sync
   - Click star → Slider sync
   - Range: 0-5, step: 1

3. **Development Panel** (DEV mode only):
   - Dropdown liệt kê unrated services
   - 3 template buttons với colors:
     - Good: green border
     - Neutral: gray border
     - Bad: red border
   - Orange info banner với tip

4. **Responsive Design**:
   - Desktop: 2 columns (service info | rating form)
   - Mobile: 1 column stacked

---

## 🐛 Troubleshooting

### Vấn đề: "No service history yet" hiển thị

**Nguyên nhân**: localStorage chưa có data

**Giải pháp**:
```javascript
// Browser Console
localStorage.clear();
window.location.reload();
```

### Vấn đề: Development Panel không hiển thị

**Nguyên nhân**: Đang ở production mode hoặc service đã rated

**Giải pháp**:
- Đảm bảo chạy `pnpm dev` (không phải `pnpm build`)
- Chọn service chưa rated

### Vấn đề: Ratings không persist sau reload

**Nguyên nhân**: localStorage không lưu được

**Giải pháp**:
- Check browser settings (allow localStorage)
- Check console errors
- Xóa cache và retry

---

## 📝 Test Checklist

Hoàn thành tất cả test cases sau:

- [ ] Login customer thành công
- [ ] My Services hiển thị 6 services
- [ ] Development Panel hiển thị (DEV mode)
- [ ] Quick Fill "Good" template works
- [ ] Quick Fill "Neutral" template works
- [ ] Quick Fill "Bad" template works
- [ ] Service switcher dropdown works
- [ ] Manual rating (stars) works
- [ ] Manual rating (sliders) works
- [ ] Stars và sliders sync với nhau
- [ ] Comment textarea có character counter
- [ ] Validation: Rating required
- [ ] Validation: Comment required
- [ ] Validation: Comment max 500 chars
- [ ] Submit rating thành công
- [ ] Toast notification hiển thị
- [ ] Rating summary hiển thị đúng
- [ ] Stats cards cập nhật
- [ ] Badge đổi "Completed" → "Rated"
- [ ] Button đổi "Rate Service" → "View Rating"
- [ ] Sales module hiển thị ratings đúng
- [ ] Invoice detail hiển thị ratings đúng
- [ ] Development panel biến mất sau khi rated

---

## 🎯 Expected Results

Sau khi test xong 4 services (1 Good + 1 Neutral + 1 Bad + 1 Manual):

**My Services Stats:**
- Total Services: 6
- Rated Services: 5 (1 có sẵn + 4 vừa test)
- Pending Reviews: 1
- Your Feedback: 5

**Service Invoices:**
- Invoice 1: staffAttitudeRating = 5, overallSatisfaction = 5
- Invoice 2: staffAttitudeRating = 5, overallSatisfaction = 5 (có sẵn)
- Invoice 3: staffAttitudeRating = 1, overallSatisfaction = 1
- Invoice 5: staffAttitudeRating = 4-5, overallSatisfaction = 4
- Invoice 6: staffAttitudeRating = 3, overallSatisfaction = 3
- Invoice 7: (chưa rated)

---

## ✅ Success Criteria

Tính năng đánh giá được coi là thành công khi:

1. ✅ Customer có thể rate services đã hoàn thành
2. ✅ Validation rules hoạt động đúng
3. ✅ Development testing panel hoạt động (DEV mode)
4. ✅ Data persist trong localStorage
5. ✅ Ratings hiển thị đúng trong Customer + Sales modules
6. ✅ UI/UX mượt mà, không có bugs
7. ✅ TypeScript 0 errors
8. ✅ Responsive design works

---

**Happy Testing! 🎉**
