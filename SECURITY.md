# Security

Website production là artifact tĩnh và không cần database credential hoặc secret runtime.

## Nguyên tắc

- Không commit `.env`, token, mật khẩu, URL database có credential hoặc khóa riêng tư.
- Chỉ cấu hình secret trong secret manager của CI/hosting khi thật sự cần.
- Nếu một secret từng được commit, phải rotate/revoke trước; xóa file ở commit mới không loại secret khỏi lịch sử.
- Sau khi rewrite lịch sử, force-push có kiểm soát và tạo fresh clone để bàn giao. Không tái sử dụng clone cũ hoặc copy thư mục `.git` cũ.
- Release website cho hosting chỉ gồm `client/.output/public/`.

## Báo cáo vấn đề

Gửi báo cáo bảo mật trực tiếp cho người chịu trách nhiệm kỹ thuật của dự án. Không đăng credential hoặc dữ liệu nhạy cảm vào issue công khai.
