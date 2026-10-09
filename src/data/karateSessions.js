export const karateSessions = [
  // ============ TUẦN 1: NỀN TẢNG (KIHON) ============
  {
    id: 'kt-01',
    name: 'Tấn pháp Vững chắc (Stances)',
    subName: 'Basic Stance Drills',
    target: 'Chân, hông, sự vững chãi, thăng bằng tĩnh',
    duration: 1800,
    durationDisplay: '30 phút',
    category: 'Nền tảng',
    week: 1,
    level: 'Beginner',
    type: 'karate',
    icon: 'fa-person-walking',
    equipment: 'Thảm tập',
    source: 'Karate Training',
    guide:
      '5p Khởi động + 25p tập theo bài drill tấn pháp. Video đã bao gồm phần khởi động hoặc giãn cơ nếu cần.',
    exercises: [
      {
        name: 'Basic Stance Drills (Chính)',
        work: '25 phút',
        note:
          'Tập theo video, chú ý giữ trọng tâm và độ rộng của tấn trong 25 phút đầu.',
        videoUrl: 'https://www.youtube.com/watch?v=UDG2zjR7Bmk',
      },
    ],
  },

  {
    id: 'kt-02',
    name: 'Kỹ thuật Đấm (Punches)',
    subName: 'Reverse Punch Drills',
    target: 'Vai, lõi, tốc độ đấm, lực xoay hông',
    duration: 1800,
    durationDisplay: '30 phút',
    category: 'Nền tảng',
    week: 1,
    level: 'Beginner',
    type: 'karate',
    icon: 'fa-hand-fist',
    equipment: 'Không',
    source: 'Karate Training',
    guide:
      '5p khởi động vai + 25p tập theo bài phối hợp đòn + thả lỏng.',
    exercises: [
      {
        name: 'Reverse Punch Drills (Chính)',
        work: '25 phút',
        note:
          'Tập trung vào kỹ thuật Gyaku-zuki, thu tay và phối hợp xoay hông.',
        videoUrl: 'https://www.youtube.com/watch?v=ZyReS5l3G5M',
      },
    ],
  },

  // ============ TUẦN 2: TẤN CÔNG & PHÒNG THỦ ============
  {
    id: 'kt-03',
    name: 'Kỹ thuật Đòn chân (Kicks)',
    subName: 'Kicking Drills',
    target: 'Đùi trước, hông, thăng bằng, lực bật',
    duration: 1800,
    durationDisplay: '30 phút',
    category: 'Kỹ thuật',
    week: 2,
    level: 'Beginner',
    type: 'karate',
    icon: 'fa-shoe-prints',
    equipment: 'Ghế/tường để giữ thăng bằng (nếu cần)',
    source: 'Karate Training',
    guide:
      '5p khởi động + 20p tập theo bài đòn chân + 5p giãn cơ.',
    exercises: [
      {
        name: 'Kicking Drills (Chính)',
        work: '20 phút',
        note:
          'Tập trung vào kỹ thuật nâng gối, thu chân và giữ thăng bằng khi thực hiện đòn đá.',
        videoUrl: 'https://www.youtube.com/watch?v=stlo5Ao3Cq4',
      },
      {
        name: 'Giãn cơ đùi sau & bắp chân',
        work: '5 phút',
        note:
          'Giãn nhẹ đùi sau và bắp chân, không ép khớp hoặc cố vượt quá giới hạn cơ thể.',
        videoUrl: 'https://www.youtube.com/watch?v=TuB6QWP7gLI',
      },
    ],
  },

  {
    id: 'kt-04',
    name: 'Nhập môn Kata Heian Shodan',
    subName: 'Basic Kata Training',
    target: 'Nhịp điệu, hơi thở, trí nhớ vận động',
    duration: 1800,
    durationDisplay: '30 phút',
    category: 'Nâng cao',
    week: 2,
    level: 'Intermediate',
    type: 'karate',
    icon: 'fa-wind',
    equipment: 'Không',
    source: 'Karate Training',
    guide:
      '5p thiền/Mokuso + 20p tập kỹ thuật cơ bản và chuỗi động tác + 5p thư giãn.',
    exercises: [
      {
        name: 'Basic Kata Training (Chính)',
        work: '20 phút',
        note:
          'Ôn kỹ thuật Kihon trước khi ghép chuỗi động tác. Chú ý hướng di chuyển, nhịp và tư thế.',
        videoUrl: 'https://www.youtube.com/watch?v=UDG2zjR7Bmk',
      },
      {
        name: 'Thiền tĩnh (Mokuso) kết thúc',
        work: '5 phút',
        note:
          'Nhắm mắt, tập trung vào hơi thở và thả lỏng cơ bắp sau buổi tập.',
        videoUrl: 'https://www.youtube.com/watch?v=6pOlcZkj_68',
      },
    ],
  },

  // ============ TUẦN 3: THỂ LỰC & HIIT ============
  {
    id: 'kt-05',
    name: 'Karate HIIT & Đốt mỡ',
    subName: '15min HIIT Class',
    target: 'Tim mạch, sức bền, tốc độ',
    duration: 1800,
    durationDisplay: '30 phút',
    category: 'HIIT',
    week: 3,
    level: 'Intermediate',
    type: 'hiit',
    icon: 'fa-heart-pulse',
    equipment: 'Thảm tập',
    source: 'Karate Training',
    guide:
      '5p khởi động + 15p tập HIIT + 8p Kihon combinations + 2p hạ nhiệt.',
    exercises: [
      {
        name: 'Karate HIIT (Chính)',
        work: '15 phút',
        note:
          'Tập theo khả năng, ưu tiên kỹ thuật chính xác và giảm tốc độ khi nhịp tim quá cao.',
        videoUrl: 'https://www.youtube.com/watch?v=qey5SM0i0jc',
      },
      {
        name: 'Karate Kihon Combinations',
        work: '8 phút',
        note:
          'Thực hiện các tổ hợp đòn ở tốc độ vừa phải sau phần HIIT.',
        videoUrl: 'https://www.youtube.com/watch?v=ZyReS5l3G5M',
      },
      {
        name: 'Hạ nhiệt',
        work: '2 phút',
        note:
          'Đi bộ nhẹ tại chỗ và hít thở sâu để điều hòa nhịp tim.',
        videoUrl: 'https://www.youtube.com/watch?v=TuB6QWP7gLI',
      },
    ],
  },

  // ============ TUẦN 4: ỨNG DỤNG & CHIẾN ĐẤU ============
  {
    id: 'kt-06',
    name: 'Kỹ thuật Chiến đấu (Kumite)',
    subName: 'Movement & Hip Rotation Drills',
    target: 'Phản xạ, khoảng cách (Maai), phối hợp',
    duration: 1800,
    durationDisplay: '30 phút',
    category: 'Tổng hợp',
    week: 4,
    level: 'Intermediate',
    type: 'karate',
    icon: 'fa-eye',
    equipment: 'Găng tay mục tiêu (nếu có)',
    source: 'Karate Training',
    guide:
      '5p khởi động + 15p tập xoay hông và di chuyển + 8p phối hợp đòn + 2p hạ nhiệt.',
    exercises: [
      {
        name: 'Hip Rotation Drills (Chính)',
        work: '15 phút',
        note:
          'Tập trung vào xoay hông, chuyển trọng tâm và trở lại tư thế phòng thủ.',
        videoUrl: 'https://www.youtube.com/watch?v=ZgjGqaquJ5U',
      },
      {
        name: 'Kumite Combination Drills',
        work: '8 phút',
        note:
          'Tập phối hợp đòn ở tốc độ kiểm soát, chú ý khoảng cách và tư thế.',
        videoUrl: 'https://www.youtube.com/watch?v=ZyReS5l3G5M',
      },
      {
        name: 'Giãn cơ cổ & vai',
        work: '2 phút',
        note:
          'Thả lỏng vai, xoay cổ nhẹ nhàng và hít thở sâu.',
        videoUrl: 'https://www.youtube.com/watch?v=TuB6QWP7gLI',
      },
    ],
  },
];

export const karateCategories = [
  'Nền tảng',
  'Kỹ thuật',
  'Thể lực',
  'HIIT',
  'Nâng cao',
  'Tổng hợp',
  'Phục hồi',
];