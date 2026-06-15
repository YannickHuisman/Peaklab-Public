import MDEditor from '@uiw/react-md-editor';

import { StyledEditorWrapper, StyledMDEditorGlobal } from './styles';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder,
  minHeight = 160,
}: MarkdownEditorProps) {
  return (
    <StyledEditorWrapper>
      <StyledMDEditorGlobal />
      <MDEditor
        value={value}
        onChange={(val) => onChange(val ?? '')}
        preview="edit"
        hideToolbar={false}
        height={minHeight}
        textareaProps={{ placeholder }}
        visibleDragbar={false}
      />
    </StyledEditorWrapper>
  );
}
