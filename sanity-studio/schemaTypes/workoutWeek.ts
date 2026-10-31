import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'workoutWeek',
  title: 'Tuần tập luyện',
  type: 'document',
  fields: [
    defineField({
      name: 'weekNumber',
      type: 'number',
      title: 'Số tuần',
      validation: (Rule) => Rule.required().min(1).max(52),
    }),
    defineField({
      name: 'label',
      type: 'string',
      title: 'Nhãn hiển thị',
      description: 'Ví dụ: "Tuần 1: Nền tảng", "Tuần 4: Tăng cường"',
    }),
    defineField({
      name: 'focus',
      type: 'string',
      title: 'Trọng tâm tuần này',
      description: 'Ví dụ: "Học kỹ thuật cơ bản", "Tăng volume", "Deload"',
    }),
    defineField({
      name: 'exercises',
      type: 'array',
      title: 'Danh sách bài tập theo thứ tự',
      of: [{ type: 'reference', to: [{ type: 'exercise' }] }],
    }),
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'focus',
      weekNumber: 'weekNumber',
    },
    prepare({ title, subtitle, weekNumber }) {
      return {
        title: `Tuần ${weekNumber}: ${title || 'Chưa đặt tên'}`,
        subtitle: subtitle || 'Chưa có trọng tâm',
      }
    },
  },
})