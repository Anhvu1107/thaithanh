<script setup lang="ts">
usePageSeo({
  title: 'Panel kho lạnh cách nhiệt theo quy cách',
  description: 'Panel EPS cách nhiệt cho kho mát, kho lạnh và kho đông; tư vấn độ dày 50–200 mm, cửa Inox 304 và phụ kiện theo kích thước công trình.',
  path: '/solutions/panel-kho-lanh',
  image: '/images/insulation/cold-room-editorial-960.webp',
  imageAlt: 'Hệ panel cách nhiệt trong kho lạnh',
  breadcrumbs: [
    { name: 'Giải pháp', path: '/solutions' },
    { name: 'Panel kho lạnh', path: '/solutions/panel-kho-lanh' },
  ],
  catalogItem: {
    category: 'Panel kho lạnh',
    applications: ['Kho mát', 'Kho lạnh', 'Kho đông'],
    specifications: [
      { label: 'Độ dày panel', value: '50–200 mm theo nhu cầu đối chiếu ban đầu' },
      { label: 'Cửa đồng bộ', value: 'Cửa kho lạnh Inox 304 theo ô chờ' },
      { label: 'Phụ kiện', value: 'Nẹp U, V và vật tư hoàn thiện hệ panel' },
    ],
  },
})

const features = [
  {
    title: 'Kho mát',
    description: 'Phù hợp bước chuẩn bị ban đầu cho khu lưu trữ cần giữ mát, với cấu hình được chốt theo nhiệt độ và tần suất mở cửa thực tế.',
    points: ['Đối chiếu độ dày panel', 'Xác định vị trí cửa và ô chờ', 'Gửi kích thước để nhận báo giá'],
  },
  {
    title: 'Kho lạnh',
    description: 'Tách rõ panel, cửa và phụ kiện để dễ kiểm tra từng hạng mục trước khi đặt mua hoặc triển khai lắp ghép.',
    points: ['Panel EPS 50–200 mm', 'Cửa bản lề hoặc cửa trượt', 'Nẹp và vật tư hoàn thiện'],
  },
  {
    title: 'Kho đông',
    description: 'Cấu hình tham khảo cần được kiểm tra kỹ hơn theo nhiệt độ vận hành, hàng hóa, nền, trần và vị trí thiết bị.',
    points: ['Không chốt chỉ theo một thông số', 'Xem xét mạch ghép và cửa', 'Xác nhận lại trước khi cung cấp'],
  },
]

const checks = [
  { label: 'Độ dày tham khảo', value: '50–200 mm', note: 'Chọn theo điều kiện vận hành và cấu hình thực tế.' },
  { label: 'Loại cửa', value: 'Bản lề hoặc cửa trượt', note: 'Theo kích thước ô chờ và cách sử dụng.' },
  { label: 'Bề mặt cửa', value: 'Inox 304', note: 'Quy cách cuối cùng xác nhận theo yêu cầu.' },
  { label: 'Phụ kiện hệ', value: 'Nẹp U, V và vật tư hoàn thiện', note: 'Tách riêng để kiểm đủ số lượng.' },
  { label: 'Thông tin cần gửi', value: 'Kích thước, nhiệt độ, hàng hóa', note: 'Kèm số lượng và nơi giao nếu có.' },
  { label: 'Phạm vi hỗ trợ', value: 'Tư vấn và báo giá toàn quốc', note: 'Tiến độ giao được xác nhận theo yêu cầu.' },
]

const relatedLinks = [
  {
    eyebrow: 'Sản phẩm',
    title: 'Tấm panel EPS cách nhiệt',
    description: 'Xem cấu tạo, độ dày, ứng dụng và cách chuẩn bị thông tin trước khi gửi yêu cầu.',
    href: '/products/panel-eps',
  },
  {
    eyebrow: 'Sản phẩm',
    title: 'Cửa kho lạnh Inox 304',
    description: 'Chọn cửa bản lề, cửa trượt hoặc kiểu cửa theo ô chờ của công trình.',
    href: '/products/cua-kho-lanh',
  },
  {
    eyebrow: 'Hướng dẫn',
    title: 'Chọn độ dày panel kho lạnh',
    description: 'Đối chiếu nhiệt độ, hàng hóa, kích thước và tần suất sử dụng trước khi chốt.',
    href: '/posts/chon-do-day-panel-kho-lanh',
  },
  {
    eyebrow: 'Hướng dẫn',
    title: 'Chuẩn bị thông tin kho lạnh',
    description: 'Danh sách dữ liệu giúp việc trao đổi quy cách và báo giá rõ ràng hơn.',
    href: '/posts/chuan-bi-thong-tin-kho-lanh',
  },
]
</script>

<template>
  <StaticSeoLanding
    eyebrow="Panel kho lạnh"
    title="Panel kho lạnh: chọn đúng độ dày, cửa và phụ kiện"
    description="Từ kho mát đến kho đông, Thái Thanh cung cấp panel EPS, cửa Inox 304 và phụ kiện theo quy cách cần đối chiếu. Gửi kích thước để nhận tư vấn và báo giá rõ ràng."
    hero-image="/images/insulation/cold-room-editorial.jpg"
    hero-image-srcset="/images/insulation/cold-room-editorial-640.webp 640w, /images/insulation/cold-room-editorial-960.webp 960w, /images/insulation/cold-room-editorial.jpg 1254w"
    hero-image-alt="Kho lạnh sử dụng hệ panel cách nhiệt"
    intro-eyebrow="Giải pháp theo điều kiện vận hành"
    intro-title="Đừng chọn panel kho lạnh chỉ bằng một con số."
    intro-text="Độ dày, loại cửa, mạch ghép, nền, trần và phụ kiện cần được nhìn như một hệ hoàn chỉnh. Trang này giúp bạn sàng lọc nhanh vật tư cần hỏi; cấu hình cuối cùng sẽ được xác nhận lại theo nhiệt độ, mặt bằng, hàng hóa và cách sử dụng thực tế."
    :features="features"
    selection-title="Thông tin nào nên gửi trước?"
    selection-description="Chỉ cần có các dữ liệu cơ bản dưới đây, Thái Thanh có thể đối chiếu nhóm sản phẩm, gợi ý quy cách ban đầu và phản hồi phần còn thiếu trước khi báo giá."
    :checks="checks"
    caution="Các độ dày và cấu hình trên là thông tin tham khảo ban đầu, không thay thế tính toán tải nhiệt hoặc hồ sơ kỹ thuật của công trình. Hãy xác nhận lại quy cách trước khi đặt hàng."
    related-title="Đi từ nhu cầu đến đúng hạng mục."
    related-description="Xem sản phẩm và bài hướng dẫn liên quan để chuẩn bị yêu cầu đầy đủ hơn, tránh phải hỏi lại nhiều lần."
    :related-links="relatedLinks"
    contact-title="Bạn đang chuẩn bị một kho lạnh cụ thể?"
    contact-description="Gửi kích thước, nhiệt độ, loại hàng, số lượng và nơi giao. Thái Thanh sẽ trao đổi quy cách panel, cửa và phụ kiện phù hợp để bạn dễ chốt đơn."
  />
</template>
