import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'karateTrack',
  title: 'Lộ trình Karate',
  type: 'document',
  fields: [
    defineField({
      name: 'id',
      type: 'string',
      title: 'ID Code (Unique, dùng cho code)',
      description: 'Ví dụ: kihon, kata, kumite, basics',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'label',
      type: 'string',
      title: 'Tên hiển thị',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Mô tả lộ trình',
      rows: 3,
    }),
    defineField({
      name: 'level',
      type: 'string',
      title: 'Cấp độ',
      options: {
        list: ['Beginner', 'Intermediate', 'Advanced'],
        layout: 'radio',
      },
      initialValue: 'Beginner',
    }),
    defineField({
      name: 'sessions',
      type: 'array',
      title: 'Các buổi tập theo thứ tự',
      of: [{ type: 'reference', to: [{ type: 'karateSession' }] }],
    }),
    defineField({
      name: 'weekLabels',
      type: 'text',
      title: 'Nhãn tuần tùy chỉnh (JSON)',
      description: 'JSON object mapping số tuần -> nhãn. Ví dụ: { "1": "Cơ bản", "2": "Nâng cao" }',
      rows: 4,
    }),
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'id',
      level: 'level',
    },
    prepare({ title, subtitle, level }) {
      return {
        title,
        subtitle: `${subtitle} • ${level}`,
      }
    },
  },
})