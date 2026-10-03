export const karateSessions = [
  // ============ TUẦN 1 — NỀN TẢNG ============
  {
    id: 'karate-01',
    name: 'Nền tảng: Stance & Đòn tay',
    subName: 'Fundamentals: Stances & Punches',
    target: 'Chân, hông, tay, vai',
    duration: 3600, // 60 phút
    durationDisplay: '60 phút',
    category: 'Nền tảng',
    week: 1,
    level: 'Beginner',
    type: 'karate',
    icon: 'fa-person',
    videoUrl:
      'https://www.youtube.com/embed/goHP43dv4eg?list=PLIvaauaSTVZuBYH05I4SnyNrqZbYEhIbg&index=1',
    guide:
      'Buổi nền tảng kết hợp tư thế chuẩn (zenkutsu-dachi, kiba-dachi) với các đòn đấm cơ bản (oi-zuki, gyaku-zuki). Đây là nền móng cho toàn bộ lộ trình — tập chậm, chính xác, cảm nhận trọng tâm và hông.',
    exercises: [
      // Phần A — Stance
      { name: 'A1. Front stance (Zenkutsu-dachi)', work: 'Giữ 30–60 giây × 3 hiệp', note: 'Trọng tâm dồn 70% chân trước, lưng thẳng' },
      { name: 'A2. Horse stance (Kiba-dachi)', work: 'Giữ 30–60 giây × 3 hiệp', note: 'Hai chân rộng bằng 2 vai, đầu gối hướng ngoài' },
      { name: 'A3. Di chuyển qua lại', work: '3 hiệp × 10 lần', note: 'Chuyển đổi giữa các tư thế, giữ thăng bằng' },
      // Phần B — Punch
      { name: 'B1. Oi-zuki (đấm tiến)', work: '3 hiệp × 20 cú', note: 'Xoay hông, duỗi thẳng tay, thu nhanh' },
      { name: 'B2. Gyaku-zuki (đấm ngược)', work: '3 hiệp × 20 cú', note: 'Chân đối diện đấm tiến, xoay hông mạnh' },
      { name: 'B3. Chamber tay', work: '2 hiệp × 30 lần', note: 'Rút tay về hông nhanh gọn, khuỷu sát sườn' },
    ],
  },
  {
    id: 'karate-02',
    name: 'Kỹ thuật: Đòn chân & Phòng thủ',
    subName: 'Kicks & Blocks',
    target: 'Đùi, hông, tay, phản xạ',
    duration: 3600,
    durationDisplay: '60 phút',
    category: 'Kỹ thuật',
    week: 1,
    level: 'Beginner',
    type: 'karate',
    videoUrl:
      'https://www.youtube.com/embed/QwXzZf3F7mM?list=PLIvaauaSTVZuBYH05I4SnyNrqZbYEhIbg&index=3',
    guide:
      'Học hai đòn chân nền tảng (mae-geri, yoko-geri) và ba block cơ bản (age-uke, gedan-barai, soto-uke). Kết hợp stance + block để tạo phản xạ phòng thủ tự nhiên.',
    exercises: [
      // Phần A — Kicks
      { name: 'A1. Mae-geri (đá trước)', work: '3 hiệp × 10 cú mỗi chân', note: 'Nâng gối, duỗi thẳng, thu nhanh' },
      { name: 'A2. Yoko-geri (đá ngang)', work: '3 hiệp × 10 cú mỗi chân', note: 'Xoay hông, cạnh bàn chân tiếp xúc' },
      // Phần B — Blocks
      { name: 'B1. High block (Age-uke)', work: '3 hiệp × 15 lần', note: 'Tay trên trán, khuỷu hướng ngoài' },
      { name: 'B2. Low block (Gedan-barai)', work: '3 hiệp × 15 lần', note: 'Quét tay xuống ngang hông' },
      { name: 'B3. Inside block (Soto-uke)', work: '3 hiệp × 15 lần', note: 'Cẳng tay xoay từ ngoài vào trong' },
    ],
  },

  // ============ TUẦN 2 — THỂ LỰC ============
  {
    id: 'karate-03',
    name: 'Cardio & Thể lực',
    subName: 'Cardio & Conditioning',
    target: 'Tim mạch, toàn thân',
    duration: 1800, // 30 phút
    durationDisplay: '30 phút',
    category: 'Thể lực',
    week: 2,
    level: 'Intermediate',
    type: 'hiit',
    videoUrl:
      'https://www.youtube.com/embed/JHkYfZfY9mY?list=PLIvaauaSTVZuBYH05I4SnyNrqZbYEhIbg&index=5',
    guide:
      'Tăng sức bền tim mạch với circuit 5 động tác. Nghỉ ngắn giữa các vòng để giữ nhịp tim ở vùng đốt mỡ.',
    exercises: [
      { name: 'Jumping jacks', work: '30 giây', note: 'Bật nhảy, tay chân mở rộng' },
      { name: 'Burpees', work: '30 giây', note: 'Chống đẩy + nhảy lên' },
      { name: 'Squat thrusts', work: '30 giây', note: 'Từ plank, kéo gối về ngực' },
      { name: 'High knees', work: '30 giây', note: 'Chạy nâng cao đùi' },
      { name: 'Plank', work: '30 giây', note: 'Giữ thẳng lưng, siết bụng' },
    ],
    circuit: { rounds: 3, note: 'Nghỉ 1 phút giữa các vòng' },
  },
  {
    id: 'karate-04',
    name: 'HIIT Karate (Tabata)',
    subName: 'Karate HIIT Tabata',
    target: 'Toàn thân, sức mạnh bùng nổ',
    duration: 1200, // 20 phút
    durationDisplay: '20 phút',
    category: 'HIIT',
    week: 2,
    level: 'Intermediate',
    type: 'hiit',
    videoUrl:
      'https://www.youtube.com/embed/KfXzYfZfY7m?list=PLIvaauaSTVZuBYH05I4SnyNrqZbYEhIbg&index=6',
    guide:
      'Kết hợp đòn tay – đòn chân với chạy tại chỗ. Tỷ lệ 20s tập hết sức + 10s nghỉ, 8 hiệp Tabata. Đây là buổi đốt calo mạnh nhất trong tuần.',
    exercises: [
      { name: 'Đấm + đá trước', work: '20 giây', note: 'Ra đòn nhanh, tối đa' },
      { name: 'Đá ngang + đấm ngược', work: '20 giây', note: 'Kết hợp chân – tay' },
      { name: 'Chạy nâng cao đùi + đấm', work: '20 giây', note: 'Cardio + tay' },
      { name: 'Squat + đấm lên', work: '20 giây', note: 'Sức mạnh thân dưới + vai' },
    ],
    circuit: { rounds: 8, workTime: 20, restTime: 10, note: 'Tabata style' },
  },

  // ============ TUẦN 3 — NÂNG CAO ============
  {
    id: 'karate-05',
    name: 'Phản xạ & Kỹ thuật kết hợp',
    subName: 'Reaction & Combinations',
    target: 'Thần kinh cơ, phối hợp',
    duration: 3600, // 60 phút
    durationDisplay: '60 phút',
    category: 'Nâng cao',
    week: 3,
    level: 'Intermediate',
    type: 'karate',
    videoUrl:
      'https://www.youtube.com/embed/LfXzYfZfY8m?list=PLIvaauaSTVZuBYH05I4SnyNrqZbYEhIbg&index=7',
    guide:
      'Rèn phản xạ (drill phản ứng) và ghép các combo liên hoàn. Đây là buổi quan trọng để chuyển từ đòn đơn lẻ sang chuỗi động tác liên tục.',
    exercises: [
      // Phần A — Reaction
      { name: 'A1. Reaction drill', work: '3 hiệp × 1 phút', note: 'Nghe tín hiệu → ra đòn chính xác' },
      { name: 'A2. Shadow sparring', work: '3 hiệp × 2 phút', note: 'Đánh giả định, nghỉ 30s giữa hiệp' },
      // Phần B — Combinations
      { name: 'B1. Combo 1: Oi-zuki + Mae-geri', work: '3 hiệp × 10 combo', note: 'Đấm tiến → đá trước' },
      { name: 'B2. Combo 2: Gyaku-zuki + Yoko-geri', work: '3 hiệp × 10 combo', note: 'Đấm ngược → đá ngang' },
      { name: 'B3. Combo 3: Block + Punch + Kick', work: '3 hiệp × 10 combo', note: 'Chặn → đấm → đá' },
    ],
  },
  {
    id: 'karate-06',
    name: 'Thở & Tập trung',
    subName: 'Breathing & Focus',
    target: 'Hô hấp, tinh thần',
    duration: 1800, // 30 phút
    durationDisplay: '30 phút',
    category: 'Thiền & Thở',
    week: 3,
    level: 'All levels',
    type: 'karate',
    videoUrl:
      'https://www.youtube.com/embed/NpXzYfZfY0m?list=PLIvaauaSTVZuBYH05I4SnyNrqZbYEhIbg&index=9',
    guide:
      'Buổi nhẹ nhàng giúp cơ thể hồi phục sau tuần tập nặng. Học kỹ thuật thở bụng (ibuki) và thiền ngắn để tăng tập trung khi ra đòn.',
    exercises: [
      { name: 'Thở bụng cơ bản', work: '5 hiệp × 10 nhịp', note: 'Hít 4s – giữ 4s – thở 6s' },
      { name: 'Thở kết hợp đòn tay', work: '5 hiệp × 10 lần', note: 'Thở ra mạnh khi đấm (kiai)' },
      { name: 'Thiền tĩnh', work: '2–3 phút', note: 'Ngồi yên, tập trung hơi thở' },
    ],
  },

  // ============ TUẦN 4 — TỔNG HỢP ============
  {
    id: 'karate-07',
    name: 'Ôn tập & Sparring nhẹ',
    subName: 'Review & Light Sparring',
    target: 'Toàn thân, tổng hợp',
    duration: 3600, // 60 phút
    durationDisplay: '60 phút',
    category: 'Tổng hợp',
    week: 4,
    level: 'Intermediate',
    type: 'karate',
    videoUrl:
      'https://www.youtube.com/embed/OpXzYfZfY1m?list=PLIvaauaSTVZuBYH05I4SnyNrqZbYEhIbg&index=10',
    guide:
      'Buổi cuối tổng hợp toàn bộ kỹ thuật: đấm, đá, chặn, combo. Shadow sparring ở cường độ cao hơn. Kết thúc bằng stretching toàn thân để cơ thể phục hồi.',
    exercises: [
      { name: 'Ôn kỹ thuật', work: '10 phút', note: 'Đấm, đá, chặn, tư thế' },
      { name: 'Shadow sparring', work: '3 hiệp × 2 phút', note: 'Nghỉ 30s giữa hiệp' },
      { name: 'Stretching', work: '10 phút', note: 'Giãn cơ toàn thân' },
    ],
  },
];

export const karateCategories = [
  'Nền tảng',
  'Kỹ thuật',
  'Thể lực',
  'HIIT',
  'Nâng cao',
  'Thiền & Thở',
  'Tổng hợp',
];