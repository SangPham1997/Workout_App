import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'equipment',
  title: 'Thiết bị',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Tên thiết bị',
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
      name: 'icon',
      type: 'string',
      title: 'Icon (FontAwesome)',
      description: 'Ví dụ: fa-dumbbell, fa-weight-scale, fa-person-running',
    }),
    defineField({
      name: 'isBodyweight',
      type: 'boolean',
      title: 'Là thể trọng (Không cần dụng cụ)?',
      initialValue: false,
    }),
  ],
})