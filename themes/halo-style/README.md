# Halo 风格主题

简约、优雅的 Halo 博客风格主题。

## 特点

- 🪟 **毛玻璃导航栏** — 滚动时半透明模糊效果
- 🃏 **卡片式布局** — 文章以卡片形式展示（搭配前台页面使用）
- 🎨 **渐变封面图** — 无封面文章自动生成彩色渐变封面
- 🌙 **暗黑模式** — 完美兼容深色主题
- 📱 **响应式** — 手机/平板/桌面全适配

## 安装

将 `layout.vue` 复制到 `layouts/halo.vue`：

```bash
cp themes/halo-style/layout.vue layouts/halo.vue
```

然后将每个页面的 `<NuxtLayout name="default">` 改为 `<NuxtLayout name="halo">`。

或者在 Nuxt 配置中将 halo 设为默认布局。

## 二次开发

此主题作为示例，你可以：

1. 创建 `themes/你主题名/` 目录
2. 复制 `theme.json` 并修改
3. 编写自己的 `layout.vue`
4. 覆盖或新增 `components/` 目录下的组件

主题系统完整指南见 `docs/dev.md`。
