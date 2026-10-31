import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'exerciseCategory',
  title: 'Danh mục bài tập',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Tên danh mục',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Mô tả',
      rows: 2,
    }),
    defineField({
      name: 'icon',
      type: 'string',
      title: 'Icon (FontAwesome)',
      description: 'Ví dụ: fa-dumbbell, fa-fire, fa-heart-pulse',
    }),
    defineField({
      name: 'order',
      type: 'number',
      title: 'Thứ tự',
      initialValue: 0,
    }),
  ],
})