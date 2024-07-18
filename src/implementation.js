var { ExtensionCommon } = ChromeUtils.import("resource://gre/modules/ExtensionCommon.jsm");
var { ExtensionSupport } = ChromeUtils.import("resource:///modules/ExtensionSupport.jsm");
const { ThreadPaneColumns } = ChromeUtils.importESModule("chrome://messenger/content/ThreadPaneColumns.mjs");

// // Before Thunderbird 115.*
// ChromeUtils.defineESModuleGetters(this, {
//   ThreadPaneColumns: "chrome://messenger/content/thread-pane-columns.mjs",
// });

// try {
//   if (typeof ThreadPaneColumns === "undefined") {
//     console.error("thread-pane-columns.mjs is not exists.");
//     throw new Error("thread-pane-columns.mjs is not exists.");
//   }
// } catch (e) {
//   // After Thunderbird 128.0
//   ChromeUtils.defineESModuleGetters(this, {
//     ThreadPaneColumns: "chrome://messenger/content/ThreadPaneColumns.mjs",
//   });
// }

var g_id_list = [];
var g_item = {};

var customSubject = class extends ExtensionCommon.ExtensionAPI {
  getAPI(context) {
    context.callOnClose(this);
    return {
      customSubject: {
        async add(id, name, pattern, replacedText) {
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

        async remove(id) {
          try {
            ThreadPaneColumns.removeCustomColumn(id);
          } catch (e) {
            console.error(e);
          }
          g_id_list = g_id_list.filter(e => e !== id);
        },
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
