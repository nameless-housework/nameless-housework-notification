<template>
  <div :id="$style.parent">
    <h1>Nameless Housework</h1>
    <p :class="$style.left">
      <a href="https://webiotmakers.connpass.com/event/268756/">
        東京開催！2022年度 Web×IoT メイカーズチャレンジ PLUS【講習会&ハッカソン】
      </a>
      のFチームが<br />開発した家事が発生したことを教えてくれるシステムです！
    </p>

    <div v-if="FLAG_QR">
      <VueQrcode :value="ENDPOINT" :options="{ width: 300 }" />
      <p>こちらの QR コードをスキャンすることで<br />通知設定ができます！</p>
    </div>
    <div v-else-if="!ENDPOINT" :class="$style.left">
      <p>
        ⚠ 通信に必要なパラメータがありません。Raspberry Pi 等の画面に表示された QR
        コードをスキャンしてアクセスしてください。
      </p>
    </div>
    <div v-else :class="$style.setting" v-for="(data, key, index) in state.sensor" :key="key">
      <el-card>
        <template #header>
          <div class="card-header">
            <el-row>
              <el-col :span="20" :class="$style.title">
                第{{ ['一', '二', '三', '四', '五', '六', '七', '八'][index] }}センサー
              </el-col>
              <el-col :span="4">
                <el-switch v-model="data.active" />
              </el-col>
            </el-row>
          </div>
        </template>

        <el-row>
          <el-col :class="$style.input" :span="12">
            <el-input type="number" v-model="data.threshold" />
          </el-col>
          <el-col :class="$style.input" :span="12">
            <el-select v-model="data.over_or_less">
              <el-option label="以上" value="over" />
              <el-option label="以下" value="less" />
            </el-select>
          </el-col>
        </el-row>
        <p :class="$style.right">になったら通知する</p>
        <el-row>
          <el-col :span="4">
            <el-icon :size="30"><Memo /></el-icon><br />
            <small>メモ</small><br />
          </el-col>
          <el-col :span="16">
            <el-input type="textarea" v-model="data.about" />
          </el-col>
          <el-col :span="4" @click="save(key)">
            <el-icon :size="30"><UploadFilled /></el-icon><br />
            <small>保存</small><br />
          </el-col>
        </el-row>
      </el-card>
    </div>

    <div :id="$style.footer">
      <el-button :id="$style.ambient" @click="location.href = 'https://ambidata.io/bd/board.html?id=55252'">
        家事の発生状況を見る
        <el-icon :size="30"><TrendCharts /></el-icon>
      </el-button>
      <el-select :id="$style.lang" v-model="state.lang">
        <el-option @click="changeLang" label="JP" value="jp" />
        <el-option @click="changeLang" label="EN" value="en" />
      </el-select>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { TrendCharts, UploadFilled, Memo } from '@element-plus/icons-vue';
import VueQrcode from '@chenfengyuan/vue-qrcode';
import { Configs, SensorKeys } from '../../../src/@types/db';

/**
 * ex: https://xxx.ngrok.io
 */
const ENDPOINT = location.search.split(/api=|&/)[1];
console.log(ENDPOINT);

/**
 * これが true なら ENDPOINT を QR コードにしたものを表示する
 */
const FLAG_QR = location.search.includes('qr=true');
console.log('flag_qr', FLAG_QR);

// api client
import { Client } from '@/api/client';

// components
import * as notification from '@/components/notification';

export default defineComponent({
  name: 'HomeView',
  components: {
    TrendCharts,
    UploadFilled,
    Memo,
    VueQrcode,
  },
  setup() {
    const state = reactive({
      lang: 'jp',
      sensor: {
        d1: {
          active: false,
          about: '',
          threshold: 0,
          over_or_less: '',
        },
        d2: {
          active: false,
          about: '',
          threshold: 0,
          over_or_less: '',
        },
        d3: {
          active: false,
          about: '',
          threshold: 0,
          over_or_less: '',
        },
        d4: {
          active: false,
          about: '',
          threshold: 0,
          over_or_less: '',
        },
        d5: {
          active: false,
          about: '',
          threshold: 0,
          over_or_less: '',
        },
        d6: {
          active: false,
          about: '',
          threshold: 0,
          over_or_less: '',
        },
        d7: {
          active: false,
          about: '',
          threshold: 0,
          over_or_less: '',
        },
        d8: {
          active: false,
          about: '',
          threshold: 0,
          over_or_less: '',
        },
      },
    } as Configs);
    const client = new Client(ENDPOINT);

    if (!ENDPOINT) {
      notification.error({
        title: '通信エラー',
        message:
          '通信に必要なパラメータがありません。Raspberry Pi 等の画面に表示された QR コードをスキャンしてアクセスしてください。',
      });
    }

    const reflectResToState = (res: Configs) => {
      state.lang = res.lang;
      state.sensor = res.sensor;
    };

    (async () => {
      const res = await client.getAll();
      reflectResToState(res);
    })();

    const save = async (key: SensorKeys) => {
      if (!state.sensor[key].about) {
        notification.error({ title: 'エラー', message: 'メモを入力してください' });
        return;
      }
      if (!state.sensor[key].over_or_less) {
        notification.error({ title: 'エラー', message: '以上/以下を入力してください' });
        return;
      }
      await client.updateSensor({ name: key, ...state.sensor[key] });
      notification.success({ title: '成功', message: '保存しました' });
    };

    const changeLang = async () => {
      await client.updateLang(state.lang);
      notification.success({ title: '成功', message: `言語を ${state.lang} に変更しました` });
    };

    return {
      state,
      save,
      changeLang,
      location,
      ENDPOINT,
      FLAG_QR,
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

.setting {
  margin: 40px 0;
}

.title {
  text-align: left;
  font-weight: bold;
  line-height: 32px;
}

.input {
  padding: 0 5px;
}

#footer {
  position: fixed;
  width: $WIDTH;
  margin: 0 auto;
  bottom: 0;
}

#ambient {
  margin-right: 40px;
}

#lang {
  width: 50px;
}

.left {
  text-align: left;
}

.right {
  text-align: right;
}
</style>
