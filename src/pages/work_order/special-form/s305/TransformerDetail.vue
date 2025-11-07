<!-- src/components/worker/TransformerDetail.vue -->
<script setup lang="ts">
import {ref, h} from "vue";
import {ColumnDef} from "@tanstack/vue-table";
import DataTableEditor from "@/components/form/DataTableEditor.vue";
import {OptionApi, Options, S305ServiceData, S305TransformerServiceData, WorkOrderObj} from "~/api/types"
import {
  getTransformerBrandOptions,
  getTransformerPhaseOptions,
  getTransformerSizeOptions,
  getTransformerTypeOptions, getTransformerVoltageOptions
} from "~/api/work_order_api";
import InputSelect from "~/components/ui/table-editor/InputSelect.vue";
import {Pencil, Save, Trash2} from "lucide-vue-next";
import InputText from "~/components/ui/table-editor/InputText.vue";

const props = defineProps<{
  data: WorkOrderObj,
  reqCode: string
}>()
const tableRef = ref<InstanceType<typeof DataTableEditor>>();
const transformerData = ref<S305TransformerServiceData[]>([])
const brandOptions = ref<Options[]>([])
const phaseOptions = ref<Options[]>([])
const typeOptions = ref<Options[]>([])
const sizeOptions = ref<Options[]>([])
const voltageOptions = ref<Options[]>([])

const emit = defineEmits<{
  "update:data": [value: WorkOrderObj]
}>()

onMounted(() => {
  Promise.all([
    fetchBrandOptions(),
    fetchPhaseOptions(),
    fetchTypeOptions(),
    fetchSizeOptions(),
    fetchVoltageOptions()
  ]).then(([resBrand, resPhase, resType, resSize, resVoltage]) => {
    handleMapServiceSpecData()
  })
})

watch(() => props.data?.serviceSpecificData, () => {
  let serviceSpec = props.data?.serviceSpecificData as S305ServiceData
  if(transformerData.value?.length === 0 && serviceSpec?.transformers?.length > 0) {
    handleMapServiceSpecData()
  }
}, {deep: true})

const handleMapServiceSpecData = () => {
  if(props.data?.serviceSpecificData) {
    let serviceSpec = props.data?.serviceSpecificData as S305ServiceData
    let transformerSpec = serviceSpec?.transformers as S305TransformerServiceData[]
    transformerData.value = transformerSpec?.map((transformer) => {
      return {
        ...transformer,
        brand: findLabelOptions(brandOptions.value, transformer.transformerBrandId),
        phase: findLabelOptions(phaseOptions.value, transformer.transformerPhaseId),
        type: findLabelOptions(typeOptions.value, transformer.transformerTypeId),
        size: findLabelOptions(sizeOptions.value, transformer.transformerSize),
        voltage: findLabelOptions(voltageOptions.value, transformer.transformerVoltage),
        isUpdate: true
      }
    })
    tableRef.value?.setData(transformerData.value || [])
  }else {
    tableRef.value?.setData([])
  }
}

const fetchBrandOptions = async (search: string = "") => {
  const res = await getTransformerBrandOptions(search, props.reqCode)
  if (res.status === 200 && res.data.data) {
    brandOptions.value = mapOptions(res.data.data)
  }else {
    brandOptions.value = []
  }
}

const fetchPhaseOptions = async (search: string = "") => {
  const res = await getTransformerPhaseOptions(search, props.reqCode)
  if (res.status === 200 && res.data.data) {
    phaseOptions.value = mapOptions(res.data.data)
  }else {
    phaseOptions.value = []
  }
}

const fetchTypeOptions = async (search: string = "") => {
  const res = await getTransformerTypeOptions(search, props.reqCode)
  if (res.status === 200 && res.data.data) {
    typeOptions.value = mapOptions(res.data.data)
  }else {
    typeOptions.value = []
  }
}

const fetchSizeOptions = async (search: string = "") => {
  const res = await getTransformerSizeOptions(search, props.reqCode)
  if (res.status === 200 && res.data.data) {
    sizeOptions.value = mapOptions(res.data.data)
  }else {
    sizeOptions.value = []
  }
}

const fetchVoltageOptions = async (search: string = "") => {
  const res = await getTransformerVoltageOptions(search, props.reqCode)
  if (res.status === 200 && res.data.data) {
    voltageOptions.value = mapOptions(res.data.data)
  }else {
    voltageOptions.value = []
  }
}

const mapOptions = (data: OptionApi[]) => {
  let options: Options[] = []
  data?.map((d) => {
    options.push({value: d.id, label: d.optionTitle, data: d})
  })

  return options
}

watch(() => transformerData.value, (newVal) => {
  handleUpdateData()
})

const handleUpdateData = () => {
  let serviceSpec = props.data?.serviceSpecificData as S305ServiceData
  let newData = {
    ...props.data,
    serviceSpecificData: {
      ...serviceSpec,
      transformers: transformerData.value
    }
  } as WorkOrderObj
  emit('update:data', newData)
}

const columns: ColumnDef<S305TransformerServiceData>[] = [
  {
    accessorKey: "id",
    header: "ลำดับ",
    maxSize: 5,
    cell: ({row}) => row.index + 1
  },
  {
    accessorKey: "brand",
    header: "ยี่ห้อ",
    maxSize: 50,
    cell: ({row, getValue}) => {
      const transformer = row.original;
      const value = getValue() as string;

      return transformer.isUpdate
        ? h(InputSelect, {
          modelValue: value,
          options: brandOptions.value,
          placeholder: 'ยี่ห้อ',
          onUpdate: (selection: Options) => {
            updateTransformer(row.index, 'brand', selection)
          },
          onOpen: () => {
            fetchBrandOptions("")
          },
          onChange: (s: string) => {
            fetchBrandOptions(s)
          }
        })
        : h('span', {class: 'transformer-display'}, value || 'ยังไม่ได้เลือก');
    }
  },
  {
    accessorKey: "phase",
    header: "เฟส",
    maxSize: 50,
    cell: ({row, getValue}) => {
      const transformer = row.original;
      const value = getValue() as string;

      return transformer.isUpdate
        ? h(InputSelect, {
          modelValue: value,
          options: phaseOptions.value,
          placeholder: 'เฟส',
          onUpdate: (selection: Options) => {
            updateTransformer(row.index, 'phase', selection)
          },
          onOpen: () => {
            fetchPhaseOptions("")
          },
          onChange: (s: string) => {
            fetchPhaseOptions(s)
          }
        })
        : h('span', {class: 'transformer-display'}, value || 'ยังไม่ได้เลือก');
    }
  },
  {
    accessorKey: "type",
    header: "ประเภท",
    maxSize: 50,
    cell: ({row, getValue}) => {
      const transformer = row.original;
      const value = getValue() as string;

      return transformer.isUpdate
        ? h(InputSelect, {
          modelValue: value,
          options: typeOptions.value,
          placeholder: 'ประเภท',
          onUpdate: (selection: Options) => {
            updateTransformer(row.index, 'type', selection)
          },
          onOpen: () => {
            fetchTypeOptions("")
          },
          onChange: (s: string) => {
            fetchTypeOptions(s)
          }
        })
        : h('span', {class: 'transformer-display'}, value || 'ยังไม่ได้เลือก');
    }
  },
  {
    accessorKey: "transformerSerial",
    header: "Serial",
    maxSize: 50,
    cell: ({row, getValue}) => {
      const transformer = row.original;
      const value = getValue() as string;

      return transformer.isUpdate
        ? h(InputText, {
          modelValue: value,
          placeholder: 'Serial',
          class: 'transformer-input',
          key: `serial_${row.index}`,
          onUpdate: (v: string) => {
            updateTransformer(row.index, 'transformerSerial', v)
          },
        })
        : h('span', {class: 'transformer-display'}, value || 'ยังไม่ได้กรอก');
    }
  },
  {
    accessorKey: "size",
    header: "ขนาด",
    maxSize: 50,
    cell: ({row, getValue}) => {
      const transformer = row.original;
      const value = getValue() as string;

      return transformer.isUpdate
        ? h(InputSelect, {
          modelValue: value,
          placeholder: 'ขนาด',
          key: `size_${row.index}`,
          options: sizeOptions.value,
          onUpdate: (selection: Options) => {
            updateTransformer(row.index, 'size', selection)
          },
          onOpen: () => {
            fetchSizeOptions("")
          },
          onChange: (s: string) => {
            fetchSizeOptions(s)
          }
        })
        : h('span', {class: 'transformer-display'}, value || 'ยังไม่ได้กรอก');
    }
  },
  {
    accessorKey: "voltage",
    header: "แรงดัน",
    maxSize: 50,
    cell: ({row, getValue}) => {
      const transformer = row.original;
      const value = getValue() as string;

      return transformer.isUpdate
        ? h(InputSelect, {
          modelValue: value,
          placeholder: 'แรงดัน',
          options: voltageOptions.value,
          key: `voltage_${row.index}`,
          onUpdate: (selection: Options) => {
            updateTransformer(row.index, 'voltage', selection)
          },
          onOpen: () => {
            fetchVoltageOptions("")
          },
          onChange: (s: string) => {
            fetchVoltageOptions(s)
          }
        })
        : h('span', {class: 'transformer-display'}, value || 'ยังไม่ได้กรอก');
    }
  },
  {
    id: "actions",
    header: "",
    maxSize: 20,
    cell: ({row}) => {
      const transformer = row.original;

      return h('div', {class: 'action-buttons'}, [
        transformer.isUpdate
          ? h('button', {
            class: 'action-btn save-table-btn',
            title: 'บันทึก',
            onClick: () => saveTransformer(row.index)
          }, h(Save, { size: 18, class: 'text-[#994C80] cursor-pointer' }))
          : h('button', {
            class: 'action-btn edit-table-btn',
            title: 'แก้ไข',
            onClick: () => editTransformer(row.index)
          }, h(Pencil, { size: 18, class: 'text-[#994C80] cursor-pointer' })),
        h('button', {
          class: 'action-btn delete-table-btn',
          title: 'ลบรายการ',
          onClick: () => removeTransformer(row.index)
        }, h(Trash2, { size: 18, class: 'text-[#994C80] cursor-pointer' }))
      ]);
    }
  }
];

const addTransformer = () => {
  const currentData = tableRef.value?.getData() || [];
  const newTransformer = {
    isUpdate: true
  } as Transformer

  transformerData.value = [...currentData, newTransformer];
  tableRef.value?.setData(transformerData.value);
  setTimeout(() => {
    tableRef.value?.setLastPageIndex();
  }, 200)
};

const removeTransformer = (index: number) => {
  tableRef.value?.removeData(index);
  transformerData.value = tableRef.value?.getData() || [];
};

const saveTransformer = (index: number) => {
  let currentData = tableRef.value?.getData() || [];
  currentData = currentData ? currentData[index] : null

  if (currentData
    && currentData.transformerBrandId
    && currentData.transformerPhaseId
    && currentData.transformerTypeId
    && currentData.transformerSerial
    && currentData.transformerSize
    && currentData.transformerVoltage
   ) {
    tableRef.value?.updateData(index, "isUpdate", false);
    transformerData.value = tableRef.value?.getData() || []
  } else {
    alert("กรุณากรอกข้อมูลให้ครบถ้วน");
  }
};

const editTransformer = (index: number) => {
  tableRef.value?.updateData(index, "isUpdate", true);
  transformerData.value = tableRef.value?.getData() || [];
};

const updateTransformer = (rowIndex: number, field: keyof S305TransformerServiceData, value: Options | string) => {
  switch (field) {
    case "brand":
      let brandItem = value as Options
      tableRef.value?.updateData(rowIndex, "transformerBrandId", brandItem.value);
      tableRef.value?.updateData(rowIndex, "brand", brandItem.label);
      break;
    case "phase":
      let phaseItem = value as Options
      tableRef.value?.updateData(rowIndex, "transformerPhaseId", phaseItem.value);
      tableRef.value?.updateData(rowIndex, "phase", phaseItem.label);
      break;
    case "type":
      let typeItem = value as Options
      tableRef.value?.updateData(rowIndex, "transformerTypeId", typeItem.value);
      tableRef.value?.updateData(rowIndex, "type", typeItem.label);
      break;
    case "size":
      let sizeItem = value as Options
      tableRef.value?.updateData(rowIndex, "transformerSize", sizeItem.value);
      tableRef.value?.updateData(rowIndex, "size", sizeItem.label);
      break;
    case "voltage":
      let voltageItem = value as Options
      tableRef.value?.updateData(rowIndex, "transformerVoltage", voltageItem.value);
      tableRef.value?.updateData(rowIndex, "voltage", voltageItem.label);
      break;
    default:
      tableRef.value?.updateData(rowIndex, field, value);
      break;
  }

  transformerData.value = tableRef.value?.getData() || [];
};

const findLabelOptions = (options: Options[] = [], value: string = "") => {
  return options.find((option: Options) => option.value === value)?.label || value
}

const clearAllData = () => {
  tableRef.value?.setData([]);
  transformerData.value = []
};
</script>

<template>
  <div>
    <div class="pb-4">รายละเอียดหม้อแปลง</div>

    <DataTableEditor
      ref="tableRef"
      :columns="columns"
    />

    <!-- Bottom Action Buttons -->
    <div class="equipment-actions">
      <button class="action-btn-bottom clear-btn" @click="clearAllData">
        <img src="/assets/images/delete-icon.png" alt="" class="icon"/>
        ลบทั้งหมด
      </button>

      <button class="action-btn-bottom add-btn-bottom" @click="addTransformer">
        <img src="/assets/images/add-icon.png" alt="" class="w-6 h-6"/>
        เพิ่มรายการ
      </button>
    </div>
  </div>
</template>
