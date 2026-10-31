import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'muscleGroup',
  title: 'Nhóm cơ',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Tên nhóm cơ',
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
      name: 'bodyRegion',
      type: 'string',
      title: 'Vùng cơ thể',
      options: {
        list: ['Upper Body', 'Lower Body', 'Core', 'Full Body', 'Cardio'],
      },
    }),
  ],
})