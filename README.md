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


## 設定情報案
（案であり未実装。将来的にJSONでのインポート、エクスポートに対応を想定）

### options.json
```json
{
	"version": 1.0,
	"list": [
		{
			"id": 0,
			"ruleNo": 1,
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
| id        | int | Thunderbird 内部の列ID |
| ruleNo    | int | 列を識別する番号 |
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


## 更新履歴
- v0.8.3 : 2026-07-22 : Thunderbird 155 まで対応とした。
- v0.8.2 : 2026-06-19 : Thunderbird 153 まで対応とした。
- v0.8.1 : 2026-05-20 : Thunderbird 152 まで対応とした。
- v0.8.0 : 2026-03-27 : デフォルトでは件名先頭の[]、()、空白を削除とした。Thunderbird 150 まで対応とした。
- v0.7.0 : 2026-03-18 : 複数列の作成に対応。Thunderbird 148 に対応。
- v0.5.6 : 2024-07-18 : Thunderbird 128.0 にも対応。
