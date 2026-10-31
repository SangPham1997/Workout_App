import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'workoutProgram',
  title: 'Chương trình tập luyện',
  type: 'document',
  fields: [
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug (URL)',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      type: 'string',
      title: 'Tên chương trình',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Mô tả',
      rows: 3,
    }),
    defineField({
      name: 'icon',
      type: 'string',
      title: 'Icon Class (FontAwesome)',
      description: 'Ví dụ: fa-dumbbell, fa-spine, fa-hand-fist',
      initialValue: 'fa-dumbbell',
    }),
    defineField({
      name: 'colorTheme',
      type: 'string',
      title: 'Theme Color',
      options: {
        list: ['rose', 'blue', 'emerald', 'amber', 'violet', 'orange', 'cyan'],
        layout: 'radio',
      },
      initialValue: 'rose',
    }),
    defineField({
      name: 'programType',
      type: 'string',
      title: 'Loại chương trình',
      options: {
        list: [
          { title: 'Hàng tuần (Weekly Program)', value: 'weekly' },
          { title: 'Thư viện bài tập (Library)', value: 'library' },
          { title: 'Karate (Track/Session)', value: 'karate' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'weeks',
      type: 'array',
      title: 'Các Tuần (Chỉ cho Weekly)',
      of: [{ type: 'reference', to: [{ type: 'workoutWeek' }] }],
      hidden: ({ parent }) => parent?.programType !== 'weekly',
    }),
    defineField({
      name: 'categories',
      type: 'array',
      title: 'Danh mục (Chỉ cho Library)',
      of: [{ type: 'reference', to: [{ type: 'exerciseCategory' }] }],
      hidden: ({ parent }) => parent?.programType !== 'library',
    }),
    defineField({
      name: 'tracks',
      type: 'array',
      title: 'Lộ trình (Chỉ cho Karate)',
      of: [{ type: 'reference', to: [{ type: 'karateTrack' }] }],
      hidden: ({ parent }) => parent?.programType !== 'karate',
    }),
    defineField({
      name: 'order',
      type: 'number',
      title: 'Thứ tự hiển thị',
      initialValue: 0,
    }),
    defineField({
      name: 'isActive',
      type: 'boolean',
      title: 'Kích hoạt',
      initialValue: true,
    }),
  ],
})