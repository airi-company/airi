"use client";
import { useEffect } from "react";

const destinations = [
  {
    title: "Núi Cao Cát",
    desc: "Đỉnh núi với tượng Phật, view toàn cảnh đảo và hoàng hôn đẹp.",
    img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Chùa Linh Sơn",
    desc: "Chùa trên đồi, không gian tĩnh lặng, gió biển mát.",
    img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Hải đăng Phú Quý",
    desc: "Điểm ngắm biển từ trên cao, đường lên hơi dốc nhưng đáng giá.",
    img: "https://images.unsplash.com/photo-1500534314211-4ea3d84c6b89?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Bãi Nhỏ – Gành Hang",
    desc: "Bãi cong, nước trong, vách đá độc đáo, chụp ảnh rất đẹp.",
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
  {
    name: "Cua Huỳnh Đế",
    desc: "Thịt ngọt, hấp hoặc nướng.",
    img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Tôm hùm",
    desc: "Nướng mọi hoặc cháo tôm.",
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Mực một nắng",
    desc: "Nướng, chấm tương ớt hoặc mắm me.",
    img: "https://images.unsplash.com/photo-1455612693675-112974d4880b?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Cá bò hòm",
    desc: "Nướng than, thịt chắc, ngọt.",
    img: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=80",
  },
];

const gallery = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1455659817273-f96807779a8a?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80",
];

export default function DemoPhuQuy() {
  useEffect(() => {
    const handler = () => {
      const reveals = document.querySelectorAll<HTMLElement>(".reveal");
      const trigger = window.innerHeight * 0.85;
      reveals.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < trigger) el.classList.add("opacity-100", "translate-y-0");
      });
    };
    window.addEventListener("scroll", handler);
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="bg-[radial-gradient(circle_at_10%_20%,#0ea5e9_0,#0ea5e9_15%,#0f172a_50%,#0b1222_100%)] text-slate-50">
      <div className="min-h-screen relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80"
          alt="Phu Quy"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-slate-900"></div>
        <div className="relative max-w-6xl mx-auto px-4 pt-28 pb-20 text-center space-y-6">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-200">Hidden Paradise</p>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">Khám Phá Đảo Phú Quý</h1>
          <p className="text-lg text-cyan-100">Biển xanh trong, hải sản tươi, người dân thân thiện và cảnh đẹp hoang sơ.</p>
          <a href="#about" className="inline-block bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg">Khám phá ngay</a>
        </div>
      </div>

      <div className="bg-slate-50 text-slate-900">
        {/* About */}
        <section id="about" className="max-w-6xl mx-auto px-4 py-14 space-y-6">
          <div className="gradient-header bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold">Giới thiệu</h2>
            <p className="text-sm opacity-90">Phú Quý - hòn đảo nhỏ ngoài khơi Bình Thuận, thiên đường biển trong xanh và ẩm thực tươi ngon.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card bg-white/90">
              <h3 className="font-semibold mb-2">Điểm nổi bật</h3>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                <li>Biển xanh trong</li>
                <li>Hải sản tươi sống</li>
                <li>Người dân thân thiện</li>
                <li>Cảnh đẹp hoang sơ</li>
              </ul>
            </div>
            <div className="card bg-white/90">
              <h3 className="font-semibold mb-2">Vì sao nên đi?</h3>
              <p className="text-slate-700">Phù hợp cho chuyến nghỉ dưỡng 2-3 ngày, khám phá điểm check-in còn hoang sơ, thưởng thức hải sản giá hợp lý.</p>
            </div>
          </div>
        </section>

        {/* Destinations */}
        <section id="destinations" className="max-w-6xl mx-auto px-4 py-14 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Điểm đến nổi bật</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {destinations.map((d) => (
              <div key={d.title} className="card hover:-translate-y-1 hover:shadow-xl transition bg-white">
                <img className="rounded-lg mb-3 h-44 w-full object-cover" src={d.img} alt={d.title} />
                <h3 className="font-semibold">{d.title}</h3>
                <p className="text-sm text-slate-600">{d.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Activities */}
        <section id="activities" className="max-w-6xl mx-auto px-4 py-14 space-y-6">
          <h2 className="text-2xl font-bold">Hoạt động</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-slate-700">
            {activities.map((a) => (
              <div key={a} className="card bg-white flex items-center gap-3">
                <span className="text-cyan-600">•</span>
                <span>{a}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Food */}
        <section id="food" className="max-w-6xl mx-auto px-4 py-14 space-y-6">
          <h2 className="text-2xl font-bold">Ẩm thực</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-slate-700">
            {foods.map((f) => (
              <div key={f.name} className="card bg-white hover:shadow-lg transition">
                <img src={f.img} className="rounded-lg mb-2 h-32 w-full object-cover" alt={f.name} />
                <div className="font-semibold">{f.name}</div>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Travel Guide */}
        <section id="guide" className="max-w-6xl mx-auto px-4 py-14 space-y-6">
          <h2 className="text-2xl font-bold">Cẩm nang du lịch</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700">
            <div className="card bg-white">
              <h3 className="font-semibold mb-2">Cách đi</h3>
              <p>Tàu cao tốc từ Phan Thiết (2.5-3h). Nên đặt vé trước, đến bến sớm 60 phút.</p>
            </div>
            <div className="card bg-white">
              <h3 className="font-semibold mb-2">Thời gian đẹp</h3>
              <p>Tháng 12 - 6: biển êm, trời nắng. Tránh bão, biển động.</p>
            </div>
            <div className="card bg-white">
              <h3 className="font-semibold mb-2">Di chuyển trên đảo</h3>
              <p>Thuê xe máy (100-150k/ngày), đổ xăng sẵn, đường dễ đi.</p>
            </div>
            <div className="card bg-white">
              <h3 className="font-semibold mb-2">Gợi ý lịch trình</h3>
              <p>Ngày 1: Bãi Nhỏ – Gành Hang, hải sản chiều.</p>
              <p>Ngày 2: Hòn Tranh lặn san hô, chiều Hải đăng.</p>
              <p>Ngày 3: Cà phê ngắm biển, mua hải sản khô, về lại đất liền.</p>
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section id="gallery" className="max-w-6xl mx-auto px-4 py-14 space-y-6">
          <h2 className="text-2xl font-bold">Thư viện ảnh</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {gallery.map((g, i) => (
              <img key={i} className="rounded-lg shadow hover:opacity-90 transition h-32 w-full object-cover" src={g} alt="gallery" />
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="max-w-4xl mx-auto px-4 py-14 space-y-4">
          <div className="card bg-white">
            <h2 className="text-2xl font-bold mb-3">Liên hệ / Đặt tour</h2>
            <form className="space-y-3">
              <input type="text" placeholder="Tên của bạn" className="w-full border border-slate-200 rounded px-3 py-2" required />
              <input type="email" placeholder="Email" className="w-full border border-slate-200 rounded px-3 py-2" required />
              <textarea placeholder="Lời nhắn" className="w-full border border-slate-200 rounded px-3 py-2" rows={4}></textarea>
              <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 rounded">Gửi</button>
            </form>
          </div>
        </section>
      </div>

      <footer className="bg-slate-900 text-slate-200 py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between gap-4 text-sm">
          <div>© 2026 Phu Quy Travel. All rights reserved.</div>
          <div className="flex gap-4">
            <a href="#about" className="hover:text-cyan-300">Giới thiệu</a>
            <a href="#destinations" className="hover:text-cyan-300">Điểm đến</a>
            <a href="#contact" className="hover:text-cyan-300">Liên hệ</a>
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-cyan-300">Facebook</a>
            <a href="#" className="hover:text-cyan-300">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
