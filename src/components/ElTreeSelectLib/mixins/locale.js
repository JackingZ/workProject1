import { t } from '@/components/ElTreeSelectLib/locale'

export default {
  methods: {
    t(...args) {
      return t.apply(this, args)
    }
  }
}
