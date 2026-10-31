import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Cài đặt chung',
  type: 'document',
  // Singleton pattern: chỉ cho phép 1 document
  __experimental_single: true,
  fields: [
    defineField({
      name: 'appName',
      type: 'string',
      title: 'Tên App',
      initialValue: 'Home Workout Pro',
    }),
    defineField({
      name: 'defaultTimerSound',
      type: 'file',
      title: 'Âm thanh Timer mặc định',
      options: { accept: 'audio/*' },
    }),
    defineField({
      name: 'achievements',
      type: 'array',
      title: 'Danh sách Huy hiệu (Achievements)',
      of: [{ type: 'achievement' }],
    }),
  ],
})