"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type Props = {
  content: string;
  onChange: (value: string) => void;
};

export default function TiptapEditor({ content, onChange }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link:{
          openOnClick: true,
          autolink: true,
          linkOnPaste: true,
        }
      }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "tiptap-content",
      },
    },
    autofocus: false,
    editable: true,
    immediatelyRender: false,
  });

  if (!mounted || !editor) return null;

  return (
    <div className="tiptap-editor-wrapper">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

const MenuBar = ({ editor }: { editor: Editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="tiptap-menu-bar" aria-label="Text formatieren">
      <div className="tiptap-toolbar-group">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
        type="button"
      ><strong>B</strong><span>Fett</span></button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "is-active" : ""}
        type="button"
      ><em>I</em><span>Kursiv</span></button>
      </div>

      <div className="tiptap-toolbar-group">
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}
        type="button"
      >H1</button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
        type="button"
      >H2</button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive("heading", { level: 3 }) ? "is-active" : ""}
        type="button"
      >H3</button>
      </div>

      <div className="tiptap-toolbar-group">
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive("bulletList") ? "is-active" : ""} type="button">• Liste</button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive("orderedList") ? "is-active" : ""} type="button">1. Liste</button>
        <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive("blockquote") ? "is-active" : ""} type="button">Zitat</button>
      </div>

      <div className="tiptap-toolbar-group">
      <button
        onClick={() => {
          const url = window.prompt("Link-Adresse eingeben");
          if (url) {
            editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
          }
        }}
        className={editor.isActive("link") ? "is-active" : ""}
        type="button"
      >Link</button>

      <button
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive("link")}
        type="button"
      >Link lösen</button>
      </div>

      <div className="tiptap-toolbar-group tiptap-history">
        <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} type="button" aria-label="Rückgängig">↶</button>
        <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} type="button" aria-label="Wiederholen">↷</button>
      </div>
    </div>
  );
};
