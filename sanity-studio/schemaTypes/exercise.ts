import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'exercise',
  title: 'Bài tập / Kỹ thuật',
  type: 'document',
  fields: [
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: { source: 'name' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      type: 'string',
      title: 'Tên bài tập (Tiếng Việt)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'nameEn',
      type: 'string',
      title: 'Tên tiếng Anh',
    }),

    // Media
    defineField({
      name: 'videoUrl',
      type: 'url',
      title: 'YouTube Video URL',
      validation: (Rule) => Rule.required().uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'thumbnail',
      type: 'image',
      title: 'Ảnh Thumbnail',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt text',
        }),
      ],
    }),
    defineField({
      name: 'gifUrl',
      type: 'url',
      title: 'GIF Demo URL (Loop, Mute)',
      description: 'Dùng cho preview nhanh trong list, tối ưu băng thông',
    }),

    // Classification
    defineField({
      name: 'category',
      type: 'reference',
      title: 'Danh mục chính',
      to: [{ type: 'exerciseCategory' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'muscleGroups',
      type: 'array',
      title: 'Nhóm cơ chính',
      of: [{ type: 'reference', to: [{ type: 'muscleGroup' }] }],
    }),
    defineField({
      name: 'equipment',
      type: 'array',
      title: 'Thiết bị cần thiết',
      of: [{ type: 'reference', to: [{ type: 'equipment' }] }],
    }),
    defineField({
      name: 'difficulty',
      type: 'string',
      title: 'Độ khó',
      options: {
        list: ['Beginner', 'Intermediate', 'Advanced'],
        layout: 'radio',
      },
      initialValue: 'Beginner',
    }),

    // Execution Details (Quan trọng cho Timer/UI)
    defineField({
      name: 'exerciseType',
      type: 'string',
      title: 'Loại bài tập',
      options: {
        list: [
          { title: 'Lặp lại (Reps/Sets)', value: 'reps' },
          { title: 'Giữ tĩnh (Hold/Plank)', value: 'hold' },
          { title: 'Kỹ thuật Karate', value: 'karate_technique' },
          { title: 'Kata/Định tuyến', value: 'karate_kata' },
          { title: 'Khởi động/Giãn cơ', value: 'warmup' },
        ],
      },
      initialValue: 'reps',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'defaultSets',
      type: 'number',
      title: 'Số hiệp mặc định',
      initialValue: 3,
      hidden: ({ parent }) => parent?.exerciseType === 'karate_kata' || parent?.exerciseType === 'warmup',
    }),
    defineField({
      name: 'defaultReps',
      type: 'string',
      title: 'Số lần/Thời gian mặc định',
      description: 'Ví dụ: "10-12", "30s", "Max", "3x10"',
      initialValue: '10-12',
    }),
    defineField({
      name: 'restSeconds',
      type: 'number',
      title: 'Nghỉ giữa các hiệp (giây)',
      initialValue: 60,
    }),
    defineField({
      name: 'prepareSeconds',
      type: 'number',
      title: 'Thời gian chuẩn bị (giây)',
      initialValue: 10,
    }),

    // Content (Portable Text)
    defineField({
      name: 'instructions',
      type: 'array',
      title: 'Hướng dẫn chi tiết',
      of: [{ type: 'block' }, { type: 'image' }],
    }),
    defineField({
      name: 'commonMistakes',
      type: 'array',
      title: 'Lỗi thường gặp',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'tips',
      type: 'array',
      title: 'Mẹo/Chú ý quan trọng',
      of: [{ type: 'block' }],
    }),

    // Progression (Cho PR Tracking)
    defineField({
      name: 'isTrackable',
      type: 'boolean',
      title: 'Theo dõi PR (Max Reps/Time/Weight)?',
      initialValue: true,
    }),
    defineField({
      name: 'progressionUnit',
      type: 'string',
      title: 'Đơn vị tiến bộ',
      options: {
        list: [
          { title: 'Số lần (Reps)', value: 'reps' },
          { title: 'Thời gian (Seconds)', value: 'seconds' },
          { title: 'Trọng lượng (Kg)', value: 'kg' },
          { title: 'Cấp độ/Level', value: 'level' },
        ],
      },
      initialValue: 'reps',
    }),
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'nameEn',
      media: 'thumbnail',
      type: 'exerciseType',
      difficulty: 'difficulty',
    },
    prepare({ title, subtitle, media, type, difficulty }) {
      const typeLabels: Record<string, string> = {
        reps: '🔁 Reps',
        hold: '⏱️ Hold',
        karate_technique: '🥋 Technique',
        karate_kata: '📜 Kata',
        warmup: '🌡️ Warmup',
      }
      return {
        title,
        subtitle: `${subtitle ? `${subtitle} • ` : ''}${typeLabels[type] || type} • ${difficulty}`,
        media,
      }
    },
  },
})