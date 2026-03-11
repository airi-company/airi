export default function DemoPhuQuy() {
  const highlights = [
    { title: "Lặn ngắm san hô", desc: "Nước trong, san hô đa dạng, có thể thuê tàu/ca nô ra Hòn Tranh." },
    { title: "Bãi Nhỏ – Gành Hang", desc: "View vách đá và bãi cát cong, đẹp để chụp ảnh." },
    { title: "Hải đăng Phú Quý", desc: "Ngắm toàn cảnh đảo, hoàng hôn đẹp." },
    { title: "Ẩm thực", desc: "Hải sản tươi (cá, mực, ốc), gỏi cá, lẩu hải sản." },
  ];

  const tips = [
    "Đi tàu cao tốc từ Phan Thiết (khoảng 2,5-3h).",
    "Thuê xe máy trên đảo để di chuyển.",
    "Mang tiền mặt vì cây ATM hạn chế.",
    "Nên đặt vé tàu và phòng trước mùa cao điểm (5-8).",
  ];

  const plan = [
    { day: "Ngày 1", items: ["Tàu cao tốc ra đảo", "Nhận phòng/thuê xe", "Chiều: Bãi Nhỏ – Gành Hang", "Tối: hải sản ở làng chài"] },
    { day: "Ngày 2", items: ["Sáng: Hòn Tranh lặn ngắm san hô", "Trưa: nghỉ ngơi", "Chiều: Hải đăng Phú Quý", "Tối: chợ đêm/ăn uống"] },
    { day: "Ngày 3", items: ["Cà phê ngắm biển", "Mua hải sản khô", "Trở về đất liền"] },
  ];

  return (
    <div className="container-page space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Du lịch đảo Phú Quý</h1>
        <p className="text-slate-600 mt-2">Gợi ý lịch trình, điểm check-in và mẹo đi nhanh.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {highlights.map((h) => (
          <div key={h.title} className="card">
            <div className="text-lg font-semibold">{h.title}</div>
            <div className="text-slate-600">{h.desc}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="font-semibold mb-2">Lịch trình gợi ý</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {plan.map((p) => (
            <div key={p.day} className="border rounded p-3 bg-slate-50">
              <div className="font-semibold">{p.day}</div>
              <ul className="list-disc pl-4 text-sm text-slate-700 space-y-1 mt-1">
                {p.items.map((i) => <li key={i}>{i}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="font-semibold mb-2">Mẹo nhanh</div>
        <ul className="list-disc pl-5 text-slate-700 space-y-1">
          {tips.map((t) => <li key={t}>{t}</li>)}
        </ul>
      </div>

      <div className="card">
        <div className="font-semibold mb-2">Thông tin tàu</div>
        <p className="text-slate-700 text-sm">Tàu cao tốc Phan Thiết ⇄ Phú Quý ~ 2.5-3h. Nên đến bến sớm 60 phút, kiểm tra thời tiết/biển động để tránh hoãn chuyến.</p>
      </div>
    </div>
  );
}
