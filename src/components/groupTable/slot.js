export default {
  name: 'TableSlot',
  functional: true,
  inject: ['tableRoot'],
  props: {
    row: { type: Object, default: {} },
    column: {
      type: Object,
      default: null
    }
  },
  render: (h, ctx) => {
    return h(
      'div',
      ctx.props.column.renderSlot({
        row: ctx.props.row,
        column: ctx.props.column
      })
    )
  }
}
