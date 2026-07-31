import { FinanceMonth } from '@/types';
import { money } from '@/utils/format';

export function generatePDF(data: FinanceMonth, month: string, userName: string) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Relatório Finzy - ${month}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #0d0f14;
          color: #e8eaf0;
          padding: 40px;
          margin: 0;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding-bottom: 20px;
        }
        .logo {
          font-size: 32px;
          font-weight: 800;
          color: #7c6af7;
          margin-bottom: 10px;
        }
        .date {
          color: #6b7280;
          font-size: 14px;
        }
        .section {
          margin-bottom: 30px;
        }
        .section-title {
          font-size: 18px;
          font-weight: 700;
          color: #7c6af7;
          margin-bottom: 15px;
          text-transform: uppercase;
        }
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
        }
        .kpi {
          background: #14171f;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 20px;
        }
        .kpi-label {
          font-size: 12px;
          color: #6b7280;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .kpi-value {
          font-size: 24px;
          font-weight: 800;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          background: #14171f;
          border-radius: 14px;
          overflow: hidden;
        }
        th, td {
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        th {
          background: #1c2030;
          color: #7c6af7;
          font-weight: 700;
          font-size: 12px;
          text-transform: uppercase;
        }
        .income { color: #22c87a; }
        .expense { color: #f05252; }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.1);
          color: #6b7280;
          font-size: 12px;
        }
        @media print {
          body { background: white; color: black; }
          .kpi, table { background: #f5f5f5; border: 1px solid #ddd; }
          th { background: #e0e0e0; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">finzy<span style="color: #22c87a;">.</span></div>
          <div class="date">Relatório Financeiro - ${month} 2025</div>
          <div class="date">Usuário: ${userName}</div>
        </div>

        <div class="section">
          <div class="section-title">Indicadores</div>
          <div class="kpi-grid">
            ${data.kpis.map((kpi) => `
              <div class="kpi">
                <div class="kpi-label">${kpi.label}</div>
                <div class="kpi-value" style="color: ${getKpiColor(kpi.tone)}">${kpi.value}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="section">
          <div class="section-title">Transações</div>
          <table>
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Nome</th>
                <th>Data</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              ${data.transactions.map((t) => `
                <tr>
                  <td>${t.icon}</td>
                  <td>${t.name}</td>
                  <td>${t.date}</td>
                  <td class="${t.type}">${t.amount}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="section-title">Orçamento Mensal</div>
          <table>
            <thead>
              <tr>
                <th>Categoria</th>
                <th>Gasto</th>
                <th>Limite</th>
                <th>Progresso</th>
              </tr>
            </thead>
            <tbody>
              ${data.budget.map((b) => `
                <tr>
                  <td>${b.icon} ${b.name}</td>
                  <td>${money(b.spent)}</td>
                  <td>${money(b.limit)}</td>
                  <td>${Math.round((b.spent / b.limit) * 100)}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="section-title">Metas Financeiras</div>
          <table>
            <thead>
              <tr>
                <th>Meta</th>
                <th>Atual</th>
                <th>Meta</th>
                <th>Progresso</th>
              </tr>
            </thead>
            <tbody>
              ${data.goals.map((g) => `
                <tr>
                  <td>${g.icon} ${g.name}</td>
                  <td>${money(g.current)}</td>
                  <td>${money(g.target)}</td>
                  <td>${Math.round((g.current / g.target) * 100)}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="footer">
          <p>Finzy - Sistema de Gestão Financeira</p>
          <p>Gerado em ${new Date().toLocaleDateString('pt-BR')}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // For web: open in new window and print
  if (typeof window !== 'undefined') {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  }

  return htmlContent;
}

function getKpiColor(tone: string): string {
  const colors: Record<string, string> = {
    green: '#22c87a',
    blue: '#3b82f6',
    red: '#f05252',
    amber: '#f59e0b',
    accent: '#7c6af7',
  };
  return colors[tone] || '#e8eaf0';
}