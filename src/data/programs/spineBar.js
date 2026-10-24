/**
 * Chương trình "Xà & Cột sống" — 8–12 phút cho dân văn phòng.
 *
 * Nguyên tắc nội dung:
 * - Cường độ thấp (RPE 3–5/10), không tập đến thất bại.
 * - Mỗi bài có regression + progression + lưu ý an toàn.
 * - Không dùng nhảy/kipping; luôn có phương án treo có hỗ trợ.
 *
 * Schema item giống exercise hiện tại, bổ sung:
 *   bar: 'high' | 'low' | 'none'
 *   spineFocus: string[]
 *   deskIssues: string[]
 */
export const spineBarProgram = {
  id: 'spine-bar',
  title: 'Xà & Cột sống',
  subtitle: 'Giải nén – mở ngực – ổn định, 8–12 phút cho dân văn phòng',
  accent: 'sky',
  groupBy: 'routine',
  groups: [
    {
      id: 'reset',
      label: 'Reset 8 phút',
      short: 'Reset',
      icon: 'fa-feather',
      description: 'Buổi ngắn để giãn lưng và làm dịu cảm giác nén sau giờ làm việc.',
    },
    {
      id: 'open',
      label: 'Mở ngực & cột sống',
      short: 'Mở ngực',
      icon: 'fa-arrows-up-down',
      description: 'Ưu tiên duỗi ngực, xoay cột sống ngực và chống tư thế gù.',
    },
    {
      id: 'core',
      label: 'Core treo nhẹ',
      short: 'Core',
      icon: 'fa-person',
      description: 'Ổn định bả vai, lưng giữa và core với lực kéo nhẹ.',
    },
  ],
  items: [
    // ============================================================
    // RESET — làm quen, giảm tải, thở
    // ============================================================
    {
      id: 'hang-relax',
      groupId: 'reset',
      name: 'Treo thả lỏng',
      subName: 'Passive Dead Hang',
      level: 1,
      mode: 'time',
      duration: 20,
      sets: 3,
      reps: null,
      rest: 40,
      equipment: 'Xà đơn cao',
      bar: 'high',
      target: 'Giãn cơ lưng, giảm cảm giác nén, tăng lực nắm',
      spineFocus: ['Giải nén', 'Giãn cơ lưng'],
      deskIssues: ['Cứng lưng dưới', 'Gù vai'],
      guide:
        'Nắm xà rộng hơn vai một chút, treo người với vai thả lỏng nhưng vẫn hoạt động nhẹ. ' +
        'Giữ thân dưới thẳng, thở chậm bằng mũi. Không đu người, không nhún, không cố kéo người lên.',
      safety:
        'Dùng ghế để lên xuống, không nhảy lên xà. Nếu vai có tiền sử trật khớp hoặc đau, ' +
        'chuyển sang bài treo có hỗ trợ.',
      regression: 'Chạm mũi chân xuống ghế để giảm tải, giữ 10–15 giây.',
      progression: 'Tăng 5 giây mỗi tuần, tối đa 30 giây/hiệp.',
      videoUrl: '',
    },
    {
      id: 'hang-assisted',
      groupId: 'reset',
      name: 'Treo có hỗ trợ',
      subName: 'Assisted Hang',
      level: 1,
      mode: 'time',
      duration: 30,
      sets: 3,
      reps: null,
      rest: 30,
      equipment: 'Xà đơn + ghế',
      bar: 'high',
      target: 'Làm quen với treo, giảm tải cột sống từng bước',
      spineFocus: ['Giải nén nhẹ', 'Làm quen'],
      deskIssues: ['Cứng lưng dưới', 'Mỏi vai'],
      guide:
        'Đặt ghế ngay dưới xà. Nắm xà, đặt mũi chân lên ghế để chịu một phần trọng lượng. ' +
        'Treo với vai thả lỏng, thân thẳng, thở đều. Đây là bước đệm trước khi treo hoàn toàn.',
      safety:
        'Ghế phải chắc chắn, không dùng ghế xoay hoặc ghế có bánh. Giữ đầu gối hơi mềm, ' +
        'không khoá cứng.',
      regression: 'Tăng lực đỡ bằng chân nếu thấy vai bị kéo quá mức.',
      progression: 'Giảm dần lực đỡ bằng chân, tiến tới treo thả lỏng 10 giây.',
      videoUrl: '',
    },
    {
      id: 'scapular-pull',
      groupId: 'reset',
      name: 'Treo kéo vai',
      subName: 'Scapular Pull',
      level: 2,
      mode: 'reps',
      duration: 30,
      sets: 3,
      reps: 6,
      rest: 40,
      equipment: 'Xà đơn cao',
      bar: 'high',
      target: 'Ổn định bả vai, kiểm soát khớp vai',
      spineFocus: ['Ổn định vai', 'Kiểm soát'],
      deskIssues: ['Gù vai', 'Mỏi vai'],
      guide:
        'Từ tư thế treo, giữ tay thẳng, kéo nhẹ hai bả vai xuống và về sau mà không gập khuỷu. ' +
        'Giữ 1–2 giây rồi thả về chậm. Biên độ nhỏ, cảm nhận cơ quanh bả vai làm việc.',
      safety:
        'Không giật người để kéo vai xuống. Nếu không cảm nhận được bả vai, quay lại bài treo có hỗ trợ.',
      regression: 'Đặt chân lên ghế để giảm trọng lượng, tập 4 lần/hiệp.',
      progression: 'Tăng lên 8 lần/hiệp khi kiểm soát tốt, sau đó thêm 1 giây giữ.',
      videoUrl: '',
    },
    {
      id: 'breathing-hang',
      groupId: 'reset',
      name: 'Treo thở 4–6',
      subName: 'Breathing Hang',
      level: 1,
      mode: 'time',
      duration: 30,
      sets: 2,
      reps: null,
      rest: 30,
      equipment: 'Xà đơn hoặc ghế',
      bar: 'high',
      target: 'Thư giãn, làm chậm nhịp thở, giảm căng cổ vai',
      spineFocus: ['Thư giãn', 'Nhịp thở'],
      deskIssues: ['Căng thẳng', 'Mỏi cổ vai'],
      guide:
        'Treo nhẹ hoặc ngồi trên ghế, hai tay đặt lên đùi. Hít vào 4 nhịp, thở ra 6 nhịp, ' +
        'thả lỏng vai và hàm. Lặp lại trong suốt thời gian giữ. Không cố gắng treo lâu hơn khả năng.',
      safety: 'Nếu chóng mặt hoặc khó thở, dừng lại và ngồi nghỉ.',
      regression: 'Thực hiện khi ngồi ghế, không cần treo.',
      progression: 'Tăng lên 3 hiệp khi thấy dễ chịu.',
      videoUrl: '',
    },

    // ============================================================
    // MỞ NGỰC — duỗi ngực, xoay cột sống ngực
    // ============================================================
    {
      id: 'thoracic-extension',
      groupId: 'open',
      name: 'Ưỡn ngực tựa xà',
      subName: 'Bar Thoracic Extension',
      level: 1,
      mode: 'time',
      duration: 20,
      sets: 2,
      reps: null,
      rest: 30,
      equipment: 'Xà thấp/khung',
      bar: 'low',
      target: 'Mở ngực, duỗi cột sống ngực',
      spineFocus: ['Duỗi ngực', 'Chống gù'],
      deskIssues: ['Gù vai', 'Cứng ngực'],
      guide:
        'Đứng cách xà một bước, hai tay nắm xà ngang hông. Ngả người về trước, ' +
        'để ngực mở ra, giữ hông thẳng và đầu gối hơi mềm. Không ưỡn quá mức gây đau lưng dưới.',
      safety:
        'Chỉ đi đến biên độ thoải mái. Nếu đau lưng dưới, siết nhẹ bụng và giảm độ ngả.',
      regression: 'Dùng khung cửa hoặc tường thay xà, giảm độ ngả.',
      progression: 'Tăng thời gian giữ lên 30 giây, không tăng độ ngả quá nhanh.',
      videoUrl: '',
    },
    {
      id: 'thoracic-rotation',
      groupId: 'open',
      name: 'Xoay ngực dưới xà',
      subName: 'Bar Thoracic Rotation',
      level: 1,
      mode: 'reps',
      duration: 30,
      sets: 2,
      reps: 6,
      rest: 30,
      equipment: 'Xà thấp/khung',
      bar: 'low',
      target: 'Linh hoạt cột sống ngực, giảm cứng vai',
      spineFocus: ['Xoay ngực', 'Linh hoạt'],
      deskIssues: ['Cứng vai', 'Cứng lưng trên'],
      guide:
        'Đứng nghiêng người, một tay nắm xà ngang ngực. Xoay thân trên về phía xà, ' +
        'giữ hông hướng trước, rồi xoay ra xa. Đổi bên. Chuyển động chậm, không giật.',
      safety: 'Không xoay quá mức gây đau; giữ bụng nhẹ để bảo vệ lưng dưới.',
      regression: 'Giảm biên độ, chỉ xoay 30–40% so với bình thường.',
      progression: 'Tăng lên 8 lần/bên khi thấy mượt.',
      videoUrl: '',
    },
    {
      id: 'bar-fold',
      groupId: 'open',
      name: 'Gập người thả lỏng',
      subName: 'Bar-assisted Fold',
      level: 1,
      mode: 'time',
      duration: 20,
      sets: 2,
      reps: null,
      rest: 30,
      equipment: 'Xà thấp/khung',
      bar: 'low',
      target: 'Giãn chuỗi sau, giảm cứng lưng dưới',
      spineFocus: ['Giãn chuỗi sau', 'Thư giãn'],
      deskIssues: ['Cứng lưng dưới', 'Cứng đùi sau'],
      guide:
        'Hai tay nắm xà thấp, chân lùi về sau một bước. Đẩy hông ra sau, gập người từ khớp hông, ' +
        'giữ lưng dài. Thở ra khi hạ xuống. Không cố chạm sàn nếu lưng dưới khó chịu.',
      safety: 'Không gập bụng để xuống sâu hơn; giữ cột sống trung tính.',
      regression: 'Giữ tay trên ghế cao thay vì xà thấp.',
      progression: 'Tăng thời gian giữ lên 30 giây hoặc lùi chân xa hơn một chút.',
      videoUrl: '',
    },
    {
      id: 'shoulder-opener',
      groupId: 'open',
      name: 'Mở khớp vai với khăn',
      subName: 'Shoulder Opener',
      level: 1,
      mode: 'reps',
      duration: 30,
      sets: 2,
      reps: 8,
      rest: 30,
      equipment: 'Khăn hoặc dây',
      bar: 'none',
      target: 'Mở vai trước, ngực, cải thiện tư thế',
      spineFocus: ['Mở ngực', 'Vai'],
      deskIssues: ['Gù vai', 'Cứng ngực'],
      guide:
        'Cầm khăn rộng hơn vai. Đưa hai tay lên cao rồi ra sau đầu, giữ khuỷu hơi gập. ' +
        'Nếu vai cho phép, tiếp tục hạ ra sau lưng. Quay lại chậm. Không ép qua cơn đau.',
      safety: 'Không dùng đà; nếu vai kêu hoặc đau, giảm biên độ.',
      regression: 'Nới rộng tay hơn hoặc chỉ đưa lên cao, không ra sau.',
      progression: 'Thu hẹp khoảng tay khi vai mở tốt hơn.',
      videoUrl: '',
    },
    {
      id: 'chair-extension',
      groupId: 'open',
      name: 'Ưỡn ngực tựa ghế',
      subName: 'Chair Thoracic Extension',
      level: 1,
      mode: 'time',
      duration: 20,
      sets: 2,
      reps: null,
      rest: 30,
      equipment: 'Ghế',
      bar: 'none',
      target: 'Duỗi cột sống ngực khi không có xà',
      spineFocus: ['Duỗi ngực', 'Chống gù'],
      deskIssues: ['Gù vai', 'Cứng lưng trên'],
      guide:
        'Ngồi trên ghế, hai tay đan sau đầu, khuỷu mở. Tựa lưng vào mép ghế, ' +
        'từ từ ngả người ra sau để mở ngực. Giữ 2–3 nhịp thở rồi trở lại. Không ngả quá xa.',
      safety: 'Ghế phải chắc, không có bánh. Nếu đau cổ, không đan tay sau đầu.',
      regression: 'Chỉ ưỡn nhẹ, không ngả người.',
      progression: 'Tăng thời gian giữ, không tăng độ ngả.',
      videoUrl: '',
    },

    // ============================================================
    // CORE — ổn định, lực kéo nhẹ
    // ============================================================
    {
      id: 'inverted-row',
      groupId: 'core',
      name: 'Kéo xà đảo tay',
      subName: 'Inverted Row',
      level: 2,
      mode: 'reps',
      duration: 40,
      sets: 3,
      reps: 8,
      rest: 45,
      equipment: 'Xà thấp/khung',
      bar: 'low',
      target: 'Lưng giữa, vai sau, tay trước',
      spineFocus: ['Ổn định lưng giữa', 'Vai sau'],
      deskIssues: ['Gù vai', 'Yếu lưng'],
      guide:
        'Nằm dưới xà thấp, nắm xà rộng hơn vai. Giữ thân thẳng từ đầu đến gót chân, ' +
        'kéo ngực lên gần xà, siết bả vai. Hạ xuống chậm. Có thể gập gối để giảm độ khó.',
      safety: 'Không võng lưng dưới; nếu không giữ được thân thẳng, gập gối nhiều hơn.',
      regression: 'Gập gối, chống chân gần người để giảm tải.',
      progression: 'Duỗi chân hoặc hạ xà thấp hơn khi kiểm soát tốt.',
      videoUrl: '',
    },
    {
      id: 'knee-raise',
      groupId: 'core',
      name: 'Nâng gối treo',
      subName: 'Hanging Knee Raise',
      level: 2,
      mode: 'reps',
      duration: 30,
      sets: 2,
      reps: 6,
      rest: 40,
      equipment: 'Xà đơn cao',
      bar: 'high',
      target: 'Core, cơ gập hông, kiểm soát thân dưới',
      spineFocus: ['Core', 'Kiểm soát'],
      deskIssues: ['Yếu core', 'Mỏi lưng dưới'],
      guide:
        'Treo trên xà, siết nhẹ bụng. Nâng hai gối lên gần ngực, giữ thân dưới ổn định, ' +
        'rồi hạ xuống chậm. Không đu người để tạo đà.',
      safety: 'Nếu vai mỏi, dùng ghế đỡ chân. Không thực hiện khi đang đau lưng dưới cấp.',
      regression: 'Nâng từng gối hoặc dùng ghế đỡ chân.',
      progression: 'Tăng lên 8 lần/hiệp hoặc giữ gối cao 1 giây.',
      videoUrl: '',
    },
    {
      id: 'tuck-hold',
      groupId: 'core',
      name: 'Giữ gối co',
      subName: 'Tuck Hold',
      level: 2,
      mode: 'time',
      duration: 12,
      sets: 2,
      reps: null,
      rest: 40,
      equipment: 'Xà đơn cao',
      bar: 'high',
      target: 'Ổn định core, kiểm soát xương chậu',
      spineFocus: ['Core', 'Ổn định'],
      deskIssues: ['Yếu core', 'Mỏi lưng dưới'],
      guide:
        'Treo trên xà, co gối về phía ngực và giữ nguyên. Siết bụng nhẹ, thở đều, ' +
        'không để thân dưới đung đưa. Hạ chân chậm khi hết thời gian.',
      safety: 'Giữ thời gian ngắn, không nín thở. Dừng nếu vai mỏi nhiều.',
      regression: 'Dùng ghế đỡ chân hoặc giảm còn 6–8 giây.',
      progression: 'Tăng lên 15–20 giây khi thân dưới không đung đưa.',
      videoUrl: '',
    },
    {
      id: 'dead-bug',
      groupId: 'core',
      name: 'Bọ chết',
      subName: 'Dead Bug',
      level: 1,
      mode: 'reps',
      duration: 30,
      sets: 2,
      reps: 6,
      rest: 30,
      equipment: 'Thảm',
      bar: 'none',
      target: 'Core sâu, kiểm soát xương chậu, an toàn cho lưng',
      spineFocus: ['Core sâu', 'Ổn định'],
      deskIssues: ['Mỏi lưng dưới', 'Yếu core'],
      guide:
        'Nằm ngửa, tay giơ lên, gối co 90 độ. Duỗi chân phải và tay trái ra xa, ' +
        'giữ lưng dưới áp sát sàn, rồi trở về. Đổi bên. Chuyển động chậm, thở đều.',
      safety: 'Nếu lưng dưới cong lên, giảm biên độ hoặc chỉ duỗi chân.',
      regression: 'Chỉ duỗi chân, giữ tay cố định; hoặc giữ chân co nhiều hơn.',
      progression: 'Tăng lên 8 lần/bên hoặc duỗi chân thấp hơn.',
      videoUrl: '',
    },
    {
      id: 'cat-cow',
      groupId: 'core',
      name: 'Cat–Cow',
      subName: 'Cat–Cow',
      level: 1,
      mode: 'reps',
      duration: 30,
      sets: 2,
      reps: 8,
      rest: 20,
      equipment: 'Thảm',
      bar: 'none',
      target: 'Linh hoạt cột sống, giảm cứng sau giờ ngồi',
      spineFocus: ['Linh hoạt cột sống', 'Thư giãn'],
      deskIssues: ['Cứng lưng', 'Cứng cổ'],
      guide:
        'Chống bốn chân, cổ tay dưới vai, gối dưới hông. Hít vào, ưỡn nhẹ ngực và ' +
        'nhìn lên; thở ra, cong lưng và nhìn xuống. Di chuyển chậm theo từng đốt sống.',
      safety: 'Không ép cổ ngửa quá mức; giữ biên độ thoải mái.',
      regression: 'Thực hiện khi ngồi ghế, chỉ ưỡn/cong nhẹ.',
      progression: 'Tăng lên 10 lần hoặc thêm xoay nhẹ sang hai bên.',
      videoUrl: '',
    },
  ],
};
