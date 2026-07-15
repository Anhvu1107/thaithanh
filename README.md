# Thái Thanh Panel

Website giới thiệu doanh nghiệp xây dựng bằng Nuxt 3 và xuất ra artifact tĩnh. Website không có backend riêng, trang quản trị, database, tài khoản, giỏ hàng hoặc thanh toán. Form liên hệ nhanh gửi dữ liệu trực tiếp tới Web3Forms để chuyển tiếp vào email doanh nghiệp.

## Yêu cầu môi trường

- Node.js 22 LTS hoặc 24 LTS; CI mặc định dùng Node 22 theo `.nvmrc`.
- npm 10 (lockfile đã được kiểm tra với npm 10.9.2).
- Chromium cho bộ kiểm tra E2E.

```powershell
npm.cmd --prefix client ci
npm.cmd --prefix client run test:e2e:install
Copy-Item client/.env.example client/.env
```

Domain production chính thức là `https://thaithanhpanel.shop`. Canonical URL, sitemap, robots và manifest phải dùng HTTPS, kể cả khi người dùng nhập địa chỉ bắt đầu bằng `http://`.

`NUXT_PUBLIC_SITE_URL` trong `client/.env` phải là URL public chính thức, không có dấu `/` ở cuối. Thêm `NUXT_PUBLIC_CONTACT_FORM_ACCESS_KEY` do Web3Forms cấp cho email nhận yêu cầu. Access key này là mã public dành cho form, không phải mật khẩu Gmail hoặc SMTP secret. Không commit `.env`.

## Chạy local

```powershell
npm.cmd run dev
```

Mở `http://localhost:3000`.

## Kiểm tra và build

```powershell
npm.cmd run verify
```

`verify` chạy dependency audit, ESLint, Vue/TypeScript typecheck, unit test, generate và E2E. Artifact để deploy nằm tại `client/.output/public/`.

Có thể chạy từng bước bằng các lệnh `npm.cmd run lint`, `npm.cmd run typecheck`, `npm.cmd run test`, `npm.cmd run build` và `npm.cmd run test:e2e`.

## Cấu trúc chính

- `client/pages/`: các trang public và trang chi tiết bài viết.
- `client/components/static/`: header, footer và khối giao diện dùng chung.
- `client/data/site-content.json`: nội dung được validate và đóng gói khi build.
- `client/public/`: favicon, ảnh tối ưu, robots/headers tĩnh.
- `client/server/routes/`: sitemap và robots được generate theo domain cấu hình.
- `client/e2e/`: kiểm tra artifact trên desktop và mobile.
- `docs/HANDOFF.md`: checklist go-live, vận hành và bàn giao.

## Cập nhật nội dung

1. Sửa `client/data/site-content.json`.
2. Thay asset tương ứng trong `client/public/images/` khi cần; chỉ dùng ảnh có quyền sử dụng.
3. Chạy `npm.cmd run verify`.
4. Deploy duy nhất nội dung của `client/.output/public/` lên static hosting.

Các route chính: `/`, `/solutions`, `/products`, `/projects`, `/posts`, `/about`, `/contact`. Bài viết đã publish được prerender tại `/posts/[slug]`; URL không tồn tại, `/admin` và endpoint runtime phải trả HTTP 404.

## Production và bảo mật

- Chọn static host có HTTPS, custom 404, immutable cache cho `/_nuxt/*` và hỗ trợ security headers. File `client/public/_headers` dùng được với các nền tảng tương thích Netlify/Cloudflare Pages; nền tảng khác cần cấu hình tương đương.
- Không deploy source, `.git`, `.env` hoặc `node_modules`; chỉ build với access key Web3Forms trong biến môi trường của hosting.
- Secret từng xuất hiện trong Git phải được rotate trước, sau đó mới rewrite history và tạo fresh clone bàn giao.
- Trước go-live, hoàn tất toàn bộ mục trong `docs/HANDOFF.md`.
