<script setup lang="ts">
// One section head: Label eyebrow, heading and optional lead (DESIGN.md "Section heads").
//
// The layout is one of the three sanctioned ones and is published as `data-head`, so a page can
// be checked for the No-Echo Rule (two consecutive heads never share a layout). The eyebrow,
// heading and lead stay direct siblings in every layout: `v-reveal.head` groups a head by shared
// parent, so they still arrive as one unit. The `aside` slot replaces the lead with the section's
// one action (a split head with a button on the heading's last line).
type SectionHeadLayout = 'stacked' | 'split' | 'rail'

const props = withDefaults(defineProps<{
  eyebrow: string
  title: string
  lead?: string
  layout: SectionHeadLayout
  /** The page's one lead section: the heading takes the Statement role instead of Headline. */
  statement?: boolean
  /** Section heads reveal as one unit; a few sections are static by design. */
  reveal?: boolean
  eyebrowClass?: string
  titleClass?: string
  leadClass?: string
}>(), {
  lead: undefined,
  statement: false,
  reveal: true,
  eyebrowClass: 'eyebrow',
  titleClass: '',
  leadClass: 'measure-lead'
})

const headingClass = computed(() => props.statement ? 'home-statement-heading' : 'home-section-heading')
</script>

<template>
  <div
    class="section-head"
    :data-head="layout"
    :data-head-size="statement ? 'statement' : 'headline'"
  >
    <template v-if="reveal">
      <p
        v-reveal.head
        class="section-head__eyebrow reveal"
        :class="eyebrowClass"
      >
        {{ eyebrow }}
      </p>
      <h2
        v-reveal.head
        class="section-head__title reveal text-ink-950"
        :class="[headingClass, titleClass]"
      >
        {{ title }}
      </h2>
      <p
        v-if="lead"
        v-reveal.head
        class="section-head__lead home-lead-text reveal text-ink-600"
        :class="leadClass"
      >
        {{ lead }}
      </p>
      <div
        v-else-if="$slots.aside"
        v-reveal.head
        class="section-head__lead reveal"
      >
        <slot name="aside" />
      </div>
    </template>
    <template v-else>
      <p
        class="section-head__eyebrow"
        :class="eyebrowClass"
      >
        {{ eyebrow }}
      </p>
      <h2
        class="section-head__title text-ink-950"
        :class="[headingClass, titleClass]"
      >
        {{ title }}
      </h2>
      <p
        v-if="lead"
        class="section-head__lead home-lead-text text-ink-600"
        :class="leadClass"
      >
        {{ lead }}
      </p>
      <div
        v-else-if="$slots.aside"
        class="section-head__lead"
      >
        <slot name="aside" />
      </div>
    </template>
  </div>
</template>
