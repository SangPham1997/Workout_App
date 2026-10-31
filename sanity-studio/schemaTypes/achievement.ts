import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'achievement',
  title: 'Huy hiệu / Thành tựu',
  type: 'object', // Embedded object trong siteSettings
  fields: [
    defineField({
      name: 'id',
      type: 'string',
      title: 'ID Code (Unique)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      type: 'string',
      title: 'Tên huy hiệu',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'string',
      title: 'Mô tả điều kiện mở khóa',
    }),
    defineField({
      name: 'icon',
      type: 'string',
      title: 'Icon (FontAwesome / Emoji)',
      initialValue: '🏆',
    }),
    defineField({
      name: 'category',
      type: 'string',
      title: 'Danh mục',
      options: {
        list: [
          { title: 'Thói quen (Habits)', value: 'habits' },
          { title: 'Tập luyện (Workout)', value: 'workout' },
          { title: 'Karate', value: 'karate' },
          { title: 'Xà đơn (Spine)', value: 'spine' },
          { title: 'Đặc biệt (Special)', value: 'special' },
        ],
      },
    }),
    defineField({
      name: 'condition',
      type: 'object',
      title: 'Điều kiện mở khóa (Logic config)',
      description: 'JSON config cho logic check tự động. Ví dụ: { "type": "streak", "target": 30, "source": "habits" }',
      fields: [
        defineField({ name: 'type', type: 'string', title: 'Loại (streak, count, pr, completion)' }),
        defineField({ name: 'target', type: 'number', title: 'Mục tiêu (số lượng)' }),
        defineField({ name: 'source', type: 'string', title: 'Nguồn dữ liệu (habits, workout, karate, spine)' }),
        defineField({ name: 'filter', type: 'string', title: 'Bộ lọc thêm (JSON string)' }),
      ],
    }),
    defineField({
      name: 'xpReward',
      type: 'number',
      title: 'XP thưởng',
      initialValue: 100,
    }),
    defineField({
      name: 'rarity',
      type: 'string',
      title: 'Độ hiếm',
      options: {
        list: ['Common', 'Rare', 'Epic', 'Legendary'],
        layout: 'radio',
      },
      initialValue: 'Common',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'id',
      icon: 'icon',
      rarity: 'rarity',
    },
    prepare({ title, subtitle, icon, rarity }) {
      const rarityColors: Record<string, string> = {
        Common: '⚪',
        Rare: '🔵',
        Epic: '🟣',
        Legendary: '🟡',
      }
      return {
        title: `${icon || '🏆'} ${title}`,
        subtitle: `${rarityColors[rarity] || ''} ${rarity} • ${subtitle}`,
      }
    },
  },
})