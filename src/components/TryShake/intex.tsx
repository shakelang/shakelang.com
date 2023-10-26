import "./index.scss";
import React, { useState } from "react";
import CodeMirror, { Extension } from "@uiw/react-codemirror";
import "./language-shake";
import { darcula } from "@uiw/codemirror-theme-darcula";
import Icon from "@mdi/react";
import { mdiPlay } from "@mdi/js";
import { shake } from "./language-shake";

// @ts-ignore
// const shake_versions = require("./shake-versions.json");

export function TryShake() {
  const [value, setValue] = React.useState('println("hello world");');
  const onChange = React.useCallback((val, viewUpdate) => {
    setValue(val);
  }, []);
  return (
    <>
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
            extensions={[]}
            onChange={onChange}
            // tabSize={2}
            // lineNumbers={false}
            //firstLineNumber: 1,
            /*extraKeys={{
              "Ctrl-Space": "autocomplete",
              "Alt-F": "findPersistent",
              F11: function (cm) {
                cm.setOption("fullScreen", !cm.getOption("fullScreen"));
              },
              Esc: function (cm) {
                if (cm.getOption("fullScreen"))
                  cm.setOption("fullScreen", false);
              },
            }}*/
            //lineWrapping={true}
            //scrollbarStyle="simple"
            theme={darcula}
          />
          <button type="button" title="play" id="try-shake-execute-button">
            <Icon path={mdiPlay} size={1} />
          </button>
        </div>
        <div id="shake-output"></div>
      </div>
    </>
  );
}
