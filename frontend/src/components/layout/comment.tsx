import React from 'react';

/**
 * Comment
 *
 * Small, grey-ish container with rounded corners and italic text.
 * Designed for brief inline notes or asides.
 */
export type CommentProps = {
  /** Content to render inside the comment container */
  children: React.ReactNode;
  /** Optional additional class names to extend or override defaults */
  className?: string;
  /** Optional accessible label for screen readers */
  ariaLabel?: string;
};

export const Comment: React.FC<CommentProps> = ({
  children,
  className,
  ariaLabel,
}) => {
  return (
    <div
      role="note"
      aria-label={ariaLabel}
      style={{
        backgroundColor: 'var(--comment-color)',
        color: 'var(--space-latte)',
        border: '1px solid var(--comment-color)',
        borderRadius: '10px',
        width: '100%'
      }}
      className={[
        'px-2 py-1',
        'italic rounded-md',
        className ?? '',
      ].join(' ')}
    >
      {children}
    </div>
  );
};

export default Comment;
