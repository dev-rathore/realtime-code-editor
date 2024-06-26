import React, { useEffect, useRef, useState } from 'react';
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

const Editor = ({ socketRef, roomId, onCodeChange, user }: any) => {
  const editorRef = useRef<any>(null);
  const [cursors, setCursors] = useState<any[]>([]);
  console.log('cursors:', cursors);
  console.log('user:', user);

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
            code,
            roomId,
          });
        }
      });

      editorRef.current.on('cursorActivity', (instance: any) => {
        const cursor = editorRef.current.getCursor();
        const cursorCoords = instance.cursorCoords(true, 'local');
        socketRef.current.emit(EVENTS.CURSOR_POSITION_CHANGE, {
          cursor,
          cursorCoords,
          roomId,
        });
      });
    }
    init();
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(EVENTS.CODE_CHANGE, ({
        code,
      }: any) => {
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }

    return () => {
      socketRef.current?.off(EVENTS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(EVENTS.CURSOR_POSITION_CHANGE, ({
        cursor,
        cursorCoords,
        socketId,
        user: u,
      }: any) => {
        const currentCursor = editorRef.current.getCursor();
        editorRef.current.setCursor(currentCursor);
        setCursors((prevCursors) => {
          const updatedCursors = prevCursors.filter((cur: any) => cur.socketId !== socketId);
          updatedCursors.push({ socketId, cursor, cursorCoords, u });
          return updatedCursors;
        });
      });

      socketRef.current.on(
        EVENTS.DISCONNECTED, ({
          socketId,
          user,
        }:{
          socketId: string;
          user: any;
        }) => {
          setCursors((prevCursors) => {
            const updatedCursors = prevCursors.filter((cur: any) => cur.socketId !== socketId);
            return updatedCursors;
          });
        }
      );
    }

    return () => {
      socketRef.current?.off(EVENTS.CURSOR_POSITION_CHANGE);
      socketRef.current?.off(EVENTS.DISCONNECTED);
    };
  }, [socketRef.current]);

  return (
    <div style={{ position: 'relative' }}>
      <textarea id="realtime-code-editor" />
      {cursors.map(({ socketId, cursorCoords, u }) => (
        u.username !== user.username && (
          <div
            key={socketId}
            style={{
              position: 'absolute',
              top: `${cursorCoords.top + 17}px`,
              left: `${cursorCoords.left + 30}px`,
            }}
          >
            <div className="custom-caret" style={{ backgroundColor: u.theme }}>
              <div className="custom-caret-head" style={{ backgroundColor: u.theme }} />
            </div>
            <div className="cursor-badge" style={{ backgroundColor: u.theme }}>
              {u.username}
            </div>
          </div>
        )
      ))}
    </div>
  );
};

export default Editor;
