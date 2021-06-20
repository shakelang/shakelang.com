import CodeMirror = require("codemirror");
import 'codemirror/addon/display/fullscreen';
import 'codemirror/addon/scroll/simplescrollbars';

import './language-shake';

// Shake Library
const interpreter: { execute(source: String, input: String) : void; } = require('./shake_environment.js')
declare const global: { interpreter: any }

global.interpreter = interpreter;

document.addEventListener('DOMContentLoaded', () => {
  const editor = CodeMirror.fromTextArea(
    <HTMLTextAreaElement>document.getElementById('try-shake'),
    {
      mode: 'shake',
      tabSize: 2,
      lineNumbers: false,
      //firstLineNumber: 1,
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
      /*
      gutters: [

        "CodeMirror-linenumbers",
        "breakpoints",
        "CodeMirror-foldgutter"
      ],
      */
      scrollbarStyle: "simple",
      theme: "darcula"
    });

  document.getElementById("try-shake-execute-button").addEventListener('click', function() {
    try {
      interpreter.execute("<Try Shake>", editor.getValue());
    } catch (e) {
        console.log(e);
      document.getElementById("shake-output").innerText = e.message;
    }
  });
}, false);