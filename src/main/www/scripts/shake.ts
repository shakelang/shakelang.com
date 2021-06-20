import CodeMirror = require("codemirror");
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/display/fullscreen';
import 'codemirror/addon/scroll/simplescrollbars';

import './language-shake';

// Shake Library
require('./shake_environment.js')

document.addEventListener('DOMContentLoaded', () => {
  const editor = CodeMirror.fromTextArea(
    <HTMLTextAreaElement>document.getElementById('try-shake'),
    {
      mode: 'shake',
      tabSize: 2,
      lineNumbers: true,
      firstLineNumber: 1,
      extraKeys: {
        "Ctrl-Space": "autocomplete",
        "Alt-F": "findPersistent",
        "F11": function(cm) {
          cm.setOption("fullScreen", !cm.getOption("fullScreen"));
        },
        "Esc": function(cm) {
          if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
        },
        /*
        "Ctrl-Q": function(cm) {
          cm.foldCode(cm.getCursor());
        }
         */
      },
      lineWrapping: true,
      // foldGutter: true,
      gutters: [
        "CodeMirror-linenumbers",
        "breakpoints",
        "CodeMirror-foldgutter"
      ],
      scrollbarStyle: "simple",
      theme: "default"
    });
}, false);