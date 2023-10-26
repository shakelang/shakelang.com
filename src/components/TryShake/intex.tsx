import "./index.scss";
import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import "./language-shake";
import Icon from "@mdi/react";
import { mdiPlay } from "@mdi/js";
import { StreamLanguage } from "@codemirror/language";
import { shake } from "./language-shake";
import "./codemirror-theme.scss";
import { shake_versions, getShakeInterpreter } from "./shake";

console.log(shake_versions);

export function TryShake() {
  const [value, setValue] = React.useState('println("hello world");');
  const onChange = React.useCallback((val, viewUpdate) => {
    setValue(val);
  }, []);

  return (
    <div id="try-shake-outer">
      <h2>Try Shake</h2>

      <div id="shake-version-select-outer" className="custom-select">
        <select
          name="shake-version-select"
          title="shake-version-select"
          id="shake-version-select"
        >
          {/*shake_versions.map((version) => {
            <option value={version.file}>{version.commit}</option>;
          })*/}
        </select>
      </div>
      <div id="try-shake-region">
        <div id="try-shake-editor-region">
          <CodeMirror
            value={value}
            height="200px"
            basicSetup={{
              tabSize: 2,
              lineNumbers: false,
              foldKeymap: true,
              autocompletion: true,
              foldGutter: false,
              highlightActiveLineGutter: false,
              highlightActiveLine: false,
            }}
            extensions={[StreamLanguage.define(shake)]}
            onChange={onChange}
            style={{}}
          />
          <button type="button" title="play" id="try-shake-execute-button">
            <Icon path={mdiPlay} color="#fff" size={1} />
          </button>
        </div>
        <div id="shake-output"></div>
      </div>
    </div>
  );
}
