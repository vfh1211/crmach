<template>
  <ul
    class="sidenav app-sidenav"
    :class="{ open: value }"
  >
    <router-link
      v-for="link in links"
      :key="link.url"
      tag="li"
      active-class="active"
      :to="link.url"
      :exact="link.exact"
    >
      <a
        href="#"
        class="waves-effect waves-orange pointer"
      >{{ link.title }}</a>
    </router-link>
  </ul>
</template>

<script>
import localizeFilter from '../../../filters/localize.filter'
export default {
  props: ['value'],
  data: () => ({
    links: [
      { title: localizeFilter('Home'), url: '/', exact: true },
      { title: localizeFilter('Balance_Sheet'), url: '/balanceSheet' },
      { title: localizeFilter('Menu_New_Fees'), url: '/record' },
      { title: localizeFilter('Menu_Students'), url: '/students' },
      { title: localizeFilter('Menu_Contract'), url: '/contract' }
    ]
  })
}
</script>
