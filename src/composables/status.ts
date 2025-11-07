export const EDIT_ACTION = computed(() => {
  const route = useRoute();
  const action = route?.query["action"] || null;
  return action == "edit";
});

export const CAN_EDIT = {
  REQUEST: computed(() => checkCanEdit("REQUEST")), // computed(() => true), //
  BP: computed(() => checkCanEdit("BP")),
  APP: computed(() => checkCanEdit("APP")),
  SURVEY: computed(() => checkCanEdit("SURVEY")),
  QUOTATION: computed(() => checkCanEdit("QUOTATION")),
  CANCEL: computed(() => checkCanEdit("CANCEL")),
};

export const CAN_ACCESS_PAGE = {
  REQUEST: computed(() => checkCanAccessPage("REQUEST")),
  BP: computed(() => checkCanAccessPage("BP")),
  APP: computed(() => checkCanAccessPage("APP")),
  SURVEY: computed(() => checkCanAccessPage("SURVEY")),
  QUOTATION: computed(() => checkCanAccessPage("QUOTATION")),
};

export function hasQuery(name: string) {
  const route = useRoute();
  // console.log("route.query", route.query);

  return computed(() => {
    const value = route.query[name];
    return value !== undefined && value !== null && value !== "";
  }).value;
};

function checkCanEdit(step) {
  const requestStore = useRequestStore();
  const { request, isSurvey } = storeToRefs(requestStore);

  if (request.value?.requests?.id) {
    const requestData = request.value.requests;
    switch (step) {
      case "REQUEST":
        if (requestData.channel) {
          return false;
        }
        return !requestData.contact_status && requestData.status == "D";
      case "BP":
        // | --------------------
        // | Old Logic
        // | --------------------
        // if (isSurvey.value) {
        //   return requestData.status == "C" || requestData.status == "I";
        // }
        // return (
        //   requestData.status == "C" ||
        //   requestData.status == "S" ||
        //   requestData.status == "Q"
        // );

        // | --------------------
        // | New Logic
        // | --------------------
        return (
          requestData.status == "C" ||
          requestData.status == "I" ||
          requestData.status == "S" ||
          requestData.status == "Q" ||
          requestData.status == "A" ||
          requestData.status == "N"
        );
      case "APP":
        return (
          requestData.status == "C" ||
          requestData.status == "I" ||
          requestData.status == "S" ||
          requestData.status == "Q" ||
          requestData.status == "A" ||
          requestData.status == "N"
        );
      case "SURVEY":
        return requestData.status == "I";
      case "QUOTATION":
        const quotationStore = useQuotationStore();
        const { quotation } = storeToRefs(quotationStore);
        if (quotation.value?.id) {
          return (
            quotation.value?.review_status == "R" ||
            quotation.value?.status == "A"
          );
        }
        else {
          return (
            requestData.status == "C" ||
            requestData.status == "S" ||
            requestData.status == "Q" ||
            requestData.status == "N"
          )
        };
      case "CANCEL":
        return requestData.status == "D" || requestData.status == "C" || requestData.status == "I" || requestData.status == "S" || requestData.status == "Q" || requestData.status == "N" || requestData.status == "A"

      default:
        return false;
    }
  }
  else if (step == "BP" || step == "REQUEST") {
    return true;
  }
  return false;
}
function checkCanAccessPage(step) {
  const requestStore = useRequestStore();
  const { request, accessPage } = storeToRefs(requestStore);

  if (request.value?.requests?.id) {
    const requestData = request.value.requests;
    switch (step) {
      case "REQUEST":
        if (requestData.status == "R" || requestData.status == "E")
          return accessPage.value?.request || false;
      case "BP":
        if (requestData.status == "R" || requestData.status == "E")
          return accessPage.value?.business_partner || false;
      case "APP":
        if (requestData.status == "R" || requestData.status == "E")
          return accessPage.value?.business_partner || false;
      case "SURVEY":
        if (requestData.status == "R" || requestData.status == "E")
          return accessPage.value?.survey || false;
      case "QUOTATION":
        if (requestData.status == "R" || requestData.status == "E")
          return accessPage.value?.quotation || false;
      default:
        return false;
    }
  }
  return false;
}

export function isShowSearchBP() {
  const requestStore = useRequestStore();
  const { request, isSurvey } = storeToRefs(requestStore);

  if (request.value?.requests?.id) {
    const requestData = request.value.requests;
    const requestSurvey = request.value.is_survey;

    const conditionOne =
      requestSurvey && (requestData.status == "C" || requestData.status == "I");
    const conditionTwo =
      !requestSurvey &&
      (requestData.status == "C" ||
        requestData.status == "Q" ||
        requestData.status == "N");

    const checkAllCondition = conditionOne || conditionTwo;

    return checkAllCondition;
  } else {
    return false;
  }
}
