# Checklist bàn giao Thái Thanh Panel

Tài liệu này áp dụng cho website giới thiệu tĩnh. Website không có backend riêng, tài khoản, trang quản trị, cơ sở dữ liệu, giỏ hàng hoặc thanh toán. Form liên hệ gửi qua Web3Forms và không lưu trong database của website.

## Điều kiện bắt buộc trước khi go-live

- [ ] Credential Neon từng xuất hiện trong lịch sử Git đã được rotate hoặc revoke.
- [ ] Lịch sử Git chứa credential đã được làm sạch; bản clone bàn giao được tạo mới sau khi rewrite.
- [ ] Domain chính thức phân giải về hosting và HTTPS hoạt động.
- [ ] Email công khai đã gửi/nhận thử thành công; nếu dùng email theo domain riêng thì MX, SPF, DKIM và DMARC đã cấu hình.
- [ ] `NUXT_PUBLIC_CONTACT_FORM_ACCESS_KEY` đã được cấu hình; gửi thử form từ domain production và xác nhận Gmail nhận đủ họ tên, số điện thoại, nội dung.
- [ ] Hotline và liên kết Zalo (nếu bật) đã được chủ doanh nghiệp kiểm tra trên thiết bị thật.
- [ ] Tên pháp nhân, địa chỉ, mã số thuế và nội dung giới thiệu đã được khách hàng duyệt.
- [x] Logo chính thức đã thay monogram tạm; logo dùng cho dữ liệu có cấu trúc có kích thước phù hợp.
- [x] Form có consent bắt buộc, trang `/privacy` và validation dự phòng khi JavaScript bị tắt.
- [ ] Ảnh sản phẩm và ảnh dự án có quyền sử dụng; ảnh minh họa không được mô tả như dự án đã thực hiện.
- [ ] Datasheet của nhà sản xuất xác nhận quy cách và dải nhiệt trước khi công khai.
- [x] Biến `NUXT_PUBLIC_SITE_URL` trong `client/.env` và cấu hình mặc định trỏ tới `https://thaithanhpanel.shop`, không có dấu `/` ở cuối.
- [ ] `npm.cmd run verify` đạt trên commit/release bàn giao.

## Build và artifact

```powershell
npm.cmd --prefix client ci
npm.cmd --prefix client exec playwright install chromium
npm.cmd run verify
```

Domain production được chủ website xác nhận là `https://thaithanhpanel.shop`. Cấu hình mặc định, `.env.example`, canonical URL, sitemap, robots và manifest đều dùng origin HTTPS này.

Chỉ deploy nội dung trong `client/.output/public/`. Không upload source, `.git`, `.env`, `node_modules` hoặc credential lên static hosting.

Với hosting hiện tại, làm theo `docs/HOSTINGER_DEPLOY.md`. Gói upload phải giữ `.htaccess` để ép HTTPS, chuẩn hóa hostname và trả trang 404 đúng.

## Kiểm tra sau deploy

- Mở `/`, sáu trang điều hướng, một bài viết và một URL không tồn tại.
- Kiểm tra desktop và mobile; thử gọi điện, Zalo, email và form liên hệ nhanh.
- Xác nhận `/robots.txt` và `/sitemap.xml` trả HTTP 200 với đúng domain.
- Xác nhận URL sai trả HTTP 404 và hiển thị trang lỗi có thương hiệu.
- Kiểm tra HTTPS, security headers và cache dài hạn cho `/_nuxt/*`.
- Gửi sitemap lên công cụ quản trị tìm kiếm sau khi domain hoạt động.

## Vận hành nội dung

1. Sửa `client/data/site-content.json` và thay asset tương ứng trong `client/public/images/`.
2. Không dùng ảnh dự án nếu chưa có quyền sử dụng và thông tin xác nhận.
3. Chạy `npm.cmd run verify`.
4. Lưu artifact/release cũ trước khi deploy để có thể rollback.

## Gói bàn giao

- Source ở commit đã kiểm thử và lịch sử Git đã làm sạch.
- Artifact production tương ứng với commit đó.
- Quyền quản lý domain, DNS, hosting, email và analytics chuyển cho tài khoản của khách hàng.
- Danh sách nhà cung cấp, ngày gia hạn và người chịu trách nhiệm vận hành.
- Biên bản khách hàng duyệt nội dung, tài sản hình ảnh và phạm vi website tĩnh.
