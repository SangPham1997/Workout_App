# PLAN: Enhance "Sticker" (icon chữ/số) → Thành HÌNH MINH HỌA cho TẤT CẢ các bài tập

## 1. Bối cảnh & Hiện trạng (đã kiểm tra trong code)

Dự án: `homecycle-react` (React 19 + Vite + Tailwind + Zustand + FontAwesome).

| Thành phần | Trạng thái hiện tại | Vấn đề |
|---|---|---|
| `src/data/exercises.js` | 11 bài tập, mỗi bài có trường `type` | 2 bài dùng `type: 'static'` (squat, glute-bridge) — **TRÙNG NHAU** và không đúng: hook lại render theo `'squat'`, `'glute-bridge'` nên 2 bài này rơi vào `default` → vẽ người đứng tĩnh + chữ "Giữ tư thế theo hướng dẫn" (chính là dạng "sticker" cần bỏ) |
| `src/hooks/useCycleAnimation.js` (458 dòng) | Vẽ stickman bằng Canvas 2D, switch theo `type`: bicycle/supine/reverse/climber/standing/plank/birddog/deadbug/catcow/squat/glute-bridge | Logic vẽ nằm trong hook → khó mở rộng; tên hàm vẽ hardcode text trong canvas |
| `src/components/shared/ExerciseBadge.jsx` | **File rỗng (0 byte)**, không được import ở đâu | Đây chính là chỗ để làm "sticker/hình" cho danh sách nhưng chưa ai code |
| `src/components/exercises/ExerciseItem.jsx` | Chỉ hiển thị **số thứ tự trong vòng tròn** (`{idx+1}`) — dạng text | Chưa có hình minh họa cho từng bài |
| `public/` | Không có asset ảnh nào | Nếu dùng ảnh thật phải thêm pipeline asset |

**Kết luận:** Cần biến "badge dạng số/icon" thành **hình minh họa trực quan cho mọi bài tập**, thống nhất từ danh sách → simulator.

---

## 2. Mục tiêu

1. Mỗi bài tập trong danh sách (`ExerciseList`) hiển thị một **thumbnail hình** (SVG sticker động/tĩnh) thay vì số thứ tự.
2. Simulator (`CanvasSimulator`) luôn vẽ **đúng hình động của từng bài** — không còn fallback "static".
3. Nguồn dữ liệu hình tập trung: 1 registry duy nhất map `exerciseId/type → renderer`, dễ thêm bài mới.
4. Không dùng ảnh PNG/JPG tải ngoài → dùng **SVG inline + Canvas vector** (nhẹ, không lộ-tải, đổi màu theo theme dark).

---

## 3. Giải pháp kiến trúc (phương án chọn: SVG/Canvas vector, không dùng ảnh nhị phân)

```
src/
├── data/exercises.js                 # sửa: type duy nhất cho mọi bài
├── renderers/                        # MỚI: tách logic vẽ khỏi hook
│   ├── primitives.js                 # drawStickmanLine, drawCircle, drawFloor...
│   ├── exerciseRenderers.js          # registry: { [type]: drawFn(ctx,w,h,colors,angle) }
│   └── thumbnails.jsx                # component <ExerciseThumb type size /> (SVG static pose)
├── hooks/useCycleAnimation.js        # refactor: chỉ giữ RAF loop + rep counting, gọi registry
├── components/shared/ExerciseBadge.jsx  # code lại: wrapper hiển thị ExerciseThumb + category color
└── components/exercises/ExerciseItem.jsx # thay số thứ tự bằng <ExerciseBadge/>
```

### Chi tiết từng bước

### Bước 1 — Chuẩn hóa data (`src/data/exercises.js`)
- Đổi `squat.type: 'static'` → `'squat'`; `glute-bridge.type: 'static'` → `'glute-bridge'`.
- Thêm field `thumbPose` (optional): góc/frame tĩnh dùng cho thumbnail SVG (vd. `squat` lấy frame giữa chu kỳ).
- Thêm JSDoc comment quy ước: **mọi bài mới bắt buộc có `type` khớp key trong `exerciseRenderers.js`**.

### Bước 2 — Tạo registry renderer (`src/renderers/exerciseRenderers.js`)
- Di chuyển toàn bộ `drawLyingCycling / drawMountainClimber / drawStandingCrunch / drawPlank / drawBirdDog / drawDeadBug / drawCatCow / drawSquat / drawGluteBridge` ra khỏi hook.
- Ký hiệu thống nhất: `drawFn(ctx, w, h, palette, angle, exercise)` + thuộc tính `repBased: true|false` (thay cho mảng hardcode `['bicycle','supine',...]` trong hook).
- Registry: `export const RENDERERS = { bicycle, supine, reverse, climber, standing, plank, birddog, deadbug, catcow, squat, 'glute-bridge' }`.
- Fallback mới khi thiếu type: vẽ **card lỗi có icon + tên bài** (dev-friendly), không còn "stickman đứng + chữ".

### Bước 3 — Refactor `useCycleAnimation.js`
- Giữ nguyên: RAF loop, DPR resize handling, rep counting, refs.
- Switch-case cũ thay bằng: `const draw = RENDERERS[type] ?? FALLBACK_RENDERER; draw(...)`.
- Rep counting đọc `draw.repBased` thay cho mảng literal.
- Bỏ các `ctx.fillText('Plank - Giữ tư thế'...)` hardcode trong canvas → tên bài do UI (`App.jsx`/`TechniqueGuide`) hiển thị, canvas chỉ còn hình (clean hơn, đúng chất "hình cho tất cả bài").

### Bước 4 — Thumbnail SVG cho danh sách (`src/renderers/thumbnails.jsx` + `ExerciseBadge.jsx`)
- `ExerciseThumb({ type, size = 40 })`: render SVG kế thừa **cùng bộ tọa độ** với renderer canvas ở pose tĩnh `angle = poseAngle(type)` → đảm bảo hình trên list và hình chạy trong simulator **khớp nhau 100%**.
  - Mẹo reuse: cho phép renderer nhận một "canvas-like" interface tối giản ghi lệnh path, hoặc đơn giản hơn: viết tay SVG `<path>`/`<line>` cho 11 pose (tốn ~15 phút, kiểm soát chất lượng tốt). Khuyến nghị cách viết tay có chú thích lấy tọa độ từ renderer.
- `ExerciseBadge.jsx` (file đang rỗng → code mới):
  ```jsx
  <div className="w-10 h-10 rounded-xl bg-slate-800 ring-1 ring-slate-700 overflow-hidden">
    <ExerciseThumb type={exercise.type} />
  </div>
  ```
  + dot màu theo `category` (Bụng = emerald, Lưng = sky, Toàn thân = amber).
  - Khi `isActive`: thêm hiệu ứng `animate-pulse` nhẹ hoặc swap sang frame động (CSS animation trên nhóm `<g>` tay/chân).

### Bước 5 — Cập nhật `ExerciseItem.jsx`
- Thay vòng tròn số `{idx + 1}` bằng `<ExerciseBadge exercise={exercise} isActive={isActive} />`.
- Giữ layout hiện tại, thêm `gap-3`, badge căn giữa chiều cao dòng.
- Số thứ tự vẫn có thể giữ nhỏ ở góc badge (`absolute -bottom-1 -right-1 text-[10px]`) nếu muốn.

### Bước 6 — Kiểm thử đồng bộ
- `npm run lint && npm run build`.
- Checklist từng bài (11/11): thumbnail đúng tư thế ↔ animation đúng tư thế ↔ đếm rep đúng nhóm (`bicycle, supine, reverse, climber, standing` + thêm `birddog, deadbug, catcow, squat, glute-bridge` nếu muốn đếm rep — hiện tại plank không đếm).
- Resize test: thumbnail không vỡ ở 320px; canvas DPR test trên màn Retina.

---

## 4. Bảng ánh xạ type → hình (ma trận nghiệm thu)

| id | type (sau sửa) | Hình động (simulator) | Thumbnail (list) | Đếm rep |
|---|---|---|---|---|
| bicycle-crunch | bicycle | Đạp xe chéo khuỷu-gối | ✅ pose giữa chu kỳ | ✅ |
| supine-cycling | supine | Đạp xe nằm ngửa | ✅ | ✅ |
| reverse-cycling | reverse | Đạp ngược | ✅ | ✅ |
| plank | plank | Plank gồng nhẹ | ✅ | ❌ (giữ tĩnh) |
| bird-dog | birddog | Duỗi chéo tay-chân | ✅ | ➕ đề xuất bật |
| dead-bug | deadbug | Tay chân đối xứng duỗi | ✅ | ➕ đề xuất bật |
| cat-cow | catcow | Cong/ưỡn lưng | ✅ | ➕ đề xuất bật |
| mountain-climbers | climber | Chạy kéo gối | ✅ | ✅ |
| standing-crunch | standing | Đứng kéo gối chéo | ✅ | ✅ |
| squat | **squat** (bỏ static) | Ngồi xổm | ✅ | ➕ đề xuất bật |
| glute-bridge | **glute-bridge** (bỏ static) | Nâng mông | ✅ | ➕ đề xuất bật |

---

## 5. Rủi ro & phương án dự phòng

| Rủi ro | Xử lý |
|---|---|
| Tọa độ SVG thumbnail lệch so với canvas | Dùng chung hằng số pose trong `renderers/poses.js`; visual review 11/11 |
| File `useCycleAnimation.js` lớn, refactor dễ lỗi | Tách từng hàm, chạy build sau mỗi lần move; git commit theo bước |
| Muốn dùng ảnh thật (PNG/lottie) thay vì vector | Phương án B: thư mục `public/stickers/<id>.svg` + `EXERCISE_STICKERS` map trong data; cùng bước refactor ExerciseBadge — nhưng **không khuyến nghị** vì mất đồng bộ màu/pose với canvas |

## 6. Effort ước lượng

| Bước | Thời gian |
|---|---|
| 1. Chuẩn hóa data | 10 phút |
| 2–3. Tách renderer + refactor hook | 1,5 giờ |
| 4. Thumbnails SVG + ExerciseBadge | 2 giờ |
| 5. ExerciseItem | 15 phút |
| 6. Test + polish | 45 phút |
| **Tổng** | **~5 giờ** |

## 7. Definition of Done
- [ ] 11/11 bài có `type` duy nhất, không còn `'static'`.
- [ ] `ExerciseBadge.jsx` không còn là file rỗng; mọi item trong list hiển thị **hình**, không còn số trần.
- [ ] Simulator vẽ đúng hình cho squat & glute-bridge.
- [ ] Không còn text hardcode trong canvas; tên bài hiển thị bởi UI.
- [ ] `npm run build` pass, lint sạch.
