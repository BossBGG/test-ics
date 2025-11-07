<script setup lang="ts">

onMounted(() => {

});
</script>

<template>
  <div>
    <!-- <h1>Index</h1> -->
    <span class="q-icon material-icons-outlined"> description </span>

    <ul>
      <li>
        <br />หมายเหตุ :
        แต่ละขั้นตอนสามารถสร้างและแก้ไขได้เมื่อขั้นตอนก่อนหน้าสำเร็จแล้ว
      </li>
      <li><br /></li>
      <li>
        REQUEST 1.<br />
        <a href="/request/612ea35e-9a89-44fa-be3c-d83cc8a996b8">review</a> |
        <a href="/createBp/612ea35e-9a89-44fa-be3c-d83cc8a996b8?bp=1022035713&ca=092000866930&action=view">createBp</a>
        |
        <a href="/survey/612ea35e-9a89-44fa-be3c-d83cc8a996b8">survey</a>,
        <a href="/survey/history/612ea35e-9a89-44fa-be3c-d83cc8a996b8">survey history</a>
        กรณี service มีการสำรวจ |
        <a href="/quotation/612ea35e-9a89-44fa-be3c-d83cc8a996b8">quotation</a>
      </li>
      <li><br /></li>
      <li>
        REQUEST 2.<br />
        <a href="/request/c6b1ee4b-5fa9-4f64-8b3d-c9958ca7c1dc">review</a> |
        <a href="/createBp/c6b1ee4b-5fa9-4f64-8b3d-c9958ca7c1dc?bp=1022035713&ca=092000866930&action=view">
          createBp
        </a>
        |
        <a href="/survey/c6b1ee4b-5fa9-4f64-8b3d-c9958ca7c1dc">survey</a>,
        <a href="/survey/history/c6b1ee4b-5fa9-4f64-8b3d-c9958ca7c1dc">survey history</a>
        กรณี service มีการสำรวจ |
        <a href="/quotation/c6b1ee4b-5fa9-4f64-8b3d-c9958ca7c1dc">quotation</a>
      </li>
      <li></li>
      <!-- <li>
        <a href="/request/72E6B50C-08E7-417E-B2CE-49DA6AF9DCF2">
          request : S301
        </a>
      </li>
      <li>
        <a href="/request/c253697f-2bf2-4b92-983b-08ed927ece3f">
          request : S303
        </a>
      </li>
      <li>
        <a href="/request/d52e1ea3-8812-4663-b7c5-a25a551dffae">
          request : S304
        </a>
      </li>
      <li>
        <a
          href="/createBp/72E6B50C-08E7-417E-B2CE-49DA6AF9DCF2?bp=1022035713&ca=092000866930&action=view"
        >
          createBp
        </a>
        <br />
        <a
          href="/createBp/232658e7-6d96-4656-978a-31b0ceabdd62?bp=1022035713&ca=092000866930&action=view"
        >
          Walk-In Create BP
        </a>
        <br />
        <a
          href="/createBp/9a8d85e3-fb92-40f8-934f-7c329a430386?bp=1022035713&ca=092000866930&action=view"
        >
          Walk-In Create BP : S301
        </a>
        <br />
        <a
          href="/createBp/8daf7d58-14b2-49cd-a1ea-2c1ea0e0dd14?bp=1022035713&ca=092000866930&action=view"
        >
          Walk-In Create BP : S302
        </a>
      </li>
      <li></li>
      <li>
        <a href="/survey/cd647989-4802-4484-8c5c-72218066ad47">
          survey : S302
        </a>
      </li>
      <li>
        <a href="/survey/history/cd647989-4802-4484-8c5c-72218066ad47">
          survey log : S302
        </a>
      </li>
      <li>
        <a href="/quotation/582cfed2-a468-4e47-8a0b-10b380025181">
          Quotation : S301 </a
        ><br />
        <a href="/quotation/cd647989-4802-4484-8c5c-72218066ad47">
          Quotation : S302
        </a>
      </li> -->
    </ul>

    <div class="q-pa-md row q-gutter-md items-start">
      <div class="q-pa-md q-gutter-sm">
        <div class="row">
          <div class="col-4 q-mt-lg">
            <q-btn color="white" text-color="black" label="Standard" />
          </div>
          <div class="col-4 q-mt-lg">
            <q-btn color="secondary" label="Secondary" />
          </div>
          <div class="col-4 q-mt-lg">
            <q-btn color="amber" glossy label="Amber" />
          </div>
          <div class="col-4 q-mt-lg">
            <q-btn color="brown-5" label="Brown 5" />
          </div>
          <div class="col-4 q-mt-lg">
            <q-btn color="deep-orange" glossy label="Deep Orange" />
          </div>
          <div class="col-4 q-mt-lg">
            <q-btn color="purple" label="Purple" />
          </div>
          <div class="col-4 q-mt-lg">
            <q-btn color="black" label="Black" />
          </div>
          <div class="col-4 q-mt-lg">
            <q-btn color="primary" @click="$keycloak.logout" label="Logout" />
          </div>
        </div>
      </div>

      <q-card class="my-card">
        <img src="https://cdn.quasar.dev/img/mountains.jpg" />

        <q-card-section>
          <div class="text-h6">Our Changing Planet</div>
          <div class="text-subtitle2">by John Doe</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ lorem }}
        </q-card-section>
      </q-card>

      <q-card class="my-card">
        <q-img src="https://cdn.quasar.dev/img/parallax2.jpg">
          <div class="absolute-bottom text-subtitle2 text-center">Title</div>
        </q-img>
      </q-card>

      <q-card class="my-card">
        <q-img src="https://cdn.quasar.dev/img/parallax2.jpg">
          <div class="absolute-bottom text-h6">Title</div>
        </q-img>

        <q-card-section>
          {{ lorem }}
        </q-card-section>
      </q-card>

      <q-card class="my-card">
        <q-img src="https://cdn.quasar.dev/img/parallax2.jpg">
          <div class="text-subtitle2 absolute-top text-center">Title</div>
        </q-img>
      </q-card>

      <q-card class="my-card">
        <q-img src="https://cdn.quasar.dev/img/parallax2.jpg">
          <div class="text-h5 absolute-bottom text-right">Title</div>
        </q-img>
      </q-card>

      <q-card class="my-card">
        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>Title</q-item-label>
            <q-item-label caption> Subhead </q-item-label>
          </q-item-section>
        </q-item>

        <img src="https://cdn.quasar.dev/img/parallax2.jpg" />
      </q-card>

      <q-card class="my-card">
        <q-img src="https://cdn.quasar.dev/img/parallax2.jpg">
          <div class="absolute-bottom">
            <div class="text-h6">Our Changing Planet</div>
            <div class="text-subtitle2">by John Doe</div>
          </div>
        </q-img>

        <q-card-actions>
          <q-btn flat> Action 1 </q-btn>
          <q-btn flat> Action 2 </q-btn>
        </q-card-actions>
      </q-card>

      <DetailsRequest />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@style";

.my-card {
  width: 100%;
  max-width: 250px;
}

.real {
  background-color: $primary;
  width: 100px;
  height: 100px;

  @media #{$screen-lg-min} {
    width: 200px;
    height: 200px;
  }
}
</style>
