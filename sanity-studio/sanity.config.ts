import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'your-project-id'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

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