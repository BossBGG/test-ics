<script setup lang="ts">
loading.start();

const requestStore = useRequestStore();
const userDataStore = useUserDataStore();
const { userProfile, selectedPeaOffice } = storeToRefs(userDataStore);

const req_id = useQuery("req_id");
const service = useQuery("service");
const bp_no = useQuery("bp_no");
const ca_no = useQuery("ca_no");

watch(
  () => userProfile.value?.username,
  async (newValue) => {
    if (newValue) {
      let request_id = req_id.value;
      let url = "";
      if (!request_id) {
        if (!service.value || service.value == "null") {
          window.location.replace(peaUrl(""));
        }
        url = `/createBp?bp=${bp_no.value || ""}&ca=${
          ca_no.value || ""
        }&service=${service.value || ""}&temp=${uuidv4()}&action=edit`;
      } else {
        url = `/createBp/${request_id}?bp=${bp_no.value || ""}&ca=${
          ca_no.value || ""
        }&action=edit`;
      }

      window.location.replace(url);
    }
  },
  { immediate: true }
);

function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      +c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
    ).toString(16)
  );
}
</script>
