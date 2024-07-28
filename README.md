# shiritori

公開URL
https://shiritori-deno.deno.dev

実行方法
deno run --allow-net --allow-read --watch --allow-env server.js        
  
実装したこと
inputが空白の時、送信できないようにした
ゲーム終了時に送信ボタンを押せないようにした
リセットボタンを追加した
ENTERで送信できるようにした
頭文字の自動挿入
存在する単語かを確認
同時アクセスに対応
最後の文字が「ー」や小さい文字の時の対応



参考文献

ひらがなかチェック
https://058.jp/javascript/?p=107　

辞書API
https://github.com/mistval/unofficial-jisho-api

denoでnpm
https://docs.deno.com/runtime/manual/node/npm_specifiers/

カタカナからひらがなに変換
https://qiita.com/mimoe/items/855c112625d39b066c9a



ソースコピー

ON/OFFスイッチ
https://hajimete.org/on-off-switch-design-7

