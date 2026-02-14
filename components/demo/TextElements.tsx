interface TextElementsProps {
  showBold?: boolean;
  showItalic?: boolean;
  showCode?: boolean;
  showMuted?: boolean;
  showSmall?: boolean;
}

export function BlogTextElements({ 
  showBold = true,
  showItalic = true, 
  showCode = true,
  showMuted = true,
  showSmall = true,
}: TextElementsProps) {
  return (
    <div className="space-y-2 text-sm">
      {showBold && <p><strong>bold text</strong></p>}
      {showItalic && <p><em>italic text</em></p>}
      {showCode && <p><code>inline code</code></p>}
      {showMuted && <p className="text-muted-foreground">muted/secondary text</p>}
      {showSmall && <p className="text-xs">extra small text</p>}
    </div>
  );
}
