import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'karateSession',
  title: 'Buổi tập Karate',
  type: 'document',
  fields: [
    defineField({
      name: 'sessionId',
      type: 'string',
      title: 'Session ID (Unique, dùng cho code)',
      description: 'Ví dụ: k1-w1-s1, k2-w3-s2',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'week',
      type: 'number',
      title: 'Tuần',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'name',
      type: 'string',
      title: 'Tên buổi tập',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'track',
      type: 'reference',
      title: 'Thuộc lộ trình',
      to: [{ type: 'karateTrack' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'level',
      type: 'string',
      title: 'Độ khó',
      options: {
        list: ['Beginner', 'Intermediate', 'Advanced'],
        layout: 'radio',
      },
      initialValue: 'Beginner',
    }),
    defineField({
      name: 'techniques',
      type: 'array',
      title: 'Kỹ thuật trong buổi',
      description: 'Chỉ chọn bài tập có type: karate_technique hoặc karate_kata',
      of: [{ type: 'reference', to: [{ type: 'exercise' }] }],
    }),
    defineField({
      name: 'warmup',
      type: 'reference',
      title: 'Khởi động',
      to: [{ type: 'exercise' }],
    }),
    defineField({
      name: 'cooldown',
      type: 'reference',
      title: 'Giãn cơ',
      to: [{ type: 'exercise' }],
    }),
    defineField({
      name: 'durationEstimate',
      type: 'number',
      title: 'Thời gian ước tính (phút)',
      initialValue: 45,
    }),
    defineField({
      name: 'notes',
      type: 'text',
      title: 'Ghi chú huấn luyện viên',
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'sessionId',
      week: 'week',
      level: 'level',
    },
    prepare({ title, subtitle, week, level }) {
      return {
        title: `Tuần ${week} - ${title}`,
        subtitle: `${subtitle} • ${level}`,
      }
    },
  },
})