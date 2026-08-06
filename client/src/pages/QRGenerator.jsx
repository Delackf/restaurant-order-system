import { useState, useEffect } from 'react'
import { getTables } from '../api'

export default function QRGenerator() {
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTables()
  }, [])

  async function loadTables() {
    try {
      const data = await getTables()
      setTables(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getOrderUrl = (tableId) => {
    return `${window.location.origin}/menu?table=${tableId}`
  }

  function printQRCodes() {
    window.print()
  }

  if (loading) return <div className="loading">جاري التحميل...</div>

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">رموز QR للطاولات</h2>
        <button className="save-btn no-print" onClick={printQRCodes}>🖨️ طباعة الكل</button>
      </div>

      <p style={{ marginBottom: 20, color: 'var(--text-light)' }}>
        اطبع هذه الرموز وضعها على الطاولات. عندما يمسحها الزبون، سيتم توجيهه لصفحة الطلب مرتبطاً برقم الطاولة.
      </p>

      <div className="qr-grid">
        {tables.map(table => (
          <div key={table.id} className="qr-card">
            <div className="table-name">طاولة {table.number}</div>
            <QRCode value={getOrderUrl(table.id)} />
            <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: 10 }}>
              امسح للطلب
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function QRCode({ value }) {
  const [svg, setSvg] = useState('')

  useEffect(() => {
    async function generate() {
      const QRCode = await import('qrcode')
      const svgString = await QRCode.toString(value, {
        type: 'svg',
        margin: 1,
        width: 150,
        color: { dark: '#1d3557', light: '#ffffff' }
      })
      setSvg(svgString)
    }
    generate()
  }, [value])

  return (
    <div
      className="qr-code"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
