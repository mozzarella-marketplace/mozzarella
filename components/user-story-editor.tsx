"use client";

import type { FC } from "react";
import {
  Color,
  FontFamily,
  FontSize,
  TextStyle,
} from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import { Placeholder } from "@tiptap/extensions";
import {
  EditorContent,
  useEditor,
  useEditorState,
  type Editor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Strikethrough,
  Underline,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { defaultLocale } from "@/consts/locales";
import { getMessages } from "@/lib/i18n/messages";

type TextAlignment = "start" | "center" | "end" | "justify";

type TextStyleSetting = "fontFamily" | "fontSize" | "color";

type TextStyleOption = { key: string; value: string | null };

type UserStoryEditorProps = {
  labelId: string;
  initialContent: string;
  placeholder: string;
  onChange: (update: { html: string; isEmpty: boolean }) => void;
};

// A null value removes the attribute, so the text falls back to the editor's own style.
const textStyleOptions: Record<TextStyleSetting, TextStyleOption[]> = {
  fontFamily: [
    { key: "default", value: null },
    { key: "serif", value: "serif" },
    { key: "mono", value: "monospace" },
  ],
  fontSize: [
    { key: "small", value: "0.875rem" },
    { key: "default", value: null },
    { key: "large", value: "1.25rem" },
    { key: "huge", value: "1.5rem" },
  ],
  color: [
    { key: "default", value: null },
    { key: "primary", value: "var(--token-color-primary)" },
    { key: "red", value: "var(--token-color-destructive)" },
    { key: "green", value: "var(--token-color-success)" },
    { key: "brown", value: "var(--token-color-accent-strong)" },
  ],
};

const textStyleSettings: TextStyleSetting[] = [
  "fontFamily",
  "fontSize",
  "color",
];

const isRightToLeft = defaultLocale.direction === "rtl";

const alignmentIcons: Record<TextAlignment, LucideIcon> = {
  start: isRightToLeft ? AlignRight : AlignLeft,
  center: AlignCenter,
  end: isRightToLeft ? AlignLeft : AlignRight,
  justify: AlignJustify,
};

const alignments: TextAlignment[] = ["start", "center", "end", "justify"];

const toolbarButtonClassName =
  "text-muted hover:bg-border hover:text-primary aria-pressed:bg-border aria-pressed:text-primary";

const getTextStyleOption = (editor: Editor, setting: TextStyleSetting) => {
  const currentValue = editor.getAttributes("textStyle")[setting] ?? null;

  return (
    textStyleOptions[setting].find(({ value }) => value === currentValue)
      ?.key ?? "default"
  );
};

const applyTextStyleOption = (
  editor: Editor,
  setting: TextStyleSetting,
  optionKey: string,
) => {
  const option = textStyleOptions[setting].find(({ key }) => key === optionKey);

  if (!option) {
    return;
  }

  editor

    .chain()

    .focus()

    .setMark("textStyle", { [setting]: option.value })

    .removeEmptyTextStyle()

    .run();
};

const EditorToolbar: FC<{ editor: Editor }> = ({ editor }) => {
  const messages = getMessages().userStory.editor;
  const editorState = useEditorState({
    editor,
    selector: ({ editor: currentEditor }) => ({
      isBold: currentEditor.isActive("bold"),
      isItalic: currentEditor.isActive("italic"),
      isUnderline: currentEditor.isActive("underline"),
      isStrike: currentEditor.isActive("strike"),
      alignment:
        alignments.find((alignment) =>
          currentEditor.isActive({ textAlign: alignment }),
        ) ?? "start",
      textStyle: {
        fontFamily: getTextStyleOption(currentEditor, "fontFamily"),
        fontSize: getTextStyleOption(currentEditor, "fontSize"),
        color: getTextStyleOption(currentEditor, "color"),
      },
    }),
  });

  const markButtons = [
    {
      label: messages.bold,
      icon: Bold,
      isActive: editorState.isBold,
      toggle: () => editor.chain().focus().toggleBold().run(),
    },
    {
      label: messages.italic,
      icon: Italic,
      isActive: editorState.isItalic,
      toggle: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: messages.underline,
      icon: Underline,
      isActive: editorState.isUnderline,
      toggle: () => editor.chain().focus().toggleUnderline().run(),
    },
    {
      label: messages.strike,
      icon: Strikethrough,
      isActive: editorState.isStrike,
      toggle: () => editor.chain().focus().toggleStrike().run(),
    },
  ];

  return (
    <div
      role="toolbar"
      aria-label={messages.toolbar}
      className="flex items-center gap-0.5 overflow-x-auto border-b border-border p-1"
    >
      {markButtons.map(({ label, icon: Icon, isActive, toggle }) => (
        <Button
          key={label}
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={label}
          aria-pressed={isActive}
          onClick={toggle}
          className={toolbarButtonClassName}
        >
          <Icon aria-hidden />
        </Button>
      ))}

      <span aria-hidden className="mx-0.5 h-5 w-px shrink-0 bg-border" />

      {alignments.map((alignment) => {
        const Icon = alignmentIcons[alignment];

        return (
          <Button
            key={alignment}
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={messages.alignments[alignment]}
            aria-pressed={editorState.alignment === alignment}
            onClick={() => editor.chain().focus().setTextAlign(alignment).run()}
            className={toolbarButtonClassName}
          >
            <Icon aria-hidden />
          </Button>
        );
      })}

      <span aria-hidden className="mx-0.5 h-5 w-px shrink-0 bg-border" />

      {textStyleSettings.map((setting) => {
        const optionLabels: Record<string, string> =
          messages.textStyles[setting].options;

        return (
          <Select
            key={setting}
            value={editorState.textStyle[setting]}
            onValueChange={(optionKey) =>
              applyTextStyleOption(editor, setting, optionKey)
            }
          >
            <SelectTrigger
              aria-label={messages.textStyles[setting].label}
              className="h-7 shrink-0 gap-1 border-none px-2 text-muted hover:bg-border"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              className={setting === "color" ? "min-w-0" : undefined}
              // Returning focus to the trigger would make the next click in the editor a new
              // selection, which drops a style picked for text that has not been typed yet.
              onCloseAutoFocus={(event) => {
                event.preventDefault();
                editor.commands.focus();
              }}
            >
              {textStyleOptions[setting].map(({ key, value }) => (
                <SelectItem
                  key={key}
                  value={key}
                  textValue={optionLabels[key]}
                  aria-label={optionLabels[key]}
                >
                  {setting === "color" ? (
                    <span
                      aria-hidden
                      className="block size-4 rounded-full ring-1 ring-foreground/20"
                      style={{ backgroundColor: value ?? "currentColor" }}
                    />
                  ) : (
                    optionLabels[key]
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      })}
    </div>
  );
};

export const UserStoryEditor: FC<UserStoryEditorProps> = ({
  labelId,
  initialContent,
  placeholder,
  onChange,
}) => {
  const editor = useEditor({
    // Rendering on the server would cause a hydration mismatch in the App Router.
    immediatelyRender: false,
    content: initialContent,
    extensions: [
      StarterKit,
      TextStyle,
      FontFamily,
      FontSize,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments,
        defaultAlignment: "start",
      }),
      Placeholder.configure({ placeholder }),
    ],
    editorProps: {
      attributes: {
        "aria-labelledby": labelId,
        "aria-multiline": "true",
        role: "textbox",
        class: "min-h-full px-3 py-2 text-body outline-none",
      },
    },
    onUpdate: ({ editor: updatedEditor }) =>
      onChange({
        html: updatedEditor.getHTML(),
        isEmpty: updatedEditor.isEmpty,
      }),
  });

  return (
    <div className="overflow-hidden rounded-control border border-border bg-background transition-colors focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/30">
      {editor && <EditorToolbar editor={editor} />}
      <EditorContent editor={editor} className="h-40 overflow-y-auto" />
    </div>
  );
};
