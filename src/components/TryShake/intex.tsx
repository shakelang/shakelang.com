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
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

console.log(shake_versions);

export function TryShake() {
  const [value, setValue] = React.useState('println("hello world");');
  const onChange = React.useCallback((val, viewUpdate) => {
    setValue(val);
  }, []);

  const [shakeVersion, setShakeVersion] = React.useState(shake_versions[0]);

  const [shakeInterpreter, setShakeInterpreter] = React.useState<{
    execute(source: String, input: String): void;
  }>();

  React.useEffect(() => {
    getShakeInterpreter(shakeVersion.file).then((interpreter) => {
      setShakeInterpreter(interpreter);
    });
  }, [shakeVersion]);

  return (
    <div id="try-shake-outer">
      <h2>Try Shake</h2>

      <div id="shake-version-select-outer" className="custom-select">
        <FormControl fullWidth>
          <InputLabel id="shake-version-select-label">Shake Version</InputLabel>
          <Select
            labelId="shake-version-select-label"
            id="shake-version-select"
            value={shakeVersion.file}
            label="shake-version-select-label"
            key={shakeVersion.commit}
            onChange={(e) => {
              const value = e.target.value;
              shake_versions.forEach((version) => {
                if (version.file === value) setShakeVersion(version);
              });
            }}
          >
            {shake_versions.map((version) => (
              <MenuItem key={version.commit} value={version.file}>
                {version.commit}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <select
          name="shake-version-select"
          title="shake-version-select"
          id="shake-version-select"
        >
          {shake_versions.map((version) => (
            <option key={version.commit} value={version.file}>
              {version.commit}
            </option>
          ))}
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
          />
          <button
            type="button"
            title="play"
            id="try-shake-execute-button"
            onClick={() => {
              if (shakeInterpreter) {
                shakeInterpreter.execute(value, "");
              }
            }}
          >
            <Icon path={mdiPlay} color="#fff" size={1} />
          </button>
        </div>
        <div id="shake-output"></div>
      </div>
    </div>
  );
}
