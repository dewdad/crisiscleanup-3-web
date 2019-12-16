<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container bg-white flex flex-col justify-between" :class="modalClasses" :style="modalStyle">

                    <div class="modal-header flex-shrink">
                        <slot name="header">

                        </slot>
                    </div>

                    <div class="modal-body flex-grow">
                        <slot></slot>
                    </div>

                    <div class="modal-footer flex-shrink">
                        <slot name="footer">
                            <div class="flex items-center justify-center py-3 border-t">
                                <base-button type="primary" class="px-6 p-3" :action="() => { $emit('close') }">
                                    OK
                                </base-button>
                            </div>
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        name: "Modal",
        props: ['modalClasses', 'modalStyle']
    }
</script>

<style scoped>
    .modal-mask {
        position: fixed;
        z-index: 9998;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
        display: table;
        transition: opacity .3s ease;
    }

    .modal-wrapper {
        display: table-cell;
        vertical-align: middle;
    }

    .modal-container {
        margin: 0px auto;
        transition: all .3s ease;
    }

    .modal-default-button {
        float: right;
    }

    /*
     * The following styles are auto-applied to elements with
     * transition="modal" when their visibility is toggled
     * by Vue.js.
     *
     * You can easily play with the modal transition by editing
     * these styles.
     */

    .modal-enter {
        opacity: 0;
    }

    .modal-leave-active {
        opacity: 0;
    }

    .modal-enter .modal-container,
    .modal-leave-active .modal-container {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
    }
</style>