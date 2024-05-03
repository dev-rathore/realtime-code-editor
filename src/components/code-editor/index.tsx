import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/material-darker.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import './code-editor.styles.css';
const EVENTS = require('@/socket-events/events.ts');

const Editor = ({
  socketRef,
  roomId,
  onCodeChange,
}: any) => {
  const editorRef = useRef<any>(null);
  useEffect(() => {
    async function init() {
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById('realtime-code-editor') as HTMLTextAreaElement,
        {
          autoCloseBrackets: true,
          autoCloseTags: true,
          lineNumbers: true,
          lineWrapping: true,
          mode: { name: 'javascript', json: true },
          tabSize: 2,
          theme: 'material-darker',
        }
      );

      editorRef.current.on('change', (instance: any, changes: any) => {
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if (origin !== 'setValue') {
          socketRef.current.emit(EVENTS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
      });
    }
    init();
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(EVENTS.CODE_CHANGE, ({ code }: any) => {
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }

    return () => {
      socketRef.current?.off(EVENTS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  return <textarea id="realtime-code-editor" />;
};

export default Editor;
