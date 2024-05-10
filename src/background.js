const id = "shorterSubjectColumn";
var savedItem = browser.storage.sync.get({
	columnName: 'Custom subject',
	pattern: '^\\[[^\\]]+\\]',
	replacedText: '',
});
savedItem.then((res) => {
	browser.customSubject.add(id, res.columnName, res.pattern, res.replacedText);
});
