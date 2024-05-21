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
### オプションの要件
- パターンと表示名の組を複数作成できる
- フォルダ名または別の条件で列の候補に表示させるかも組ごとに設定できる
  - 組が多くなると列の選択肢が大量となる可能性があるため、フォルダ指定で絞れても良いかもしれない


## 設定ファイル
### options.json
```json
{
	"version": 1.0,
	"list": [
		{
			"id": 0,
			"columnName": "No leading []",
			"useRegExp": true,
			"useGlobal": false,
      "ignoreCase": false,
			"pattern": "^(\\[[^\\]]+\\]\\s*)+",
			"replacedText": "",
			"comment": "Remove leading [...]. e.g. [ML:1][ml:2] Subject -> Subject"
		}
	]
}
```

| プロパティ | 型 | 説明 |
|-----------|----|------|
| id        | int | 識別番号 |
| columnName| str | 列の表示名 |
| useRegExp | bool| true: 正規表現, false: 単純文字列 |
| useGlobal | bool| true: 置換を繰り返す, false: 1回のみ |
| ignoreCase | bool| true: 大文字小文字を無視 |
| pattern   | str | 検索対象正規表現または文字列 |
| replacedText| str| 置換後の文字列 |
| comment   | str | 説明 |


## 利用スクリプト
- [DKIM Verifier](https://github.com/lieser/dkim_verifier) by Philippe Lieser の translation.mjs.js を利用しています。


## 参考
- [Full address column](https://github.com/lkosson/full-address-column) by lkosson
- [DKIM Verifier](https://github.com/lieser/dkim_verifier) by Philippe Lieser

