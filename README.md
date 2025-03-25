# しりとりゲーム

## 公開URL
[https://shiritori-deno-vh0a8kmef1dy.deno.dev/](https://shiritori-deno-deploy-82g7hqxjayv9.deno.dev)


## 実行方法
```bash
deno install
deno task run
``` 
  
## 実装したこと
* ENTERで送信、ESCでリセット
* ゲーム終了後に送信ボタンを押せないように変更 
* 頭文字の自動挿入機能
* 実在する単語かを確認(下のAPIを利用)
* 最後の文字が「ー」や小さい文字の時に対応
* 同時アクセスに対応
* コンピュータ対戦
* 対人戦(ランダム、または同じ合言葉を入れることでマッチング)

## 使用したAPI
* 辞書API
https://github.com/mistval/unofficial-jisho-api

## 参考文献

* ひらがなかチェック
https://058.jp/javascript/?p=107　

* denoでnpm
https://docs.deno.com/runtime/manual/node/npm_specifiers/

* カタカナからひらがなに変換
https://qiita.com/mimoe/items/855c112625d39b066c9a



## ソースコピー

* ON/OFFスイッチ
https://hajimete.org/on-off-switch-design-7


