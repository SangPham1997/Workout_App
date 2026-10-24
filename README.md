# Home Workout Pro

Ứng dụng tập luyện tại nhà gồm 4 mục: bài tập 4 tuần, Karate, Xà & Cột sống và thói quen.  
Xây dựng bằng React 19 + Vite + Tailwind CSS + Zustand, dữ liệu lưu trong `localStorage`.

## Tính năng

- **Exercises (`/`)** — 20 bài, chia 4 tuần, timer theo hiệp/thời gian, video hướng dẫn, đánh dấu tuần hoàn thành.
- **Karate (`/karate`)** — 12 buổi, 3 lộ trình Kihon / Kata / Kumite, timeline tua video, thư viện kỹ thuật, ghi chú và tiến độ từng track.
- **Xà & Cột sống (`/xa`)** — 14 bài nhẹ cho dân văn phòng, 3 routine 8–12 phút, filter cấp/dụng cụ, safety notice, timer, ghi chú.
- **Thói quen (`/habits`)** — habit tracker, streak, heatmap, backup/restore.

## Chạy local

```bash
npm install
npm run dev
```

Mở URL Vite in ra (mặc định `http://localhost:5173`).

## Build & kiểm tra

```bash
npm run lint
npm run build
npm run preview
```

## Routes

| Route | Nội dung |
|---|---|
| `/` | Home Workout 4 tuần |
| `/karate` | Karate 3 track |
| `/xa` | Xà & Cột sống |
| `/habits` | Thói quen |

## Cấu trúc chính

```text
src/
├── data/
│   ├── programs/      # homeWorkout, spineBar, registry
│   ├── karate/        # tracks, sessions, techniques, blocks
│   ├── exercises.js   # dữ liệu 20 bài nền
│   └── karateSessions.js
├── stores/            # zustand + persist
├── components/
│   ├── exercises/
│   ├── karate/
│   ├── spine/
│   ├── timer/
│   └── layout/
└── pages/
```

Kế hoạch chi tiết và trạng thái triển khai: [docs/ke-hoach-phat-trien.md](docs/ke-hoach-phat-trien.md).

## Ghi chú an toàn

Mục Xà & Cột sống là vận động nhẹ để thư giãn, không thay thế chẩn đoán hoặc điều trị.  
Người có tiền sử chấn thương vai/cổ, thoát vị đĩa đệm, đang mang thai hoặc huyết áp không ổn định nên hỏi bác sĩ trước khi tập.
