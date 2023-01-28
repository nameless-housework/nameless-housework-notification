# nameless-housework-notification

> 名もなき家事が発生していることを住人にあの手この手で通知するシステム

## About

[東京開催！2022年度 Web×IoT メイカーズチャレンジ PLUS【講習会&ハッカソン】](https://webiotmakers.connpass.com/event/268756/) で集まったFチームによるいわゆる名前のない家事の遂行を支援するプロダクトの内、家事が発生したことを通知する実装を管理しているリポジトリです。

### features

1. coming soon...

## node/npm version について

会場で配布された `Raspberry Pi ZERO WH` にインストールされていたものをベースに開発しております。

```
pi@raspberrypi:~$ node -v
v18.12.1
pi@raspberrypi:~$ npm -v
8.19.2
```

## セットアップ&永続化方法

WARNING: 配布された `Raspberry Pi` には `git` が入ってないので `sudo apt install -y git` を実行されたい。

1. 会場で配布された及び [forever](https://www.npmjs.com/package/forever) 導入済みの `Raspberry Pi` を起動し当リポジトリをクローンしてください。
2. リポジトリ内へ移動し、 `example.env` ファイルを参考に環境変数を設定及び `.env` ファイルの作成をしてください。
3. `Raspberry Pi` に開発者モードを有効にした Android デバイスを接続してください。
4. `Chirimen` の [Neopixel LED](https://tutorial.chirimen.org/pizero/esm-examples/neopixel-i2c/index.html) を参考に配線を行ってください。
5. `npm i  --production` を実行してください。(依存関係構築)
6. リポジトリ内へ移動し、 `forever start -c "npm run start" ./` を実行してください。※起動&永続化
7. coming soon...

### データ保存先について

coming soon...
