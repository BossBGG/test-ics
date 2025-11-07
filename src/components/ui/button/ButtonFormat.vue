<script setup lang="ts">
import { computed } from "vue";
import { Button, type ButtonVariants } from ".";
import { cn } from "~/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

type ButtonFormat =
  | "default"
  | "cancelworkorderrequest"
  | "editquotation"
  | "printquotation"
  | "back"
  | "createworkorder"
  | "uploadMOIform"
  | "printMOIform"
  | "endICS"
  | "createreferncerequestform"
  | "editworkorderform"
  | "confirm"
  | "close"
  | "workclosurenotapproved"
  | "workclosureapproved"
  | "finishedwork"
  | "re_entertransaction";

interface ButtonFormatProps {
  format: ButtonFormat;
  onClick?: (...args: any[]) => void;
  class?: string;
  size?: "default" | "sm" | "lg" | "icon";
  options?: Array<string | { label: string; value: any }>;
  onSelect?: (value: any) => void;
}

const props = withDefaults(defineProps<ButtonFormatProps>(), {
  size: "default",
  options: () => [],
});

const buttonFormats: Record<
  ButtonFormat,
  {
    label: string;
    variant: ButtonVariants["variant"];
    icon?: string;
    dropdown?: boolean;
  }
> = {
  // Config for button
  default: {
    label: "",
    variant: "default",
  },
  // ยกเลิกใบสั่งงานคำร้อง : <ButtonFormat format="cancelworkorderrequest" @click=""/>
  cancelworkorderrequest: {
    label: "ยกเลิกใบสั่งงานคำร้อง",
    variant: "cancelworkorderrequest",
  },
  // แก้ไขใบเสนอราคา : <ButtonFormat format="editquotation" @click=""/>
  editquotation: {
    label: "แก้ไขใบเสนอราคา ",
    variant: "editquotation",
  },
  // พิมพ์ใบเสนอราคา : <ButtonFormat format="printquotation" @click=""/>
  printquotation: {
    label: "พิมพ์ใบเสนอราคา",
    variant: "printquotation",
  },
  // ย้อนกลับ : <ButtonFormat format="back" @click=""/>
  back: {
    label: "ย้อนกลับ",
    variant: "back",
  },
  // สร้างใบงาน : <ButtonFormat format="createworkorder" @click=""/>
  createworkorder: {
    label: "สร้างใบงาน",
    icon: "/assets/images/save-btn.png",
    variant: "createworkorder",
  },
  // อัพโหลด มท. : <ButtonFormat format="uploadMOIform" @click=""/>
  uploadMOIform: {
    label: "อัพโหลด มท.",
    icon: "/assets/images/upload-white-icon.png",
    variant: "uploadMOIform",
  },
  // พิมพ์เอกสาร ใบ มท. :
  /* <ButtonFormat 
    format="printMOIform" 
    :options="[
      { label: 'พิมพ์ มท. (ขนาด A4)', value: '' },
      { label: 'พิมพ์ มท. (ขนาด A5)', value: '' }
    ]"
    @select="(value) => console.log('Selected:', value)"
  /> */

  printMOIform: {
    label: "พิมพ์เอกสาร ใบ มท.",
    icon: "/assets/images/print.png",
    variant: "printMOIform",
    dropdown: true,
  },
  // สิ้นสุดการกระบวนการบน ICS ดำเนินการต่อบน SAP : <ButtonFormat format="endICS" @click=""/>
  endICS: {
    label: "สิ้นสุดการกระบวนการบน ICS ดำเนินการต่อบน SAP",
    variant: "endICS",
  },
  // สร้าง/อ้างอิง ใบคำร้อง :
  /* <ButtonFormat 
    format="createreferncerequestform" 
    :options="[
      { label: 'สร้างใบคำร้องใหม่', value: '' },
      { label: 'อ้างอิงใบคำร้อง', value: '' },
      { label: 'อ้างอิงใบสั่งงาน', value: '' }
    ]"
    @select="(value) => console.log('Selected:', value)"
  /> */
  
  createreferncerequestform: {
    label: "สร้าง/อ้างอิง ใบคำร้อง",
    icon: "/assets/images/save-btn.png",
    variant: "createreferncerequestform",
    dropdown: true,
  },
  // แก้ไขใบงาน : <ButtonFormat format="editworkorderform" @click=""/>
  editworkorderform: {
    label: "แก้ไขใบงาน",
    icon: "/assets/images/edit-icon.png",
    variant: "editworkorderform",
  },
  // ยืนยัน :   <ButtonFormat format="confirm" @click=""/>
  confirm: {
    label: "ยืนยัน",
    variant: "confirm",
  },
  // ปิด :   <ButtonFormat format="close" @click=""/>
  close: {
    label: "ปิด",
    variant: "close",
  },
  // ไม่อนุมัติปิดงาน :  <ButtonFormat format="workclosurenotapproved" @click=""/>
  workclosurenotapproved: {
    label: "ไม่อนุมัติปิดงาน",
    variant: "workclosurenotapproved",
  },
  // อนุมัติปิดงาน :   <ButtonFormat format="workclosureapproved" @click=""/>
  workclosureapproved: {
    label: "อนุมัติปิดงาน",
    variant: "workclosureapproved",
  },
  // จบงาน : <ButtonFormat format="finishedwork" @click=""/>
  finishedwork: {
    label: "จบงาน",
    variant: "finishedwork",
  },
  // ทำรายการใหม่อีกครั้ง : <ButtonFormat format="re_entertransaction" @click=""/>
  re_entertransaction: {
    label: "ทำรายการใหม่อีกครั้ง",
    variant: "re_entertransaction",
  },
};

const config = computed(() => buttonFormats[props.format]);
const isOpen = ref(false);

const handleSelect = (value: any) => {
  if (props.onSelect) {
    props.onSelect(value);
  }
};
</script>

<template>
  <DropdownMenu v-if="config.dropdown" v-model:open="isOpen">
    <DropdownMenuTrigger as-child>
      <Button
        :variant="config.variant"
        :size="props.size"
        :class="
          cn('inline-flex items-center gap-2 w-[240px] h-[48px]', props.class)
        "
      >
        <img
          v-if="config.icon"
          :src="config.icon"
          class="w-4 h-4 flex-shrink-0"
          alt=""
        />
        <span>{{ config.label }}</span>
        <svg
          :class="
            cn(
              'w-4 h-4 flex-shrink-0 transition-transform duration-200',
              isOpen && '-rotate-180',
            )
          "
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-[240px]">
      <DropdownMenuItem
        v-for="option in props.options"
        :key="typeof option === 'string' ? option : option.value"
        :class="
          cn(
            props.format === 'createreferncerequestform' &&
              'hover:bg-[#9A3E7E] hover:text-white focus:bg-[#9A3E7E] focus:text-white data-[highlighted]:bg-[#9A3E7E] data-[highlighted]:text-white',
          )
        "
        @click="
          handleSelect(typeof option === 'string' ? option : option.value)
        "
      >
        {{ typeof option === "string" ? option : option.label }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <Button
    v-else
    :variant="config.variant"
    :size="props.size"
    :class="
      cn(
        'inline-flex items-center gap-2 h-[48px]',
        props.format === 'endICS' ? 'w-[320px]' : 'w-[240px]',
        props.class,
      )
    "
    @click="props.onClick"
  >
    <img
      v-if="config.icon"
      :src="config.icon"
      class="w-4 h-4 flex-shrink-0"
      alt=""
    />
    <span :class="cn('truncate', props.format === 'endICS' && 'text-sm')">{{
      config.label
    }}</span>
  </Button>
</template>
