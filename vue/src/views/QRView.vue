<template>
  <div :id="$style.parent">
    <h1>Nameless Housework</h1>
    <p :class="$style.left">
      <a href="https://webiotmakers.connpass.com/event/268756/">
        東京開催！2022年度 Web×IoT メイカーズチャレンジ PLUS【講習会&ハッカソン】
      </a>
      のFチームが<br />開発した家事が発生したことを教えてくれるシステムです！
    </p>

    <VueQrcode :value="ENDPOINT" :options="{ width: 300 }" />
    <p>こちらの QR コードをスキャンすることで<br />通知設定ができます！</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import VueQrcode from '@chenfengyuan/vue-qrcode';

/**
 * ex: https://xxx.ngrok.io
 */
const ENDPOINT = location.search.split(/api=|&/)[1];
console.log(ENDPOINT);

export default defineComponent({
  name: 'HomeView',
  components: {
    VueQrcode,
  },
  setup() {
    return {
      ENDPOINT,
    };
  },
});
</script>

<style lang="scss" module>
$WIDTH: 336px;

#parent {
  width: $WIDTH;
  margin: 0 auto;
}

.left {
  text-align: left;
}
</style>
