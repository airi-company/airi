export default function PhuQuyPage() {
  const highlights = [
    "Biển xanh trong, hoang sơ",
    "Hải sản tươi, giá hợp lý",
    "Người dân thân thiện",
    "Nhiều điểm check-in đẹp",
  ];

  const destinations = [
    {
      title: "Núi Cao Cát",
      desc: "View toàn cảnh đảo, hoàng hôn đẹp.",
      img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Chùa Linh Sơn",
      desc: "Chùa trên đồi, không gian tĩnh lặng.",
      img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Hải đăng Phú Quý",
      desc: "Ngắm biển từ trên cao, đường lên hơi dốc.",
      img: "https://images.unsplash.com/photo-1500534314211-4ea3d84c6b89?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Bãi Nhỏ – Gành Hang",
      desc: "Bãi cong, nước trong, vách đá độc đáo.",
      img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Hòn Tranh",
      desc: "Ca nô, lặn ngắm san hô, nước trong vắt.",
      img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80",
    },
  ];

  const activities = [
    "Lặn biển ngắm san hô",
    "Câu cá",
    "Khám phá đảo bằng xe máy",
    "Chụp ảnh hoàng hôn",
    "Thưởng thức hải sản",
  ];

  const foods = [
    { name: "Cua Huỳnh Đế", desc: "Thịt ngọt, hấp hoặc nướng." },
    { name: "Tôm hùm", desc: "Nướng mọi hoặc cháo tôm." },
    { name: "Mực một nắng", desc: "Nướng, chấm tương ớt hoặc mắm me." },
    { name: "Cá bò hòm", desc: "Nướng than, thịt chắc, ngọt." },
  ];

  const gallery = [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1455659817273-f96807779a8a?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80",
  ];

  return (
    <div className="bg-slate-50 text-slate-900">
      <section className="relative min-h-[60vh] flex items-center justify-center text-center text-white overflow-hidden">
        <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80" alt="Phu Quy" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
        <div className="relative max-w-3xl px-4 space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-200">Hidden Paradise</p>
          <h1 className="text-4xl sm:text-5xl font-bold">Khám Phá Đảo Phú Quý</h1>
          <p className="text-lg text-cyan-100">Biển xanh trong, hải sản tươi, cảnh đẹp hoang sơ.</p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-12 space-y-10">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card bg-white">
            <h2 className="text-xl font-semibold mb-2">Giới thiệu</h2>
            <p className="text-slate-600">Phú Quý là hòn đảo nhỏ ngoài khơi Bình Thuận, nổi tiếng với biển trong xanh, người dân thân thiện và ẩm thực tươi ngon.</p>
          </div>
          <div className="card bg-white">
            <h3 className="font-semibold mb-2">Điểm nổi bật</h3>
            <ul className="list-disc pl-5 text-slate-600 space-y-1">
              {highlights.map((h) => <li key={h}>{h}</li>)}
            </ul>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-xl font-semibold">Điểm đến nổi bật</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {destinations.map((d) => (
              <div key={d.title} className="card bg-white hover:-translate-y-1 hover:shadow-lg transition">
                <img src={d.img} className="rounded-lg mb-3 h-44 w-full object-cover" alt={d.title} />
                <h3 className="font-semibold">{d.title}</h3>
                <p className="text-sm text-slate-600">{d.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Hoạt động</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-slate-700">
            {activities.map((a) => (
              <div key={a} className="card bg-white flex items-center gap-3">
                <span className="text-cyan-600">•</span>
                <span>{a}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Ẩm thực</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-slate-700">
            {foods.map((f) => (
              <div key={f.name} className="card bg-white hover:shadow-lg transition">
                <div className="font-semibold">{f.name}</div>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Cẩm nang</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700">
            <div className="card bg-white">
              <h3 className="font-semibold mb-1">Cách đi</h3>
              <p>Tàu cao tốc từ Phan Thiết (2.5-3h). Đặt vé trước, đến bến sớm 60 phút.</p>
            </div>
            <div className="card bg-white">
              <h3 className="font-semibold mb-1">Thời gian đẹp</h3>
              <p>Tháng 12 - 6: biển êm, trời nắng. Tránh bão, biển động.</p>
            </div>
            <div className="card bg-white">
              <h3 className="font-semibold mb-1">Di chuyển trên đảo</h3>
              <p>Thuê xe máy (100-150k/ngày), đường dễ đi.</p>
            </div>
            <div className="card bg-white">
              <h3 className="font-semibold mb-1">Gợi ý lịch trình</h3>
              <p>Ngày 1: Bãi Nhỏ – Gành Hang, hải sản chiều.</p>
              <p>Ngày 2: Hòn Tranh lặn san hô, chiều Hải đăng.</p>
              <p>Ngày 3: Cà phê ngắm biển, mua hải sản khô.</p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Thư viện ảnh</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {gallery.map((g, i) => (
              <img key={i} className="rounded-lg shadow hover:opacity-90 transition h-32 w-full object-cover" src={g} alt="gallery" />
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Liên hệ</h2>
          <div className="card bg-white">
            <form className="space-y-3 text-sm">
              <input className="w-full border rounded px-3 py-2" placeholder="Tên của bạn" required />
              <input className="w-full border rounded px-3 py-2" placeholder="Email" type="email" required />
              <textarea className="w-full border rounded px-3 py-2" placeholder="Lời nhắn" rows={3}></textarea>
              <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 rounded">Gửi</button>
            </form>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-slate-200 py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between gap-4 text-sm">
          <div>© 2026 Phu Quy Travel.</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-cyan-300">Facebook</a>
            <a href="#" className="hover:text-cyan-300">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
