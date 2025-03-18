const id = "shorterSubjectColumn";
// var savedItem = browser.storage.sync.get({
// 	columnName: 'Custom subject',
// 	pattern: '^\\[[^\\]]+\\]',
// 	replacedText: '',
// });
// savedItem.then((res) => {
// 	browser.CustomSubject.test(id);
// 	browser.CustomSubject.add(id, res.columnName, res.pattern, res.replacedText);
// });

// async function loadSetting() {
// 	await browser.CustomSubject.load();
// }
//browser.windows.onCreated.addListener(loadSetting);
browser.customSubject.load();

browser.action.onClicked.addListener(() => {
	browser.runtime.openOptionsPage();
});
