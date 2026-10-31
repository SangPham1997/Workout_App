import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
// Nguồn cấu hình API duy nhất: sanity.cli.ts (đọc SANITY_STUDIO_PROJECT_ID từ .env.local)
import cliConfig from './sanity.cli'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || cliConfig.api?.projectId || 'your-project-id'
const dataset = process.env.SANITY_STUDIO_DATASET || cliConfig.api?.dataset || 'production'

if (projectId === 'your-project-id') {
  // Cảnh báo ngay ở console khi dev để khỏi nhầm với lỗi CORS thật
  console.warn(
    '[HomeCycle Studio] Chưa cấu hình SANITY_STUDIO_PROJECT_ID trong sanity-studio/.env.local — ' +
      'Studio sẽ không login được và trình duyệt báo CORS lỗi.',
  )
}

export default defineConfig({
  name: 'homecycle',
  title: 'HomeCycle Content Studio',

  projectId,
  dataset,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Nội dung')
          .items([
            S.listItem()
              .title('Chương trình tập luyện')
              .child(
                S.documentList()
                  .title('Chương trình tập luyện')
                  .filter('_type == "workoutProgram"')
                  .menuItems(S.documentTypeList('workoutProgram').getMenuItems())
              ),
            S.divider(),
            S.documentTypeListItem('exercise').title('Bài tập / Kỹ thuật'),
            S.documentTypeListItem('exerciseCategory').title('Danh mục bài tập'),
            S.documentTypeListItem('muscleGroup').title('Nhóm cơ'),
            S.documentTypeListItem('equipment').title('Thiết bị'),
            S.divider(),
            S.documentTypeListItem('workoutWeek').title('Tuần tập luyện'),
            S.documentTypeListItem('karateTrack').title('Lộ trình Karate'),
            S.documentTypeListItem('karateSession').title('Buổi tập Karate'),
            S.divider(),
            S.documentTypeListItem('siteSettings').title('Cài đặt chung'),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})