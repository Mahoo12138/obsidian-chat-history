import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogHandle } from '@/components/ui/Dialog';
import { MessageContent, ContentBlock } from '@/lib/type';

interface MessageEditorProps {
  initialContent?: MessageContent;
  onSave: (content: MessageContent) => void;
}

export const MessageEditor: React.FC<MessageEditorProps> = ({ initialContent, onSave }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);

  const imageDialogRef = useRef<DialogHandle>(null);
  const mentionDialogRef = useRef<DialogHandle>(null);

  // 在组件顶部新增 ref
  const savedRangeRef = useRef<Range | null>(null);

  // 初始化内容转换
  useEffect(() => {
    if (!initialContent) return;

    const parsedBlocks = typeof initialContent === 'string'
      ? [{ type: 'text', value: initialContent }]
      : Array.isArray(initialContent)
        ? initialContent
        : [initialContent];

    setBlocks(parsedBlocks);
    updateEditorContent(parsedBlocks);
  }, [initialContent]);

  // 转换内容为可编辑HTML
  const blocksToHTML = (blocks: ContentBlock[]): string => {
    return blocks.map(block => {
      if (block.type === 'image') {
        return `<img src="${block.value}" class="inline-image" contenteditable="false" />`;
      }
      if (block.type === 'at') {
        return `<span class="mention" data-value="${block.value}" contenteditable="false">${block.value}</span>`;
      }
      return block.value;
    }).join(' ');
  };

  // 更新编辑器内容
  const updateEditorContent = (newBlocks: ContentBlock[]) => {
    if (!editorRef.current) return;
    editorRef.current.innerHTML = blocksToHTML(newBlocks);
  };

  // 解析编辑器内容为区块
  const parseEditorContent = (): ContentBlock[] => {
    if (!editorRef.current) return [];

    const newBlocks: ContentBlock[] = [];
    const walker = document.createTreeWalker(
      editorRef.current,
      NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT
    );

    let currentNode: Node | null = walker.currentNode;
    while (currentNode) {
      // 新增：跳过 mention 元素内的文本节点
      if (currentNode.parentElement?.classList.contains('mention')) {
        currentNode = walker.nextNode();
        continue;
      }

      if (currentNode.nodeType === Node.TEXT_NODE) {
        const text = currentNode.textContent?.trim();
        if (text) {
          newBlocks.push({ type: 'text', value: text });
        }
      }
      else if (currentNode instanceof HTMLElement) {
        if (currentNode.classList.contains('inline-image')) {
          const src = currentNode.getAttribute('src');
          if (src) {
            newBlocks.push({ type: 'image', value: src });
          }
        }
        else if (currentNode.classList.contains('mention')) {
          const value = currentNode.getAttribute('data-value');
          if (value) {
            newBlocks.push({ type: 'at', value });
          }
        }
      }
      currentNode = walker.nextNode();
    }

    return newBlocks;
  };

  // 新增处理函数
  const handleInsertImage = (url: string) => {
    if (!url) return;

    const img = document.createElement('img');
    img.className = 'inline-image';
    img.src = url;
    img.contentEditable = 'false';

    // 恢复选区
    if (savedRangeRef.current) {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(savedRangeRef.current);
      savedRangeRef.current.insertNode(img);
    }

    const range = window.getSelection()?.getRangeAt(0);
    if (range) {
      range.insertNode(img);
      range.collapse(false);
      setBlocks(parseEditorContent());
      editorRef.current?.focus();
    }
  };

  const handleInsertMention = (username: string) => {
    if (!username) return;

    const atSpan = document.createElement('span');
    atSpan.className = 'mention';
    atSpan.textContent = `@${username}`;
    atSpan.dataset.value = `@${username}`;
    atSpan.contentEditable = 'false';

    // 恢复选区
    if (savedRangeRef.current) {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(savedRangeRef.current);
      savedRangeRef.current.insertNode(atSpan);
      savedRangeRef.current.collapse(false);
    }

    const range = window.getSelection()?.getRangeAt(0);
    if (range) {
      range.insertNode(atSpan);
      range.collapse(false);
      setBlocks(parseEditorContent());
      editorRef.current?.focus();
    }
  };

  // 修改 insertContent 方法
  const insertContent = (type: ContentBlock['type']) => {
    // 保存当前选区
    const selection = window.getSelection();
    if (selection?.rangeCount) {
      savedRangeRef.current = selection.getRangeAt(0).cloneRange();
    }

    if (type === 'image') {
      imageDialogRef.current?.open();
    } else if (type === 'at') {
      mentionDialogRef.current?.open();
    }
  };

  // 保存处理
  const handleSave = () => {
    const finalBlocks = parseEditorContent();
    const finalContent = finalBlocks.length === 1 && finalBlocks[0].type === 'text'
      ? finalBlocks[0].value
      : finalBlocks;

    onSave(finalContent);
    setBlocks([]);
    if (editorRef.current) editorRef.current.innerHTML = '';
  };

  return (
    <div className="rich-editor">
      {/* 新增 Dialog 组件 */}
      <Dialog
        ref={imageDialogRef}
        title="插入图片"
        inputLabel="图片 URL"
        confirmText="插入"
        onConfirm={handleInsertImage}
      />
      <Dialog
        ref={mentionDialogRef}
        title="提及用户"
        inputLabel="用户名"
        confirmText="提及"
        onConfirm={handleInsertMention}
      />
      <div className="toolbar">
        <button type="button" onClick={() => insertContent('image')}>🖼️ 图片</button>
        <button type="button" onClick={() => insertContent('at')}>@ 提及</button>
      </div>

      <div
        ref={editorRef}
        className="editor-content"
        contentEditable
        onInput={() => setBlocks(parseEditorContent())}
        onPaste={(e) => {
          // 处理图片粘贴
          const items = e.clipboardData?.items;
          if (items) {
            for (let i = 0; i < items.length; i++) {
              if (items[i].type.includes('image')) {
                const file = items[i].getAsFile();
                if (file) {
                  // 这里可以添加图片上传逻辑
                  const url = URL.createObjectURL(file);
                  insertContent('image');
                  e.preventDefault();
                }
              }
            }
          }
        }}
      />

      <div className="footer">
        <button onClick={handleSave}>保存</button>
      </div>
    </div>
  );
};