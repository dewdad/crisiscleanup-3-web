<template>
    <button v-bind:class="styles" @click="performAction" :disabled="disabled" :type="type" :size="size">
        <font-awesome-icon v-if="loading" size="sm" icon="spinner" spin /> <font-awesome-icon v-if="icon" class="mx-1" :icon="icon" /> {{title}}
    </button>
</template>

<script>
    export default {
        name: "BaseButton",
        data() {
            return {
                disabled: false,
                loading: false,
                styles: {
                    'text-lg': this.size === 'large',
                    'text-base': this.size === 'medium',
                    small: this.size === 'small',

                    primary: this.type === 'primary',
                    danger: this.type === 'danger',
                    warning: this.type === 'warning',
                    link: this.type === 'link',
                }
            };
        },
        props: {
            action: {
                type: Function,
                default: () => {
                },
            },
            title: String,
            type: String,
            size: String,
            icon: String,
        },
        methods: {
            async performAction() {
                this.disabled = true;
                this.loading = true;

                try {
                    await this.action();
                } catch (e) {

                } finally {
                    this.disabled = false;
                    this.loading = false;
                }
            },
        },
    }
</script>

<style scoped>
    button {
        outline: 0;
    }
    .primary {
        background-color: #fece09
    }
</style>