::: title 基础使用
:::

::: block 使 用 useBoolean 创 建 布 尔 类 型 的 Ref 响 应 变 量
:::

```vue
<script>
import { useBoolean } from '@layui/hooks-vue'

export default {
  setup() {
    const { setTrue, setFalse } = useBoolean(true)
    return {
        setTrue,
        setFalse
    }
  },
}
</script>
```