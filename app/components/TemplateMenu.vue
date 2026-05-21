<script setup lang="ts">
const templates = [
  {
    label: 'Starter',
    to: 'https://starter-template.nuxt.dev/'
  },
  {
    label: 'Landing',
    to: 'https://landing-template.nuxt.dev/'
  },
  {
    label: 'Docs',
    to: 'https://docs-template.nuxt.dev/'
  }
]
</script>

<template>
  <UDropdownMenu
    v-slot="{ open }"
    :modal="false"
    :items="templates"
    :content="{ align: 'start' }"
    :ui="{ content: 'min-w-fit' }"
    size="xs"
  >
    <UButton
      label="Starter"
      variant="subtle"
      trailing-icon="i-lucide-chevron-down"
      size="xs"
      class="-mb-1.5 truncate rounded-full font-semibold"
      :class="[open && 'bg-primary/15']"
      :ui="{
        trailingIcon: [
          'transition-transform duration-200',
          open ? 'rotate-180' : undefined
        ]
          .filter(Boolean)
          .join(' ')
      }"
    />
  </UDropdownMenu>
</template>
