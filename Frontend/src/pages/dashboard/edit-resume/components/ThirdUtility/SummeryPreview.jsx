import React from 'react'

function SummeryPreview({ resumeInfo }) {
  return (
    <div style={{ margin: 0 }}>
      {resumeInfo?.summary && resumeInfo.summary.length > 0 && (
        <div style={{ margin: 0 }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              width: '100%',
            }}
          >
            <h2
              style={{
                color: resumeInfo?.themeColor || '#2e1350',
                margin: 0,
                padding: 0,
                fontSize: 14,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                textAlign: 'center',
              }}
            >
              Summary
            </h2>

            <div
              style={{
                width: '100%',
                height: 1.5,
                background: resumeInfo?.themeColor || '#2e1350',
                marginTop: 4,
                border: 'none',
              }}
            />
          </div>
        </div>
      )}

      {resumeInfo?.summary && (
        <div
          style={{ lineHeight: 1.5, marginTop: 8, marginBottom: 0, fontSize: 12 }}
          dangerouslySetInnerHTML={{ __html: resumeInfo.summary }}
        />
      )}
    </div>
  )
}

export default SummeryPreview