import * as CodeMirror from 'codemirror';
import 'codemirror/addon/display/fullscreen';
import 'codemirror/addon/scroll/simplescrollbars';

import './language-shake';
import { apply_to_select } from './select'

// @ts-ignore
const shake_versions = require('./shake-versions.json');

const interpreters: any = {};

async function getShakeInterpreter(file: string): Promise<{ execute(source: String, input: String) : void; }> {

  if(!interpreters[file]) {

    // @ts-ignore
    interpreters[file] = await import(
      /* webpackInclude: /\.js$/ */
      /* webpackChunkName: 'commit-entry-' */
      /* webpackMode: 'lazy' */
      /* webpackPrefetch: true */
      /* webpackPreload: true */
      `./shake/${file}`
    );

    if(interpreters[file].addInterpreterFileFromUrl) {
      await interpreters[file].addInterpreterFileFromUrl('core/system.shake', './assets/shake/core/system.shake');
    }
  }

  return {
    execute(source: String, input: String) {
      if(!interpreters[file].addInterpreterFileFromUrl)
        console.warn(`This shake version seems not to allow API imports, so the core API can't be imported [used verion: ${file}]`)
      interpreters[file].execute(source, input)
    }
  };

}

document.addEventListener('DOMContentLoaded', () => {

  const shake_version_select = document.getElementById('shake-version-select') as HTMLSelectElement;

  shake_versions.forEach((e: any) => {
    const option = document.createElement('option') as HTMLOptionElement;
    option.value = e.file;
    option.innerText = e.commit;
    shake_version_select.appendChild(option);
  });
  
  const shake_version_select_outer = document.getElementById('shake-version-select-outer') as HTMLDivElement;
  apply_to_select(shake_version_select_outer)

  const editor = CodeMirror.fromTextArea(
    document.getElementById('try-shake') as HTMLTextAreaElement,
    {
      mode: 'shake',
      tabSize: 2,
      lineNumbers: false,
      //firstLineNumber: 1,
      extraKeys: {
        'Ctrl-Space': 'autocomplete',
        'Alt-F': 'findPersistent',
        'F11': function(cm) {
          cm.setOption('fullScreen', !cm.getOption('fullScreen'));
        },
        'Esc': function(cm) {
          if (cm.getOption('fullScreen')) cm.setOption('fullScreen', false);
        },
      },
      lineWrapping: true,
      scrollbarStyle: 'simple',
      theme: 'darcula'
    });

   const divConsole = new DivConsole(document.getElementById('shake-output') as HTMLDivElement);

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

  document.getElementById('try-shake-execute-button').addEventListener('click', async function() {

    divConsole.clear();
    const { undoCaptureConsoleLog } = captureConsoleLog();

    const interpreter = await getShakeInterpreter(shake_version_select.value);
    try {

      // Get shake interpreter
      interpreter.execute('<Try Shake>', editor.getValue());

    } catch (e) {
       if(e.marker) e.toString = function() {
          return `${this.name}: ${this.details}\n\nat ${this.marker.source}\n${this.marker.preview}\n${this.marker.marker}'\n`;
       }
       console.error('Shake code execution threw an error', e);
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
      message.forEach(e => `${e}`.split('\n').forEach(m => {
         const p = document.createElement('p');
         p.classList.add(classname);
         p.innerHTML = formatHTMLString(m);
         this.println(p);
      }));
   }

   public log(...message: string[]) { this.general_log('console-log', ...message) }
   public warn(...message: string[]) { this.general_log('console-warn', ...message) }
   public error(...message: string[]) { this.general_log('console-error', ...message) }
   public debug(...message: string[]) { this.general_log('console-debug', ...message) }

   public println(e: HTMLElement | string): void {
      if(typeof e == 'string') {
         const div = document.createElement('div');
         div.innerHTML = e.trim();
         return div.childNodes.forEach(e => this.println(e as HTMLElement));
      }
      else {
         this.div.appendChild(e);
      }
   }

   public clear() {
      this.setConsoleOutput('');
   }

   public setConsoleOutput(e: string) {
      this.div.innerHTML = formatHTMLString(e);

   }

}

function formatHTMLString(str: string): string {
   return str.toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/'/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/ /g, '&nbsp;')
}