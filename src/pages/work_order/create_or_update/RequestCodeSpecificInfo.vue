<script setup lang="ts">
import {WorkOrderObj} from "~/api/types";
import EquipmentInfoS301 from '~/pages/work_order/special-form/s301/EquipmentInfo.vue'
import BusinessType from "~/components/work_order/BusinessType.vue";
import VoltageLevelS307 from '~/pages/work_order/special-form/s307/VoltageLevel.vue'
import RequestServiceType from "~/pages/work_order/special-form/s305/RequestServiceType.vue";
import TransformerDetailS305 from "~/pages/work_order/special-form/s305/TransformerDetail.vue";
import VoltageLevel from "~/pages/work_order/special-form/s308/VoltageLevel.vue";
import GeneratorList from "~/pages/work_order/special-form/s316/GeneratorList.vue";
import InsulationDateSelector from "~/pages/work_order/special-form/s314/InsulationDateSelector.vue";
import CertificateRequirement from "~/pages/work_order/special-form/s329/CertificateRequirement.vue";
import InsulatorList from "~/pages/work_order/special-form/s314/InsulatorList.vue";
import EnergySourceSelector from "~/pages/work_order/special-form/s329/EnergySourceSelector.vue";
import CertificateYearSelector from "~/pages/work_order/special-form/s329/CertificateYearSelector.vue";
import TransformerList from "~/pages/work_order/special-form/s315/TransformerList.vue";
import Package from "~/pages/work_order/special-form/s322/Package.vue";
import MeterElectricalEquipment from "~/pages/work_order/special-form/s318/MeterElectricalEquipment.vue";

defineProps<{
  requestCode: String,
  data: WorkOrderObj,
  showCollapse?: boolean
}>()

const emit = defineEmits<{
  "update:data": [value: WorkOrderObj]
}>()

function updateWorkOrderData(workOrderData: WorkOrderObj) {
  emit('update:data', workOrderData)
}
</script>

<template>
  <template v-if="requestCode === 's301'">
    <CardCollapse :isShowHeader="showCollapse" title="ประเภทอุปกรณ์ไฟฟ้า">
      <EquipmentInfoS301 :data="data"
                         @update:data="updateWorkOrderData"
      />
    </CardCollapse>
  </template>

  <template v-else-if="['s302', 's303', 's304', 's306', 's309', 's310', 's311', 's317', 's319', 's320', 's323', 's399', 's332_Solar_Air_Conditioner'].includes(requestCode)">
    <CardCollapse :isShowHeader="showCollapse" title="ประเภทธุรกิจ">
      <BusinessType :data="data" @update:data="updateWorkOrderData" />
    </CardCollapse>
  </template>

  <template v-else-if="requestCode === 's307'">
    <CardCollapse :isShowHeader="showCollapse" title="ประเภทธุรกิจ">
      <BusinessType :data="data" @update:data="updateWorkOrderData" />
    </CardCollapse>

    <CardCollapse :isShowHeader="showCollapse" title="ระดับแรงดันไฟฟ้า">
      <VoltageLevelS307 :data="data"
                        @update:data="updateWorkOrderData"
      />
    </CardCollapse>
  </template>

  <template v-else-if="requestCode === 's305'">
    <CardCollapse :isShowHeader="showCollapse" title="ประเภทคำร้อง">
      <RequestServiceType :data="data"
                          @update:data="updateWorkOrderData"
      />
    </CardCollapse>

    <CardCollapse :isShowHeader="showCollapse" title="รายละเอียดหม้อแปลง">
      <TransformerDetailS305 reqCode="s305"
                             @update:data="updateWorkOrderData"
                             :data="data"
      />
    </CardCollapse>
  </template>

  <template v-else-if="requestCode === 's308'">
    <CardCollapse :isShowHeader="showCollapse" title="ประเภทธุรกิจ">
      <BusinessType :data="data" @update:data="updateWorkOrderData" />
    </CardCollapse>

    <CardCollapse :is-show-header="showCollapse" title="ระดับแรงดันไฟฟ้า">
      <VoltageLevel :data="data" @update:data="updateWorkOrderData" />
    </CardCollapse>

    <CardCollapse :isShowHeader="showCollapse" title="รายละเอียดหม้อแปลง">
      <TransformerDetailS305 reqCode="s308"
                             @update:data="updateWorkOrderData"
                             :data="data"
      />
    </CardCollapse>
  </template>

  <template v-else-if="requestCode === 's312'">
    <CardCollapse :isShowHeader="showCollapse" title="ประเภทธุรกิจ">
      <BusinessType :data="data" @update:data="updateWorkOrderData" />
    </CardCollapse>

    <CardCollapse :isShowHeader="showCollapse" title="ประเภทอุปกรณ์ไฟฟ้า">
      <EquipmentInfoS301 :data="data"
                       @update:data="updateWorkOrderData"/>
    </CardCollapse>
  </template>

  <template v-else-if="requestCode === 's314'">
    <CardCollapse :isShowHeader="showCollapse" title="วันที่เช่าฉนวนครอบสายไฟฟ้า">
      <InsulationDateSelector :data="data"
                              @update:data="updateWorkOrderData"
                              title="วันที่เช่าฉนวนครอบสายไฟฟ้า"
      />
    </CardCollapse>

    <CardCollapse :isShowHeader="showCollapse" title="ฉนวนครอบสายไฟฟ้า">
      <InsulatorList :data="data"
                     @update:data="updateWorkOrderData"
      />
    </CardCollapse>
  </template>

  <template v-else-if="requestCode === 's315'">
    <CardCollapse :isShowHeader="showCollapse" title="ประเภทธุรกิจ">
      <BusinessType :data="data" @update:data="updateWorkOrderData" />
    </CardCollapse>

    <CardCollapse :isShowHeader="showCollapse" title="วันที่เช่าหม้อแปลง">
      <InsulationDateSelector :data="data"
                              @update:data="updateWorkOrderData"
                              title="วันที่เช่าหม้อแปลง"
      />
    </CardCollapse>

    <CardCollapse :isShowHeader="showCollapse" title="หม้อแปลง">
      <TransformerList :data="data"
                       @update:data="updateWorkOrderData"/>
    </CardCollapse>
  </template>

  <template v-else-if="requestCode === 's316'">
    <CardCollapse :isShowHeader="showCollapse" title="วันที่เช่าเครื่องกำเนิดไฟฟ้า">
      <InsulationDateSelector :data="data"
                              @update:data="updateWorkOrderData"
                              title="วันที่เช่าเครื่องกำเนิดไฟฟ้า"
      />
    </CardCollapse>

    <CardCollapse :isShowHeader="showCollapse" title="เครื่องกำเนิดไฟฟ้า">
      <GeneratorList />
    </CardCollapse>
  </template>

  <template v-else-if="requestCode === 's318'">
    <CardCollapse :isShowHeader="showCollapse" title="มิเตอร์/อุปกรณ์ไฟฟ้า">
      <MeterElectricalEquipment :data="data"
                                @update:data="updateWorkOrderData"
      />
    </CardCollapse>
  </template>

  <template v-else-if="requestCode === 's322'">
    <CardCollapse :isShowHeader="showCollapse" title="ประเภทธุรกิจ">
      <BusinessType :data="data" @update:data="updateWorkOrderData" />
    </CardCollapse>

    <CardCollapse :isShowHeader="showCollapse" title="Package">
      <Package :data="data" @update:data="updateWorkOrderData"/>
    </CardCollapse>
  </template>

  <template v-else-if="requestCode === 's329'">
    <CardCollapse :isShowHeader="showCollapse" title="สำรวจความต้องการใบรับรองการผลิตพลังงานหมุนเวียน">
      <CertificateRequirement :data="data" @update:data="updateWorkOrderData"/>
    </CardCollapse>

    <CardCollapse :isShowHeader="showCollapse" title="แหล่งที่มาของพลังงานหมุนเวียนที่ต้องการ">
      <EnergySourceSelector :data="data" @update:data="updateWorkOrderData"/>
    </CardCollapse>

    <CardCollapse :isShowHeader="showCollapse" title="ปีที่มีความต้องการใบรับรองการผลิตพลังงานหมุนเวียน">
      <CertificateYearSelector :data="data" @update:data="updateWorkOrderData"/>
    </CardCollapse>
  </template>
</template>
