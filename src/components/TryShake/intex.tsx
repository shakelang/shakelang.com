import "./index.scss";
import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import "./language-shake";
import Icon from "@mdi/react";
import { mdiPlay } from "@mdi/js";
import { StreamLanguage } from "@codemirror/language";
import { shake } from "./language-shake";
import "./codemirror-theme.scss";
import { shake_versions, getShakeInterpreter, LogEntry } from "./shake";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export function TryShake() {
  const [value, setValue] = React.useState('println("hello world");');
  const onChange = React.useCallback((val, viewUpdate) => {
    setValue(val);
  }, []);

  const [shakeVersion, setShakeVersion] = React.useState(shake_versions[0]);

  const [shakeInterpreter, setShakeInterpreter] = React.useState<{
    execute(source: String, input: String): LogEntry[];
  }>();

  const [shakeOutput, setShakeOutput] = React.useState<LogEntry[]>([]);

  React.useEffect(() => {
    getShakeInterpreter(shakeVersion.file).then((interpreter) => {
      console.log("shakeVersion", shakeVersion);
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
            style={{
              width: "100%",
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
                const result = shakeInterpreter.execute("", value);
                setShakeOutput(result);
              }
            }}
          >
            <Icon path={mdiPlay} color="#fff" size={1} />
          </button>
        </div>
        <div id="shake-output">
          {shakeOutput.map((entry) => (
            <p className={`console-${entry.type}`}>{entry.message}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
