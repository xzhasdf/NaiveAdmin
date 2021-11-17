import { ExtractPropTypes, PropType } from 'vue'

export const statusTagProps = {
  type: {
    type: String as PropType<
      'default' | 'success' | 'info' | 'warning' | 'error' | 'black'
    >,
    default: 'default',
  },
  size: {
    type: String as PropType<'default' | 'large'>,
    default: 'default',
  },
  shape: {
    type: String as PropType<'default' | 'square' | 'round'>,
    default: 'default',
  },
  bold: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
}

type tStatusTag = ExtractPropTypes<typeof statusTagProps>
export type TStatusTag = Partial<tStatusTag>
