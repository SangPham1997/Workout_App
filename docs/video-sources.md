# Nguồn video YouTube

Cập nhật: **24/10/2026**. Tất cả URL dưới đây đã được kiểm tra bằng:

1. `https://www.youtube.com/oembed?url=...` → HTTP 200, tiêu đề/kênh khớp chủ đề.
2. Trang watch của video → `playabilityStatus.status = OK` và `playableInEmbed = true`.

Tổng kiểm tra: **46/46 video** trong `exercises.js`, `karateSessions.js`, `spineBar.js`, `sessions.kumite.js` đều hợp lệ và cho phép nhúng iframe.

> Video là nội dung bên thứ ba; có thể bị xoá hoặc đổi quyền nhúng theo thời gian. Khi bảo trì, chạy lại quy trình kiểm tra trước khi thay URL.

## Xà & Cột sống — 14 bài

| Bài | Video | Kênh |
|---|---|---|
| Treo thả lỏng | [How To Dead Hang Correctly](https://www.youtube.com/watch?v=dOCQjaasbGs) | FitnessFAQs |
| Treo có hỗ trợ | [Build Hanging From Zero! Great for beginners!](https://www.youtube.com/watch?v=no_ZdiJsLu4) | Tom Morrison |
| Treo kéo vai | [Scapular Pull Ups (Beginner to Advanced Progressions)](https://www.youtube.com/watch?v=-ZIpSoTRsuE) | Zack Henderson |
| Treo thở 4–6 | [Hanging Decompression Breathing](https://www.youtube.com/watch?v=XFbAB7nyVV8) | Athlete Breath Coach |
| Ưỡn ngực tựa xà | [Thoracic Mobility - Thoracic Extension w/ Foam Roller & Bar](https://www.youtube.com/watch?v=UzPcawhpeQ8) | Movement Enhanced |
| Xoay ngực dưới xà | [Standing Thoracic Rotation](https://www.youtube.com/watch?v=PWmNVcs8rJY) | Garrett McLaughlin |
| Gập người thả lỏng | [Standing Forward Fold - Stretch Hamstrings and Lower Back](https://www.youtube.com/watch?v=goN4rWbQUn4) | Group HIIT |
| Mở khớp vai với khăn | [Shoulder Dislocates for Shoulder Flexibility](https://www.youtube.com/watch?v=vP8YmmRMz6I) | GMB Fitness |
| Ưỡn ngực tựa ghế | [Thoracic Extension using Chair](https://www.youtube.com/watch?v=woHZZa12zDw) | Rehab My Patient |
| Kéo xà đảo tay | [Inverted Row Tutorial / With Progressions](https://www.youtube.com/watch?v=5W8F6MzZ8Rk) | Andrew Alinda |
| Nâng gối treo | [The Hanging Knee Raise / A Tutorial](https://www.youtube.com/watch?v=p9hhX_Sx5v0) | Signum Fitness & Nutrition |
| Giữ gối co | [Tuck Hang (Hanging Tuck Hold)](https://www.youtube.com/watch?v=B3gtmd0Upng) | NCFIT |
| Bọ chết | [How to Do a Dead Bug: A Guide from Physical Therapists](https://www.youtube.com/watch?v=GbSC02oU3To) | Hinge Health |
| Cat–Cow | [How to Do a Cat Cow Stretch: A Guide from Physical Therapists](https://www.youtube.com/watch?v=1Y0YjXS9sKI) | Hinge Health |

**Lưu ý nội dung:** một số video minh hoạ biến thể gần nhất (standing rotation, forward fold, shoulder dislocates bằng dowel) thay vì đúng dụng cụ xà/khăn. Phần `guide` trong data đã ghi rõ cách điều chỉnh; người tập nên ưu tiên biên độ không đau.

## Karate — 3 buổi Kumite solo

| Buổi | Video gắn vào | Kênh |
|---|---|---|
| `kt-10` Kamae & Maai | [Karate Kumite Stances & Footwork Tutorial!](https://www.youtube.com/watch?v=qJED51I7iTc) | Karate Dojo waKu |
| `kt-11` Gohon Kumite Solo | [Gohon Kumite](https://www.youtube.com/watch?v=m3M6tdpoEUw) | Paul Walker |
| `kt-12` Kihon Ippon Solo | [SKIF Kihon Ippon Kumite - Jodan 1 - 6](https://www.youtube.com/watch?v=eyQTvH7XGYs) | Seamus O'Dowd |

## Video cũ đã kiểm tra

29 video còn lại trong `src/data/exercises.js` và `src/data/karateSessions.js` đều trả về oEmbed 200 và `playableInEmbed = true`; không cần thay URL.

## Cách kiểm tra lại

```powershell
# 1. Lấy toàn bộ videoId trong data
$files = @(
  'src\data\exercises.js',
  'src\data\karateSessions.js',
  'src\data\programs\spineBar.js',
  'src\data\karate\sessions.kumite.js'
)
$ids = foreach ($f in $files) {
  [regex]::Matches((Get-Content $f -Raw),
    'https?://(?:www\.)?(?:youtube\.com/(?:watch\?v=|shorts/|embed/)|youtu\.be/)([A-Za-z0-9_-]{11})') |
    ForEach-Object { $_.Groups[1].Value }
}
$ids = $ids | Select-Object -Unique

# 2. Kiểm tra oEmbed + playableInEmbed
foreach ($id in $ids) {
  $meta = Invoke-RestMethod "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=$id&format=json"
  $html = (Invoke-WebRequest "https://www.youtube.com/watch?v=$id&hl=en&gl=US" -UseBasicParsing).Content
  $status = [regex]::Match($html, '"playabilityStatus":\{"status":"([^"]+)"').Groups[1].Value
  $embed = [regex]::Match($html, '"playableInEmbed":(true|false)').Groups[1].Value
  "{0} | {1} | embed={2} | {3}" -f $id, $status, $embed, $meta.title
}
```
