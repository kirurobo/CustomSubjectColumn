"use strict";

(function (exports) {

const { ExtensionCommon } = ChromeUtils.import("resource://gre/modules/ExtensionCommon.jsm");
const { ExtensionSupport } = ChromeUtils.import("resource:///modules/ExtensionSupport.jsm");

// After Thunderbird 128.0
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
        async add(id, name, pattern, replacedText) {
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
        async remove(id) {
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
        async load() {
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

  close() {
    for (const id of g_id_list)
    {
      try {
        ThreadPaneColumns.removeCustomColumn(id);
      } catch (e) {
        console.error(e);
      }
    }
  }
};

exports.customSubject = customSubject;

})(this);