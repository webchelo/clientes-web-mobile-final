<!-- src/components/MainInput.vue -->
<template>
    <div>
        <MainLabel v-if="label" :for="id" class="block text-sm font-medium text-gray-700">
            {{ label }}
        </MainLabel>
        <input
            :type="type"
            :id="id"
            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-100"
            :disabled="disabled"
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
            :required="required"
            :placeholder="placeholder"
            :minlength="minlength"
        >
    </div>
</template>

<script>
import MainLabel from './MainLabel.vue';

export default {
    name: 'MainInput',
    components: { MainLabel },
    props: {
        id: {
            type: String,
            required: true
        },
        type: {
            type: String,
            default: 'text'
        },
        modelValue: {
            type: [String, Number],
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        },
        required: {
            type: Boolean,
            default: false
        },
        placeholder: {
            type: String,
            default: ''
        },
        minlength: {
            type: [String, Number],
            default: null
        },
        label: {
            type: String,
            default: ''
        }
    },
    emits: ['update:modelValue']
}
</script>