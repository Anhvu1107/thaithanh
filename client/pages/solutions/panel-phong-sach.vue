<script setup lang="ts">
usePageSeo({
  title: 'Panel phòng sạch cách nhiệt cho vách và trần',
  description: 'Panel EPS cho vách, trần phòng sạch và khu vực sản xuất; tư vấn quy cách, mạch ghép, cửa và phụ kiện theo mặt bằng thực tế.',
  path: '/solutions/panel-phong-sach',
  image: '/images/insulation/eps-panel-step-joint.webp',
  imageAlt: 'Cấu tạo mép ngàm của tấm panel cách nhiệt',
  breadcrumbs: [
    { name: 'Giải pháp', path: '/solutions' },
    { name: 'Panel phòng sạch', path: '/solutions/panel-phong-sach' },
  ],
  catalogItem: {
    category: 'Panel phòng sạch và nhà xưởng',
    applications: ['Vách ngăn', 'Trần panel', 'Khu sản xuất và đóng gói'],
    specifications: [
      { label: 'Vật tư chính', value: 'Panel EPS cách nhiệt theo quy cách' },
      { label: 'Độ dày tham khảo', value: '50–200 mm, xác nhận theo mặt bằng' },
      { label: 'Hạng mục đi kèm', value: 'Cửa, nẹp U/V và vật tư hoàn thiện' },
    ],
  },
})

const features = [
  {
    title: 'Vách phòng sạch',
    description: 'Panel được dùng để phân chia khu vực; vị trí mạch ghép, góc giao và các điểm xuyên cần được đưa vào bản vẽ hoặc kích thước gửi báo giá.',
    points: ['Đo chiều dài và chiều cao vách', 'Xác định các góc và ô cửa', 'Đối chiếu cách hoàn thiện mối nối'],
  },
  {
    title: 'Trần và khu sản xuất',
    description: 'Cấu hình trần cần xem cùng cao độ, điểm treo, đèn, ống kỹ thuật và lối bảo trì để tránh thiếu vật tư khi lắp đặt.',
    points: ['Ghi rõ cao độ hoàn thiện', 'Đánh dấu vị trí xuyên trần', 'Tách panel và phụ kiện treo'],
  },
  {
    title: 'Khu đóng gói, sơ chế',
    description: 'Ưu tiên bề mặt dễ vệ sinh và luồng di chuyển rõ ràng; yêu cầu kiểm soát môi trường cần được thống nhất với bên thiết kế.',
    points: ['Xác định luồng người và hàng', 'Chọn vị trí cửa phù hợp', 'Kiểm tra yêu cầu vận hành riêng'],
  },
]

const checks = [
  { label: 'Hạng mục cần làm', value: 'Vách, trần hoặc cả hệ', note: 'Gửi sơ đồ hoặc kích thước từng khu vực.' },
  { label: 'Quy cách panel', value: 'EPS 50–200 mm tham khảo', note: 'Không chốt độ dày chỉ theo tên phòng.' },
  { label: 'Mặt bằng', value: 'Dài, rộng, cao và góc giao', note: 'Có ô cửa, cột hoặc điểm giật càng tốt.' },
  { label: 'Cửa và phụ kiện', value: 'Cửa, nẹp U/V, vật tư hoàn thiện', note: 'Xác định vị trí trước khi tính số lượng.' },
  { label: 'Điều kiện sử dụng', value: 'Nhiệt độ, độ ẩm, vệ sinh', note: 'Kèm yêu cầu vận hành nếu đã có.' },
  { label: 'Thông tin cần xác nhận', value: 'Cấp sạch và tiêu chuẩn nghiệm thu', note: 'Phối hợp với đơn vị thiết kế hoặc tư vấn chuyên ngành.' },
]

const relatedLinks = [
  {
    eyebrow: 'Sản phẩm',
    title: 'Tấm panel EPS cách nhiệt',
    description: 'Xem cấu tạo, quy cách và các ứng dụng vách, trần, mái của dòng panel EPS.',
    href: '/products/panel-eps',
  },
  {
    eyebrow: 'Bài viết',
    title: 'Panel EPS cho kho lạnh, nhà xưởng và phòng sạch',
    description: 'Đọc nhanh các điểm cần đối chiếu khi dùng panel cho nhiều loại khu vực.',
    href: '/posts/tam-cach-nhiet-eps-kho-lanh-nha-xuong-phong-sach',
  },
  {
    eyebrow: 'Bài viết',
    title: 'Panel EPS là gì và dùng ở đâu?',
    description: 'Nắm cấu tạo cơ bản, ưu điểm và giới hạn trước khi chọn vật liệu.',
    href: '/posts/tam-panel-cach-nhiet-eps-la-gi',
  },
  {
    eyebrow: 'Giải pháp',
    title: 'Xem các hướng cấu hình khác',
    description: 'So sánh kho mát, kho lạnh, kho đông và nhà xưởng trong cùng một trang.',
    href: '/solutions',
  },
]
</script>

<template>
  <StaticSeoLanding
    eyebrow="Panel phòng sạch"
    title="Panel phòng sạch cho vách, trần và khu vực kiểm soát"
    description="Thái Thanh cung cấp panel EPS, cửa và phụ kiện để chuẩn bị vật tư cho vách, trần phòng sạch và khu sản xuất. Gửi mặt bằng để được đối chiếu quy cách trước khi đặt hàng."
    hero-image="/images/insulation/eps-panel-step-joint-editorial.jpg"
    hero-image-srcset="/images/insulation/eps-panel-step-joint-editorial-640.webp 640w, /images/insulation/eps-panel-step-joint-editorial-960.webp 960w, /images/insulation/eps-panel-step-joint-editorial.jpg 1254w"
    hero-image-alt="Chi tiết mép ngàm của panel EPS cách nhiệt"
    intro-eyebrow="Vật tư cho không gian cần phân khu rõ"
    intro-title="Bắt đầu từ mặt bằng, không bắt đầu từ lời quảng cáo."
    intro-text="Panel có thể là một phần của hệ vách và trần phòng sạch, nhưng hiệu quả vận hành còn phụ thuộc vào mạch ghép, cửa, điểm xuyên, luồng di chuyển và hệ thống kỹ thuật. Trang này giúp bạn chuẩn bị đúng dữ liệu để hỏi panel; các yêu cầu cấp sạch, áp suất, HVAC và nghiệm thu cần được xác nhận cùng bên thiết kế chuyên môn."
    :features="features"
    selection-title="Chuẩn bị dữ liệu để báo giá đúng hơn"
    selection-description="Một ảnh mặt bằng, kích thước từng vách/trần và vị trí cửa thường giúp trao đổi nhanh hơn nhiều. Nếu chưa có bản vẽ, hãy gửi các con số đang có và ghi rõ phần chưa chắc chắn."
    :checks="checks"
    caution="Panel EPS không tự xác nhận cấp sạch hoặc thay thế hồ sơ thiết kế phòng sạch. Những yêu cầu về cấp sạch, áp suất, HVAC, vật liệu bề mặt và nghiệm thu cần được đơn vị thiết kế/tư vấn chuyên ngành chốt trước khi đặt hàng."
    related-title="Xem đúng nội dung cho đúng giai đoạn."
    related-description="Đọc bài hướng dẫn để hiểu vật liệu, sau đó mở trang sản phẩm và gửi mặt bằng khi bạn đã có kích thước cần hỏi."
    :related-links="relatedLinks"
    contact-title="Bạn đang chuẩn bị vách hoặc trần phòng sạch?"
    contact-description="Gửi mặt bằng, kích thước, vị trí cửa và yêu cầu vận hành. Thái Thanh sẽ giúp bạn lập danh sách panel, cửa và phụ kiện cần đối chiếu."
  />
</template>
