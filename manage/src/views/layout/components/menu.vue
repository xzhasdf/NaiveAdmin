<template>
  <n-element>
    <div class="quick-search" v-if="!collapsed && ifShowSearch">
      <n-auto-complete
        :options="options"
        v-model:value="keyword"
        placeholder="快捷搜索"
        clear-after-select
        blur-after-select
        clearable
        :on-select="handleSelected"
      >
        <template #prefix>
          <n-icon>
            <search-icon></search-icon>
          </n-icon>
        </template>
      </n-auto-complete>
    </div>
    <n-menu
      :icon-size="14"
      :collapsed-icon-size="20"
      :root-indent="18"
      :indent="24"
      :collapsed-width="56"
      :collapsed="collapsed"
      :inverted="inverted"
      :accordion="accordion"
      :options="menu"
      :value="defaultMenu"
      :on-update:value="handleSelected"
      :expanded-keys="expandedKeys"
      :on-update:expanded-keys="handleExpanded"
    />
  </n-element>
</template>

<script setup lang="ts">
import SearchIcon from '@vicons/ionicons5/SearchOutline'
import { NElement, NMenu, NAutoComplete, useThemeVars, NIcon } from 'naive-ui'
const themeVars = useThemeVars()
import { ref, computed, watch, inject, Ref } from 'vue'

import { useStore } from '@/hooks/useStore'
const store = useStore()

import { useRoute } from 'vue-router'
const route = useRoute()

// 快捷搜索
import { ISearchOption } from '@/authorization'
const keyword = ref('')
const options = computed(() => {
  return fuzzyQuery(store.getters.getSearchOptions, keyword.value)
  function fuzzyQuery(list: Array<ISearchOption>, keyWord: string) {
    if (!keyWord) {
      return []
    }
    keyWord = keyWord.replace(/\s*/g, '').toLowerCase()
    var arr = []
    for (var i = 0; i < list.length; i++) {
      if (
        list[i].label.match(keyWord) != null ||
        list[i].labelPinYin.match(keyWord) != null
      ) {
        arr.push(list[i])
      }
    }
    return arr
  }
})

// 渲染菜单
const inverted = inject('inverted') as Ref<boolean>
const accordion = inject('accordion') as Ref<boolean>
const collapsed = inject('collapsed') as Ref<boolean>
const ifShowIcon = inject('ifShowIcon') as Ref<boolean>
const ifShowSearch = inject('ifShowSearch') as Ref<boolean>
const menu = computed(() => {
  const showIcon = collapsed.value ? true : ifShowIcon.value
  return store.getters.getMenu(showIcon)
})

// 初始化菜单状态并配合当前路由实时选中、展开、修改网页标题
const defaultMenu = computed(() => route.meta.menuKey as string)
const expandedKeys = ref((route.meta.expandedKey as string).split(','))
watch(
  () => [route.name, accordion.value],
  () => {
    document.title = route.meta.label + ' - 海獭 Design'
    if (route.name != 'Redirect') {
      setExpandedKeys()
    }
  },
  { immediate: true }
)

function setExpandedKeys() {
  let olds = expandedKeys.value
  let keys = (route.meta.expandedKey as string).split(',')
  let news = keys.filter((key) => !olds.includes(key))
  let finals = accordion.value ? keys : [...olds, ...news]
  expandedKeys.value = finals
}

// 菜单展开
const handleExpanded = (keys: string[]) => {
  expandedKeys.value = keys
}

const emit = defineEmits(['navigateTo'])
// 菜单选中
const handleSelected = (key: string) => {
  emit('navigateTo', {
    name: key,
    ifCurrent: key == route.name && Object.keys(route.query).length == 0,
  })
}

// vue3.2新特性 v-bind style 解决在框架主题限制下的自定义样式痛点
const activeBarColor = computed(() =>
  inverted.value ? 'transparent' : themeVars.value.primaryColor
)
const itemPos = computed(() => (inverted.value ? '8px' : '0'))
const itemRadius = computed(() =>
  inverted.value ? 'var(--border-radius)' : '0'
)
</script>

<style scoped>
.quick-search {
  padding: 18px;
}
.n-menu {
  margin-top: -6px;
  margin-bottom: -6px;
}
:deep(.n-menu .n-menu-item::before) {
  left: v-bind(itemPos);
  right: v-bind(itemPos);
  border-radius: v-bind(itemRadius);
  border-right: 3px solid transparent;
  transition: all 0.3s var(--bezier);
}
:deep(.n-menu .n-menu-item.n-menu-item--selected::before) {
  border-right: 3px solid v-bind(activeBarColor);
}
</style>
