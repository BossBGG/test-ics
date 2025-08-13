import axios from 'axios';
import { apiKey, apiExUrl, baseUrl } from './env';
import { useClearInput, useClearSelect, typing, useInput } from './input';

export const formatRequestName = (requestFunction) => {
  const match = requestFunction.name.match(/(\d+)/);
  return match ? `S${match[1]}` : requestFunction.name;
};

export const reviewSubmit = (data) => {
  cy.wait(500).visit(`${baseUrl}request/${data.request_id}`)
  cy.url().should('eq', `${baseUrl}request/${data.request_id}`)
  cy.contains('ข้อมูลผู้ใช้ไฟฟ้า', { timeout: 30000 })
  cy.wait(1000)
  // cy.get('.request-transfer-btn').click()
  // cy.get('.btn-request-confirm-transfer').then(($btn) => {
  //   if ($btn.is(':disabled')) {
  //     cy.get('.select-area-transfer').click(), { timeout: 10000 };
  //     cy.get('.q-menu .q-item').first().click(), { timeout: 10000 };
  //     cy.get('.btn-request-confirm-transfer').click(), { timeout: 10000 };
  //     cy.contains('โอนย้ายคำร้องสำเร็จ', { timeout: 10000 })
  //   } else {
  //     cy.get('.btn-request-confirm-transfer').click();
  //   }
  // });
  // cy.wait(500).visit(`${baseUrl}request/${data.request_id}`)
  // cy.url().should('eq', `${baseUrl}request/${data.request_id}`)
  cy.wait(500).contains('บันทึกและค้นหาข้อมูล BP', { timeout: 20000 }).click({ timeout: 20000 })
  cy.get('.btn-modal-alert-confirm', { timeout: 20000 }).click({ timeout: 20000 })
  cy.wait(500).contains('บันทึกข้อมูลสำเร็จ', { timeout: 20000 })
  cy.get('#btn-close-alert', { timeout: 20000 }).click({ force: true, timeout: 20000 })
  // cy.wait(500).url().should('eq', `https://ics.pea.co.th/authentication/login`, { timeout: 20000 })
};

export const reviewSubmitUnhappy = (data) => {
  cy.wait(500).visit(`${baseUrl}request/${data.request_id}`)
  cy.url().should('eq', `${baseUrl}request/${data.request_id}`)
  cy.contains('ข้อมูลผู้ใช้ไฟฟ้า', { timeout: 40000 })
  cy.wait(1000)

  useClearInput(".request-customer-type")
  cy.contains('กรุณากรอกชื่อ', { timeout: 30000 })
  cy.contains('กรุณากรอกนามสกุล', { timeout: 30000 })
  cy.contains('กรุณากรอกเบอร์ติดต่อ', { timeout: 30000 })

  useClearInput(".request-address-form")
  cy.contains('กรุณากรอกที่อยู่', { timeout: 30000 })
  useClearSelect('.select-province')
  cy.get('.request-save-btn', { timeout: 30000 }).click({ timeout: 30000 })
};

export const clickNextToTest = () => {
  cy.get('.request-save-btn', { timeout: 30000 }).click({ timeout: 30000 })
  const requestCustomerType = useInput('.request-customer-type')
  requestCustomerType.typing('.input-first-name', 'นรสิงห์')
  cy.get('.request-save-btn', { timeout: 30000 }).click({ timeout: 30000 })
};

export const clearS301 = () => {
  useClearSelect('.select-equipment-type')
  useClearInput(".form-request-service")
};

export const insertRequest301 = async () => {
  const { data } = await axios.post(
    apiExUrl + 'requests',
    {
      "service_code": "S301",
      "channel": 0,
      "morning_flag": true,
      "afternoon_flag": true,
      "first_name": "มาตาลดา",
      "last_name": "คำวงศ์",
      "mobile_no": "0880937651",
      "email": "firstname.l@kanda.digital",
      "address": "440/067 คอนโดไทย",
      "address_province": "76",
      "address_city": "7606",
      "address_district": "760601",
      "address_post_code": "76150",
      "request_type": "XXX",
      "files": null,
      "detail": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas venenatis nunc ac justo pharetra laoreet. Fusce ut mi elementum, lobortis arcu quis, viverra ipsum. Maecenas dui arcu.",
      "legal_form": "",
      "nationality": "",
      //s301
      "equipment_type": "7F3D3C5A-3CCA-4F88-B866-48871BD577CB", // STRING : GUID from service_items Y3
      //s302, s303, s304, s307, s309, s311, s312, s315, s320, s322
      "business_type_id": "1413F877-0E21-491A-B733-3A4EF8CD8F0F", // STRING : GUID from m_business_type Y3
      //s301, s312, s314, s315,s316,s318,s327,s329
      "qty": 3, // INT or NULL
      //s305, s313, s328
      "request_service": "e45cee2a-5314-4c35-8dbf-bf7081e1fbf6", // STRING : GUID from service_items Y3
      //s305, s313
      "request_service_type": "996fbdcf-27a6-461b-94b3-5cad12810cc3", // STRING : GUID from service_items Y3
      "transformers": [
        {
          "transformer_brand": "e3161e97-7926-46b2-bc5b-155fd917318a", // STRING : GUID from service_items Y3
          "transformer_phase": "5ad55ade-d663-4770-aaf7-dc5af8b0d765", // STRING : GUID from service_items Y3
          "transformer_type": "897ee3ff-6f0c-46f5-aecc-f0cc3a4800fc", // STRING : GUID from service_items Y3 | *child of phase
          "transformer_serial": "TRANSFORMERSERIAL002", // STRING
          "transformer_size": "ad7d8913-4087-4bdf-8163-af8b86bfe648", // STRING : GUID from service_items Y3
          "transformer_voltage": "3beb04f8-4072-4a46-8adc-86c9cd0162c2", // STRING : GUID from service_items Y3
          "transformer_voltage_other": "" // STRING : เมื่อ transformer_voltage is_other = true
        }
      ],
      //s307
      "transformer_voltage": null, // STRING : GUID from service_items Y3
      //s308,s315
      "transformer_size": 0, // INT
      //s315
      "transformer_qty": 0, // INT
      //s312
      "equipment_type_id": "D2993E34-01A1-4B84-A014-C99C239A76E8", // STRING : GUID from service_items Y3
      //s314
      "rental_startdate": "2024-04-22 23:59:59", // DATETIME
      "rental_enddate": "2024-04-30 23:59:59", // DATETIME
      "days": 1, // INT
      //s316
      "kw_size": 10, // INT
      //s318
      "equipment_id": "D2993E34-01A1-4B84-A014-C99C239A76E8", // STRING : GUID from service_items Y3
      "amps_size": 0, // INT
      //s322
      "size_install": "cacfa7cb-32ff-4606-b294-44102ee44fa9", // STRING : GUID from service_items Y3
      //s329
      "renewable_type": "D6F08661-5682-4915-AB0D-3BFBAB11979F", // STRING : GUID from service_items Y3
      "renewable_source": [], // ARRAY : GUID from service_items คั่นด้วย comma ex. ["D2C43111-1345-45E0-B365-B5D3A2C90C0D","BC48F0E3-6D8D-4E90-87B1-96341337FC42"]
      "renewable_source_other": {}, // JSON เมื่อ renewable_source มีตัวที่ is_other = true ให้ key = GUID และ value = text from input ex. {"BC48F0E3-6D8D-4E90-87B1-96341337FC42":"Value"}
      "year": 2567 // INT
    },
    {
      headers: {
        'Apikey': apiKey
      }
    }
  );

  return data
};

export const insertRequest302 = async () => {
  const { data } = await axios.post(
    apiExUrl + 'requests',
    {
      "service_code": "S302",
      "channel": 0,
      "morning_flag": true,
      "afternoon_flag": true,
      "first_name": "มาตาลดา",
      "last_name": "คำวงศ์",
      "mobile_no": "0880937651",
      "email": "firstname.l@kanda.digital",
      "address": "440/067 คอนโดไทย",
      "address_province": "81",
      "address_city": "8101",
      "address_district": "810101",
      "address_post_code": "81000",
      "request_type": "XXX",
      "files": null,
      "detail": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas venenatis nunc ac justo pharetra laoreet. Fusce ut mi elementum, lobortis arcu quis, viverra ipsum. Maecenas dui arcu.",
      "legal_form": "",
      "nationality": "",
      //s301
      "equipment_type": "7F3D3C5A-3CCA-4F88-B866-48871BD577CB", // STRING : GUID from service_items Y3
      //s302, s303, s304, s307, s309, s311, s312, s315, s320, s322
      "business_type_id": "1413F877-0E21-491A-B733-3A4EF8CD8F0F", // STRING : GUID from m_business_type Y3
      //s301, s312, s314, s315,s316,s318,s327,s329
      "qty": 3, // INT or NULL
      //s305, s313, s328
      "request_service": "e45cee2a-5314-4c35-8dbf-bf7081e1fbf6", // STRING : GUID from service_items Y3
      //s305, s313
      "request_service_type": "996fbdcf-27a6-461b-94b3-5cad12810cc3", // STRING : GUID from service_items Y3
      "transformers": [
        {
          "transformer_brand": "e3161e97-7926-46b2-bc5b-155fd917318a", // STRING : GUID from service_items Y3
          "transformer_phase": "5ad55ade-d663-4770-aaf7-dc5af8b0d765", // STRING : GUID from service_items Y3
          "transformer_type": "897ee3ff-6f0c-46f5-aecc-f0cc3a4800fc", // STRING : GUID from service_items Y3 | *child of phase
          "transformer_serial": "TRANSFORMERSERIAL002", // STRING
          "transformer_size": "ad7d8913-4087-4bdf-8163-af8b86bfe648", // STRING : GUID from service_items Y3
          "transformer_voltage": "3beb04f8-4072-4a46-8adc-86c9cd0162c2", // STRING : GUID from service_items Y3
          "transformer_voltage_other": "" // STRING : เมื่อ transformer_voltage is_other = true
        }
      ],
      //s307
      "transformer_voltage": null, // STRING : GUID from service_items Y3
      //s308,s315
      "transformer_size": 0, // INT
      //s315
      "transformer_qty": 0, // INT
      //s312
      "equipment_type_id": "D2993E34-01A1-4B84-A014-C99C239A76E8", // STRING : GUID from service_items Y3
      //s314
      "rental_startdate": "2024-04-22 23:59:59", // DATETIME
      "rental_enddate": "2024-04-30 23:59:59", // DATETIME
      "days": 1, // INT
      //s316
      "kw_size": 10, // INT
      //s318
      "equipment_id": "D2993E34-01A1-4B84-A014-C99C239A76E8", // STRING : GUID from service_items Y3
      "amps_size": 0, // INT
      //s322
      "size_install": "cacfa7cb-32ff-4606-b294-44102ee44fa9", // STRING : GUID from service_items Y3
      //s329
      "renewable_type": "D6F08661-5682-4915-AB0D-3BFBAB11979F", // STRING : GUID from service_items Y3
      "renewable_source": [], // ARRAY : GUID from service_items คั่นด้วย comma ex. ["D2C43111-1345-45E0-B365-B5D3A2C90C0D","BC48F0E3-6D8D-4E90-87B1-96341337FC42"]
      "renewable_source_other": {}, // JSON เมื่อ renewable_source มีตัวที่ is_other = true ให้ key = GUID และ value = text from input ex. {"BC48F0E3-6D8D-4E90-87B1-96341337FC42":"Value"}
      "year": 2567 // INT
    },
    {
      headers: {
        'Apikey': apiKey
      }
    }
  );

  return data
};

export const insertRequest303 = async () => {
  const { data } = await axios.post(
    apiExUrl + 'requests',
    {
      "service_code": "S303",
      "channel": 0,
      "morning_flag": true,
      "afternoon_flag": true,
      "first_name": "มาตาลดา",
      "last_name": "คำวงศ์",
      "mobile_no": "0880937651",
      "email": "firstname.l@kanda.digital",
      "address": "440/067 คอนโดไทย",
      "address_province": "76",
      "address_city": "7606",
      "address_district": "760601",
      "address_post_code": "76150",
      "request_type": "XXX",
      "files": null,
      "detail": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas venenatis nunc ac justo pharetra laoreet. Fusce ut mi elementum, lobortis arcu quis, viverra ipsum. Maecenas dui arcu.",
      "legal_form": "",
      "nationality": "",
      //s301
      "equipment_type": "7F3D3C5A-3CCA-4F88-B866-48871BD577CB", // STRING : GUID from service_items Y3
      //s302, s303, s304, s307, s309, s311, s312, s315, s320, s322
      "business_type_id": "1413F877-0E21-491A-B733-3A4EF8CD8F0F", // STRING : GUID from m_business_type Y3
      //s301, s312, s314, s315,s316,s318,s327,s329
      "qty": 3, // INT or NULL
      //s305, s313, s328
      "request_service": "e45cee2a-5314-4c35-8dbf-bf7081e1fbf6", // STRING : GUID from service_items Y3
      //s305, s313
      "request_service_type": "996fbdcf-27a6-461b-94b3-5cad12810cc3", // STRING : GUID from service_items Y3
      "transformers": [
        {
          "transformer_brand": "e3161e97-7926-46b2-bc5b-155fd917318a", // STRING : GUID from service_items Y3
          "transformer_phase": "5ad55ade-d663-4770-aaf7-dc5af8b0d765", // STRING : GUID from service_items Y3
          "transformer_type": "897ee3ff-6f0c-46f5-aecc-f0cc3a4800fc", // STRING : GUID from service_items Y3 | *child of phase
          "transformer_serial": "TRANSFORMERSERIAL002", // STRING
          "transformer_size": "ad7d8913-4087-4bdf-8163-af8b86bfe648", // STRING : GUID from service_items Y3
          "transformer_voltage": "3beb04f8-4072-4a46-8adc-86c9cd0162c2", // STRING : GUID from service_items Y3
          "transformer_voltage_other": "" // STRING : เมื่อ transformer_voltage is_other = true
        }
      ],
      //s307
      "transformer_voltage": null, // STRING : GUID from service_items Y3
      //s308,s315
      "transformer_size": 0, // INT
      //s315
      "transformer_qty": 0, // INT
      //s312
      "equipment_type_id": "D2993E34-01A1-4B84-A014-C99C239A76E8", // STRING : GUID from service_items Y3
      //s314
      "rental_startdate": "2024-04-22 23:59:59", // DATETIME
      "rental_enddate": "2024-04-30 23:59:59", // DATETIME
      "days": 1, // INT
      //s316
      "kw_size": 10, // INT
      //s318
      "equipment_id": "D2993E34-01A1-4B84-A014-C99C239A76E8", // STRING : GUID from service_items Y3
      "amps_size": 0, // INT
      //s322
      "size_install": "cacfa7cb-32ff-4606-b294-44102ee44fa9", // STRING : GUID from service_items Y3
      //s329
      "renewable_type": "D6F08661-5682-4915-AB0D-3BFBAB11979F", // STRING : GUID from service_items Y3
      "renewable_source": [], // ARRAY : GUID from service_items คั่นด้วย comma ex. ["D2C43111-1345-45E0-B365-B5D3A2C90C0D","BC48F0E3-6D8D-4E90-87B1-96341337FC42"]
      "renewable_source_other": {}, // JSON เมื่อ renewable_source มีตัวที่ is_other = true ให้ key = GUID และ value = text from input ex. {"BC48F0E3-6D8D-4E90-87B1-96341337FC42":"Value"}
      "year": 2567 // INT
    },
    {
      headers: {
        'Apikey': apiKey
      }
    }
  );

  return data
};

export const insertRequest304 = async () => {
  const { data } = await axios.post(
    apiExUrl + 'requests',
    {
      "service_code": "S304",
      "channel": 0,
      "morning_flag": true,
      "afternoon_flag": true,
      "first_name": "มาตาลดา",
      "last_name": "คำวงศ์",
      "mobile_no": "0880937651",
      "email": "firstname.l@kanda.digital",
      "address": "440/067 คอนโดไทย",
      "address_province": "76",
      "address_city": "7606",
      "address_district": "760601",
      "address_post_code": "76150",
      "request_type": "XXX",
      "files": null,
      "detail": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas venenatis nunc ac justo pharetra laoreet. Fusce ut mi elementum, lobortis arcu quis, viverra ipsum. Maecenas dui arcu.",
      "legal_form": "",
      "nationality": "",
      //s301
      "equipment_type": "7F3D3C5A-3CCA-4F88-B866-48871BD577CB", // STRING : GUID from service_items Y3
      //s302, s303, s304, s307, s309, s311, s312, s315, s320, s322
      "business_type_id": "1413F877-0E21-491A-B733-3A4EF8CD8F0F", // STRING : GUID from m_business_type Y3
      //s301, s312, s314, s315,s316,s318,s327,s329
      "qty": 3, // INT or NULL
      //s305, s313, s328
      "request_service": "e45cee2a-5314-4c35-8dbf-bf7081e1fbf6", // STRING : GUID from service_items Y3
      //s305, s313
      "request_service_type": "996fbdcf-27a6-461b-94b3-5cad12810cc3", // STRING : GUID from service_items Y3
      "transformers": [
        {
          "transformer_brand": "e3161e97-7926-46b2-bc5b-155fd917318a", // STRING : GUID from service_items Y3
          "transformer_phase": "5ad55ade-d663-4770-aaf7-dc5af8b0d765", // STRING : GUID from service_items Y3
          "transformer_type": "897ee3ff-6f0c-46f5-aecc-f0cc3a4800fc", // STRING : GUID from service_items Y3 | *child of phase
          "transformer_serial": "TRANSFORMERSERIAL002", // STRING
          "transformer_size": "ad7d8913-4087-4bdf-8163-af8b86bfe648", // STRING : GUID from service_items Y3
          "transformer_voltage": "3beb04f8-4072-4a46-8adc-86c9cd0162c2", // STRING : GUID from service_items Y3
          "transformer_voltage_other": "" // STRING : เมื่อ transformer_voltage is_other = true
        }
      ],
      //s307
      "transformer_voltage": null, // STRING : GUID from service_items Y3
      //s308,s315
      "transformer_size": 0, // INT
      //s315
      "transformer_qty": 0, // INT
      //s312
      "equipment_type_id": "D2993E34-01A1-4B84-A014-C99C239A76E8", // STRING : GUID from service_items Y3
      //s314
      "rental_startdate": "2024-04-22 23:59:59", // DATETIME
      "rental_enddate": "2024-04-30 23:59:59", // DATETIME
      "days": 1, // INT
      //s316
      "kw_size": 10, // INT
      //s318
      "equipment_id": "D2993E34-01A1-4B84-A014-C99C239A76E8", // STRING : GUID from service_items Y3
      "amps_size": 0, // INT
      //s322
      "size_install": "cacfa7cb-32ff-4606-b294-44102ee44fa9", // STRING : GUID from service_items Y3
      //s329
      "renewable_type": "D6F08661-5682-4915-AB0D-3BFBAB11979F", // STRING : GUID from service_items Y3
      "renewable_source": [], // ARRAY : GUID from service_items คั่นด้วย comma ex. ["D2C43111-1345-45E0-B365-B5D3A2C90C0D","BC48F0E3-6D8D-4E90-87B1-96341337FC42"]
      "renewable_source_other": {}, // JSON เมื่อ renewable_source มีตัวที่ is_other = true ให้ key = GUID และ value = text from input ex. {"BC48F0E3-6D8D-4E90-87B1-96341337FC42":"Value"}
      "year": 2567 // INT
    },
    {
      headers: {
        'Apikey': apiKey
      }
    }
  );

  return data
};

export const insertRequest305 = async () => {
  const { data } = await axios.post(
    apiExUrl + 'requests',
    {
      "service_code": "S305",
      "channel": 0,
      "morning_flag": true,
      "afternoon_flag": true,
      "first_name": "test",
      "last_name": "test",
      "mobile_no": "0880937651",
      "email": "firstname.l@kanda.digital",
      "address": "440/067 คอนโดไทย",
      "address_province": "76",
      "address_city": "7606",
      "address_district": "760601",
      "address_post_code": "76150",
      "request_type": "XXX",
      "files": null,
      "detail": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas venenatis nunc ac justo pharetra laoreet. Fusce ut mi elementum, lobortis arcu quis, viverra ipsum. Maecenas dui arcu.",
      "legal_form": "",
      "nationality": "",
      //s301
      "equipment_type": "7F3D3C5A-3CCA-4F88-B866-48871BD577CB", // STRING : GUID from service_items Y3
      //s302, s303, s304, s307, s309, s311, s312, s315, s320, s322
      "business_type_id": "1413F877-0E21-491A-B733-3A4EF8CD8F0F", // STRING : GUID from m_business_type Y3
      //s301, s312, s314, s315,s316,s318,s327,s329
      "qty": 3, // INT or NULL
      //s305, s313, s328
      "request_service": "68d4be55-4b60-4675-8170-6ac96b398ad8", // STRING : GUID from service_items Y3
      //s305, s313
      "request_service_type": "e51d31fe-cd31-442d-877f-60e4dc357002", // STRING : GUID from service_items Y3
      "transformers": [
        {
          "transformer_brand": "529e631e-f67a-4d57-92c7-d7ae47a3d705", // STRING : GUID from service_items Y3
          "transformer_phase": "b147197f-2889-41cb-96bf-c19bdd30e3b5", // STRING : GUID from service_items Y3
          "transformer_type": "10ceadc5-16b6-4b2a-8b77-9343f97abf2e", // STRING : GUID from service_items Y3 | *child of phase
          "transformer_serial": "TRANSFORMERSERIAL001", // STRING
          "transformer_size": "2e8be5d4-5950-4c47-93a3-e80bf40492a7", // STRING : GUID from service_items Y3
          "transformer_voltage": "827f9724-d3c8-4da8-bdcd-84afd725cb17", // STRING : GUID from service_items Y3
          "transformer_voltage_other": "" // STRING : เมื่อ transformer_voltage is_other = true
        },
        {
          "transformer_brand": "529e631e-f67a-4d57-92c7-d7ae47a3d705", // STRING : GUID from service_items Y3
          "transformer_phase": "b50f79dc-3ef2-49de-a5c2-7079f9a7c55d", // STRING : GUID from service_items Y3
          "transformer_type": "1ea20e4f-1b84-4e76-bc9a-fac3c718fe8f", // STRING : GUID from service_items Y3 | *child of phase
          "transformer_serial": "TRANSFORMERSERIAL002", // STRING
          "transformer_size": "64124829-e6c7-4799-b34a-845081ec46bc", // STRING : GUID from service_items Y3
          "transformer_voltage": "dcaf9300-f0f7-4975-b54c-17b25b6ed28d", // STRING : GUID from service_items Y3
          "transformer_voltage_other": "99" // STRING : เมื่อ transformer_voltage is_other = true
        }
      ],
      //s307
      "transformer_voltage": null, // STRING : GUID from service_items Y3
      //s308,s315
      "transformer_size": 0, // INT
      //s315
      "transformer_qty": 0, // INT
      //s312
      "equipment_type_id": "D2993E34-01A1-4B84-A014-C99C239A76E8", // STRING : GUID from service_items Y3
      //s314
      "rental_startdate": "2024-04-22 23:59:59", // DATETIME
      "rental_enddate": "2024-04-30 23:59:59", // DATETIME
      "days": 1, // INT
      //s316
      "kw_size": 10, // INT
      //s318
      "equipment_id": "D2993E34-01A1-4B84-A014-C99C239A76E8", // STRING : GUID from service_items Y3
      "amps_size": 0, // INT
      //s322
      "size_install": "cacfa7cb-32ff-4606-b294-44102ee44fa9", // STRING : GUID from service_items Y3
      //s329
      "renewable_type": "D6F08661-5682-4915-AB0D-3BFBAB11979F", // STRING : GUID from service_items Y3
      "renewable_source": [], // ARRAY : GUID from service_items คั่นด้วย comma ex. ["D2C43111-1345-45E0-B365-B5D3A2C90C0D","BC48F0E3-6D8D-4E90-87B1-96341337FC42"]
      "renewable_source_other": {}, // JSON เมื่อ renewable_source มีตัวที่ is_other = true ให้ key = GUID และ value = text from input ex. {"BC48F0E3-6D8D-4E90-87B1-96341337FC42":"Value"}
      "year": 2567 // INT
    },
    {
      headers: {
        'Apikey': apiKey
      }
    }
  );

  return data
};

export const insertRequest306 = async () => {
  const { data } = await axios.post(
    apiExUrl + 'requests',
    {
      "service_code": "S306",
      "channel": 0,
      "morning_flag": true,
      "afternoon_flag": true,
      "first_name": "test",
      "last_name": "test",
      "mobile_no": "0880937651",
      "email": "firstname.l@kanda.digital",
      "address": "440/067 คอนโดไทย",
      "address_province": "76",
      "address_city": "7606",
      "address_district": "760601",
      "address_post_code": "76150",
      "request_type": "XXX",
      "files": null,
      "detail": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas venenatis nunc ac justo pharetra laoreet. Fusce ut mi elementum, lobortis arcu quis, viverra ipsum. Maecenas dui arcu.",
      "legal_form": "",
      "nationality": "",
      //s301
      "equipment_type": "7F3D3C5A-3CCA-4F88-B866-48871BD577CB", // STRING : GUID from service_items Y3
      //s302, s303, s304, s307, s309, s311, s312, s315, s320, s322
      "business_type_id": "1413F877-0E21-491A-B733-3A4EF8CD8F0F", // STRING : GUID from m_business_type Y3
      //s301, s312, s314, s315,s316,s318,s327,s329
      "qty": 3, // INT or NULL
      //s305, s313, s328
      "request_service": "68d4be55-4b60-4675-8170-6ac96b398ad8", // STRING : GUID from service_items Y3
      //s305, s313
      "request_service_type": "e51d31fe-cd31-442d-877f-60e4dc357002", // STRING : GUID from service_items Y3
      "transformers": [
        {
          "transformer_brand": "529e631e-f67a-4d57-92c7-d7ae47a3d705", // STRING : GUID from service_items Y3
          "transformer_phase": "b147197f-2889-41cb-96bf-c19bdd30e3b5", // STRING : GUID from service_items Y3
          "transformer_type": "10ceadc5-16b6-4b2a-8b77-9343f97abf2e", // STRING : GUID from service_items Y3 | *child of phase
          "transformer_serial": "TRANSFORMERSERIAL002", // STRING
          "transformer_size": "2e8be5d4-5950-4c47-93a3-e80bf40492a7", // STRING : GUID from service_items Y3
          "transformer_voltage": "827f9724-d3c8-4da8-bdcd-84afd725cb17", // STRING : GUID from service_items Y3
          "transformer_voltage_other": "" // STRING : เมื่อ transformer_voltage is_other = true
        }
      ],
      //s307
      "transformer_voltage": null, // STRING : GUID from service_items Y3
      //s308,s315
      "transformer_size": 0, // INT
      //s315
      "transformer_qty": 0, // INT
      //s312
      "equipment_type_id": "D2993E34-01A1-4B84-A014-C99C239A76E8", // STRING : GUID from service_items Y3
      //s314
      "rental_startdate": "2024-04-22 23:59:59", // DATETIME
      "rental_enddate": "2024-04-30 23:59:59", // DATETIME
      "days": 1, // INT
      //s316
      "kw_size": 10, // INT
      //s318
      "equipment_id": "D2993E34-01A1-4B84-A014-C99C239A76E8", // STRING : GUID from service_items Y3
      "amps_size": 0, // INT
      //s322
      "size_install": "cacfa7cb-32ff-4606-b294-44102ee44fa9", // STRING : GUID from service_items Y3
      //s329
      "renewable_type": "d6f08661-5682-4915-ab0d-3bfbab11979f", // STRING : GUID from service_items Y3
      "renewable_source": [
        "9c39f6bd-c2a9-4098-89db-a8fc4856912c",
        "4e1edfa9-caca-42c4-8c48-26ad5f2ab038",
        "fbad0064-f430-47b5-93a1-223095677213"
      ] // ARRAY : GUID from service_items คั่นด้วย comma ex. ["D2C43111-1345-45E0-B365-B5D3A2C90C0D","BC48F0E3-6D8D-4E90-87B1-96341337FC42"]
      ,
      "renewable_source_other": {
        "9c39f6bd-c2a9-4098-89db-a8fc4856912c": "",
        "4e1edfa9-caca-42c4-8c48-26ad5f2ab038": "",
        "fbad0064-f430-47b5-93a1-223095677213": "test"
      } // JSON เมื่อ renewable_source มีตัวที่ is_other = true ให้ key = GUID และ value = text from input ex. {"BC48F0E3-6D8D-4E90-87B1-96341337FC42":"Value"}
      ,
      "year": 2567 // INT
    },
    {
      headers: {
        'Apikey': apiKey
      }
    }
  );

  return data
};

export const insertRequest307 = async () => {
  const { data } = await axios.post(
    apiExUrl + 'requests',
    {
      "service_code": "S307",
      "channel": 0,
      "morning_flag": true,
      "afternoon_flag": true,
      "first_name": "test",
      "last_name": "test",
      "mobile_no": "0880937651",
      "email": "firstname.l@kanda.digital",
      "address": "440/067 คอนโดไทย",
      "address_province": "76",
      "address_city": "7606",
      "address_district": "760601",
      "address_post_code": "76150",
      "request_type": "XXX",
      "files": null,
      "detail": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas venenatis nunc ac justo pharetra laoreet. Fusce ut mi elementum, lobortis arcu quis, viverra ipsum. Maecenas dui arcu.",
      "legal_form": "",
      "nationality": "",
      //s301
      "equipment_type": "7F3D3C5A-3CCA-4F88-B866-48871BD577CB", // STRING : GUID from service_items Y3
      //s302, s303, s304, s307, s309, s311, s312, s315, s320, s322
      "business_type_id": "1413F877-0E21-491A-B733-3A4EF8CD8F0F", // STRING : GUID from m_business_type Y3
      //s301, s312, s314, s315,s316,s318,s327,s329
      "qty": 3, // INT or NULL
      //s305, s313, s328
      "request_service": "68d4be55-4b60-4675-8170-6ac96b398ad8", // STRING : GUID from service_items Y3
      //s305, s313
      "request_service_type": "e51d31fe-cd31-442d-877f-60e4dc357002", // STRING : GUID from service_items Y3
      "transformers": [
        {
          "transformer_brand": "529e631e-f67a-4d57-92c7-d7ae47a3d705", // STRING : GUID from service_items Y3
          "transformer_phase": "b147197f-2889-41cb-96bf-c19bdd30e3b5", // STRING : GUID from service_items Y3
          "transformer_type": "10ceadc5-16b6-4b2a-8b77-9343f97abf2e", // STRING : GUID from service_items Y3 | *child of phase
          "transformer_serial": "TRANSFORMERSERIAL002", // STRING
          "transformer_size": "2e8be5d4-5950-4c47-93a3-e80bf40492a7", // STRING : GUID from service_items Y3
          "transformer_voltage": "827f9724-d3c8-4da8-bdcd-84afd725cb17", // STRING : GUID from service_items Y3
          "transformer_voltage_other": "" // STRING : เมื่อ transformer_voltage is_other = true
        }
      ],
      //s307
      "transformer_voltage": "983dc9d5-84ef-4917-bbd7-321a00b73668", // STRING : GUID from service_items Y3
      //s308,s315
      "transformer_size": 0, // INT
      //s315
      "transformer_qty": 0, // INT
      //s312
      "equipment_type_id": "D2993E34-01A1-4B84-A014-C99C239A76E8", // STRING : GUID from service_items Y3
      //s314
      "rental_startdate": "2024-04-22 23:59:59", // DATETIME
      "rental_enddate": "2024-04-30 23:59:59", // DATETIME
      "days": 1, // INT
      //s316
      "kw_size": 10, // INT
      //s318
      "equipment_id": "D2993E34-01A1-4B84-A014-C99C239A76E8", // STRING : GUID from service_items Y3
      "amps_size": 0, // INT
      //s322
      "size_install": "cacfa7cb-32ff-4606-b294-44102ee44fa9", // STRING : GUID from service_items Y3
      //s329
      "renewable_type": "d6f08661-5682-4915-ab0d-3bfbab11979f", // STRING : GUID from service_items Y3
      "renewable_source": [
        "9c39f6bd-c2a9-4098-89db-a8fc4856912c",
        "4e1edfa9-caca-42c4-8c48-26ad5f2ab038",
        "fbad0064-f430-47b5-93a1-223095677213"
      ] // ARRAY : GUID from service_items คั่นด้วย comma ex. ["D2C43111-1345-45E0-B365-B5D3A2C90C0D","BC48F0E3-6D8D-4E90-87B1-96341337FC42"]
      ,
      "renewable_source_other": {
        "9c39f6bd-c2a9-4098-89db-a8fc4856912c": "",
        "4e1edfa9-caca-42c4-8c48-26ad5f2ab038": "",
        "fbad0064-f430-47b5-93a1-223095677213": "test"
      } // JSON เมื่อ renewable_source มีตัวที่ is_other = true ให้ key = GUID และ value = text from input ex. {"BC48F0E3-6D8D-4E90-87B1-96341337FC42":"Value"}
      ,
      "year": 2567 // INT
    },
    {
      headers: {
        'Apikey': apiKey
      }
    }
  );

  return data
};

export const insertRequest308 = async () => {
  const { data } = await axios.post(
    apiExUrl + 'requests',
    {
      "service_code": "S308",
      "channel": 0,
      "morning_flag": true,
      "afternoon_flag": true,
      "first_name": "test",
      "last_name": "test",
      "mobile_no": "0880937651",
      "email": "firstname.l@kanda.digital",
      "address": "440/067 คอนโดไทย",
      "address_province": "76",
      "address_city": "7606",
      "address_district": "760601",
      "address_post_code": "76150",
      "request_type": "XXX",
      "files": null,
      "detail": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas venenatis nunc ac justo pharetra laoreet. Fusce ut mi elementum, lobortis arcu quis, viverra ipsum. Maecenas dui arcu.",
      "legal_form": "",
      "nationality": "",
      //s301
      "equipment_type": "7F3D3C5A-3CCA-4F88-B866-48871BD577CB", // STRING : GUID from service_items Y3
      //s302, s303, s304, s307, s309, s311, s312, s315, s320, s322
      "business_type_id": "1413F877-0E21-491A-B733-3A4EF8CD8F0F", // STRING : GUID from m_business_type Y3
      //s301, s312, s314, s315,s316,s318,s327,s329
      "qty": 3, // INT or NULL
      //s305, s313, s328
      "request_service": "68d4be55-4b60-4675-8170-6ac96b398ad8", // STRING : GUID from service_items Y3
      //s305, s313
      "request_service_type": "e51d31fe-cd31-442d-877f-60e4dc357002", // STRING : GUID from service_items Y3
      "transformers": [
        {
          "transformer_brand": "529e631e-f67a-4d57-92c7-d7ae47a3d705", // STRING : GUID from service_items Y3
          "transformer_phase": "b147197f-2889-41cb-96bf-c19bdd30e3b5", // STRING : GUID from service_items Y3
          "transformer_type": "10ceadc5-16b6-4b2a-8b77-9343f97abf2e", // STRING : GUID from service_items Y3 | *child of phase
          "transformer_serial": "TRANSFORMERSERIAL002", // STRING
          "transformer_size": "2e8be5d4-5950-4c47-93a3-e80bf40492a7", // STRING : GUID from service_items Y3
          "transformer_voltage": "827f9724-d3c8-4da8-bdcd-84afd725cb17", // STRING : GUID from service_items Y3
          "transformer_voltage_other": "" // STRING : เมื่อ transformer_voltage is_other = true
        }
      ],
      //s307
      "transformer_voltage": "983dc9d5-84ef-4917-bbd7-321a00b73668", // STRING : GUID from service_items Y3
      //s308,s315
      "transformer_size": 3, // INT
      //s315
      "transformer_qty": 3, // INT
      //s312
      "equipment_type_id": "D2993E34-01A1-4B84-A014-C99C239A76E8", // STRING : GUID from service_items Y3
      //s314
      "rental_startdate": "2024-04-22 23:59:59", // DATETIME
      "rental_enddate": "2024-04-30 23:59:59", // DATETIME
      "days": 1, // INT
      //s316
      "kw_size": 10, // INT
      //s318
      "equipment_id": "D2993E34-01A1-4B84-A014-C99C239A76E8", // STRING : GUID from service_items Y3
      "amps_size": 0, // INT
      //s322
      "size_install": "cacfa7cb-32ff-4606-b294-44102ee44fa9", // STRING : GUID from service_items Y3
      //s329
      "renewable_type": "d6f08661-5682-4915-ab0d-3bfbab11979f", // STRING : GUID from service_items Y3
      "renewable_source": [
        "9c39f6bd-c2a9-4098-89db-a8fc4856912c",
        "4e1edfa9-caca-42c4-8c48-26ad5f2ab038",
        "fbad0064-f430-47b5-93a1-223095677213"
      ] // ARRAY : GUID from service_items คั่นด้วย comma ex. ["D2C43111-1345-45E0-B365-B5D3A2C90C0D","BC48F0E3-6D8D-4E90-87B1-96341337FC42"]
      ,
      "renewable_source_other": {
        "9c39f6bd-c2a9-4098-89db-a8fc4856912c": "",
        "4e1edfa9-caca-42c4-8c48-26ad5f2ab038": "",
        "fbad0064-f430-47b5-93a1-223095677213": "test"
      } // JSON เมื่อ renewable_source มีตัวที่ is_other = true ให้ key = GUID และ value = text from input ex. {"BC48F0E3-6D8D-4E90-87B1-96341337FC42":"Value"}
      ,
      "year": 2567 // INT
    },
    {
      headers: {
        'Apikey': apiKey
      }
    }
  );

  return data
};

export const insertRequest309 = async () => {
  const { data } = await axios.post(
    apiExUrl + 'requests',
    {
      "service_code": "S309",
      "channel": 0,
      "morning_flag": true,
      "afternoon_flag": true,
      "first_name": "test",
      "last_name": "test",
      "mobile_no": "0880937651",
      "email": "firstname.l@kanda.digital",
      "address": "440/067 คอนโดไทย",
      "address_province": "76",
      "address_city": "7606",
      "address_district": "760601",
      "address_post_code": "76150",
      "request_type": "XXX",
      "files": null,
      "detail": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas venenatis nunc ac justo pharetra laoreet. Fusce ut mi elementum, lobortis arcu quis, viverra ipsum. Maecenas dui arcu.",
      "legal_form": "",
      "nationality": "",
      //s301
      "equipment_type": "7F3D3C5A-3CCA-4F88-B866-48871BD577CB", // STRING : GUID from service_items Y3
      //s302, s303, s304, s307, s309, s311, s312, s315, s320, s322
      "business_type_id": "1413F877-0E21-491A-B733-3A4EF8CD8F0F", // STRING : GUID from m_business_type Y3
      //s301, s312, s314, s315,s316,s318,s327,s329
      "qty": 3, // INT or NULL
      //s305, s313, s328
      "request_service": "68d4be55-4b60-4675-8170-6ac96b398ad8", // STRING : GUID from service_items Y3
      //s305, s313
      "request_service_type": "e51d31fe-cd31-442d-877f-60e4dc357002", // STRING : GUID from service_items Y3
      "transformers": [
        {
          "transformer_brand": "529e631e-f67a-4d57-92c7-d7ae47a3d705", // STRING : GUID from service_items Y3
          "transformer_phase": "b147197f-2889-41cb-96bf-c19bdd30e3b5", // STRING : GUID from service_items Y3
          "transformer_type": "10ceadc5-16b6-4b2a-8b77-9343f97abf2e", // STRING : GUID from service_items Y3 | *child of phase
          "transformer_serial": "TRANSFORMERSERIAL002", // STRING
          "transformer_size": "2e8be5d4-5950-4c47-93a3-e80bf40492a7", // STRING : GUID from service_items Y3
          "transformer_voltage": "827f9724-d3c8-4da8-bdcd-84afd725cb17", // STRING : GUID from service_items Y3
          "transformer_voltage_other": "" // STRING : เมื่อ transformer_voltage is_other = true
        }
      ],
      //s307
      "transformer_voltage": "983dc9d5-84ef-4917-bbd7-321a00b73668", // STRING : GUID from service_items Y3
      //s308,s315
      "transformer_size": 3, // INT
      //s315
      "transformer_qty": 3, // INT
      //s312
      "equipment_type_id": "D2993E34-01A1-4B84-A014-C99C239A76E8", // STRING : GUID from service_items Y3
      //s314
      "rental_startdate": "2024-04-22 23:59:59", // DATETIME
      "rental_enddate": "2024-04-30 23:59:59", // DATETIME
      "days": 1, // INT
      //s316
      "kw_size": 10, // INT
      //s318
      "equipment_id": "D2993E34-01A1-4B84-A014-C99C239A76E8", // STRING : GUID from service_items Y3
      "amps_size": 0, // INT
      //s322
      "size_install": "cacfa7cb-32ff-4606-b294-44102ee44fa9", // STRING : GUID from service_items Y3
      //s329
      "renewable_type": "d6f08661-5682-4915-ab0d-3bfbab11979f", // STRING : GUID from service_items Y3
      "renewable_source": [
        "9c39f6bd-c2a9-4098-89db-a8fc4856912c",
        "4e1edfa9-caca-42c4-8c48-26ad5f2ab038",
        "fbad0064-f430-47b5-93a1-223095677213"
      ] // ARRAY : GUID from service_items คั่นด้วย comma ex. ["D2C43111-1345-45E0-B365-B5D3A2C90C0D","BC48F0E3-6D8D-4E90-87B1-96341337FC42"]
      ,
      "renewable_source_other": {
        "9c39f6bd-c2a9-4098-89db-a8fc4856912c": "",
        "4e1edfa9-caca-42c4-8c48-26ad5f2ab038": "",
        "fbad0064-f430-47b5-93a1-223095677213": "test"
      } // JSON เมื่อ renewable_source มีตัวที่ is_other = true ให้ key = GUID และ value = text from input ex. {"BC48F0E3-6D8D-4E90-87B1-96341337FC42":"Value"}
      ,
      "year": 2567 // INT
    },
    {
      headers: {
        'Apikey': apiKey
      }
    }
  );

  return data
};

export const insertRequest310 = async () => {
  const { data } = await axios.post(
    apiExUrl + 'requests',
    {
      "service_code": "S310",
      "channel": 0,
      "morning_flag": true,
      "afternoon_flag": true,
      "first_name": "test",
      "last_name": "test",
      "mobile_no": "0880937651",
      "email": "firstname.l@kanda.digital",
      "address": "440/067 คอนโดไทย",
      "address_province": "76",
      "address_city": "7606",
      "address_district": "760601",
      "address_post_code": "76150",
      "request_type": "XXX",
      "files": null,
      "detail": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas venenatis nunc ac justo pharetra laoreet. Fusce ut mi elementum, lobortis arcu quis, viverra ipsum. Maecenas dui arcu.",
      "legal_form": "",
      "nationality": "",
      //s301
      "equipment_type": "7F3D3C5A-3CCA-4F88-B866-48871BD577CB", // STRING : GUID from service_items Y3
      //s302, s303, s304, s307, s309, s311, s312, s315, s320, s322
      "business_type_id": "1413F877-0E21-491A-B733-3A4EF8CD8F0F", // STRING : GUID from m_business_type Y3
      //s301, s312, s314, s315,s316,s318,s327,s329
      "qty": 3, // INT or NULL
      //s305, s313, s328
      "request_service": "68d4be55-4b60-4675-8170-6ac96b398ad8", // STRING : GUID from service_items Y3
      //s305, s313
      "request_service_type": "e51d31fe-cd31-442d-877f-60e4dc357002", // STRING : GUID from service_items Y3
      "transformers": [
        {
          "transformer_brand": "529e631e-f67a-4d57-92c7-d7ae47a3d705", // STRING : GUID from service_items Y3
          "transformer_phase": "b147197f-2889-41cb-96bf-c19bdd30e3b5", // STRING : GUID from service_items Y3
          "transformer_type": "10ceadc5-16b6-4b2a-8b77-9343f97abf2e", // STRING : GUID from service_items Y3 | *child of phase
          "transformer_serial": "TRANSFORMERSERIAL002", // STRING
          "transformer_size": "2e8be5d4-5950-4c47-93a3-e80bf40492a7", // STRING : GUID from service_items Y3
          "transformer_voltage": "827f9724-d3c8-4da8-bdcd-84afd725cb17", // STRING : GUID from service_items Y3
          "transformer_voltage_other": "" // STRING : เมื่อ transformer_voltage is_other = true
        }
      ],
      //s307
      "transformer_voltage": "983dc9d5-84ef-4917-bbd7-321a00b73668", // STRING : GUID from service_items Y3
      //s308,s315
      "transformer_size": 3, // INT
      //s315
      "transformer_qty": 3, // INT
      //s312
      "equipment_type_id": "D2993E34-01A1-4B84-A014-C99C239A76E8", // STRING : GUID from service_items Y3
      //s314
      "rental_startdate": "2024-04-22 23:59:59", // DATETIME
      "rental_enddate": "2024-04-30 23:59:59", // DATETIME
      "days": 1, // INT
      //s316
      "kw_size": 10, // INT
      //s318
      "equipment_id": "D2993E34-01A1-4B84-A014-C99C239A76E8", // STRING : GUID from service_items Y3
      "amps_size": 0, // INT
      //s322
      "size_install": "cacfa7cb-32ff-4606-b294-44102ee44fa9", // STRING : GUID from service_items Y3
      //s329
      "renewable_type": "d6f08661-5682-4915-ab0d-3bfbab11979f", // STRING : GUID from service_items Y3
      "renewable_source": [
        "9c39f6bd-c2a9-4098-89db-a8fc4856912c",
        "4e1edfa9-caca-42c4-8c48-26ad5f2ab038",
        "fbad0064-f430-47b5-93a1-223095677213"
      ] // ARRAY : GUID from service_items คั่นด้วย comma ex. ["D2C43111-1345-45E0-B365-B5D3A2C90C0D","BC48F0E3-6D8D-4E90-87B1-96341337FC42"]
      ,
      "renewable_source_other": {
        "9c39f6bd-c2a9-4098-89db-a8fc4856912c": "",
        "4e1edfa9-caca-42c4-8c48-26ad5f2ab038": "",
        "fbad0064-f430-47b5-93a1-223095677213": "test"
      } // JSON เมื่อ renewable_source มีตัวที่ is_other = true ให้ key = GUID และ value = text from input ex. {"BC48F0E3-6D8D-4E90-87B1-96341337FC42":"Value"}
      ,
      "year": 2567 // INT
    },
    {
      headers: {
        'Apikey': apiKey
      }
    }
  );

  return data
};

export const insertRequest311 = async () => {
  const { data } = await axios.post(
    apiExUrl + 'requests',
    {
      "service_code": "S311",
      "channel": 0,
      "morning_flag": true,
      "afternoon_flag": true,
      "first_name": "test",
      "last_name": "test",
      "mobile_no": "0880937651",
      "email": "firstname.l@kanda.digital",
      "address": "440/067 คอนโดไทย",
      "address_province": "76",
      "address_city": "7606",
      "address_district": "760601",
      "address_post_code": "76150",
      "request_type": "XXX",
      "files": null,
      "detail": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas venenatis nunc ac justo pharetra laoreet. Fusce ut mi elementum, lobortis arcu quis, viverra ipsum. Maecenas dui arcu.",
      "legal_form": "",
      "nationality": "",
      //s301
      "equipment_type": "7F3D3C5A-3CCA-4F88-B866-48871BD577CB", // STRING : GUID from service_items Y3
      //s302, s303, s304, s307, s309, s311, s312, s315, s320, s322
      "business_type_id": "1413F877-0E21-491A-B733-3A4EF8CD8F0F", // STRING : GUID from m_business_type Y3
      //s301, s312, s314, s315,s316,s318,s327,s329
      "qty": 3, // INT or NULL
      //s305, s313, s328
      "request_service": "68d4be55-4b60-4675-8170-6ac96b398ad8", // STRING : GUID from service_items Y3
      //s305, s313
      "request_service_type": "e51d31fe-cd31-442d-877f-60e4dc357002", // STRING : GUID from service_items Y3
      "transformers": [
        {
          "transformer_brand": "529e631e-f67a-4d57-92c7-d7ae47a3d705", // STRING : GUID from service_items Y3
          "transformer_phase": "b147197f-2889-41cb-96bf-c19bdd30e3b5", // STRING : GUID from service_items Y3
          "transformer_type": "10ceadc5-16b6-4b2a-8b77-9343f97abf2e", // STRING : GUID from service_items Y3 | *child of phase
          "transformer_serial": "TRANSFORMERSERIAL002", // STRING
          "transformer_size": "2e8be5d4-5950-4c47-93a3-e80bf40492a7", // STRING : GUID from service_items Y3
          "transformer_voltage": "827f9724-d3c8-4da8-bdcd-84afd725cb17", // STRING : GUID from service_items Y3
          "transformer_voltage_other": "" // STRING : เมื่อ transformer_voltage is_other = true
        }
      ],
      //s307
      "transformer_voltage": "983dc9d5-84ef-4917-bbd7-321a00b73668", // STRING : GUID from service_items Y3
      //s308,s315
      "transformer_size": 3, // INT
      //s315
      "transformer_qty": 3, // INT
      //s312
      "equipment_type_id": "D2993E34-01A1-4B84-A014-C99C239A76E8", // STRING : GUID from service_items Y3
      //s314
      "rental_startdate": "2024-04-22 23:59:59", // DATETIME
      "rental_enddate": "2024-04-30 23:59:59", // DATETIME
      "days": 1, // INT
      //s316
      "kw_size": 10, // INT
      //s318
      "equipment_id": "D2993E34-01A1-4B84-A014-C99C239A76E8", // STRING : GUID from service_items Y3
      "amps_size": 0, // INT
      //s322
      "size_install": "cacfa7cb-32ff-4606-b294-44102ee44fa9", // STRING : GUID from service_items Y3
      //s329
      "renewable_type": "d6f08661-5682-4915-ab0d-3bfbab11979f", // STRING : GUID from service_items Y3
      "renewable_source": [
        "9c39f6bd-c2a9-4098-89db-a8fc4856912c",
        "4e1edfa9-caca-42c4-8c48-26ad5f2ab038",
        "fbad0064-f430-47b5-93a1-223095677213"
      ] // ARRAY : GUID from service_items คั่นด้วย comma ex. ["D2C43111-1345-45E0-B365-B5D3A2C90C0D","BC48F0E3-6D8D-4E90-87B1-96341337FC42"]
      ,
      "renewable_source_other": {
        "9c39f6bd-c2a9-4098-89db-a8fc4856912c": "",
        "4e1edfa9-caca-42c4-8c48-26ad5f2ab038": "",
        "fbad0064-f430-47b5-93a1-223095677213": "test"
      } // JSON เมื่อ renewable_source มีตัวที่ is_other = true ให้ key = GUID และ value = text from input ex. {"BC48F0E3-6D8D-4E90-87B1-96341337FC42":"Value"}
      ,
      "year": 2567 // INT
    },
    {
      headers: {
        'Apikey': apiKey
      }
    }
  );

  return data
};

export const insertRequest312 = async () => {
  const { data } = await axios.post(
    apiExUrl + 'requests',
    {
      "service_code": "S312",
      "channel": 0,
      "morning_flag": true,
      "afternoon_flag": true,
      "first_name": "test",
      "last_name": "test",
      "mobile_no": "0880937651",
      "email": "firstname.l@kanda.digital",
      "address": "440/067 คอนโดไทย",
      "address_province": "76",
      "address_city": "7606",
      "address_district": "760601",
      "address_post_code": "76150",
      "request_type": "XXX",
      "files": null,
      "detail": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas venenatis nunc ac justo pharetra laoreet. Fusce ut mi elementum, lobortis arcu quis, viverra ipsum. Maecenas dui arcu.",
      "legal_form": "",
      "nationality": "",
      //s301
      "equipment_type": "7F3D3C5A-3CCA-4F88-B866-48871BD577CB", // STRING : GUID from service_items Y3
      //s302, s303, s304, s307, s309, s311, s312, s315, s320, s322
      "business_type_id": "1413F877-0E21-491A-B733-3A4EF8CD8F0F", // STRING : GUID from m_business_type Y3
      //s301, s312, s314, s315,s316,s318,s327,s329
      "qty": 3, // INT or NULL
      //s305, s313, s328
      "request_service": "68d4be55-4b60-4675-8170-6ac96b398ad8", // STRING : GUID from service_items Y3
      //s305, s313
      "request_service_type": "e51d31fe-cd31-442d-877f-60e4dc357002", // STRING : GUID from service_items Y3
      "transformers": [
        {
          "transformer_brand": "529e631e-f67a-4d57-92c7-d7ae47a3d705", // STRING : GUID from service_items Y3
          "transformer_phase": "b147197f-2889-41cb-96bf-c19bdd30e3b5", // STRING : GUID from service_items Y3
          "transformer_type": "10ceadc5-16b6-4b2a-8b77-9343f97abf2e", // STRING : GUID from service_items Y3 | *child of phase
          "transformer_serial": "TRANSFORMERSERIAL002", // STRING
          "transformer_size": "2e8be5d4-5950-4c47-93a3-e80bf40492a7", // STRING : GUID from service_items Y3
          "transformer_voltage": "827f9724-d3c8-4da8-bdcd-84afd725cb17", // STRING : GUID from service_items Y3
          "transformer_voltage_other": "" // STRING : เมื่อ transformer_voltage is_other = true
        }
      ],
      //s307
      "transformer_voltage": "983dc9d5-84ef-4917-bbd7-321a00b73668", // STRING : GUID from service_items Y3
      //s308,s315
      "transformer_size": 3, // INT
      //s315
      "transformer_qty": 3, // INT
      //s312
      "equipment_type_id": "D2993E34-01A1-4B84-A014-C99C239A76E8", // STRING : GUID from service_items Y3
      //s314
      "rental_startdate": "2024-04-22 23:59:59", // DATETIME
      "rental_enddate": "2024-04-30 23:59:59", // DATETIME
      "days": 1, // INT
      //s316
      "kw_size": 10, // INT
      //s318
      "equipment_id": "D2993E34-01A1-4B84-A014-C99C239A76E8", // STRING : GUID from service_items Y3
      "amps_size": 0, // INT
      //s322
      "size_install": "cacfa7cb-32ff-4606-b294-44102ee44fa9", // STRING : GUID from service_items Y3
      //s329
      "renewable_type": "d6f08661-5682-4915-ab0d-3bfbab11979f", // STRING : GUID from service_items Y3
      "renewable_source": [
        "9c39f6bd-c2a9-4098-89db-a8fc4856912c",
        "4e1edfa9-caca-42c4-8c48-26ad5f2ab038",
        "fbad0064-f430-47b5-93a1-223095677213"
      ] // ARRAY : GUID from service_items คั่นด้วย comma ex. ["D2C43111-1345-45E0-B365-B5D3A2C90C0D","BC48F0E3-6D8D-4E90-87B1-96341337FC42"]
      ,
      "renewable_source_other": {
        "9c39f6bd-c2a9-4098-89db-a8fc4856912c": "",
        "4e1edfa9-caca-42c4-8c48-26ad5f2ab038": "",
        "fbad0064-f430-47b5-93a1-223095677213": "test"
      } // JSON เมื่อ renewable_source มีตัวที่ is_other = true ให้ key = GUID และ value = text from input ex. {"BC48F0E3-6D8D-4E90-87B1-96341337FC42":"Value"}
      ,
      "year": 2567 // INT
    },
    {
      headers: {
        'Apikey': apiKey
      }
    }
  );

  return data
};

export const insertRequest313 = async () => {
  const { data } = await axios.post(
    apiExUrl + 'requests',
    {
      "service_code": "S313",
      "channel": 0,
      "morning_flag": true,
      "afternoon_flag": true,
      "first_name": "test",
      "last_name": "test",
      "mobile_no": "0880937651",
      "email": "firstname.l@kanda.digital",
      "address": "440/067 คอนโดไทย",
      "address_province": "76",
      "address_city": "7606",
      "address_district": "760601",
      "address_post_code": "76150",
      "request_type": "XXX",
      "files": null,
      "detail": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas venenatis nunc ac justo pharetra laoreet. Fusce ut mi elementum, lobortis arcu quis, viverra ipsum. Maecenas dui arcu.",
      "legal_form": "",
      "nationality": "",
      //s301
      "equipment_type": "7F3D3C5A-3CCA-4F88-B866-48871BD577CB", // STRING : GUID from service_items Y3
      //s302, s303, s304, s307, s309, s311, s312, s315, s320, s322
      "business_type_id": "1413F877-0E21-491A-B733-3A4EF8CD8F0F", // STRING : GUID from m_business_type Y3
      //s301, s312, s314, s315,s316,s318,s327,s329
      "qty": 3, // INT or NULL
      //s305, s313, s328
      "request_service": "e45cee2a-5314-4c35-8dbf-bf7081e1fbf6", // STRING : GUID from service_items Y3
      //s305, s313
      "request_service_type": "96370292-3698-47f9-bcd1-1d04cad4e1a4", // STRING : GUID from service_items Y3
      "transformers": [
        {
          "transformer_brand": "cb56fdd6-5dd7-4092-9311-2aea9ac3b007", // STRING : GUID from service_items Y3
          "transformer_phase": "2b4825a5-1dd8-45a4-aaf6-d22fb5fe8a18", // STRING : GUID from service_items Y3
          "transformer_type": "ada88416-f356-43fb-a4b2-0924c68587ec", // STRING : GUID from service_items Y3 | *child of phase
          "transformer_serial": "TRANSFORMERSERIAL003", // STRING
          "transformer_size": "13e711c3-995b-4c91-8759-821f920d864e", // STRING : GUID from service_items Y3
          "transformer_voltage": "cb3a38be-96b4-4048-b76e-e5556ae76c60", // STRING : GUID from service_items Y3
          "transformer_voltage_other": "" // STRING : เมื่อ transformer_voltage is_other = true
        }
      ],
      //s307
      "transformer_voltage": "983dc9d5-84ef-4917-bbd7-321a00b73668", // STRING : GUID from service_items Y3
      //s308,s315
      "transformer_size": 3, // INT
      //s315
      "transformer_qty": 3, // INT
      //s312
      "equipment_type_id": "D2993E34-01A1-4B84-A014-C99C239A76E8", // STRING : GUID from service_items Y3
      //s314
      "rental_startdate": "2024-04-22 23:59:59", // DATETIME
      "rental_enddate": "2024-04-30 23:59:59", // DATETIME
      "days": 1, // INT
      //s316
      "kw_size": 10, // INT
      //s318
      "equipment_id": "D2993E34-01A1-4B84-A014-C99C239A76E8", // STRING : GUID from service_items Y3
      "amps_size": 0, // INT
      //s322
      "size_install": "cacfa7cb-32ff-4606-b294-44102ee44fa9", // STRING : GUID from service_items Y3
      //s329
      "renewable_type": "d6f08661-5682-4915-ab0d-3bfbab11979f", // STRING : GUID from service_items Y3
      "renewable_source": [
        "9c39f6bd-c2a9-4098-89db-a8fc4856912c",
        "4e1edfa9-caca-42c4-8c48-26ad5f2ab038",
        "fbad0064-f430-47b5-93a1-223095677213"
      ] // ARRAY : GUID from service_items คั่นด้วย comma ex. ["D2C43111-1345-45E0-B365-B5D3A2C90C0D","BC48F0E3-6D8D-4E90-87B1-96341337FC42"]
      ,
      "renewable_source_other": {
        "9c39f6bd-c2a9-4098-89db-a8fc4856912c": "",
        "4e1edfa9-caca-42c4-8c48-26ad5f2ab038": "",
        "fbad0064-f430-47b5-93a1-223095677213": "test"
      } // JSON เมื่อ renewable_source มีตัวที่ is_other = true ให้ key = GUID และ value = text from input ex. {"BC48F0E3-6D8D-4E90-87B1-96341337FC42":"Value"}
      ,
      "year": 2567 // INT
    },
    {
      headers: {
        'Apikey': apiKey
      }
    }
  );

  return data
};

export const insertRequest314 = async () => {
  const { data } = await axios.post(
    apiExUrl + 'requests',
    {
      "service_code": "S314",
      "channel": 0,
      "morning_flag": true,
      "afternoon_flag": true,
      "first_name": "test",
      "last_name": "test",
      "mobile_no": "0880937651",
      "email": "firstname.l@kanda.digital",
      "address": "440/067 คอนโดไทย",
      "address_province": "76",
      "address_city": "7606",
      "address_district": "760601",
      "address_post_code": "76150",
      "request_type": "XXX",
      "files": null,
      "detail": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas venenatis nunc ac justo pharetra laoreet. Fusce ut mi elementum, lobortis arcu quis, viverra ipsum. Maecenas dui arcu.",
      "legal_form": "",
      "nationality": "",
      //s301
      "equipment_type": "7F3D3C5A-3CCA-4F88-B866-48871BD577CB", // STRING : GUID from service_items Y3
      //s302, s303, s304, s307, s309, s311, s312, s315, s320, s322
      "business_type_id": "1413F877-0E21-491A-B733-3A4EF8CD8F0F", // STRING : GUID from m_business_type Y3
      //s301, s312, s314, s315,s316,s318,s327,s329
      "qty": 3, // INT or NULL
      //s305, s313, s328
      "request_service": "e45cee2a-5314-4c35-8dbf-bf7081e1fbf6", // STRING : GUID from service_items Y3
      //s305, s313
      "request_service_type": "96370292-3698-47f9-bcd1-1d04cad4e1a4", // STRING : GUID from service_items Y3
      "transformers": [
        {
          "transformer_brand": "cb56fdd6-5dd7-4092-9311-2aea9ac3b007", // STRING : GUID from service_items Y3
          "transformer_phase": "2b4825a5-1dd8-45a4-aaf6-d22fb5fe8a18", // STRING : GUID from service_items Y3
          "transformer_type": "ada88416-f356-43fb-a4b2-0924c68587ec", // STRING : GUID from service_items Y3 | *child of phase
          "transformer_serial": "TRANSFORMERSERIAL003", // STRING
          "transformer_size": "13e711c3-995b-4c91-8759-821f920d864e", // STRING : GUID from service_items Y3
          "transformer_voltage": "cb3a38be-96b4-4048-b76e-e5556ae76c60", // STRING : GUID from service_items Y3
          "transformer_voltage_other": "" // STRING : เมื่อ transformer_voltage is_other = true
        }
      ],
      //s307
      "transformer_voltage": "983dc9d5-84ef-4917-bbd7-321a00b73668", // STRING : GUID from service_items Y3
      //s308,s315
      "transformer_size": 3, // INT
      //s315
      "transformer_qty": 4, // INT
      //s312
      "equipment_type_id": "D2993E34-01A1-4B84-A014-C99C239A76E8", // STRING : GUID from service_items Y3
      //s314
      "rental_startdate": "2024-07-22 23:59:59", // DATETIME
      "rental_enddate": "2024-07-30 23:59:59", // DATETIME
      "days": 9, // INT
      //s316
      "kw_size": 10, // INT
      //s318
      "equipment_id": "D2993E34-01A1-4B84-A014-C99C239A76E8", // STRING : GUID from service_items Y3
      "amps_size": 0, // INT
      //s322
      "size_install": "cacfa7cb-32ff-4606-b294-44102ee44fa9", // STRING : GUID from service_items Y3
      //s329
      "renewable_type": "d6f08661-5682-4915-ab0d-3bfbab11979f", // STRING : GUID from service_items Y3
      "renewable_source": [
        "9c39f6bd-c2a9-4098-89db-a8fc4856912c",
        "4e1edfa9-caca-42c4-8c48-26ad5f2ab038",
        "fbad0064-f430-47b5-93a1-223095677213"
      ] // ARRAY : GUID from service_items คั่นด้วย comma ex. ["D2C43111-1345-45E0-B365-B5D3A2C90C0D","BC48F0E3-6D8D-4E90-87B1-96341337FC42"]
      ,
      "renewable_source_other": {
        "9c39f6bd-c2a9-4098-89db-a8fc4856912c": "",
        "4e1edfa9-caca-42c4-8c48-26ad5f2ab038": "",
        "fbad0064-f430-47b5-93a1-223095677213": "test"
      } // JSON เมื่อ renewable_source มีตัวที่ is_other = true ให้ key = GUID และ value = text from input ex. {"BC48F0E3-6D8D-4E90-87B1-96341337FC42":"Value"}
      ,
      "year": 2567 // INT
    },
    {
      headers: {
        'Apikey': apiKey
      }
    }
  );

  return data
};

export const insertRequest315 = async () => {
  const { data } = await axios.post(
    apiExUrl + 'requests',
    {
      "service_code": "S315",
      "channel": 0,
      "morning_flag": true,
      "afternoon_flag": true,
      "first_name": "test",
      "last_name": "test",
      "mobile_no": "0880937651",
      "email": "firstname.l@kanda.digital",
      "address": "440/067 คอนโดไทย",
      "address_province": "76",
      "address_city": "7606",
      "address_district": "760601",
      "address_post_code": "76150",
      "request_type": "XXX",
      "files": null,
      "detail": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas venenatis nunc ac justo pharetra laoreet. Fusce ut mi elementum, lobortis arcu quis, viverra ipsum. Maecenas dui arcu.",
      "legal_form": "",
      "nationality": "",
      //s301
      "equipment_type": "7F3D3C5A-3CCA-4F88-B866-48871BD577CB", // STRING : GUID from service_items Y3
      //s302, s303, s304, s307, s309, s311, s312, s315, s320, s322
      "business_type_id": "1413F877-0E21-491A-B733-3A4EF8CD8F0F", // STRING : GUID from m_business_type Y3
      //s301, s312, s314, s315,s316,s318,s327,s329
      "qty": 3, // INT or NULL
      //s305, s313, s328
      "request_service": "e45cee2a-5314-4c35-8dbf-bf7081e1fbf6", // STRING : GUID from service_items Y3
      //s305, s313
      "request_service_type": "96370292-3698-47f9-bcd1-1d04cad4e1a4", // STRING : GUID from service_items Y3
      "transformers": [
        {
          "transformer_brand": "cb56fdd6-5dd7-4092-9311-2aea9ac3b007", // STRING : GUID from service_items Y3
          "transformer_phase": "2b4825a5-1dd8-45a4-aaf6-d22fb5fe8a18", // STRING : GUID from service_items Y3
          "transformer_type": "ada88416-f356-43fb-a4b2-0924c68587ec", // STRING : GUID from service_items Y3 | *child of phase
          "transformer_serial": "TRANSFORMERSERIAL003", // STRING
          "transformer_size": "13e711c3-995b-4c91-8759-821f920d864e", // STRING : GUID from service_items Y3
          "transformer_voltage": "cb3a38be-96b4-4048-b76e-e5556ae76c60", // STRING : GUID from service_items Y3
          "transformer_voltage_other": "" // STRING : เมื่อ transformer_voltage is_other = true
        }
      ],
      //s307
      "transformer_voltage": "983dc9d5-84ef-4917-bbd7-321a00b73668", // STRING : GUID from service_items Y3
      //s308,s315
      "transformer_size": 3, // INT
      //s315
      "transformer_qty": 4, // INT
      //s312
      "equipment_type_id": "D2993E34-01A1-4B84-A014-C99C239A76E8", // STRING : GUID from service_items Y3
      //s314
      "rental_startdate": "2024-07-22 23:59:59", // DATETIME
      "rental_enddate": "2024-07-30 23:59:59", // DATETIME
      "days": 9, // INT
      //s316
      "kw_size": 10, // INT
      //s318
      "equipment_id": "D2993E34-01A1-4B84-A014-C99C239A76E8", // STRING : GUID from service_items Y3
      "amps_size": 0, // INT
      //s322
      "size_install": "cacfa7cb-32ff-4606-b294-44102ee44fa9", // STRING : GUID from service_items Y3
      //s329
      "renewable_type": "d6f08661-5682-4915-ab0d-3bfbab11979f", // STRING : GUID from service_items Y3
      "renewable_source": [
        "9c39f6bd-c2a9-4098-89db-a8fc4856912c",
        "4e1edfa9-caca-42c4-8c48-26ad5f2ab038",
        "fbad0064-f430-47b5-93a1-223095677213"
      ] // ARRAY : GUID from service_items คั่นด้วย comma ex. ["D2C43111-1345-45E0-B365-B5D3A2C90C0D","BC48F0E3-6D8D-4E90-87B1-96341337FC42"]
      ,
      "renewable_source_other": {
        "9c39f6bd-c2a9-4098-89db-a8fc4856912c": "",
        "4e1edfa9-caca-42c4-8c48-26ad5f2ab038": "",
        "fbad0064-f430-47b5-93a1-223095677213": "test"
      } // JSON เมื่อ renewable_source มีตัวที่ is_other = true ให้ key = GUID และ value = text from input ex. {"BC48F0E3-6D8D-4E90-87B1-96341337FC42":"Value"}
      ,
      "year": 2567 // INT
    },
    {
      headers: {
        'Apikey': apiKey
      }
    }
  );

  return data
};

export const insertRequest316 = async () => {
  const { data } = await axios.post(
    apiExUrl + 'requests',
    {
      "service_code": "S316",
      "channel": 0,
      "morning_flag": true,
      "afternoon_flag": true,
      "first_name": "test",
      "last_name": "test",
      "mobile_no": "0880937651",
      "email": "firstname.l@kanda.digital",
      "address": "440/067 คอนโดไทย",
      "address_province": "76",
      "address_city": "7606",
      "address_district": "760601",
      "address_post_code": "76150",
      "request_type": "XXX",
      "files": null,
      "detail": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas venenatis nunc ac justo pharetra laoreet. Fusce ut mi elementum, lobortis arcu quis, viverra ipsum. Maecenas dui arcu.",
      "legal_form": "",
      "nationality": "",
      //s301
      "equipment_type": "7F3D3C5A-3CCA-4F88-B866-48871BD577CB", // STRING : GUID from service_items Y3
      //s302, s303, s304, s307, s309, s311, s312, s315, s320, s322
      "business_type_id": "1413F877-0E21-491A-B733-3A4EF8CD8F0F", // STRING : GUID from m_business_type Y3
      //s301, s312, s314, s315,s316,s318,s327,s329
      "qty": 3, // INT or NULL
      //s305, s313, s328
      "request_service": "e45cee2a-5314-4c35-8dbf-bf7081e1fbf6", // STRING : GUID from service_items Y3
      //s305, s313
      "request_service_type": "96370292-3698-47f9-bcd1-1d04cad4e1a4", // STRING : GUID from service_items Y3
      "transformers": [
        {
          "transformer_brand": "cb56fdd6-5dd7-4092-9311-2aea9ac3b007", // STRING : GUID from service_items Y3
          "transformer_phase": "2b4825a5-1dd8-45a4-aaf6-d22fb5fe8a18", // STRING : GUID from service_items Y3
          "transformer_type": "ada88416-f356-43fb-a4b2-0924c68587ec", // STRING : GUID from service_items Y3 | *child of phase
          "transformer_serial": "TRANSFORMERSERIAL003", // STRING
          "transformer_size": "13e711c3-995b-4c91-8759-821f920d864e", // STRING : GUID from service_items Y3
          "transformer_voltage": "cb3a38be-96b4-4048-b76e-e5556ae76c60", // STRING : GUID from service_items Y3
          "transformer_voltage_other": "" // STRING : เมื่อ transformer_voltage is_other = true
        }
      ],
      //s307
      "transformer_voltage": "983dc9d5-84ef-4917-bbd7-321a00b73668", // STRING : GUID from service_items Y3
      //s308,s315
      "transformer_size": 3, // INT
      //s315
      "transformer_qty": 4, // INT
      //s312
      "equipment_type_id": "D2993E34-01A1-4B84-A014-C99C239A76E8", // STRING : GUID from service_items Y3
      //s314
      "rental_startdate": "2024-07-22 23:59:59", // DATETIME
      "rental_enddate": "2024-07-30 23:59:59", // DATETIME
      "days": 9, // INT
      //s316
      "kw_size": 10, // INT
      //s318
      "equipment_id": "D2993E34-01A1-4B84-A014-C99C239A76E8", // STRING : GUID from service_items Y3
      "amps_size": 0, // INT
      //s322
      "size_install": "cacfa7cb-32ff-4606-b294-44102ee44fa9", // STRING : GUID from service_items Y3
      //s329
      "renewable_type": "d6f08661-5682-4915-ab0d-3bfbab11979f", // STRING : GUID from service_items Y3
      "renewable_source": [
        "9c39f6bd-c2a9-4098-89db-a8fc4856912c",
        "4e1edfa9-caca-42c4-8c48-26ad5f2ab038",
        "fbad0064-f430-47b5-93a1-223095677213"
      ] // ARRAY : GUID from service_items คั่นด้วย comma ex. ["D2C43111-1345-45E0-B365-B5D3A2C90C0D","BC48F0E3-6D8D-4E90-87B1-96341337FC42"]
      ,
      "renewable_source_other": {
        "9c39f6bd-c2a9-4098-89db-a8fc4856912c": "",
        "4e1edfa9-caca-42c4-8c48-26ad5f2ab038": "",
        "fbad0064-f430-47b5-93a1-223095677213": "test"
      } // JSON เมื่อ renewable_source มีตัวที่ is_other = true ให้ key = GUID และ value = text from input ex. {"BC48F0E3-6D8D-4E90-87B1-96341337FC42":"Value"}
      ,
      "year": 2567 // INT
    },
    {
      headers: {
        'Apikey': apiKey
      }
    }
  );

  return data
};

export const insertRequest317 = async () => {
  const { data } = await axios.post(
    apiExUrl + 'requests',
    {
      "service_code": "S317",
      "channel": 0,
      "morning_flag": true,
      "afternoon_flag": true,
      "first_name": "test",
      "last_name": "test",
      "mobile_no": "0880937651",
      "email": "firstname.l@kanda.digital",
      "address": "440/067 คอนโดไทย",
      "address_province": "76",
      "address_city": "7606",
      "address_district": "760601",
      "address_post_code": "76150",
      "request_type": "XXX",
      "files": null,
      "detail": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas venenatis nunc ac justo pharetra laoreet. Fusce ut mi elementum, lobortis arcu quis, viverra ipsum. Maecenas dui arcu.",
      "legal_form": "",
      "nationality": "",
      //s301
      "equipment_type": "7F3D3C5A-3CCA-4F88-B866-48871BD577CB", // STRING : GUID from service_items Y3
      //s302, s303, s304, s307, s309, s311, s312, s315, s320, s322
      "business_type_id": "1413F877-0E21-491A-B733-3A4EF8CD8F0F", // STRING : GUID from m_business_type Y3
      //s301, s312, s314, s315,s316,s318,s327,s329
      "qty": 3, // INT or NULL
      //s305, s313, s328
      "request_service": "e45cee2a-5314-4c35-8dbf-bf7081e1fbf6", // STRING : GUID from service_items Y3
      //s305, s313
      "request_service_type": "96370292-3698-47f9-bcd1-1d04cad4e1a4", // STRING : GUID from service_items Y3
      "transformers": [
        {
          "transformer_brand": "cb56fdd6-5dd7-4092-9311-2aea9ac3b007", // STRING : GUID from service_items Y3
          "transformer_phase": "2b4825a5-1dd8-45a4-aaf6-d22fb5fe8a18", // STRING : GUID from service_items Y3
          "transformer_type": "ada88416-f356-43fb-a4b2-0924c68587ec", // STRING : GUID from service_items Y3 | *child of phase
          "transformer_serial": "TRANSFORMERSERIAL003", // STRING
          "transformer_size": "13e711c3-995b-4c91-8759-821f920d864e", // STRING : GUID from service_items Y3
          "transformer_voltage": "cb3a38be-96b4-4048-b76e-e5556ae76c60", // STRING : GUID from service_items Y3
          "transformer_voltage_other": "" // STRING : เมื่อ transformer_voltage is_other = true
        }
      ],
      //s307
      "transformer_voltage": "983dc9d5-84ef-4917-bbd7-321a00b73668", // STRING : GUID from service_items Y3
      //s308,s315
      "transformer_size": 3, // INT
      //s315
      "transformer_qty": 4, // INT
      //s312
      "equipment_type_id": "D2993E34-01A1-4B84-A014-C99C239A76E8", // STRING : GUID from service_items Y3
      //s314
      "rental_startdate": "2024-07-22 23:59:59", // DATETIME
      "rental_enddate": "2024-07-30 23:59:59", // DATETIME
      "days": 9, // INT
      //s316
      "kw_size": 10, // INT
      //s318
      "equipment_id": "D2993E34-01A1-4B84-A014-C99C239A76E8", // STRING : GUID from service_items Y3
      "amps_size": 0, // INT
      //s322
      "size_install": "cacfa7cb-32ff-4606-b294-44102ee44fa9", // STRING : GUID from service_items Y3
      //s329
      "renewable_type": "d6f08661-5682-4915-ab0d-3bfbab11979f", // STRING : GUID from service_items Y3
      "renewable_source": [
        "9c39f6bd-c2a9-4098-89db-a8fc4856912c",
        "4e1edfa9-caca-42c4-8c48-26ad5f2ab038",
        "fbad0064-f430-47b5-93a1-223095677213"
      ] // ARRAY : GUID from service_items คั่นด้วย comma ex. ["D2C43111-1345-45E0-B365-B5D3A2C90C0D","BC48F0E3-6D8D-4E90-87B1-96341337FC42"]
      ,
      "renewable_source_other": {
        "9c39f6bd-c2a9-4098-89db-a8fc4856912c": "",
        "4e1edfa9-caca-42c4-8c48-26ad5f2ab038": "",
        "fbad0064-f430-47b5-93a1-223095677213": "test"
      } // JSON เมื่อ renewable_source มีตัวที่ is_other = true ให้ key = GUID และ value = text from input ex. {"BC48F0E3-6D8D-4E90-87B1-96341337FC42":"Value"}
      ,
      "year": 2567 // INT
    },
    {
      headers: {
        'Apikey': apiKey
      }
    }
  );

  return data
};

export const insertRequest318 = async () => {
  const { data } = await axios.post(
    apiExUrl + 'requests',
    {
      "service_code": "S318",
      "channel": 0,
      "morning_flag": true,
      "afternoon_flag": true,
      "first_name": "test",
      "last_name": "test",
      "mobile_no": "0880937651",
      "email": "firstname.l@kanda.digital",
      "address": "440/067 คอนโดไทย",
      "address_province": "76",
      "address_city": "7606",
      "address_district": "760601",
      "address_post_code": "76150",
      "request_type": "XXX",
      "files": null,
      "detail": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas venenatis nunc ac justo pharetra laoreet. Fusce ut mi elementum, lobortis arcu quis, viverra ipsum. Maecenas dui arcu.",
      "legal_form": "",
      "nationality": "",
      //s301
      "equipment_type": "7F3D3C5A-3CCA-4F88-B866-48871BD577CB", // STRING : GUID from service_items Y3
      //s302, s303, s304, s307, s309, s311, s312, s315, s320, s322
      "business_type_id": "1413F877-0E21-491A-B733-3A4EF8CD8F0F", // STRING : GUID from m_business_type Y3
      //s301, s312, s314, s315,s316,s318,s327,s329
      "qty": 3, // INT or NULL
      //s305, s313, s328
      "request_service": "e45cee2a-5314-4c35-8dbf-bf7081e1fbf6", // STRING : GUID from service_items Y3
      //s305, s313
      "request_service_type": "96370292-3698-47f9-bcd1-1d04cad4e1a4", // STRING : GUID from service_items Y3
      "transformers": [
        {
          "transformer_brand": "cb56fdd6-5dd7-4092-9311-2aea9ac3b007", // STRING : GUID from service_items Y3
          "transformer_phase": "2b4825a5-1dd8-45a4-aaf6-d22fb5fe8a18", // STRING : GUID from service_items Y3
          "transformer_type": "ada88416-f356-43fb-a4b2-0924c68587ec", // STRING : GUID from service_items Y3 | *child of phase
          "transformer_serial": "TRANSFORMERSERIAL003", // STRING
          "transformer_size": "13e711c3-995b-4c91-8759-821f920d864e", // STRING : GUID from service_items Y3
          "transformer_voltage": "cb3a38be-96b4-4048-b76e-e5556ae76c60", // STRING : GUID from service_items Y3
          "transformer_voltage_other": "" // STRING : เมื่อ transformer_voltage is_other = true
        }
      ],
      //s307
      "transformer_voltage": "983dc9d5-84ef-4917-bbd7-321a00b73668", // STRING : GUID from service_items Y3
      //s308,s315
      "transformer_size": 3, // INT
      //s315
      "transformer_qty": 4, // INT
      //s312
      "equipment_type_id": "D2993E34-01A1-4B84-A014-C99C239A76E8", // STRING : GUID from service_items Y3
      //s314
      "rental_startdate": "2024-07-22 23:59:59", // DATETIME
      "rental_enddate": "2024-07-30 23:59:59", // DATETIME
      "days": 9, // INT
      //s316
      "kw_size": 10, // INT
      //s318
      "equipment_id": "78d2728e-a45b-488a-98a4-7b5d0c06c120", // STRING : GUID from service_items Y3
      "amps_size": 11, // INT
      //s322
      "size_install": "cacfa7cb-32ff-4606-b294-44102ee44fa9", // STRING : GUID from service_items Y3
      //s329
      "renewable_type": "d6f08661-5682-4915-ab0d-3bfbab11979f", // STRING : GUID from service_items Y3
      "renewable_source": [
        "9c39f6bd-c2a9-4098-89db-a8fc4856912c",
        "4e1edfa9-caca-42c4-8c48-26ad5f2ab038",
        "fbad0064-f430-47b5-93a1-223095677213"
      ] // ARRAY : GUID from service_items คั่นด้วย comma ex. ["D2C43111-1345-45E0-B365-B5D3A2C90C0D","BC48F0E3-6D8D-4E90-87B1-96341337FC42"]
      ,
      "renewable_source_other": {
        "9c39f6bd-c2a9-4098-89db-a8fc4856912c": "",
        "4e1edfa9-caca-42c4-8c48-26ad5f2ab038": "",
        "fbad0064-f430-47b5-93a1-223095677213": "test"
      } // JSON เมื่อ renewable_source มีตัวที่ is_other = true ให้ key = GUID และ value = text from input ex. {"BC48F0E3-6D8D-4E90-87B1-96341337FC42":"Value"}
      ,
      "year": 2567 // INT
    },
    {
      headers: {
        'Apikey': apiKey
      }
    }
  );

  return data
};

export const insertRequest319 = async () => {
  const { data } = await axios.post(
    apiExUrl + 'requests',
    {
      "service_code": "S319",
      "channel": 0,
      "morning_flag": true,
      "afternoon_flag": true,
      "first_name": "test",
      "last_name": "test",
      "mobile_no": "0880937651",
      "email": "firstname.l@kanda.digital",
      "address": "440/067 คอนโดไทย",
      "address_province": "76",
      "address_city": "7606",
      "address_district": "760601",
      "address_post_code": "76150",
      "request_type": "XXX",
      "files": null,
      "detail": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas venenatis nunc ac justo pharetra laoreet. Fusce ut mi elementum, lobortis arcu quis, viverra ipsum. Maecenas dui arcu.",
      "legal_form": "",
      "nationality": "",
      //s301
      "equipment_type": "7F3D3C5A-3CCA-4F88-B866-48871BD577CB", // STRING : GUID from service_items Y3
      //s302, s303, s304, s307, s309, s311, s312, s315, s320, s322
      "business_type_id": "1413F877-0E21-491A-B733-3A4EF8CD8F0F", // STRING : GUID from m_business_type Y3
      //s301, s312, s314, s315,s316,s318,s327,s329
      "qty": 3, // INT or NULL
      //s305, s313, s328
      "request_service": "e45cee2a-5314-4c35-8dbf-bf7081e1fbf6", // STRING : GUID from service_items Y3
      //s305, s313
      "request_service_type": "96370292-3698-47f9-bcd1-1d04cad4e1a4", // STRING : GUID from service_items Y3
      "transformers": [
        {
          "transformer_brand": "cb56fdd6-5dd7-4092-9311-2aea9ac3b007", // STRING : GUID from service_items Y3
          "transformer_phase": "2b4825a5-1dd8-45a4-aaf6-d22fb5fe8a18", // STRING : GUID from service_items Y3
          "transformer_type": "ada88416-f356-43fb-a4b2-0924c68587ec", // STRING : GUID from service_items Y3 | *child of phase
          "transformer_serial": "TRANSFORMERSERIAL003", // STRING
          "transformer_size": "13e711c3-995b-4c91-8759-821f920d864e", // STRING : GUID from service_items Y3
          "transformer_voltage": "cb3a38be-96b4-4048-b76e-e5556ae76c60", // STRING : GUID from service_items Y3
          "transformer_voltage_other": "" // STRING : เมื่อ transformer_voltage is_other = true
        }
      ],
      //s307
      "transformer_voltage": "983dc9d5-84ef-4917-bbd7-321a00b73668", // STRING : GUID from service_items Y3
      //s308,s315
      "transformer_size": 3, // INT
      //s315
      "transformer_qty": 4, // INT
      //s312
      "equipment_type_id": "D2993E34-01A1-4B84-A014-C99C239A76E8", // STRING : GUID from service_items Y3
      //s314
      "rental_startdate": "2024-07-22 23:59:59", // DATETIME
      "rental_enddate": "2024-07-30 23:59:59", // DATETIME
      "days": 9, // INT
      //s316
      "kw_size": 10, // INT
      //s318
      "equipment_id": "78d2728e-a45b-488a-98a4-7b5d0c06c120", // STRING : GUID from service_items Y3
      "amps_size": 11, // INT
      //s322
      "size_install": "cacfa7cb-32ff-4606-b294-44102ee44fa9", // STRING : GUID from service_items Y3
      //s329
      "renewable_type": "d6f08661-5682-4915-ab0d-3bfbab11979f", // STRING : GUID from service_items Y3
      "renewable_source": [
        "9c39f6bd-c2a9-4098-89db-a8fc4856912c",
        "4e1edfa9-caca-42c4-8c48-26ad5f2ab038",
        "fbad0064-f430-47b5-93a1-223095677213"
      ] // ARRAY : GUID from service_items คั่นด้วย comma ex. ["D2C43111-1345-45E0-B365-B5D3A2C90C0D","BC48F0E3-6D8D-4E90-87B1-96341337FC42"]
      ,
      "renewable_source_other": {
        "9c39f6bd-c2a9-4098-89db-a8fc4856912c": "",
        "4e1edfa9-caca-42c4-8c48-26ad5f2ab038": "",
        "fbad0064-f430-47b5-93a1-223095677213": "test"
      } // JSON เมื่อ renewable_source มีตัวที่ is_other = true ให้ key = GUID และ value = text from input ex. {"BC48F0E3-6D8D-4E90-87B1-96341337FC42":"Value"}
      ,
      "year": 2567 // INT
    },
    {
      headers: {
        'Apikey': apiKey
      }
    }
  );

  return data
};

export const insertRequest320 = async () => {
  const { data } = await axios.post(
    apiExUrl + 'requests',
    {
      "service_code": "S320",
      "channel": 0,
      "morning_flag": true,
      "afternoon_flag": true,
      "first_name": "test",
      "last_name": "test",
      "mobile_no": "0880937651",
      "email": "firstname.l@kanda.digital",
      "address": "440/067 คอนโดไทย",
      "address_province": "76",
      "address_city": "7606",
      "address_district": "760601",
      "address_post_code": "76150",
      "request_type": "XXX",
      "files": null,
      "detail": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas venenatis nunc ac justo pharetra laoreet. Fusce ut mi elementum, lobortis arcu quis, viverra ipsum. Maecenas dui arcu.",
      "legal_form": "",
      "nationality": "",
      //s301
      "equipment_type": "7F3D3C5A-3CCA-4F88-B866-48871BD577CB", // STRING : GUID from service_items Y3
      //s302, s303, s304, s307, s309, s311, s312, s315, s320, s322
      "business_type_id": "1413F877-0E21-491A-B733-3A4EF8CD8F0F", // STRING : GUID from m_business_type Y3
      //s301, s312, s314, s315,s316,s318,s327,s329
      "qty": 3, // INT or NULL
      //s305, s313, s328
      "request_service": "e45cee2a-5314-4c35-8dbf-bf7081e1fbf6", // STRING : GUID from service_items Y3
      //s305, s313
      "request_service_type": "96370292-3698-47f9-bcd1-1d04cad4e1a4", // STRING : GUID from service_items Y3
      "transformers": [
        {
          "transformer_brand": "cb56fdd6-5dd7-4092-9311-2aea9ac3b007", // STRING : GUID from service_items Y3
          "transformer_phase": "2b4825a5-1dd8-45a4-aaf6-d22fb5fe8a18", // STRING : GUID from service_items Y3
          "transformer_type": "ada88416-f356-43fb-a4b2-0924c68587ec", // STRING : GUID from service_items Y3 | *child of phase
          "transformer_serial": "TRANSFORMERSERIAL003", // STRING
          "transformer_size": "13e711c3-995b-4c91-8759-821f920d864e", // STRING : GUID from service_items Y3
          "transformer_voltage": "cb3a38be-96b4-4048-b76e-e5556ae76c60", // STRING : GUID from service_items Y3
          "transformer_voltage_other": "" // STRING : เมื่อ transformer_voltage is_other = true
        }
      ],
      //s307
      "transformer_voltage": "983dc9d5-84ef-4917-bbd7-321a00b73668", // STRING : GUID from service_items Y3
      //s308,s315
      "transformer_size": 3, // INT
      //s315
      "transformer_qty": 4, // INT
      //s312
      "equipment_type_id": "D2993E34-01A1-4B84-A014-C99C239A76E8", // STRING : GUID from service_items Y3
      //s314
      "rental_startdate": "2024-07-22 23:59:59", // DATETIME
      "rental_enddate": "2024-07-30 23:59:59", // DATETIME
      "days": 9, // INT
      //s316
      "kw_size": 10, // INT
      //s318
      "equipment_id": "78d2728e-a45b-488a-98a4-7b5d0c06c120", // STRING : GUID from service_items Y3
      "amps_size": 11, // INT
      //s322
      "size_install": "cacfa7cb-32ff-4606-b294-44102ee44fa9", // STRING : GUID from service_items Y3
      //s329
      "renewable_type": "d6f08661-5682-4915-ab0d-3bfbab11979f", // STRING : GUID from service_items Y3
      "renewable_source": [
        "9c39f6bd-c2a9-4098-89db-a8fc4856912c",
        "4e1edfa9-caca-42c4-8c48-26ad5f2ab038",
        "fbad0064-f430-47b5-93a1-223095677213"
      ] // ARRAY : GUID from service_items คั่นด้วย comma ex. ["D2C43111-1345-45E0-B365-B5D3A2C90C0D","BC48F0E3-6D8D-4E90-87B1-96341337FC42"]
      ,
      "renewable_source_other": {
        "9c39f6bd-c2a9-4098-89db-a8fc4856912c": "",
        "4e1edfa9-caca-42c4-8c48-26ad5f2ab038": "",
        "fbad0064-f430-47b5-93a1-223095677213": "test"
      } // JSON เมื่อ renewable_source มีตัวที่ is_other = true ให้ key = GUID และ value = text from input ex. {"BC48F0E3-6D8D-4E90-87B1-96341337FC42":"Value"}
      ,
      "year": 2567 // INT
    },
    {
      headers: {
        'Apikey': apiKey
      }
    }
  );

  return data
};

export const insertRequest321 = async () => {
  const { data } = await axios.post(
    apiExUrl + 'requests',
    {
      "service_code": "S321",
      "channel": 0,
      "morning_flag": true,
      "afternoon_flag": true,
      "first_name": "test",
      "last_name": "test",
      "mobile_no": "0880937651",
      "email": "firstname.l@kanda.digital",
      "address": "440/067 คอนโดไทย",
      "address_province": "76",
      "address_city": "7606",
      "address_district": "760601",
      "address_post_code": "76150",
      "request_type": "XXX",
      "files": null,
      "detail": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas venenatis nunc ac justo pharetra laoreet. Fusce ut mi elementum, lobortis arcu quis, viverra ipsum. Maecenas dui arcu.",
      "legal_form": "",
      "nationality": "",
      //s301
      "equipment_type": "7F3D3C5A-3CCA-4F88-B866-48871BD577CB", // STRING : GUID from service_items Y3
      //s302, s303, s304, s307, s309, s311, s312, s315, s320, s322
      "business_type_id": "1413F877-0E21-491A-B733-3A4EF8CD8F0F", // STRING : GUID from m_business_type Y3
      //s301, s312, s314, s315,s316,s318,s327,s329
      "qty": 3, // INT or NULL
      //s305, s313, s328
      "request_service": "e45cee2a-5314-4c35-8dbf-bf7081e1fbf6", // STRING : GUID from service_items Y3
      //s305, s313
      "request_service_type": "96370292-3698-47f9-bcd1-1d04cad4e1a4", // STRING : GUID from service_items Y3
      "transformers": [
        {
          "transformer_brand": "cb56fdd6-5dd7-4092-9311-2aea9ac3b007", // STRING : GUID from service_items Y3
          "transformer_phase": "2b4825a5-1dd8-45a4-aaf6-d22fb5fe8a18", // STRING : GUID from service_items Y3
          "transformer_type": "ada88416-f356-43fb-a4b2-0924c68587ec", // STRING : GUID from service_items Y3 | *child of phase
          "transformer_serial": "TRANSFORMERSERIAL003", // STRING
          "transformer_size": "13e711c3-995b-4c91-8759-821f920d864e", // STRING : GUID from service_items Y3
          "transformer_voltage": "cb3a38be-96b4-4048-b76e-e5556ae76c60", // STRING : GUID from service_items Y3
          "transformer_voltage_other": "" // STRING : เมื่อ transformer_voltage is_other = true
        }
      ],
      //s307
      "transformer_voltage": "983dc9d5-84ef-4917-bbd7-321a00b73668", // STRING : GUID from service_items Y3
      //s308,s315
      "transformer_size": 3, // INT
      //s315
      "transformer_qty": 4, // INT
      //s312
      "equipment_type_id": "D2993E34-01A1-4B84-A014-C99C239A76E8", // STRING : GUID from service_items Y3
      //s314
      "rental_startdate": "2024-07-22 23:59:59", // DATETIME
      "rental_enddate": "2024-07-30 23:59:59", // DATETIME
      "days": 9, // INT
      //s316
      "kw_size": 10, // INT
      //s318
      "equipment_id": "78d2728e-a45b-488a-98a4-7b5d0c06c120", // STRING : GUID from service_items Y3
      "amps_size": 11, // INT
      //s322
      "size_install": "cacfa7cb-32ff-4606-b294-44102ee44fa9", // STRING : GUID from service_items Y3
      //s329
      "renewable_type": "d6f08661-5682-4915-ab0d-3bfbab11979f", // STRING : GUID from service_items Y3
      "renewable_source": [
        "9c39f6bd-c2a9-4098-89db-a8fc4856912c",
        "4e1edfa9-caca-42c4-8c48-26ad5f2ab038",
        "fbad0064-f430-47b5-93a1-223095677213"
      ] // ARRAY : GUID from service_items คั่นด้วย comma ex. ["D2C43111-1345-45E0-B365-B5D3A2C90C0D","BC48F0E3-6D8D-4E90-87B1-96341337FC42"]
      ,
      "renewable_source_other": {
        "9c39f6bd-c2a9-4098-89db-a8fc4856912c": "",
        "4e1edfa9-caca-42c4-8c48-26ad5f2ab038": "",
        "fbad0064-f430-47b5-93a1-223095677213": "test"
      } // JSON เมื่อ renewable_source มีตัวที่ is_other = true ให้ key = GUID และ value = text from input ex. {"BC48F0E3-6D8D-4E90-87B1-96341337FC42":"Value"}
      ,
      "year": 2567 // INT
    },
    {
      headers: {
        'Apikey': apiKey
      }
    }
  );

  return data
};

export const insertRequest322 = async () => {
  const { data } = await axios.post(
    apiExUrl + 'requests',
    {
      "service_code": "S322",
      "channel": 0,
      "morning_flag": true,
      "afternoon_flag": true,
      "first_name": "test",
      "last_name": "test",
      "mobile_no": "0880937651",
      "email": "firstname.l@kanda.digital",
      "address": "440/067 คอนโดไทย",
      "address_province": "76",
      "address_city": "7606",
      "address_district": "760601",
      "address_post_code": "76150",
      "request_type": "XXX",
      "files": null,
      "detail": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas venenatis nunc ac justo pharetra laoreet. Fusce ut mi elementum, lobortis arcu quis, viverra ipsum. Maecenas dui arcu.",
      "legal_form": "",
      "nationality": "",
      //s301
      "equipment_type": "7F3D3C5A-3CCA-4F88-B866-48871BD577CB", // STRING : GUID from service_items Y3
      //s302, s303, s304, s307, s309, s311, s312, s315, s320, s322
      "business_type_id": "1413F877-0E21-491A-B733-3A4EF8CD8F0F", // STRING : GUID from m_business_type Y3
      //s301, s312, s314, s315,s316,s318,s327,s329
      "qty": 3, // INT or NULL
      //s305, s313, s328
      "request_service": "e45cee2a-5314-4c35-8dbf-bf7081e1fbf6", // STRING : GUID from service_items Y3
      //s305, s313
      "request_service_type": "96370292-3698-47f9-bcd1-1d04cad4e1a4", // STRING : GUID from service_items Y3
      "transformers": [
        {
          "transformer_brand": "cb56fdd6-5dd7-4092-9311-2aea9ac3b007", // STRING : GUID from service_items Y3
          "transformer_phase": "2b4825a5-1dd8-45a4-aaf6-d22fb5fe8a18", // STRING : GUID from service_items Y3
          "transformer_type": "ada88416-f356-43fb-a4b2-0924c68587ec", // STRING : GUID from service_items Y3 | *child of phase
          "transformer_serial": "TRANSFORMERSERIAL003", // STRING
          "transformer_size": "13e711c3-995b-4c91-8759-821f920d864e", // STRING : GUID from service_items Y3
          "transformer_voltage": "cb3a38be-96b4-4048-b76e-e5556ae76c60", // STRING : GUID from service_items Y3
          "transformer_voltage_other": "" // STRING : เมื่อ transformer_voltage is_other = true
        }
      ],
      //s307
      "transformer_voltage": "983dc9d5-84ef-4917-bbd7-321a00b73668", // STRING : GUID from service_items Y3
      //s308,s315
      "transformer_size": 3, // INT
      //s315
      "transformer_qty": 4, // INT
      //s312
      "equipment_type_id": "D2993E34-01A1-4B84-A014-C99C239A76E8", // STRING : GUID from service_items Y3
      //s314
      "rental_startdate": "2024-07-22 23:59:59", // DATETIME
      "rental_enddate": "2024-07-30 23:59:59", // DATETIME
      "days": 9, // INT
      //s316
      "kw_size": 10, // INT
      //s318
      "equipment_id": "78d2728e-a45b-488a-98a4-7b5d0c06c120", // STRING : GUID from service_items Y3
      "amps_size": 11, // INT
      //s322
      "size_install": "e75ea6c8-d098-4290-bd2a-0a7ad16dd5e2", // STRING : GUID from service_items Y3
      //s329 S322
      "renewable_type": "d6f08661-5682-4915-ab0d-3bfbab11979f", // STRING : GUID from service_items Y3
      "renewable_source": [
        "9c39f6bd-c2a9-4098-89db-a8fc4856912c",
        "4e1edfa9-caca-42c4-8c48-26ad5f2ab038",
        "fbad0064-f430-47b5-93a1-223095677213"
      ] // ARRAY : GUID from service_items คั่นด้วย comma ex. ["D2C43111-1345-45E0-B365-B5D3A2C90C0D","BC48F0E3-6D8D-4E90-87B1-96341337FC42"]
      ,
      "renewable_source_other": {
        "9c39f6bd-c2a9-4098-89db-a8fc4856912c": "",
        "4e1edfa9-caca-42c4-8c48-26ad5f2ab038": "",
        "fbad0064-f430-47b5-93a1-223095677213": "test"
      } // JSON เมื่อ renewable_source มีตัวที่ is_other = true ให้ key = GUID และ value = text from input ex. {"BC48F0E3-6D8D-4E90-87B1-96341337FC42":"Value"}
      ,
      "year": 2567 // INT
    },
    {
      headers: {
        'Apikey': apiKey
      }
    }
  );

  return data
};

export const insertRequest323 = async () => {
  const { data } = await axios.post(
    apiExUrl + 'requests',
    {
      "service_code": "S323",
      "channel": 0,
      "morning_flag": true,
      "afternoon_flag": true,
      "first_name": "test",
      "last_name": "test",
      "mobile_no": "0880937651",
      "email": "firstname.l@kanda.digital",
      "address": "440/067 คอนโดไทย",
      "address_province": "76",
      "address_city": "7606",
      "address_district": "760601",
      "address_post_code": "76150",
      "request_type": "XXX",
      "files": null,
      "detail": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas venenatis nunc ac justo pharetra laoreet. Fusce ut mi elementum, lobortis arcu quis, viverra ipsum. Maecenas dui arcu.",
      "legal_form": "",
      "nationality": "",
      //s301
      "equipment_type": "7F3D3C5A-3CCA-4F88-B866-48871BD577CB", // STRING : GUID from service_items Y3
      //s302, s303, s304, s307, s309, s311, s312, s315, s320, s322
      "business_type_id": "1413F877-0E21-491A-B733-3A4EF8CD8F0F", // STRING : GUID from m_business_type Y3
      //s301, s312, s314, s315,s316,s318,s327,s329
      "qty": 3, // INT or NULL
      //s305, s313, s328
      "request_service": "e45cee2a-5314-4c35-8dbf-bf7081e1fbf6", // STRING : GUID from service_items Y3
      //s305, s313
      "request_service_type": "96370292-3698-47f9-bcd1-1d04cad4e1a4", // STRING : GUID from service_items Y3
      "transformers": [
        {
          "transformer_brand": "cb56fdd6-5dd7-4092-9311-2aea9ac3b007", // STRING : GUID from service_items Y3
          "transformer_phase": "2b4825a5-1dd8-45a4-aaf6-d22fb5fe8a18", // STRING : GUID from service_items Y3
          "transformer_type": "ada88416-f356-43fb-a4b2-0924c68587ec", // STRING : GUID from service_items Y3 | *child of phase
          "transformer_serial": "TRANSFORMERSERIAL003", // STRING
          "transformer_size": "13e711c3-995b-4c91-8759-821f920d864e", // STRING : GUID from service_items Y3
          "transformer_voltage": "cb3a38be-96b4-4048-b76e-e5556ae76c60", // STRING : GUID from service_items Y3
          "transformer_voltage_other": "" // STRING : เมื่อ transformer_voltage is_other = true
        }
      ],
      //s307
      "transformer_voltage": "983dc9d5-84ef-4917-bbd7-321a00b73668", // STRING : GUID from service_items Y3
      //s308,s315
      "transformer_size": 3, // INT
      //s315
      "transformer_qty": 4, // INT
      //s312
      "equipment_type_id": "D2993E34-01A1-4B84-A014-C99C239A76E8", // STRING : GUID from service_items Y3
      //s314
      "rental_startdate": "2024-07-22 23:59:59", // DATETIME
      "rental_enddate": "2024-07-30 23:59:59", // DATETIME
      "days": 9, // INT
      //s316
      "kw_size": 10, // INT
      //s318
      "equipment_id": "78d2728e-a45b-488a-98a4-7b5d0c06c120", // STRING : GUID from service_items Y3
      "amps_size": 11, // INT
      //s322
      "size_install": "e75ea6c8-d098-4290-bd2a-0a7ad16dd5e2", // STRING : GUID from service_items Y3
      //s329 S322
      "renewable_type": "d6f08661-5682-4915-ab0d-3bfbab11979f", // STRING : GUID from service_items Y3
      "renewable_source": [
        "9c39f6bd-c2a9-4098-89db-a8fc4856912c",
        "4e1edfa9-caca-42c4-8c48-26ad5f2ab038",
        "fbad0064-f430-47b5-93a1-223095677213"
      ] // ARRAY : GUID from service_items คั่นด้วย comma ex. ["D2C43111-1345-45E0-B365-B5D3A2C90C0D","BC48F0E3-6D8D-4E90-87B1-96341337FC42"]
      ,
      "renewable_source_other": {
        "9c39f6bd-c2a9-4098-89db-a8fc4856912c": "",
        "4e1edfa9-caca-42c4-8c48-26ad5f2ab038": "",
        "fbad0064-f430-47b5-93a1-223095677213": "test"
      } // JSON เมื่อ renewable_source มีตัวที่ is_other = true ให้ key = GUID และ value = text from input ex. {"BC48F0E3-6D8D-4E90-87B1-96341337FC42":"Value"}
      ,
      "year": 2567 // INT
    },
    {
      headers: {
        'Apikey': apiKey
      }
    }
  );

  return data
};

export const insertRequest329 = async () => {
  const { data } = await axios.post(
    apiExUrl + 'requests',
    {
      "service_code": "S329",
      "channel": 0,
      "morning_flag": true,
      "afternoon_flag": true,
      "first_name": "test",
      "last_name": "test",
      "mobile_no": "0880937651",
      "email": "firstname.l@kanda.digital",
      "address": "440/067 คอนโดไทย",
      "address_province": "76",
      "address_city": "7606",
      "address_district": "760601",
      "address_post_code": "76150",
      "request_type": "XXX",
      "files": null,
      "detail": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas venenatis nunc ac justo pharetra laoreet. Fusce ut mi elementum, lobortis arcu quis, viverra ipsum. Maecenas dui arcu.",
      "legal_form": "",
      "nationality": "",
      //s301
      "equipment_type": "7F3D3C5A-3CCA-4F88-B866-48871BD577CB", // STRING : GUID from service_items Y3
      //s302, s303, s304, s307, s309, s311, s312, s315, s320, s322
      "business_type_id": "1413F877-0E21-491A-B733-3A4EF8CD8F0F", // STRING : GUID from m_business_type Y3
      //s301, s312, s314, s315,s316,s318,s327,s329
      "qty": 3, // INT or NULL
      //s305, s313, s328
      "request_service": "68d4be55-4b60-4675-8170-6ac96b398ad8", // STRING : GUID from service_items Y3
      //s305, s313
      "request_service_type": "e51d31fe-cd31-442d-877f-60e4dc357002", // STRING : GUID from service_items Y3
      "transformers": [
        {
          "transformer_brand": "529e631e-f67a-4d57-92c7-d7ae47a3d705", // STRING : GUID from service_items Y3
          "transformer_phase": "b147197f-2889-41cb-96bf-c19bdd30e3b5", // STRING : GUID from service_items Y3
          "transformer_type": "10ceadc5-16b6-4b2a-8b77-9343f97abf2e", // STRING : GUID from service_items Y3 | *child of phase
          "transformer_serial": "TRANSFORMERSERIAL002", // STRING
          "transformer_size": "2e8be5d4-5950-4c47-93a3-e80bf40492a7", // STRING : GUID from service_items Y3
          "transformer_voltage": "827f9724-d3c8-4da8-bdcd-84afd725cb17", // STRING : GUID from service_items Y3
          "transformer_voltage_other": "" // STRING : เมื่อ transformer_voltage is_other = true
        }
      ],
      //s307
      "transformer_voltage": null, // STRING : GUID from service_items Y3
      //s308,s315
      "transformer_size": 0, // INT
      //s315
      "transformer_qty": 0, // INT
      //s312
      "equipment_type_id": "D2993E34-01A1-4B84-A014-C99C239A76E8", // STRING : GUID from service_items Y3
      //s314
      "rental_startdate": "2024-04-22 23:59:59", // DATETIME
      "rental_enddate": "2024-04-30 23:59:59", // DATETIME
      "days": 1, // INT
      //s316
      "kw_size": 10, // INT
      //s318
      "equipment_id": "D2993E34-01A1-4B84-A014-C99C239A76E8", // STRING : GUID from service_items Y3
      "amps_size": 0, // INT
      //s322
      "size_install": "cacfa7cb-32ff-4606-b294-44102ee44fa9", // STRING : GUID from service_items Y3
      //s329
      "renewable_type": "d6f08661-5682-4915-ab0d-3bfbab11979f", // STRING : GUID from service_items Y3
      "renewable_source": [
        "9c39f6bd-c2a9-4098-89db-a8fc4856912c",
        "4e1edfa9-caca-42c4-8c48-26ad5f2ab038",
        "fbad0064-f430-47b5-93a1-223095677213"
      ] // ARRAY : GUID from service_items คั่นด้วย comma ex. ["D2C43111-1345-45E0-B365-B5D3A2C90C0D","BC48F0E3-6D8D-4E90-87B1-96341337FC42"]
      ,
      "renewable_source_other": {
        "9c39f6bd-c2a9-4098-89db-a8fc4856912c": "",
        "4e1edfa9-caca-42c4-8c48-26ad5f2ab038": "",
        "fbad0064-f430-47b5-93a1-223095677213": "test"
      } // JSON เมื่อ renewable_source มีตัวที่ is_other = true ให้ key = GUID และ value = text from input ex. {"BC48F0E3-6D8D-4E90-87B1-96341337FC42":"Value"}
      ,
      "year": 2567 // INT
    },
    {
      headers: {
        'Apikey': apiKey
      }
    }
  );

  return data
};

// export const insertRequest301 = async () => {
//   const { data } = await axios.post(
//     apiExUrl + 'requests',
//     {},
//     {
//       headers: {
//         'Apikey': apiKey
//       }
//     }
//   );

//   return data
// };
