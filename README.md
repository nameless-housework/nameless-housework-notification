# nameless-housework-notification

> 名もなき家事が発生していることを住人にあの手この手で通知するシステム

## About

[東京開催！2022年度 Web×IoT メイカーズチャレンジ PLUS【講習会&ハッカソン】](https://webiotmakers.connpass.com/event/268756/) で集まったFチームによるいわゆる名前のない家事の遂行を支援するプロダクトの内、家事が発生したことを通知する実装を管理しているリポジトリです。

### Features

1. coming soon...

## Tips

- コミットの際は、 `npm run commit` を実行することで `Git` コミット用の `CLI` ツールが起動します。(開発チームにおけるコミットフォーマットの標準化的なことができたりする…かも)
- 当リポジトリでは `git push` の際にクラウド上及び `GitHub Actions` にて自動的にコードの構文チェックが走ります。構文は主に `@typescript-eslint/recommended` というルールに基づいています。`dev` ブランチの設定上チェックを合格するまで原則 `PR` を取り込むボタンが押せなくなっております。(開発チームにおけるコードフォーマットの標準化的なことができたりする…かも)

## node/npm version について

会場で配布された `Raspberry Pi ZERO WH` にインストールされていたものをベースに開発しております。

```
pi@raspberrypi:~$ node -v
v18.12.1
pi@raspberrypi:~$ npm -v
8.19.2
pi@raspberrypi:~$ wget -O speedtest-cli https://raw.githubusercontent.com/sivel/speedtest-cli/master/speedtest.py
pi@raspberrypi:~$ chmod +x speedtest-cli
pi@raspberrypi:~$ ./speedtest-cli
Retrieving speedtest.net configuration...
Retrieving speedtest.net server list...
Selecting best server based on ping...
Hosted by Rakuten Mobile, Inc (Tokyo) [2.38 km]: 132.094 ms
Testing download speed................................................................................
Download: 22.86 Mbit/s
Testing upload speed......................................................................................................
Upload: 13.56 Mbit/s
```

## セットアップ&永続化方法

### ご注意

- 配布された `Raspberry Pi` には `git` が入ってないので `sudo apt install -y git` を実行されたい。
- `ssh` などではなく [PiZeroWebSerialConsole](https://chirimen.org/PiZeroWebSerialConsole/PiZeroWebSerialConsole.html) を利用している場合などで `Raspberry Pi` の電源用 USB ポートから充電していない場合は給電してください。(手順の途中で PC 以外のシリアルデータ通信が必要になるデバイスの接続を要するため)
- `WiFi` などはセットアップ済である前提です。

### 手順

1. 会場で配布された及び [forever](https://www.npmjs.com/package/forever) 導入済みの `Raspberry Pi` を起動し当リポジトリをクローンしてください。
2. リポジトリ内へ移動し、 `example.env` ファイルを参考に環境変数を設定及び `.env` ファイルの作成をしてください。
3. `Chirimen` の [Neopixel LED](https://tutorial.chirimen.org/pizero/esm-examples/neopixel-i2c/index.html) を参考に配線を行ってください。
4. `npm i --production` を実行してください。(依存関係構築)(筆者の移動先の環境ではその回線速度と `Raspberry Pi` のスペックもあり完了まで6分程要したので気長に待ちましょう。)
5. リポジトリ内へ移動し、 `forever start -c "npm run start" ./` を実行してください。※起動&永続化
6. `Raspberry Pi` に開発者モードを有効にした Android デバイスを接続してください。

### データ保存先について

coming soon...
