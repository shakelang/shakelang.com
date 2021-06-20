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

   const divConsole = new DivConsole(<HTMLDivElement> document.getElementById("shake-output"));

  function captureConsoleLog() {
    const log = console.log;
    const warn = console.warn;
    const error = console.error;
    const debug = console.debug;
    const clear = console.clear;
    console.log = function (message) {
       log.apply(console, arguments);
       divConsole.log.apply(divConsole, arguments);
    }
    console.warn = function (message) {
       warn.apply(console, arguments);
       divConsole.warn.apply(divConsole, arguments);
    }
    console.error = function (message) {
       error.apply(console, arguments);
       divConsole.error.apply(divConsole, arguments);
    }
    console.debug = function (message) {
       debug.apply(console, arguments);
       divConsole.debug.apply(divConsole, arguments);
    }
    console.clear = function () {
       clear.apply(console, arguments);
       divConsole.clear.apply(divConsole, arguments);
    }
    return {
       undoCaptureConsoleLog: () => {
          console.log = log;
          console.warn = warn;
          console.error = error;
          console.debug = debug;
          console.clear = clear;
       }
    }



  }

  document.getElementById("try-shake-execute-button").addEventListener('click', function() {
    divConsole.clear();
    const { undoCaptureConsoleLog } = captureConsoleLog();
    try {
      interpreter.execute("<Try Shake>", editor.getValue());
    } catch (e) {
        console.error(
           "Shake code execution threw an error",
           `${e.name}: ${e.details}\n\nat ${e.marker.source}\n${e.marker.preview}\n${e.marker.marker}"\n`);
    } finally {
       undoCaptureConsoleLog();
    }
  });
}, false);

class DivConsole {

   constructor(
      private div: HTMLDivElement
   ) {}

   private general_log(classname: string, ...message: string[]) {
      message.forEach(m => {
         const p = document.createElement('p');
         p.classList.add(classname);
         p.innerHTML = formatHTMLString(m);
         this.println(p);
      });
   }

   public log(...message: string[]) { this.general_log("console-log", ...message) }
   public warn(...message: string[]) { this.general_log("console-warn", ...message) }
   public error(...message: string[]) { this.general_log("console-error", ...message) }
   public debug(...message: string[]) { this.general_log("console-debug", ...message) }

   public println(e: HTMLElement | string) {
      if(typeof e == "string") {
         const div = document.createElement('div');
         div.innerHTML = e.trim();
         return div.childNodes.forEach(e => this.println(<HTMLElement> e));
      }
      else {
         this.div.appendChild(e);
      }
   }

   public clear() {
      this.setConsoleOutput("");
   }

   public setConsoleOutput(e: string) {
      this.div.innerHTML = formatHTMLString(e);

   }

}

function formatHTMLString(str: string): string {
   return str.toString()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
      .replace(/ /g, "&nbsp;")
      .replace(/\n/g, "\n<br/>");
}