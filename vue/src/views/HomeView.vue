<template>
  <div :id="$style.parent">
    <h1>Nameless Housework</h1>
    <p>
      <a href="https://webiotmakers.connpass.com/event/268756/">
        東京開催！2022年度 Web×IoT メイカーズチャレンジ PLUS【講習会&ハッカソン】
      </a>
      のFチームが<br />開発した家事が発生したことを教えてくれるシステムです！
    </p>

    <div :class="$style.setting" v-for="(data, key, index) in state.sensor" :key="key">
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
          <el-col :span="4" @click="save">
            <el-icon :size="30"><UploadFilled /></el-icon><br />
          </el-col>
        </el-row>
      </el-card>
    </div>

    <div :id="$style.footer">
      <el-button @click="location.href = 'https://ambidata.io/bd/board.html?id=55252'">
        家事の発生状況を見る
        <el-icon :size="30"><TrendCharts /></el-icon>
      </el-button>
      <el-select :id="$style.lang" v-model="state.lang">
        <el-option @click="lagnChange" label="JP" value="jp" />
        <el-option @click="lagnChange" label="EK" value="ek" />
      </el-select>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { TrendCharts, UploadFilled, Memo } from '@element-plus/icons-vue';
import * as notification from '@/components/notification';

export default defineComponent({
  name: 'HomeView',
  components: {
    TrendCharts,
    UploadFilled,
    Memo,
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
    });

    const save = () => {
      notification.success({ title: '成功', message: '保存しました' });
    };

    const lagnChange = () => {
      notification.success({ title: '成功', message: `言語を${state.lang}に変更しました` });
    };

    return {
      state,
      save,
      lagnChange,
      location,
    };
  },
});
</script>

<style lang="scss" module>
#parent {
  width: 375px;
  margin: 0 auto;
}
.setting {
  margin: 30px 0;
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
  width: 100%;
  left: 0;
  bottom: 0;
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
