<script setup lang="ts">
const { content } = useSiteContent()
const companyContact = computed(() => content.value.companyContact)

usePageSeo({
  title: 'Chính sách quyền riêng tư',
  description: 'Thông tin về dữ liệu được thu thập qua website Thái Thanh Panel, mục đích sử dụng, thời gian lưu giữ và quyền của người liên hệ.',
  path: '/privacy',
  breadcrumbs: [
    { name: 'Chính sách quyền riêng tư', path: '/privacy' },
  ],
})
</script>

<template>
  <div>
    <StaticPageHero
      eyebrow="Quyền riêng tư"
      title="Thông tin của bạn được dùng đúng mục đích."
      description="Chính sách này giải thích dữ liệu được thu thập khi bạn gửi yêu cầu tư vấn, cách Thái Thanh xử lý dữ liệu và cách bạn thực hiện các quyền của mình."
      primary-label="Gửi yêu cầu tư vấn"
      primary-href="/contact#quick-contact-form"
      secondary-label="Gọi hotline"
      :secondary-href="companyContact.phoneHref"
    />

    <section class="section bg-white">
      <div class="container-site grid gap-12 lg:grid-cols-[minmax(0,0.66fr)_minmax(0,1.34fr)] lg:gap-20">
        <aside class="lg:sticky lg:top-28 lg:self-start">
          <p class="section-kicker">Chính sách quyền riêng tư</p>
          <p class="mt-5 max-w-sm text-sm leading-7 text-neutral-600">
            Áp dụng cho thông tin được gửi qua biểu mẫu liên hệ trên website Thái Thanh Panel.
          </p>
          <p class="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
            Cập nhật lần cuối: 14/07/2026
          </p>
        </aside>

        <article class="privacy-content max-w-3xl">
          <section aria-labelledby="privacy-data">
            <h2 id="privacy-data">1. Dữ liệu được thu thập</h2>
            <p>
              Khi bạn gửi biểu mẫu liên hệ, Thái Thanh thu thập họ tên, số điện thoại, nội dung yêu cầu và email nếu bạn tự nguyện cung cấp. Nội dung yêu cầu có thể bao gồm thông tin về công trình, kích thước, vị trí hoặc nhu cầu sản phẩm do bạn nhập.
            </p>
            <p>
              Website không yêu cầu bạn cung cấp mật khẩu, thông tin tài khoản ngân hàng hoặc dữ liệu thanh toán qua biểu mẫu này.
            </p>
          </section>

          <section aria-labelledby="privacy-purpose">
            <h2 id="privacy-purpose">2. Mục đích sử dụng</h2>
            <p>Thông tin được sử dụng để:</p>
            <ul>
              <li>tiếp nhận và phản hồi yêu cầu tư vấn;</li>
              <li>liên hệ lại qua điện thoại hoặc email theo thông tin bạn cung cấp;</li>
              <li>chuẩn bị nội dung trao đổi, báo giá hoặc phương án phù hợp với nhu cầu;</li>
              <li>ngăn chặn thư rác, gian lận và bảo vệ hoạt động của website.</li>
            </ul>
            <p>Thái Thanh không bán thông tin liên hệ của bạn cho bên thứ ba.</p>
          </section>

          <section aria-labelledby="privacy-processor">
            <h2 id="privacy-processor">3. Web3Forms là bên xử lý biểu mẫu</h2>
            <p>
              Biểu mẫu sử dụng dịch vụ Web3Forms để nhận dữ liệu và chuyển tiếp yêu cầu đến hộp thư của Thái Thanh. Vì vậy, dữ liệu bạn gửi qua biểu mẫu được truyền đến Web3Forms với vai trò nhà cung cấp xử lý biểu mẫu trước khi được chuyển tiếp cho Thái Thanh.
            </p>
            <p>
              Thái Thanh chỉ gửi các trường hiển thị trong biểu mẫu và thông tin kỹ thuật cần thiết để xác định nguồn gửi; không chủ động gửi dữ liệu thanh toán hoặc mật khẩu đến dịch vụ này.
            </p>
          </section>

          <section aria-labelledby="privacy-retention">
            <h2 id="privacy-retention">4. Thời gian lưu giữ</h2>
            <p>
              Thông tin phục vụ yêu cầu tư vấn được Thái Thanh lưu tối đa 12 tháng kể từ lần trao đổi gần nhất. Dữ liệu có thể được giữ lâu hơn khi cần thực hiện hợp đồng, giải quyết tranh chấp hoặc tuân thủ nghĩa vụ pháp lý; khi không còn cần thiết, dữ liệu sẽ được xóa hoặc ẩn danh trong phạm vi hệ thống Thái Thanh kiểm soát.
            </p>
            <p>
              Thời gian Web3Forms lưu dữ liệu trong hệ thống của họ được điều chỉnh theo chính sách và cấu hình dịch vụ của nhà cung cấp đó.
            </p>
          </section>

          <section aria-labelledby="privacy-rights">
            <h2 id="privacy-rights">5. Quyền của bạn</h2>
            <p>Bạn có thể liên hệ để:</p>
            <ul>
              <li>hỏi Thái Thanh đang lưu thông tin nào về yêu cầu của bạn;</li>
              <li>đề nghị sửa thông tin chưa chính xác;</li>
              <li>yêu cầu xóa dữ liệu trong phạm vi pháp luật cho phép;</li>
              <li>rút lại sự đồng ý cho việc liên hệ trong tương lai.</li>
            </ul>
            <p>
              Việc rút lại đồng ý không làm ảnh hưởng đến hoạt động xử lý đã thực hiện hợp lệ trước thời điểm rút lại. Thái Thanh có thể cần xác minh người yêu cầu trước khi cung cấp, sửa hoặc xóa dữ liệu.
            </p>
          </section>

          <section aria-labelledby="privacy-contact" class="rounded-2xl border border-[#ddd6cc] bg-[#f4f1eb] p-6 sm:p-8">
            <h2 id="privacy-contact" class="mt-0">6. Liên hệ về dữ liệu cá nhân</h2>
            <p>
              Gửi yêu cầu truy cập, sửa, xóa hoặc rút lại đồng ý qua một trong các kênh sau. Vui lòng nêu số điện thoại hoặc email đã dùng khi gửi biểu mẫu để Thái Thanh có thể đối chiếu.
            </p>
            <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a :href="companyContact.phoneHref" class="btn-primary">
                {{ companyContact.phoneDisplay }}
              </a>
              <a
                v-if="companyContact.emailHref && companyContact.emailDisplay"
                :href="companyContact.emailHref"
                class="btn border border-[#cfc6bb] bg-white text-panel-black hover:border-panel-black hover:bg-panel-black hover:text-white"
              >
                {{ companyContact.emailDisplay }}
              </a>
            </div>
          </section>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.privacy-content {
  color: #525752;
  font-size: 1rem;
  line-height: 1.9;
}

.privacy-content > section + section {
  margin-top: 3rem;
  padding-top: 3rem;
  border-top: 1px solid #e4ded5;
}

.privacy-content h2 {
  margin-bottom: 1rem;
  color: #1d211e;
  font-size: clamp(1.45rem, 2vw, 1.85rem);
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1.25;
}

.privacy-content p + p,
.privacy-content ul + p {
  margin-top: 1rem;
}

.privacy-content ul {
  margin-top: 1rem;
  padding-left: 1.25rem;
  list-style: disc;
}

.privacy-content li + li {
  margin-top: 0.5rem;
}
</style>
