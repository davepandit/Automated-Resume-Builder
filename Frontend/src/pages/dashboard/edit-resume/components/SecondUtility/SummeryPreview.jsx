import React from 'react'

function SummeryPreview({ resumeInfo }) {
  const fontFamily = resumeInfo?.fontFamily || 'Georgia, "Times New Roman", serif'
  const headingColor = resumeInfo?.themeColor || '#111827'

  return (
    <div className="my-6" style={{ fontFamily }}>
      {resumeInfo?.summary && resumeInfo.summary.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-3">
            <h2
              className="font-serif text-sm uppercase tracking-wider"
              style={{ color: headingColor, letterSpacing: '0.12em' }}
            >
              Summary
            </h2>
            <div
              style={{
                flex: 1,
                borderTop: '1px solid',
                borderColor: headingColor,
              }}
            />
          </div>
        </div>
      )}

      {resumeInfo?.summary && (
        <div
          className="text-sm my-2"
          style={{ lineHeight: 1.6, color: '#111827' }}
          dangerouslySetInnerHTML={{ __html: resumeInfo.summary }}
        />
      )}
    </div>
  )
}

export default SummeryPreview