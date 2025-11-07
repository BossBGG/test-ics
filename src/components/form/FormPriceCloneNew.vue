<script setup lang="ts">
import { sum } from "lodash";
import { onTestFailed } from "vitest";
const { fetchComplete } = defineProps(["fetchComplete"]);

const userDataStore = useUserDataStore();
const { userProfile } = storeToRefs(userDataStore);
const masterDataStore = useMasterDataStore();
const { materialsList } = storeToRefs(masterDataStore);

const quotationStore = useQuotationStore();
const { quotation, isDisabled, discountType, quotationForm } =
	storeToRefs(quotationStore);

const requestStore = useRequestStore();
const { request, requestForm } = storeToRefs(requestStore);

onMounted(async () => {
	await masterDataStore.fetchMaterialsList();
});

const filterValue = ref("");
const filteredMaterials = computed(() => {
	if (!filterValue.value) {
		return materialsList.value;
	}
	const needle = filterValue.value.toLowerCase();
	return materialsList.value.filter((option) => {
		const code = option.mat_code ? option.mat_code.toLowerCase() : "";
		const name = option.mat_name ? option.mat_name.toLowerCase() : "";
		return code.includes(needle) || name.includes(needle);
	});
});

const filterFn = (val, update) => {
	filterValue.value = val;
	update();
};

const calculateTotalPrice = (item) => {
	const unitPrice = item.unit_price || 0;
	const qty = item.qty || 0;
	const price = unitPrice * qty;
	const discountRate = Number.parseFloat(item.discount_rate || 0);

	if (discountType.value == "1") {
		item.discount_price = Number.parseFloat(
			((price * discountRate) / 100).toFixed(2)
		);
	}

	const subtotal = price ? price - item.discount_price : 0;
	if (!item.change_vat_price) {
		item.vat_price = Number.parseFloat(
			((subtotal * (item.vat_rate || 0)) / 100).toFixed(2)
		);
	}
	item.line_item_price = subtotal + item.vat_price;

	return item.line_item_price;
};

const cloneForm = () => {
	quotationForm.value.details.push({
		mat_code: null,
		qty: 1,
		unit_price: 0,
		discount_rate: 0,
		discount_price: 0,
		discount_unit: discountType.value,
		vat_rate: 0,
		vat_price: 0,
		line_item_price: 0,
		display_qty: intToCurrency("1"),
		display_unit_price: decimalToCurrency(0),
		display_discount_price: decimalToCurrency(0),
		display_vat_price: decimalToCurrency(0),
		change_vat_price: false,
	});
};

const total_price = computed(() => {
	return sum(
		quotationForm.value.details.map((item) => item.qty * item.unit_price)
	);
});
quotationForm.value.total_price = total_price;

const sumTotalPrice = computed(() => {
	return sum(
		quotationForm.value.details.map((item) => calculateTotalPrice(item))
	);
});
quotationForm.value.net_price = sumTotalPrice;

const total_discount = computed(() => {
	return sum(quotationForm.value.details.map((item) => +item.discount_price));
});
quotationForm.value.total_discount = total_discount;

const subtotal_price = computed(() => {
	return total_price.value - total_discount.value;
});
quotationForm.value.subtotal_price = subtotal_price;

const total_vat = computed(() => {
	return sum(quotationForm.value.details.map((item) => +item.vat_price));
});
quotationForm.value.total_vat = total_vat;

watch(
	() => discountType.value,
	(newValue) => {
		if (fetchComplete) {
			quotationForm.value.details.map((item) => {
				item.change_vat_price = false;
				item.discount_unit = newValue;
				item.discount_rate = 0;
				item.discount_price = 0;
				calculateTotalPrice(item);
				item.display_discount_price = decimalToCurrency(item.discount_price);
				item.display_vat_price = decimalToCurrency(item.vat_price);
			});
		}
	}
);

const deleteForm = (index) => {
	quotationForm.value.details.splice(index, 1);
};

const updateMaterial = async (index, value) => {
	const selected = filteredMaterials.value.find(
		(item) => item.mat_code == value
	);
	quotationForm.value.details[index]["unit_price"] = selected?.price || 0;
	quotationForm.value.details[index]["vat_rate"] = selected?.vat || 0;
	quotationForm.value.details[index]["vat_price"] = 0;
	quotationForm.value.details[index]["discount_rate"] = 0;
	quotationForm.value.details[index]["discount_price"] = 0;
	await calculateTotalPrice(quotationForm.value.details[index]);
	quotationForm.value.details[index]["display_unit_price"] = decimalToCurrency(
		quotationForm.value.details[index]["unit_price"]
	);
	quotationForm.value.details[index]["display_discount_price"] =
		decimalToCurrency(quotationForm.value.details[index]["discount_price"]);
	quotationForm.value.details[index]["display_vat_price"] = decimalToCurrency(
		quotationForm.value.details[index]["vat_price"]
	);
	
	// Reset S16 calculation flag when protected items are manually changed
	if (requestForm.value?.service_code === SERVICE.S16 && isProtectedServiceItem(value)) {
		quotationForm.value.s16_calculation_confirmed = false;
	}
};
const getMaterialName = (code) => {
	const selected = filteredMaterials.value.find(
		(item) => item.mat_code == code
	);
	return selected?.mat_name;
};

const formatCurrency = (item, key, isInt = false) => {
	let value = currencyToDecimal(item[`display_${key}`]);
	if (!isNaN(value)) {
		item[key] = value;
		if (typeof value === "number" || value == "")
			item[`display_${key}`] = isInt
				? intToCurrency(value)
				: decimalToCurrency(value);
	} else {
		item[key] = 0;
		item[`display_${key}`] = isInt
			? intToCurrency(value)
			: decimalToCurrency(0);
	}
};

const removeFormat = (item, key) => {
	if (key == "discount_price") {
		item[`display_${key}`] =
			(discountType.value == "1" ? item.discount_rate : item[key]) || null;
	} else {
		item[`display_${key}`] = item[key] || null;
	}
};
const calculateMaterialPrice = async (item, key) => {
	if (key == "qty") {
		item.change_vat_price = false;
	} else {
		if (key == "discount_price" && discountType.value == "1") {
			if (item[`display_${key}`] > 100) {
				item[`display_${key}`] = 100;
				item[`display_${key}`] = 100;
			}
			item["discount_rate"] = item[`display_${key}`] || 0;
		} else {
			item[key] = item[`display_${key}`] || 0;
		}
		if (key != "vat_price") {
			item.change_vat_price = false;
			await calculateTotalPrice(item);
			item[`display_vat_price`] = decimalToCurrency(item.vat_price);
		} else {
			item.change_vat_price = true;
			item.vat_price = currencyToDecimal(item[`display_vat_price`] || 0);
		}
	}
};

const quotationPopup = ref(false);

const isProtectedServiceItem = (matCode: string) => {
	return requestForm.value?.service_code === SERVICE.S16 && 
	       ['S-3O-001', 'S-3O-002', 'S-3O-003'].includes(matCode);
};

function openQuotationPopup() {
	quotationPopup.value = true;
}
function closeQuotationPopup() {
	quotationPopup.value = false;
}
function handleConfirm(data: any){
  if( requestForm.value?.service_code === SERVICE.S16 ){
    const serviceMapping = {
      'S-3O-001': 'rentalTotal',
      'S-3O-002': 'operatorTotal',
      'S-3O-003': 'shippingTotal'
    };
    
    const totals = Object.keys(serviceMapping).reduce((acc, key) => {
      acc[key] = data.calculations.reduce((sum: number, calc: any) => 
        sum + calc.services[serviceMapping[key]], 0
      );
      return acc;
    }, {} as any);

    quotationForm.value.details.forEach((item: any) => {
      if (item.mat_code in totals) {
        item.unit_price = totals[item.mat_code];
        item.display_unit_price = decimalToCurrency(totals[item.mat_code]);
        calculateTotalPrice(item);
        item.display_vat_price = decimalToCurrency(item.vat_price);
      }
    });
    
    quotationForm.value.s16_calculation_confirmed = true;
  }
	
	closeQuotationPopup()
}
function handleCancel(){
	closeQuotationPopup()
}

function canDeleteItem(item: any){
	return !(requestForm.value?.service_code === SERVICE.S16 && isProtectedServiceItem(item.mat_code));
}
</script>

<template>
	<div class="box_select_price" v-if="!isDisabled">
		<div class="wraper_select_price">
			<div class="box_select">
				<div class="text font-size-normal">ประเภทส่วนลด</div>
				<div class="select_price">
					<q-select
						v-model="discountType"
						class="border_dashed input_filled_custom input_select_price text-weight-500"
						:options="DISCOUNTS"
						option-label="label"
						option-value="value"
						map-options
						emit-value
						bg-color="white"
						filled
					/>
				</div>
			</div>
		</div>
	</div>
	<div class="wrapper-price-clone q-mt-lg">
		<div class="box_table_quotation">
			<div class="title q-py-sm q-px-sm">
				<div class="row justify-between">
					<div class="item col_id">
						<h4 class="text-center">ลำดับ</h4>
					</div>
					<div class="item col_name">
						<h4 class="text-center">Service Material No. / ชื่อสินค้า</h4>
					</div>
					<div class="item col_unit head-col">
						<h4 class="text-center">จำนวนหน่วย</h4>
					</div>
					<div class="item col_unit head-col">
						<h4 class="text-center">ราคาต่อหน่วย</h4>
					</div>
					<div class="item col_unit head-col">
						<h4 class="text-center">
							ส่วนลด ({{
								DISCOUNTS_SIGN(quotationForm?.details[0]?.discount_unit)
							}})
						</h4>
					</div>
					<div class="item col_unit head-col">
						<h4 class="text-center">ภาษี</h4>
					</div>
					<div class="item col_price">
						<h4 class="text-center">ราคารวม</h4>
					</div>
					<div class="item col_delete">
						<h4 class="text-center"></h4>
					</div>
				</div>
			</div>
			<div class="sub_table">
				<div
					v-for="(item, index) in quotationForm?.details"
					:key="index"
					class="wraper_form_price"
					:class="`qt-price-${index}`"
				>
					<div class="box_table"  style="align-items: center;" v-if="!isDisabled">
						<div class="item col_id">
							<div class="box_align">
								<label for="" class="text-order">{{ index + 1 }}</label>
							</div>
						</div>
						<div class="item col_name">
							<q-select
								v-model="item.mat_code"
								class="border_dashed input_filled_custom text-weight-500 qt-name"
								label="ชื่อรายการ"
								:options="filteredMaterials"
								option-value="mat_code"
								map-options
								:option-label="
									(option) => `${option?.mat_code} ${option?.mat_name ?? ''}`
								"
								bg-color="white"
								input-debounce="0"
								filled
								emit-value
								use-input
								fill-input
								:clearable="!isProtectedServiceItem(item.mat_code)"
								:readonly="isProtectedServiceItem(item.mat_code)"
								hide-selected
								@filter="filterFn"
								@update:model-value="(value) => updateMaterial(index, value)"
								:rules="[
									(val) => (val && val.length > 0) || 'กรุณาเลือกสินค้า',
								]"
								hide-bottom-space
							>
								<template #no-option>
									<q-item>
										<q-item-section class="text-grey">
											ไม่พบข้อมูล
										</q-item-section>
									</q-item>
								</template>
								​</q-select
							>
						</div>
						<div class="item col_unit col-desktop">
							<q-input
								v-model.number="item.display_qty"
								filled
								class="input_filled_custom qt-qty"
								type="text"
								bg-color="white"
								input-class="text-center"
								@keypress="allowOnlyPrice"
								@update:model-value="calculateMaterialPrice(item)"
								@blur="formatCurrency(item, 'qty', true)"
								@focus="removeFormat(item, 'qty')"
								:disable="!item.mat_code"
								maxlength="12"
								reverse-fill-mask
								unmasked-value
							/>
						</div>
						<div class="item col_unit col-desktop">
							<q-input
								v-model.number="item.display_unit_price"
								type="text"
								filled
								class="input_filled_custom qt-unit-price"
								bg-color="white"
								input-class="text-right"
								@keypress="allowOnlyPrice"
								@update:model-value="calculateMaterialPrice(item, 'unit_price')"
								@blur="formatCurrency(item, 'unit_price')"
								@focus="removeFormat(item, 'unit_price')"
								maxlength="12"
								step="0.01"
								:disable="!item.mat_code"
							/>
						</div>
						<div class="item col_unit col-desktop discount">
							<q-input
								v-model.number="item.display_discount_price"
								filled
								class="input_filled_custom"
								style="padding-bottom: 0;"
								type="text"
								bg-color="white"
								input-class="text-right"
								@keypress="allowOnlyPrice"
								@update:model-value="
									calculateMaterialPrice(item, 'discount_price')
								"
								@blur="formatCurrency(item, 'discount_price')"
								@focus="removeFormat(item, 'discount_price')"
								:disable="!item.mat_code"
								:maxlength="discountType == '1' ? 3 : 12"
								:rules="[
									(val) =>
										item.discount_price <= item.qty * item.unit_price ||
										'กรุณาตรวจสอบส่วนลด',
								]"
							/>
						</div>
						<div class="item col_unit col-desktop">
							<!-- <q-input
                v-model.number="item.display_vat_price"
                filled
                class="input_filled_custom"
                type="text"
                maxlength="10"
                bg-color="white"
                input-class="text-right"
                @keypress="allowOnlyPrice"
                @update:model-value="calculateMaterialPrice(item, 'vat_price')"
                @blur="formatCurrency(item, 'vat_price')"
                @focus="removeFormat(item, 'vat_price')"
                :disable="!item.mat_code"
              /> -->
							<div class="box_align box_end">
								<div class="text_total">
									{{ item.display_vat_price }}
								</div>
							</div>
						</div>
						<div class="item col_price">
							<div class="box_align box_end">
								<div class="text_total">
									{{ decimalToCurrency(item.line_item_price) }}
								</div>
							</div>
						</div>
						<div class="item col_delete" v-if="canDeleteItem(item)">
							<div class="box_align">
								<i
									class="q-icon material-icons col-desktop"
									aria-hidden="true"
									role="img"
									style="font-size: 1.3em; color: #994c80"
									@click="deleteForm(index)"
									v-if="quotationForm?.details?.length > 1"
									>delete</i
								>
							</div>
						</div>
						<div class="item col_delete" v-else>
							<div class="box_align"></div>
						</div>
					</div>
					<div class="box_table" v-else>
						<div class="item col_id">
							<div class="box_align">
								<label for="" class="text-order">{{ index + 1 }}</label>
							</div>
						</div>

						<div class="item col_name">
							<q-field
								filled
								readonly
								stack-label
								bg-color="transparent"
								class="label_q_field border_0"
							>
								<template #control>
									<div
										class="full-width no-outline color_text_input self-center font-size-normal"
										tabindex="0"
									>
										{{ item.mat_code }} {{ getMaterialName(item.mat_code) }}
									</div>
								</template>
							</q-field>
						</div>
						<div class="item col_unit col-desktop">
							<q-field
								filled
								readonly
								stack-label
								bg-color="transparent"
								class="label_q_field border_0"
							>
								<template #control>
									<div
										class="full-width no-outline color_text_input self-center font-size-normal text-center"
										tabindex="0"
									>
										{{ item.display_qty ?? "-" }}
									</div>
								</template>
							</q-field>
						</div>
						<div class="item col_unit col-desktop">
							<q-field
								filled
								readonly
								stack-label
								bg-color="transparent"
								class="label_q_field border_0"
							>
								<template #control>
									<div
										class="full-width no-outline color_text_input self-center font-size-normal text-right"
										tabindex="0"
									>
										{{ item.display_unit_price ?? "-" }}
									</div>
								</template>
							</q-field>
						</div>
						<div class="item col_unit col-desktop">
							<q-field
								filled
								readonly
								stack-label
								bg-color="transparent"
								class="label_q_field border_0"
							>
								<template #control>
									<div
										class="full-width no-outline color_text_input self-center font-size-normal text-right"
										tabindex="0"
									>
										{{ item.display_discount_price ?? "-" }}
									</div>
								</template>
							</q-field>
						</div>
						<div class="item col_unit col-desktop">
							<!-- <q-field
                filled
                readonly
                stack-label
                bg-color="transparent"
                class="label_q_field border_0"
              >
                <template #control>
                  <div
                    class="full-width no-outline color_text_input self-center font-size-normal text-right"
                    tabindex="0"
                  >
                    {{ item.display_vat_price ?? "-" }}
                  </div>
                </template>
              </q-field> -->
							<div class="box_align box_end">
								<p class="text_total">
									{{ item.display_vat_price }}
								</p>
							</div>
						</div>
						<div class="item col_price">
							<div class="box_align box_end">
								<p class="text_total">
									{{ decimalToCurrency(item.line_item_price) }}
								</p>
							</div>
						</div>
						<div class="item col_delete" v-if="canDeleteItem(item)">
							<div class="box_align"></div>
						</div>
						<div class="item col_delete" v-else>
							<div class="box_align"></div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="q-mt-md text-right" style="margin: 40px 0" v-if="!isDisabled">
			<q-btn
				icon="add"
				label="เพิ่มรายการ"
				color="primary"
				class="q-btn-size-small"
				@click="cloneForm"
				flat
				outline 
				style="border:#A64682 1px solid"
			/>

			<q-btn
				label="คำนวณค่าบริการ"
				color="primary"
				class="q-btn-size-small text-white"
				@click="openQuotationPopup"
				style="margin-left: 8px"
			/>
		</div>

		<div class="form-summary">
			<div class="q-px-md form_total">
				<div class="q-pt-md text-right">
					<div class="item_text">
						<div class="text_label">รวม</div>
						<div class="text_number">
							{{ decimalToCurrency(total_price) }} บาท
						</div>
					</div>
				</div>
				<div class="text-right">
					<div class="item_text">
						<div class="text_label">หักส่วนลด</div>
						<div class="text_number">
							{{ decimalToCurrency(total_discount) }} บาท
						</div>
					</div>
				</div>
				<div class="text-right">
					<div class="item_text">
						<div class="text_label">รวมเป็นเงิน</div>
						<div class="text_number">
							{{ decimalToCurrency(subtotal_price) }} บาท
						</div>
					</div>
				</div>
				<div class="q-pb-md text-right">
					<div class="item_text">
						<div class="text_label">ภาษีมูลค่าเพิ่ม</div>
						<div class="text_number">
							{{ decimalToCurrency(total_vat) }} บาท
						</div>
					</div>
				</div>
			</div>
			<div class="q-mt-md q-py-md q-px-md bg-white text-right">
				<div class="item_text text_price_total">
					<div class="text_label">รวมเงินทั้งสิ้น</div>
					<div class="text_number total">
						{{ decimalToCurrency(sumTotalPrice) }}
						บาท
					</div>
				</div>
			</div>
			<div v-if="!quotation?.status && false" class="q-mt-md text-right">
				<FormInstallment />
			</div>
			<div
				v-if="
					quotation?.id || quotationForm.memo || quotationForm.reviewer_memo
				"
				class="q-mt-md"
			>
				<FormPaymentFormat />
			</div>
		</div>

		<QuotationPopup 
			v-model="quotationPopup" 
			@confirm="handleConfirm"
			@cancel="handleCancel" 
    />
	</div>
	
</template>

<style lang="scss" scoped>
@import "@style";

.wraper_form_price {
	background-color: #fafafa;
	border-bottom: 1px solid #aaaaaa;
	border-left: 1px solid #aaaaaa;
	border-right: 1px solid #aaaaaa;
	padding: 8px;

	@media #{$screen-mds-max} {
		padding: 0px;
	}

	.text-order {
		font-size: 15px;
		color: #343a40;

		@media (max-width: $breakpoint-xs-max) {
			font-size: 10px;
		}
	}

	.centered-input {
		text-align: center;
	}

	input {
		text-align: center;
	}

	.q-field__control {
		background: #fff;
	}

	.q-field__input {
		text-align: center;
	}

	.box_icon {
		@include flexbox();
		@include justify-content(end);
	}

	.box_table {
		@include flexbox();
		@include justify-content(space-between);

		@media #{$screen-mds-max} {
			padding: 8px 2px;
		}

		.item {
			flex: 1;

			.box_align {
				@include flexbox;
				@include justify-content(center);
				@include align-items(center);
				height: 100%;

				.q-icon {
					cursor: pointer;
				}

				.icon_arrow {
					transition: 0.2s all cubic-bezier(0.15, 0.22, 0.2, 1);

					&.show {
						transform: rotate(180deg);
					}
				}

				&.box_end {
					@include justify-content(end);
				}

				.text_total {
					font-size: 15px;

					@media (max-width: $breakpoint-xs-max) {
						font-size: 10px;
					}
				}

				.input_filled_custom {
					.q-field__label,
					.q-field__native {
						font-size: 15px !important;

						@media (max-width: $breakpoint-xs-max) {
							font-size: 10px !important;
						}
					}
				}
			}

			&.col_id {
				max-width: 38px;
				padding: 0 8px;

				// @media (max-width: $breakpoint-xs-max) {
				//   max-width: 36px;
				//   padding: 0 8px;
				// }
			}

			&.col_name {
				max-width: 448px;
				min-width: 257px;
				padding: 0 8px;

				// @media (max-width: $breakpoint-xs-max) {
				//   max-width: 227px;
				//   min-width: unset;
				//   padding: 0 5px;
				// }
				// .q-field--with-bottom {
				//   padding-bottom: 0;
				// }
			}

			&.col_unit {
				max-width: 150px;
				padding: 0 8px;
			}

			&.col_price {
				max-width: 187px;
				padding: 0 8px;

				// @media (max-width: $breakpoint-xs-max) {
				//   max-width: 70px;
				//   padding: 0 2px;
				// }
			}

			&.col_delete {
				max-width: 51px;

				// @media (max-width: $breakpoint-xs-max) {
				//   max-width: 20px;
				// }
			}
		}
	}

	.box_open {
		@media #{$screen-mds-max} {
			max-height: 0;
			transition: max-height 0.3s cubic-bezier(0.15, 0.22, 0.2, 1);
			overflow: hidden;
			background-color: $bg_field_light_gray;
			visibility: visible;
		}

		&.show {
			@media #{$screen-mds-max} {
				visibility: unset;
				max-height: 69px;
				transition: max-height 0.25s cubic-bezier(0.15, 0.22, 0.2, 1);
			}
		}

		.add {
			@media #{$screen-mds-max} {
				padding: 2px;
				border-top: 1px solid #aaaaaa;
			}
		}

		.item {
			padding: 8px;

			@media #{$screen-mds-max} {
				padding: 4px;
			}

			&.col-mobile {
				.box_mobile {
					@include flexbox();
					@include justify-content(center);
					@include flex-direction(column);
					@include border-radius-separate(4px, 4px, 0, 0);
					height: 100%;
					background-color: #ffffff;
					padding: 2px 4px;

					@media #{$screen-mds-min} {
						padding: 0 12px;
					}

					.text_tax {
						font-size: 10px;
						color: #57595b;
						opacity: 0.6;

						@media #{$screen-mds-min} {
							font-size: 12px;
						}
					}

					.text_total {
						font-size: 12px;
						opacity: 0.6;

						@media #{$screen-mds-min} {
							font-size: 13px;
						}
					}
				}
			}
		}
	}
}

.form-summary {
	margin-top: 20px;
	background: #f5f7f8;
	padding: 16px;

	.form_total {
		background: $white;
		font-size: 15px;
		color: $black;

		@media (max-width: $breakpoint-xs-max) {
			font-size: 12px;
		}

		// .item_text {
		//   @include flexbox();

		//   .text_label {
		//     flex: 1;
		//   }
		//   .text_number {
		//     flex: 0 0 170px;

		//     @media (max-width: $breakpoint-xs-max) {
		//       flex: 0 0 130px;
		//     }
		//   }
		// }
	}

	.item_text {
		@include flexbox();
		column-gap: 20px;

		@media #{$screen-lg-min} {
			column-gap: 0;
		}

		&.text_price_total {
			column-gap: 0;
		}

		.text_label {
			flex: 1;
		}

		.text_number {
			flex: 0 0 170px;

			@media (max-width: $breakpoint-xs-max) {
				flex: 0 0 130px;
				text-wrap: nowrap;
			}

			&.total {
				flex: 0 0 200px;

				@media (max-width: $breakpoint-xs-max) {
					flex: 0 0 170px;
				}
			}
		}
	}

	.text_price_total {
		font-size: 20px;
		font-weight: 500;
		color: $black;

		@media (max-width: $breakpoint-xs-max) {
			font-size: 14px;
		}
	}
}

.wraper_form_price .col-mobile {
	display: none;

	@media #{$screen-mds-max} {
		display: block;
	}
}

:deep(input[type="number"]::-webkit-outer-spin-button),
:deep(input[type="number"]::-webkit-inner-spin-button) {
	-webkit-appearance: none;
	margin: 0;
}

:deep(input[type="number"]) {
	-moz-appearance: textfield;
}

//////////////////////////////

.box_table_quotation {

	min-width: 1024px;
	width: 100%;

	.sub_table {
		overflow-x: auto;

		&::-webkit-scrollbar {
			height: 10px;
			width: 5px;
			z-index: 12;
			overflow: visible;
		}

		&::-webkit-scrollbar-track {
			border-radius: 10px;
			background: #f6f6f6;
			border: 4px solid rgba(0, 0, 0, 0);
		}

		&::-webkit-scrollbar-thumb {
			width: 1px;
			background-color: #69306d;
			border-radius: 10px;
			z-index: 12;
			-webkit-transition: background-color 0.28s ease-in-out;
			transition: background-color 0.28s ease-in-out;
			margin: 4px;
			/*
			min-height: 32px;
			min-width: 32px;
			*/
		}
	}

	@media #{$screen-1053-max} {
		//margin-bottom: 10px;
	}
}

.box_details_request {
	.title {
		background-color: $primary;
		color: $white;
		@include border-radius-separate(8px, 8px, 0, 0);

		h4 {
			font-size: 16px;
			font-weight: 500;

			@media (max-width: $breakpoint-xs-max) {
				font-size: 10px !important;
			}
		}
	}

	.item {
		flex: 1;
	}

	.col_id {
		max-width: 38px;
		padding: 0 8px;

		// @media (max-width: $breakpoint-xs-max) {
		//   max-width: 36px;
		//   padding: 0 8px;
		// }
	}

	.col_name {
		max-width: 448px;
		min-width: 257px;
		padding: 0 8px;

		// @media (max-width: $breakpoint-xs-max) {
		//   max-width: 227px;
		//   min-width: unset;
		//   padding: 0 5px;
		// }
	}

	.col_unit {
		max-width: 150px;
		padding: 0 8px;
	}

	.col_price {
		max-width: 187px;
		padding: 0 8px;

		// @media (max-width: $breakpoint-xs-max) {
		//   max-width: 70px;
		//   padding: 0 2px;
		// }
	}

	.col_delete {
		max-width: 51px;

		// @media (max-width: $breakpoint-xs-max) {
		//   max-width: 0px;
		// }
	}
}

.wraper_form {
	background-color: #fafafa;

	.text-order {
		color: #343a40;
	}

	.centered-input {
		text-align: center;
	}

	input {
		text-align: center;
	}
}

.box_select_price {
	@media (max-width: $breakpoint-xs-max) {
		margin-top: 40px;
	}

	.wraper_select_price {
		.box_select {
			max-width: 327px;
			width: 100%;
			@include flexbox();
			@include align-items(center);
			@include justify-content(space-between);
			@include border-radius-separate(4px, 4px, 0, 0);
			background-color: #a64682;
			padding: 5px 5px 5px 12px;
			margin: 0 0 0 auto;

			@media (max-width: $breakpoint-xs-max) {
				max-width: 229px;
			}

			.text {
				color: #ffffff;
			}

			.select_price {
				flex: 0 0 175px;

				@media (max-width: $breakpoint-xs-max) {
					flex: 0 0 120px;
				}
			}
		}
	}
}
</style>
