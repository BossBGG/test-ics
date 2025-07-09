export default async function status(to, from, next) {
  // console.log("Start status middleware");

  const requestStore = useRequestStore();
  const businessPartnerStore = useBusinessPartnerStore();

  const uid = to.params.uid;

  const routeName =
    [
      "request",
      "createbp",
      "application",
      "history",
      "survey",
      "quotation",
    ].find((route) => to.name.toLowerCase().includes(route)) || "";

  if (!routeName) {
    return next();
  }

  const serviceStore = useServiceStore();
  await serviceStore.fetchGetServiceList();

  if (!uid) {
    if (!(routeName == "createbp" || routeName == "application")) {
      // console.log("End status middleware: error");
      return next({ name: "/" });
    }

    const userDataStore = useUserDataStore();
    const { userProfile, selectedPeaOffice } = storeToRefs(userDataStore);
    // console.log(userProfile)
    const { requestForm, setRequestCode } = storeToRefs(requestStore);
    requestForm.value.channel = 1;
    requestForm.value.pea_office = selectedPeaOffice.value || userProfile.value?.pea_office;
    requestForm.value.service_code = to.query.service;
    setRequestCode.value = to.query.service;

    const { services } = storeToRefs(serviceStore);
    const service = services.value?.find(opt => opt.request_code == setRequestCode.value);
    if (!service?.id) {
      return next({ name: "/404", query: { code: "service", service: setRequestCode.value } });
    }
    requestStore.setServiceData(service);
    // return next();
  }

  // console.log("to.name: ", to.name.toLowerCase());

  if (uid) {
    const fetchRequests = requestStore.fetchGetRequestsByUID(uid);
    await fetchRequests;
    const { request } = storeToRefs(requestStore);
    if (!request.value?.requests?.id) {
      return next({ name: "/404" });
    }
  }
  const { request } = storeToRefs(requestStore);
  const bpFormLocalStorage = getLocalStorage(`${uid || to.query.temp}_bpForm`);

  const status = request.value?.requests?.status;
  const isSurvey = request.value?.is_survey;

  // console.log('to', to);
  if (to.query.skip) {
    return next()
  }

  // const userDataStore = useUserDataStore();
  // const { selectedPeaOffice } = storeToRefs(userDataStore);
  // if (request.value?.requests?.pea_office != selectedPeaOffice.value) {
  //   return next({ name: "/forbidden" })
  // }

  // console.log("request.value: ", request.value);
  // console.log("status: ", status);
  // console.log("isSurvey: ", isSurvey);
  // console.log("routeName: ", routeName.toLowerCase());

  let hasBP = false;

  const redirectToHome = () => next({ name: "/" });
  const redirectToReview = () => next({ name: "/request/[uid]", params: { uid } });
  const redirectToCreateBP = () => {
    if (uid) {
      return next({
        name: "/createbp/[uid]",
        params: { uid },
        query: {
          bp: to.query.bp || '',
          ca: to.query.ca || '',
        }
      });
    } else {
      return next({
        name: "/createbp",
        query: {
          bp: to.query.bp || '',
          ca: to.query.ca || '',
          service: to.query.service || '',
          temp: to.query.temp || '',
        }
      });
    }
  }
  const redirectToSurvey = () =>
    next({ name: isSurvey ? "/survey/[uid]" : "/createbp/[uid]", params: { uid } });

  if (["request"].includes(routeName.toLowerCase())) {
    if (request.value?.requests?.channel) {
      redirectToCreateBP()
    }
  }

  if (["application", "createbp"].includes(routeName.toLowerCase())) {
    if (request.value?.requests?.customer_request_no) {
      const fetchBusinessPartners =
        businessPartnerStore.fetchBusinessPartnersByRequestID(
          request.value?.requests?.customer_request_no,
        );
      await fetchBusinessPartners;
    }

    const { businessPartner } = storeToRefs(businessPartnerStore);
    const bpForm = await bpFormLocalStorage;

    if (!businessPartner.value && status === "R") {
      redirectToReview()
    } else {
      hasBP = businessPartner.value?.id || bpForm?.mobile_no ? true : false;
    }
  }

  if (["survey", "history"].includes(routeName.toLowerCase())) {
    const surveyStore = useSurveyStore();
    const { survey } = storeToRefs(surveyStore);

    await surveyStore.setRequestID(uid);
    await surveyStore.fetchSurvey();

    if (!survey.value && status === "R") {
      redirectToCreateBP()
    }
  }

  if (["quotation"].includes(routeName.toLowerCase())) {
    const quotationStore = useQuotationStore();
    const { quotation } = storeToRefs(quotationStore);

    await quotationStore.setRequestID(uid);
    await quotationStore.fetchQuotationByRequestId(true);
    console.log('quotation: ', quotation);

    if (!quotation.value && status === "R") {
      redirectToSurvey()
    }
  }

  const routeConditions = {
    createbp: () => (status === "D" ? redirectToReview() : next()),
    application: () =>
      (status === "D" || !hasBP ? redirectToCreateBP() : next()),
    history: () =>
      (!isSurvey || ["D", "C"].includes(status) ? redirectToHome() : next()),
    survey: () =>
      (!isSurvey || ["D", "C"].includes(status) ? redirectToHome() : next()),
    quotation: () =>
      (["D", "C", "I"].includes(status) ? redirectToSurvey() : next()),
  };
  const conditionCheck = routeConditions[routeName.toLowerCase()];

  if (conditionCheck) {
    return conditionCheck();
  }

  // console.log("End status middleware: success");
  return next();
}

//-------------------------------------------------------------------------------------------------------------

// export default async function status(to, from, next) {
//   console.log('Start status middleware');

//   const requestStore = useRequestStore();
//   const businessPartnerStore = useBusinessPartnerStore();

//   const uid = to.params.uid;

//   if (!uid) {
//     console.log('End status middleware: error');
//     return next({ name: '/' });
//   }

//   console.log('middleware UID: ', uid);

//   const routeName = ['request', 'createbp', 'application', 'history', 'survey', 'quotation'].find(route => to.name.toLowerCase().includes(route)) || '';

//   if (!routeName) {
//     return next();
//   }

//   console.log('to.name: ', to.name.toLowerCase());

//   await requestStore.fetchGetRequestsByUID(uid);

//   const { request } = storeToRefs(requestStore);
//   const status = request.value.requests.status;
//   const isSurvey = request.value.is_survey;

//   console.log('request.value: ', request.value);
//   console.log('status: ', status);
//   console.log('isSurvey: ', isSurvey);
//   console.log('routeName: ', routeName.toLowerCase());

//   const hasBP = ref(false)
//   const { businessPartner, contractAccount } = storeToRefs(businessPartnerStore);
//   console.log('businessPartner: ', businessPartner.value);
//   console.log('contractAccount: ', contractAccount.value);

//   await businessPartnerStore.fetchBusinessPartnersByRequestID(
//     request.value?.requests?.customer_request_no
//   );

//   const bpForm = await getLocalStorage(`${uid}_bpForm`);

//   if(businessPartner.value != null || bpForm?.cid){
//     hasBP.value = true
//   }
//   console.log('hasBP.value: ', hasBP.value);

//   const redirectToHome = () => next({ name: '/' });
//   const redirectToReview = () => next({ name: '/request/[uid]', params: { uid } });
//   const redirectToCreateBP = () => next({ name: '/createbp/[uid]', params: { uid } });

//   const routeConditions = {
//     createbp: () => status === 'D' ? redirectToReview() : next(),
//     application: () => (status === 'D' || !hasBP.value) ? redirectToCreateBP() : next(),
//     history: () => (!isSurvey || ['D', 'C'].includes(status)) ? redirectToHome() : next(),
//     survey: () => (!isSurvey || ['D', 'C'].includes(status)) ? redirectToHome() : next(),
//     quotation: () => (['D', 'C', 'I'].includes(status)) ? redirectToHome() : next()
//   };

//   const conditionCheck = routeConditions[routeName.toLowerCase()];

//   if (conditionCheck) {
//     return conditionCheck();
//   }

//   console.log('End status middleware: success');
//   return next();
// }

//-------------------------------------------------------------------------------------------------------------

// export default async function status(to, from, next) {

//   console.log('Start status middleware');

//   const requestStore = useRequestStore();

//   const uid = to.params.uid;
//   let routeName = '';

//   if (uid) {
//     console.log('middleware UID: ', uid);

//     const isRequestPage = hasSameWord(to.name.toLowerCase(), 'request');
//     const isCreateBpPage = hasSameWord(to.name.toLowerCase(), 'createbp');
//     const isApplicationPage = hasSameWord(to.name.toLowerCase(), 'application');
//     const isSurveyHistoryPage = hasSameWord(to.name.toLowerCase(), 'history');
//     const isSurveyPage = hasSameWord(to.name.toLowerCase(), 'survey');
//     const isQuotationPage = hasSameWord(to.name.toLowerCase(), 'quotation');
//     console.log('to.name: ', to.name.toLowerCase());

//     const pageMappings = [
//       { var: isRequestPage, name: 'request' },
//       { var: isCreateBpPage, name: 'createbp' },
//       { var: isApplicationPage, name: 'application' },
//       { var: isSurveyHistoryPage, name: 'history' },
//       { var: isSurveyPage, name: 'survey' },
//       { var: isQuotationPage, name: 'quotation' }
//     ];

//     for (const mapping of pageMappings) {
//       if (mapping.var) {
//         routeName = mapping.name;
//         break;
//       }
//     }

//     await requestStore.fetchGetRequestsByUID(uid);

//     const { request } = storeToRefs(requestStore);
//     console.log('request.value: ', request.value);

//     const status = request.value.requests.status
//     const isSurvey = request.value.is_survey
//     console.log('status: ', status);
//     console.log('isSurvey: ', isSurvey);
//     console.log('routeName: ', routeName.toLowerCase());

//     switch (routeName.toLowerCase()) {
//       case "createbp":
//         console.log('createbp');
//         if (status == 'D') {
//           console.log('status: ', status);
//           return next({
//             name: '/',
//           })
//         }
//         break;
//       case "application":
//         if (status == 'D') {
//           return next({
//             name: '/',
//           })
//         }
//         break;
//       case "history":
//         if (!isSurvey || (status == 'D' || status == 'C')) {
//           return next({
//             name: '/',
//           })
//         }
//         break;
//       case "survey":
//         if (!isSurvey || (status == 'D' || status == 'C')) {
//           return next({
//             name: '/',
//           })
//         }
//         break;
//       case "quotation":
//         if (status == 'D' || status == 'C' || status == 'I') {
//           return next({
//             name: '/',
//           })
//         }
//         break;
//     }

//     console.log('End status middleware : success');

//     return next();

//   } else {
//     console.log('End status middleware : error');

//     return next({
//       name: '/',
//     })
//   }

// }
