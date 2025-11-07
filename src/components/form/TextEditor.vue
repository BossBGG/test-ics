<script setup>
import { computed, ref } from "vue";
import {
  BlockQuote,
  Bold,
  ClassicEditor,
  ColorGridView,
  Essentials,
  Heading,
  HorizontalLine,
  ImageUpload,
  Italic,
  Link,
  Paragraph,
  Strikethrough,
  Table,
  Underline,
} from "ckeditor5";
import { Ckeditor } from "@ckeditor/ckeditor5-vue";

import "ckeditor5/ckeditor5.css";

const data = ref("");
const config = computed(() => {
  return {
    licenseKey: "GPL", // GPL license for open source usage
    plugins: [
      Essentials,
      Paragraph,
      Bold,
      Italic,
      Heading,
      Underline,
      Strikethrough,
      Table,
      Link,
      BlockQuote,
      HorizontalLine,
      ColorGridView,
      ImageUpload,
    ],
    toolbar: {
      items: [
        "undo",
        "redo",
        "|",
        "heading",
        "|",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "bulletedList",
        "numberedList",
        "|",
        "alignment",
        "|",
        "outdent",
        "indent",
        "|",
        "link",
        "unlink",
        "insertImage",
        "insertTable",
        "|",
        "blockQuote",
        "horizontalLine",
        "codeBlock", // Added codeBlock based on common use,
        // though it might be 'code' or similar depending on exact build
        "sourceEditing", // This is typically how you get the '< />' button
      ],
      // The `shouldNotGroupWhenFull` property comes in handy if you have a lot of items in the toolbar.
      // It will prevent toolbar items from grouping into a dropdown if there's enough space.
      shouldNotGroupWhenFull: true,
    },
  };
});
</script>

<template>
  <Ckeditor v-model="data" :editor="ClassicEditor" :config="config" />
</template>

<style>
.input-textarea-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  width: 100%; /* Make it responsive */
}

.textarea-label {
  color: #333;
  margin-bottom: 8px;
  align-self: flex-start; /* Aligns the label to the left */
}

.textarea-label .required {
  color: #e74c3c; /* Red color for asterisk */
  font-weight: bold;
}

.textarea-field {
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  color: #333;
  outline: none; /* Remove default focus outline */
  transition:
    border-color 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
  width: 100%; /* Make textarea fill its container */
  box-sizing: border-box; /* Include padding and border in the element's total width and height */
  resize: vertical; /* Allow vertical resizing by user, but not horizontal */
  min-height: 100px; /* Minimum height */
}

.textarea-field::placeholder {
  color: #999;
}

.textarea-field:focus {
  border-color: #8a2be2; /* Purple focus border */
  box-shadow: 0 0 0 3px rgba(138, 43, 226, 0.2); /* Light purple glow */
}
</style>
