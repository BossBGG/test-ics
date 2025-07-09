<template>
  <main>
    <TheHeader />
    <div class="container">
      <div class="wraper_all">
        <RouterView />
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
@import '@style';

main {
  background-color: $white;
}
.container {
  padding: 0;
  .wraper_all {
    padding: 13px 20px 56px;

    @media #{$screen-mds-min} {
      padding: 33px 25px 68px;
    }

    @media #{$screen-xls-min} {
      padding: 33px 0 68px;
    }
  }
}
</style>
