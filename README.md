# Custom subject column

## 概要
A Thunderbird add-on that adds a custom subject column to the message list.  
サンダーバードのメッセージリストにカスタマイズされた件名の列を追加するアドオンです。  

## 作者
Kirurobo


## 要件定義
### 基本的な要件
- 正規表現で置換した件名の列を表示できるようにする
- 正規表現パターンと列の表示名はアドオンのオプションで編集可能とする
### オプションの要件（実装するかは未定）
- パターンと表示名の組を複数作成できる
- フォルダ名または別の条件で列の候補に表示させるかも組ごとに設定できる
  - 組が多くなると列の選択肢が大量となる可能性があるため、フォルダ指定で絞れても良いかもしれない


## 参考
- [Full address column](https://github.com/lkosson/full-address-column) by lkosson
- [DKIM Verifier](https://github.com/lieser/dkim_verifier) by Philippe Lieser
