var { ExtensionCommon } = ChromeUtils.import("resource://gre/modules/ExtensionCommon.jsm");
var { ExtensionSupport } = ChromeUtils.import("resource:///modules/ExtensionSupport.jsm");
const { ThreadPaneColumns } = ChromeUtils.importESModule("chrome://messenger/content/thread-pane-columns.mjs");

var ids = [];
var g_item = {};

var customSubject = class extends ExtensionCommon.ExtensionAPI {
  getAPI(context) {
    context.callOnClose(this);
    return {
      customSubject: {
        async add(id, name, pattern, replacedText) {
          ids.push(id);

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
          ThreadPaneColumns.removeCustomColumn(id);
          //ids.remove(id);
          ids = ids.filter(e => e !== id);
        },
      },
    };
  }

  close() {
    for (const id of ids)
    {
      try {
        ThreadPaneColumns.removeCustomColumn(id);
      } catch (e) {
        console.error(e);
      }
    }
  }
};
