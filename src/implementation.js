const { ExtensionCommon } = ChromeUtils.importESModule("resource://gre/modules/ExtensionCommon.sys.mjs");
const { ExtensionSupport } = ChromeUtils.importESModule("resource:///modules/ExtensionSupport.sys.mjs");

// Thunderbird 128.0 より前はサポートしない
const { ThreadPaneColumns } = ChromeUtils.importESModule("chrome://messenger/content/ThreadPaneColumns.mjs");


var g_id_list = [];
var g_item = {};

var customSubject = class extends ExtensionCommon.ExtensionAPI {
  getAPI(context) {
    context.callOnClose(this);

    return {
      customSubject: {
        /**
         * 指定されたIDでカスタム列を追加する
         * @param {string} id
         * @param {string} name
         * @param {string} pattern
         * @param {string} replacedText
         */
        add(id, name, pattern, replacedText) {
          // 指定IDがすでに存在する場合は削除してから追加する
          if (g_id_list.includes(id)) {
            console.warn(`Column with ID ${id} already exists. Removed.`);
            this.remove(id);
          }
          console.log('add', id, name, pattern, replacedText);
          
          g_id_list.push(id);

          g_item = {
            name: name,
            pattern: pattern,
            replacedText: replacedText,
            regexp: new RegExp(pattern, 'g'),
          };

          function getCustomizedSubject(message) {
            if (g_item.regexp) {
              return message.mime2DecodedSubject.replace(g_item.regexp, g_item.replacedText);
            }
            return message.mime2DecodedSubject;
          }

          ThreadPaneColumns.addCustomColumn(id, {
            name: name,
            hidden: false,
            icon: false,
            resizable: true,
            sortable: true,
            textCallback: getCustomizedSubject,
          });
        },

        /**
         * 指定されたIDのカスタム列を削除する
         * @param {string} id
         */
        remove(id) {
          // 指定IDが存在しない場合は終了
          if (!g_id_list.includes(id)) {
            console.warn(`Column with ID ${id} does not exist.`);
            return;
          }
          console.log('remove', id);

          try {
            ThreadPaneColumns.removeCustomColumn(id);
          } catch (e) {
            console.error(e);
          }
          browser.storage.sync.remove({
            json: JSON.stringify(items),
            version: 1.0,
          });
          g_id_list = g_id_list.filter(e => e !== id);
        },

        /**
         * 保存されている設定を読み込む
         */
        load() {
          var savedItems = browser.storage.sync.get({
            json: '{}',
            version: 1.0,
          });
          savedItems.then((res) => {
            const items = JSON.parse(res.json);
            for (const id in items) {
              const item = items[id];
              this.add(id, item.columnName, item.pattern, item.replacedText);
            }
          });
        },

        /** 保存時のキー文字列を生成 */
        getKeyString(id) {
          const idPrefix = "CustomSubjectColumn_";
          return idPrefix + id;
        }
      },
    };
  }

  /**
   * 拡張機能が閉じられたときに呼び出される
   */
  close() {
    // 現時点のIDリストのコピーを作成
    const currentIdList = g_id_list.slice();
    for (const id of currentIdList){
      try {
        // 指定IDの列が存在するか確認してから削除
        if (ThreadPaneColumns.getCustomColun && ThreadPaneColumns.getCustomColumn(id)) {
          ThreadPaneColumns.removeCustomColumn(id);
        }
      } catch (e) {
        console.error(e);
      }
    }

    // IDリストをクリア
    g_id_list = [];
  }
};
