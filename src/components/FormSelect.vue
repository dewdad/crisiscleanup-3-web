<template>
  <v-select
    :value="value"
    :options="options"
    :label="label"
    :components="{ OpenIndicator }"
    :searchable="searchable"
    :multiple="multiple"
    :clearable="clearable"
    :disabled="disabled"
    class="form-select text-base"
    :class="[selectClasses, isInvalid && !value ? 'invalid' : '']"
    :placeholder="placeholder"
    :reduce="item => (itemKey ? item[itemKey] : item)"
    :selectable="
      () => !multiple || (multiple && limit > 0 && value.length < limit)
    "
    @input="onInput"
    @search:focus="open"
  >
    <template v-if="required" #search="{attributes, events}">
      <input
        ref="input"
        class="vs__search"
        :required="!value"
        :readonly="false"
        v-bind="attributes"
        v-on="events"
      />
    </template>
  </v-select>
</template>

<script>
export default {
  name: 'FormSelect',
  props: {
    searchable: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    selectClasses: {
      type: String,
      default: '',
    },
    options: {
      type: Array,
      default: () => {
        return [];
      },
    },
    limit: {
      type: Number,
      default: 0,
    },
    placeholder: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: 'large',
    },
    value: {
      type: null,
      default: null,
    },
    itemKey: {
      type: null,
      default: null,
    },
  },
  data() {
    return {
      isInvalid: false,
      OpenIndicator: {
        render() {
          return (
            <font-awesome-icon
              size="sm"
              icon="sort"
              class="mx-1 text-crisiscleanup-dark-400"
            />
          );
        },
      },
    };
  },
  mounted() {
    this.id = this._uid;
    if (this.required) {
      this.$refs.input.addEventListener(
        'invalid',
        () => {
          this.isInvalid = true;
        },
        true,
      );
    }
  },
  methods: {
    onInput(value) {
      this.$emit('input', value);
      if (this.required) {
        if (this.$refs.input.checkValidity()) {
          this.isInvalid = false;
        }
      }
    },
    open() {
      this.$nextTick(() => {
        const items = [].slice.call(
          document.querySelectorAll('.vs__dropdown-option'),
        );

        items.forEach(item => {
          item.classList.remove('vs__dropdown-option--highlight');
        });

        const selected = items.find(item => {
          if (this.value) {
            const currentLabel = this.label
              ? this.value[this.label]
              : this.value;
            return item.textContent.trim() === currentLabel;
          }
          return false;
        });

        if (selected) {
          selected.classList.add('vs__dropdown-option--highlight');
          document.querySelector('.vs__dropdown-menu').scrollTop =
            selected.offsetTop;
        }
      });
    },
  },
};
</script>

<style>
@import '~vue-select/dist/vue-select.css';
.form-select .vs__dropdown-menu {
  border-radius: 0;
}
.form-select .vs__dropdown-toggle {
  height: 100%;
  border-radius: 0;
  border: none;
}
.form-select .vs__search::placeholder {
  @apply text-crisiscleanup-dark-200;
}

.form-select.invalid {
  @apply border border-crisiscleanup-red-100;
}

.vue-select-up.form-select .vs__dropdown-menu {
  top: auto !important;
  bottom: calc(100% - 3px);
}
</style>
