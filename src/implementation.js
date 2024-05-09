var { ExtensionCommon } = ChromeUtils.import("resource://gre/modules/ExtensionCommon.jsm");
var { ExtensionSupport } = ChromeUtils.import("resource:///modules/ExtensionSupport.jsm");
const { ThreadPaneColumns } = ChromeUtils.importESModule("chrome://messenger/content/thread-pane-columns.mjs");

const ids = [];

var customSubject = class extends ExtensionCommon.ExtensionAPI {
  getAPI(context) {
    context.callOnClose(this);
    return {
      customSubject: {
        async add(id, name) {
          ids.push(id);

          function getCustomizedSubject(message) {
            //return message.mime2DecodedSubject.replace(/^\[[^\]]*\]/, "");
            return message.mime2DecodedSubject.replace(/^F[0-9A-Z]+ - THREAT ALERT : /, "");
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
          ids.remove(id);
        }
      },
    };
  }

  close() {
    for (const id of ids)
    {
      ThreadPaneColumns.removeCustomColumn(id);
    }
  }
};
