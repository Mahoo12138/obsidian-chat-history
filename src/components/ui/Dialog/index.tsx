import React, { forwardRef, useImperativeHandle, useState } from 'react';

interface DialogProps {
  title: string;
  inputLabel: string;
  confirmText?: string;
  onConfirm: (value: string) => void;
}

export interface DialogHandle {
  open: () => void;
}

export const Dialog = forwardRef<DialogHandle, DialogProps>(({ 
  title,
  inputLabel,
  confirmText = '确认',
  onConfirm 
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useImperativeHandle(ref, () => ({
    open: () => {
      setIsOpen(true);
      setInputValue('');
    }
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(inputValue);
    setIsOpen(false);
  };

  return (
    <dialog open={isOpen} className="dialog">
      <form method="dialog" onSubmit={handleSubmit}>
        <h3>{title}</h3>
        <label>
          {inputLabel}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            autoFocus
          />
        </label>
        <div className="dialog-buttons">
          <button type="submit">{confirmText}</button>
          <button type="button" onClick={() => setIsOpen(false)}>取消</button>
        </div>
      </form>
    </dialog>
  );
});