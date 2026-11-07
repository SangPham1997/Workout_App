import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <>
      <style>{`
        /* === Card — chỉ override màu/border/shadow, KHÔNG đụng layout === */
        [data-sonner-toast] {
          font-family: inherit !important;
          background: rgb(30 41 59 / 0.95) !important;
          border: 1px solid rgb(51 65 85 / 0.6) !important;
          border-left-width: 4px !important;
          border-radius: 14px !important;
          padding: 14px 16px !important;
          box-shadow:
            0 20px 40px -12px rgba(0, 0, 0, 0.55),
            0 0 0 1px rgba(51, 65, 85, 0.2) !important;
          backdrop-filter: blur(16px) !important;
          -webkit-backdrop-filter: blur(16px) !important;
          color: #e2e8f0 !important;
        }

        /* === Accent viền trái theo variant === */
        [data-sonner-toast][data-type="success"] { border-left-color: #10b981 !important; }
        [data-sonner-toast][data-type="error"]   { border-left-color: #f43f5e !important; }
        [data-sonner-toast][data-type="warning"] { border-left-color: #f59e0b !important; }
        [data-sonner-toast][data-type="info"]    { border-left-color: #0ea5e9 !important; }
        [data-sonner-toast][data-type="loading"] { border-left-color: #64748b !important; }

        /* === Icon — giữ slot 20x20 của sonner, chỉ thêm màu === */
        [data-sonner-toast] [data-icon] svg,
        [data-sonner-toast] [data-icon] i {
          font-size: 20px !important;
          width: 20px !important;
          height: 20px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        /* === Title === */
        [data-sonner-toast] [data-title] {
          font-size: 14px !important;
          font-weight: 600 !important;
          color: #f8fafc !important;
          line-height: 1.4 !important;
          letter-spacing: 0 !important;
        }

        /* === Description === */
        [data-sonner-toast] [data-description] {
          font-size: 12px !important;
          color: #94a3b8 !important;
          line-height: 1.5 !important;
          margin-top: 2px !important;
        }

        /* === Close button — ẩn, chỉ hiện khi hover === */
        [data-sonner-toast] [data-close-button] {
          opacity: 0;
          transition: opacity 150ms ease, background 150ms ease, color 150ms ease !important;
          background: rgb(51 65 85) !important;
          border: 1px solid rgb(71 85 105) !important;
          color: #cbd5e1 !important;
        }
        [data-sonner-toast]:hover [data-close-button] {
          opacity: 1;
        }
        [data-sonner-toast] [data-close-button]:hover {
          background: rgb(71 85 105) !important;
          color: #fff !important;
        }

        /* === Action / Cancel button === */
        [data-sonner-toast] [data-button] {
          border-radius: 8px !important;
          font-weight: 600 !important;
          font-size: 12px !important;
          padding: 6px 12px !important;
          height: auto !important;
        }
      `}</style>

      <SonnerToaster
        position="top-right"
        theme="dark"
        closeButton
        duration={4000}
        visibleToasts={4}
        expand={false}
        gap={12}
        offset={16}
        swipeDirections={['right']}
        toastOptions={{
          style: {
            background: 'rgb(30 41 59 / 0.95)',
            border: '1px solid rgb(51 65 85 / 0.6)',
            color: '#e2e8f0',
          },
        }}
        icons={{
          success: (
            <i
              className="fa-solid fa-circle-check"
              style={{ color: '#10b981', fontSize: 20, lineHeight: 1 }}
              aria-hidden="true"
            />
          ),
          error: (
            <i
              className="fa-solid fa-circle-xmark"
              style={{ color: '#f43f5e', fontSize: 20, lineHeight: 1 }}
              aria-hidden="true"
            />
          ),
          warning: (
            <i
              className="fa-solid fa-triangle-exclamation"
              style={{ color: '#f59e0b', fontSize: 20, lineHeight: 1 }}
              aria-hidden="true"
            />
          ),
          info: (
            <i
              className="fa-solid fa-circle-info"
              style={{ color: '#0ea5e9', fontSize: 20, lineHeight: 1 }}
              aria-hidden="true"
            />
          ),
          loading: (
            <span
              style={{
                display: 'inline-block',
                width: 20,
                height: 20,
                border: '2px solid rgba(148, 163, 184, 0.3)',
                borderTopColor: '#e2e8f0',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}
            />
          ),
        }}
      />
    </>
  );
}