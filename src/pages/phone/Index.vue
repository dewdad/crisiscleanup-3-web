<template>
  <div class="p-6 bg-gray-100 h-full overflow-auto relative">
    <div v-if="!loading">
      <div class="flex">
        <div class="w-1/4 m-35 p-6 shadow text-base bg-white relative">
          <contact-card></contact-card>
        </div>
        <div class="w-1/4 m-10 p-6 shadow bg-white relative">
          <h1>Hello</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ContactCard from '../../components/ContactCard.vue';

export default {
  components: {
    'contact-card': ContactCard,
  },
};
</script>
