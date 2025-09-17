import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { Voluntario, Beneficiario } from '@/lib/supabase'

// Extend jsPDF type for autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => void;
  }
}

export const exportVoluntariosToExcel = (voluntarios: Voluntario[]) => {
  const data = voluntarios.map(v => ({
    'Nome': v.nome,
    'Email': v.email,
    'Telefone': v.telefone,
    'Idade': v.idade,
    'Endereço': v.endereco,
    'Área de Atuação': v.area,
    'Disponibilidade': v.disponibilidade,
    'Experiência': v.experiencia,
    'Data de Cadastro': new Date(v.created_at || '').toLocaleDateString('pt-BR')
  }))

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Voluntários')

  // Style the header
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1')
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const address = XLSX.utils.encode_cell({ r: 0, c: C })
    if (!worksheet[address]) continue
    worksheet[address].s = {
      font: { bold: true },
      fill: { fgColor: { rgb: "CCCCCC" } }
    }
  }

  const fileName = `voluntarios-mais-amor-${new Date().toISOString().split('T')[0]}.xlsx`
  XLSX.writeFile(workbook, fileName)
}

export const exportBeneficiariosToExcel = (beneficiarios: Beneficiario[]) => {
  const data = beneficiarios.map(b => ({
    'Nome': b.nome,
    'Telefone': b.telefone,
    'Email': b.email || '',
    'Idade': b.idade,
    'Endereço': b.endereco,
    'Responsável': b.responsavel || '',
    'Serviços de Interesse': b.necessidades.join(', '),
    'Observações': b.observacoes,
    'Confirmou Presença': b.confirmou_presenca ? 'Sim' : 'Não',
    'Data de Cadastro': new Date(b.created_at || '').toLocaleDateString('pt-BR')
  }))

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Beneficiários')

  // Style the header
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1')
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const address = XLSX.utils.encode_cell({ r: 0, c: C })
    if (!worksheet[address]) continue
    worksheet[address].s = {
      font: { bold: true },
      fill: { fgColor: { rgb: "CCCCCC" } }
    }
  }

  const fileName = `beneficiarios-mais-amor-${new Date().toISOString().split('T')[0]}.xlsx`
  XLSX.writeFile(workbook, fileName)
}

export const exportVoluntariosToPDF = (voluntarios: Voluntario[]) => {
  const doc = new jsPDF()
  
  // Title
  doc.setFontSize(18)
  doc.text('Relatório de Voluntários - Mais Amor', 14, 22)
  
  doc.setFontSize(12)
  doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 14, 32)
  doc.text(`Total de Voluntários: ${voluntarios.length}`, 14, 42)

  // Table data
  const tableData = voluntarios.map(v => [
    v.nome,
    v.email,
    v.telefone,
    v.area,
    v.disponibilidade,
    new Date(v.created_at || '').toLocaleDateString('pt-BR')
  ])

  doc.autoTable({
    head: [['Nome', 'Email', 'Telefone', 'Área', 'Disponibilidade', 'Cadastro']],
    body: tableData,
    startY: 50,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 139, 202] }
  })

  const fileName = `voluntarios-mais-amor-${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(fileName)
}

export const exportBeneficiariosToPDF = (beneficiarios: Beneficiario[]) => {
  const doc = new jsPDF()
  
  // Title
  doc.setFontSize(18)
  doc.text('Relatório de Beneficiários - Mais Amor', 14, 22)
  
  doc.setFontSize(12)
  doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 14, 32)
  doc.text(`Total de Beneficiários: ${beneficiarios.length}`, 14, 42)
  doc.text(`Presenças Confirmadas: ${beneficiarios.filter(b => b.confirmou_presenca).length}`, 14, 52)

  // Table data
  const tableData = beneficiarios.map(b => [
    b.nome,
    b.telefone,
    b.idade.toString(),
    b.necessidades.slice(0, 2).join(', ') + (b.necessidades.length > 2 ? '...' : ''),
    b.confirmou_presenca ? 'Sim' : 'Não',
    new Date(b.created_at || '').toLocaleDateString('pt-BR')
  ])

  doc.autoTable({
    head: [['Nome', 'Telefone', 'Idade', 'Serviços', 'Presente', 'Cadastro']],
    body: tableData,
    startY: 60,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [40, 167, 69] }
  })

  const fileName = `beneficiarios-mais-amor-${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(fileName)
}