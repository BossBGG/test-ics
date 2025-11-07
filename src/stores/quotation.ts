import { acceptHMRUpdate, defineStore } from "pinia";
import axios from "axios";

export const useQuotationStore = defineStore("quotation", () => {
  const request_id = ref("");
  const customerRequestNo = ref({});
  const discountType = ref("1");
  const isDisabled = ref(true);
  const users = ref([]);
  const quotation = ref({});
  const validationQuotationForm = ref();
  const quotationForm = ref({
    request_id: null,
    quotation_by: null,
    quotation_date: dateFormatBy(Date.now(), "YYYY-MM-DDTHH:mm:ss"),
    reviewed_by: null,
    approved_by: null,
    total_price: 0,
    total_discount: 0,
    subtotal_price: 0,
    total_vat: 0,
    net_price: 0,
    memo: null,
    reviewer_memo: null,
    payment_type: 1,
    number_of_installment: null,
    installment_price: null,
    is_change: false,
    details: [
      {
        mat_code: null,
        qty: 1,
        unit_price: 0,
        discount_rate: 0,
        discount_price: 0,
        discount_unit: "1",
        vat_rate: 0,
        vat_price: 0,
        line_item_price: 0,
        display_qty: intToCurrency("1"),
        display_unit_price: decimalToCurrency(0),
        display_discount_price: decimalToCurrency(0),
        display_vat_price: decimalToCurrency(0),
        change_vat_price: false,
      },
    ],
  });

  function setRequestID(uid) {
    request_id.value = uid;
  }

  async function fetchUsers() {
    try {
      const { data } = await axios.get(`master/users/1`);
      users.value = data.data;
      return { data };
    } catch (e) {
    }

    return false;
  }

  async function getLatestQuotationByRequestId() {
    try {
      const { data } = await axios.get(
        `quotations/search?searchKey=request_id&searchValue=${request_id.value}`,
      );
      return data.datas?.quotations[0];
    } catch (error) {
      return null;
    }
  }
  async function fetchQuotationByRequestId(assignVal = false) {
    const { data } = await axios.get(
      `quotations/search?searchKey=request_id&searchValue=${request_id.value}`,
    );
    const latest = data.datas?.quotations[0];
    if (latest?.status != "N") {
      quotation.value = data.datas?.quotations[0];
    }

    if (latest?.id && assignVal) {
      quotationForm.value.quotation_by = latest.quotation_by;
      quotationForm.value.reviewed_by = latest.reviewed_by;
      quotationForm.value.approved_by = latest.approved_by;
      quotationForm.value.quotation_date =
        latest.quotation_date || quotationForm.value.quotation_date;
      quotationForm.value.memo = latest.memo;
      quotationForm.value.reviewer_memo = latest.reviewer_memo;
      quotationForm.value.payment_type = latest.payment_type;
      quotationForm.value.number_of_installment = latest.number_of_installment;
      quotationForm.value.installment_price = latest.installment_price;
      if (latest.details?.length) {
        discountType.value = latest.details[0].discount_unit;
        quotationForm.value.details = latest.details;
        quotationForm.value.details.map((item) => {
          item.change_vat_price = true;
          item.display_qty = intToCurrency(item.qty);
          item.display_unit_price = decimalToCurrency(item.unit_price);
          item.display_vat_price = decimalToCurrency(item.vat_price);
          item.display_discount_price = decimalToCurrency(
            discountType.value == "1"
              ? item.discount_rate
              : item.discount_price,
          );
        });
        quotationForm.value.details = quotationForm.value.details.sort(
          (item) => item.created_date,
        );
      }
    }

    return { data };
  }

  // async function updateOrCreateQuotationByUID(uid = false, quotationsData) {
  async function updateOrCreateQuotationByUID() {
    try {
      quotationForm.value.request_id = request_id.value;
      quotationForm.value.memo = null;
      quotationForm.value.reviewer_memo = null;
      if (quotation?.value?.id) {
        if (quotation.value.status == "A" || (quotation.value.status == "Q" && quotation.value.review_status == "R")) {
          quotationForm.value.is_change = false;
          await axios.delete(`/quotations/delete/${quotation.value.id}`);
          const { data } = await axios.post(
            `/quotations/insert`,
            quotationForm.value,
          );
          return { data, status: true };
        } else {
          const { data } = await axios.patch(
            `/quotations/update/${quotation.value.id}`,
            quotationForm.value,
          );
          return { data, status: true };
        }
      } else {
        quotationForm.value.is_change = false;
        const { data } = await axios.post(
          `/quotations/insert`,
          quotationForm.value,
        );
        return { data, status: true };
      }
    } catch (error) {
      console.error("Error quotations:", error);
      return { status: false };
    }
  }

  async function approveQuotation() {
    try {
      const { data } = await axios.post(`/quotations/approve`, {
        quotationId: quotation.value?.id,
        memo: quotationForm.value?.memo,
      });
      return { data, status: true };
    } catch (error) {
      console.error("Error quotations:", error);
      return { status: false };
    }
  }
  async function cancelQuotation() {
    try {
      const { data } = await axios.post(`/quotations/reject`, {
        quotationId: quotation.value?.id,
        memo: quotationForm.value?.memo,
      });
      return { data, status: true };
    } catch (error) {
      console.error("Error quotations:", error);
      return { status: false };
    }
  }

  async function passQuotation() {
    try {
      const { data } = await axios.post(`/quotations/reviewer-pass`, {
        quotationId: quotation.value?.id,
        reviewer_memo: quotationForm.value?.reviewer_memo,
      });
      return { data, status: true };
    } catch (error) {
      console.error("Error quotations:", error);
      return { status: false };
    }
  }
  async function failQuotation() {
    try {
      const { data } = await axios.post(`/quotations/reviewer-reject`, {
        quotationId: quotation.value?.id,
        reviewer_memo: quotationForm.value?.reviewer_memo,
      });
      return { data, status: true };
    } catch (error) {
      console.error("Error quotations:", error);
      return { status: false };
    }
  }

  async function printQuotation(customNo) {
    try {
      const { data } = await axios.get(
        `/requests/document/${customNo}/quotation`,
      );
      customerRequestNo.value = data.datas;
      return { data };
    } catch (e) {
    }
  }

  return {
    request_id: computed(() => request_id.value),
    quotation: computed(() => quotation.value),
    customerRequestNo: computed(() => customerRequestNo.value),
    users: computed(() => users.value),
    printQuotation,
    discountType,
    isDisabled,
    quotationForm,
    validationQuotationForm,
    setRequestID,
    fetchUsers,
    getLatestQuotationByRequestId,
    fetchQuotationByRequestId,
    updateOrCreateQuotationByUID,
    approveQuotation,
    cancelQuotation,
    passQuotation,
    failQuotation,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useQuotationStore as any, import.meta.hot),
  );
}
