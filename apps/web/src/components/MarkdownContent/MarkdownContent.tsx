import ReactMarkdown from 'react-markdown';

import { StyledMarkdown } from './styles';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <StyledMarkdown className={className}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </StyledMarkdown>
  );
}
