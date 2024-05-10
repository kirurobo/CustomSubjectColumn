const id = "shorterSubjectColumn";

function saveOptions(e) {
	let pattern = document.querySelector("#pattern").value;
	let columnName = document.querySelector("#columnName").value;
	let replacedText = document.querySelector("#replacedText").value;

	browser.customSubject.remove(id);
	browser.customSubject.add(id, columnName, pattern, replacedText);

	browser.storage.sync.set({
		pattern: pattern,
		columnName: columnName,
		replacedText: replacedText,
	});

	e.preventDefault();
  }
  
  function restoreOptions() {
	// デフォルトのパターンは、件名先頭の[]で囲まれた文字列を除去
	const defaultPattern = '^\\[[^\\]]+\\]';
	const defaultColumnName = 'Custom subject';
	const defaultReplacedText = '';

	var savedItem = browser.storage.sync.get({
		columnName: defaultColumnName,
		pattern: defaultPattern,
		replacedText: defaultReplacedText,
	});
	savedItem.then((res) => {
		document.querySelector("#pattern").value = res.pattern;
		document.querySelector("#columnName").value = res.columnName;
		document.querySelector("#replacedText").value = res.replacedText;
	});
  }

  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.querySelector("form").addEventListener("submit", saveOptions);
  