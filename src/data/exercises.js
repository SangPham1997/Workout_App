export const exercises = [
  // ============ NHÓM BỤNG (CORE) ============
  {
    id: 'bicycle-crunch',
    name: 'Đạp xe trên không',
    subName: 'Bicycle Crunches',
    target: 'Bụng trên, bụng chéo & Đùi',
    duration: 45,
    guide: 'Nằm ngửa, tay để sau đầu. Co gối trái lên, xoay khuỷu tay phải chạm gối trái. Đổi bên liên tục nhịp nhàng, không thả chân chạm sàn.',
    type: 'bicycle',
    svg: 'bicycle',  // tên hình SVG minh họa (SvgFigures.jsx)
    reps: 2,
    category: 'Bụng'
  },
  {
    id: 'supine-cycling',
    name: 'Đạp xe nằm ngửa',
    subName: 'Supine Cycling',
    target: 'Cơ bụng dưới & Cơ đùi trước',
    duration: 45,
    guide: 'Nằm ngửa, hai tay thả lỏng lót dưới hông để đỡ lưng. Nâng chân và xoay tròn khớp gối theo chiều tiến về phía trước giống như đạp bàn đạp.',
    type: 'supine',
    svg: 'supine',  // tên hình SVG minh họa (SvgFigures.jsx)
    reps: 2,
    category: 'Bụng'
  },
  {
    id: 'reverse-cycling',
    name: 'Đạp xe ngược',
    subName: 'Reverse Bicycle',
    target: 'Tập trung chuyên sâu Bụng dưới',
    duration: 45,
    guide: 'Giữ tư thế nằm ngửa, thực hiện động tác đạp chân xoay tròn theo chiều ngược lại (từ dưới kéo ngược lên trên) để kích hoạt cơ bụng dưới.',
    type: 'reverse',
    svg: 'reverse',  // tên hình SVG minh họa (SvgFigures.jsx)
    reps: 2,
    category: 'Bụng'
  },
  {
    id: 'plank',
    name: 'Plank (Tấm ván)',
    subName: 'Plank Hold',
    target: 'Cơ bụng sâu, lưng dưới, vai',
    duration: 30,
    guide: 'Tư thế chống đẩy, giữ cơ thể thẳng từ đầu đến gót chân. Siết cơ bụng và mông, không võng lưng. Giữ càng lâu càng tốt.',
    type: 'plank',
    svg: 'plank',  // tên hình SVG minh họa (SvgFigures.jsx)
    reps: 1,             // Plank thường giữ tĩnh, không đếm rep theo chu kỳ
    category: 'Bụng'
  },

  // ============ NHÓM LƯNG & CỘT SỐNG ============
  {
    id: 'bird-dog',
    name: 'Chim chó',
    subName: 'Bird-Dog',
    target: 'Cơ lưng dưới, cơ mông, cơ bụng sâu',
    duration: 30,
    guide: 'Tư thế chống bốn chân. Duỗi thẳng tay phải và chân trái, giữ vài giây rồi trở về. Đổi bên. Giữ lưng thẳng, không cong.',
    type: 'birddog',
    svg: 'birddog',  // tên hình SVG minh họa (SvgFigures.jsx)
    reps: 2,
    category: 'Lưng & Cột sống'
  },
  {
    id: 'dead-bug',
    name: 'Bọ chết',
    subName: 'Dead Bug',
    target: 'Cơ bụng sâu, lưng dưới, cơ ổn định cột sống',
    duration: 30,
    guide: 'Nằm ngửa, tay và chân giơ thẳng lên. Duỗi chân phải và tay trái ra xa, giữ vài giây rồi trở về. Đổi bên. Giữ lưng áp sát sàn.',
    type: 'deadbug',
    svg: 'deadbug',  // tên hình SVG minh họa (SvgFigures.jsx)
    reps: 2,
    category: 'Lưng & Cột sống'
  },
  {
    id: 'cat-cow',
    name: 'Mèo - Bò',
    subName: 'Cat-Cow Stretch',
    target: 'Cột sống linh hoạt, giảm đau lưng',
    duration: 30,
    guide: 'Tư thế chống bốn chân. Hít vào, ưỡn lưng xuống (bò). Thở ra, cong lưng lên (mèo). Lặp lại nhịp nhàng.',
    type: 'catcow',
    svg: 'catcow',  // tên hình SVG minh họa (SvgFigures.jsx)
    reps: 2,
    category: 'Lưng & Cột sống'
  },

  // ============ NHÓM TOÀN THÂN / TIM MẠCH ============
  {
    id: 'mountain-climbers',
    name: 'Leo núi tại chỗ',
    subName: 'Mountain Climbers',
    target: 'Tim mạch, Vai, Bụng & Toàn thân',
    duration: 30,
    guide: 'Tư thế chống đẩy cao. Kéo lần lượt từng đầu gối về phía ngực càng nhanh càng tốt. Giữ lưng thẳng, không võng hông.',
    type: 'climber',
    svg: 'climber',  // tên hình SVG minh họa (SvgFigures.jsx)
    reps: 2,
    category: 'Toàn thân'
  },
  {
    id: 'standing-crunch',
    name: 'Đứng kéo gối chéo',
    subName: 'Standing Cross Crunches',
    target: 'Cơ bụng chéo & Khớp hông',
    duration: 45,
    guide: 'Đứng thẳng, tay sau đầu. Co gối trái lên cao sang bên phải, đồng thời gập thân người để khuỷu tay phải tiến gần gối trái. Đổi bên.',
    type: 'standing',
    svg: 'standing',  // tên hình SVG minh họa (SvgFigures.jsx)
    reps: 2,
    category: 'Toàn thân'
  },
  {
    id: 'squat',
    name: 'Squat (Ngồi xổm)',
    subName: 'Bodyweight Squat',
    target: 'Đùi, mông, cơ lưng dưới',
    duration: 30,
    guide: 'Đứng thẳng, hai chân rộng bằng vai. Hạ thấp người xuống như ngồi ghế, giữ lưng thẳng. Đẩy mông ra sau, đầu gối không vượt quá mũi chân.',
    type: 'squat',
    svg: 'squat',  // tên hình SVG minh họa (SvgFigures.jsx)
    reps: 2,
    category: 'Toàn thân'
  },
  {
    id: 'glute-bridge',
    name: 'Nâng mông',
    subName: 'Glute Bridge',
    target: 'Mông, cơ lưng dưới, cơ bụng',
    duration: 30,
    guide: 'Nằm ngửa, co gối, hai chân đặt sát sàn. Nâng hông lên cao, siết mông và giữ vài giây, rồi hạ xuống.',
    type: 'glute-bridge',
    svg: 'glute-bridge',  // tên hình SVG minh họa (SvgFigures.jsx)
    reps: 2,
    category: 'Toàn thân'
  },
];