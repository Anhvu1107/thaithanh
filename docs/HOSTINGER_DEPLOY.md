# Xuất bản lên Hostinger

Domain production: `https://thaithanhpanel.shop`.

## Gói cần upload

Chạy `npm.cmd run verify`, sau đó nén **nội dung bên trong** `client/.output/public/`. Khi giải nén trên Hostinger, `index.html`, `.htaccess`, `_nuxt/`, `images/` và các thư mục route phải nằm trực tiếp trong `public_html/`, không nằm thêm trong một thư mục lồng bên ngoài.

Không upload `.git`, source, `.env`, `node_modules`, `.nuxt` hoặc credential lên hosting.

## Thao tác trong hPanel

1. Mở Websites → Manage → File Manager → `public_html`.
2. Sao lưu nội dung trang giữ chỗ hiện tại, sau đó xóa file `index.html` mặc định của Hostinger.
3. Upload gói production và giải nén trực tiếp vào `public_html`.
4. Bật SSL cho `thaithanhpanel.shop` và `www.thaithanhpanel.shop`.
5. `.htaccess` đã cấu hình chuyển HTTP sang HTTPS, chuyển `www` về domain gốc và dùng `/404.html` cho URL không tồn tại.

## Kiểm tra sau upload

- Mở trang chủ, toàn bộ menu, `/privacy` và một URL không tồn tại.
- Xác nhận `http://thaithanhpanel.shop` chuyển 301 sang HTTPS.
- Xác nhận `https://www.thaithanhpanel.shop` chuyển 301 về `https://thaithanhpanel.shop`.
- Gửi form thật và kiểm tra Gmail nhận đủ họ tên, số điện thoại và nội dung.
- Kiểm tra `/robots.txt`, `/sitemap.xml` và `/site.webmanifest` trả HTTP 200.
