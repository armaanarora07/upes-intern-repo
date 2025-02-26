import jsPDF from "jspdf";
import "jspdf-autotable";

class Template2 {
  constructor() {
    this.doc = new jsPDF();
    this.primaryColor = [41, 128, 185]; // Nice blue color
    this.secondaryColor = [189, 195, 199]; // Light gray
  }

  generateContinuationHeader() {
    const pageCount = this.doc.getNumberOfPages();
    this.doc.setFontSize(8);
    this.doc.setTextColor(...this.secondaryColor);
    this.doc.text(`Page ${pageCount}`, 185, 8);
  }

  generateFullHeader(invoiceData) {
    // Company Logo Area
    this.doc.setFillColor(...this.primaryColor);
    this.doc.rect(0, 0, 210, 40, "F");
    
    // Company Name
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(20);
    this.doc.setTextColor(255, 255, 255);
    const tradeName = `${invoiceData.firstParty.trade_name.replace(/^M\/S\s+/i, "")}`;
    this.doc.text(tradeName, 15, 20);

    // Company Address
    this.doc.setFontSize(8);
    const address = `${invoiceData.firstParty.principal_address.address1}, ${invoiceData.firstParty.principal_address.address2}, ${invoiceData.firstParty.principal_address.city}, ${invoiceData.firstParty.principal_address.state} - ${invoiceData.firstParty.principal_address.pincode}`;
    this.doc.text(address, 15, 25);

    // GSTIN & Document Type
    this.doc.setFontSize(10);
    this.doc.text(`GSTIN: ${invoiceData.firstParty.gstin}`, 15, 32);
    
    // Tax Invoice Badge
    this.doc.setFillColor(255, 255, 255);
    this.doc.roundedRect(140, 10, 55, 20, 3, 3, "F");
    this.doc.setTextColor(...this.primaryColor);
    this.doc.setFontSize(14);
    this.doc.text("TAX INVOICE", 145, 22);
    
    this.drawModernHeaderLines(invoiceData);
  }

  drawModernHeaderLines(invoiceData) {
    // Customer Details Card
    this.doc.setFillColor(249, 249, 249);
    this.doc.roundedRect(15, 50, 85, 45, 2, 2, "F");
    this.doc.setDrawColor(...this.primaryColor);
    this.doc.setLineWidth(0.1);
    this.doc.roundedRect(15, 50, 85, 45, 2, 2, "S");

    this.doc.setTextColor(...this.primaryColor);
    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("BILL TO", 20, 58);

    this.doc.setTextColor(60, 60, 60);
    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "normal");
    this.doc.text(`${invoiceData.party.legal_name}`, 20, 65);
    this.doc.text(`${invoiceData.party.principal_address.address1}`, 20, 70);
    this.doc.text(`${invoiceData.party.principal_address.address2}`, 20, 75);
    this.doc.text(`GSTIN: ${invoiceData.party.gstin}`, 20, 80);
    this.doc.text(`Place of Supply: ${invoiceData.party.principal_address.country}`, 20, 85);
    this.doc.text(`PIN: ${invoiceData.party.principal_address.pincode}`, 20, 90);

    // Invoice Details Card
    this.drawModernInvoiceDetailsBlock(invoiceData);
  }

  drawModernInvoiceDetailsBlock(invoiceData) {
    this.doc.setFillColor(249, 249, 249);
    this.doc.roundedRect(110, 50, 85, 45, 2, 2, "F");
    this.doc.setDrawColor(...this.primaryColor);
    this.doc.roundedRect(110, 50, 85, 45, 2, 2, "S");

    this.doc.setTextColor(...this.primaryColor);
    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("INVOICE DETAILS", 115, 58);

    this.doc.setTextColor(60, 60, 60);
    this.doc.setFontSize(9);
    this.doc.setFont("helvetica", "normal");

    const details = [
      ["Invoice No:", invoiceData.party.invoiceDate],
      ["Invoice Date:", new Date().toLocaleDateString()],
      ["Due Date:", "30 days"],
      ["PO Number:", "-"],
      ["Terms:", "Net 30"]
    ];

    let yPos = 65;
    details.forEach(([label, value]) => {
      this.doc.setFont("helvetica", "bold");
      this.doc.text(label, 115, yPos);
      this.doc.setFont("helvetica", "normal");
      this.doc.text(value, 155, yPos);
      yPos += 5;
    });
  }

  drawItemsTable(invoiceData) {
    const tableColumns = [
      { header: "#", dataKey: "sno", width: 10 },
      { header: "Item Description", dataKey: "item", width: 50 },
      { header: "HSN", dataKey: "hsn", width: 20 },
      { header: "Qty", dataKey: "qty", width: 15 },
      { header: "Rate", dataKey: "price", width: 20 },
      { header: "Tax", dataKey: "tax", width: 20 },
      { header: "Amount", dataKey: "amount", width: 25 }
    ];

    const tableData = invoiceData.hsn_details.map((item, index) => ({
      sno: (index + 1).toString(),
      item: item.product_info,
      hsn: item.hsn_code.toString(),
      qty: invoiceData.quantities[index].toString(),
      price: invoiceData.rates[index].toString(),
      tax: item.totalTax,
      amount: item.taxableAmount,
    }));

    this.doc.autoTable({
      startY: 105,
      head: [tableColumns.map(col => col.header)],
      body: tableData.map(row => tableColumns.map(col => row[col.dataKey])),
      theme: "grid",
      headStyles: {
        fillColor: [...this.primaryColor],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center",
        fontSize: 10
      },
      styles: {
        fontSize: 9,
        cellPadding: 4,
        lineWidth: 0.1,
        lineColor: [220, 220, 220],
        textColor: [60, 60, 60]
      },
      columnStyles: {
        0: { halign: "center" },
        3: { halign: "center" },
        4: { halign: "right" },
        5: { halign: "right" },
        6: { halign: "right" }
      },
      margin: { left: 15, right: 15 },
      didDrawPage: (data) => {
        if (data.pageNumber > 1) {
          this.generateContinuationHeader();
        }
      }
    });

    return this.doc.lastAutoTable.finalY;
  }

  drawModernTotalsSection(invoiceData, finalY) {
    // Summary Card
    this.doc.setFillColor(249, 249, 249);
    this.doc.roundedRect(110, finalY + 5, 85, 40, 2, 2, "F");
    this.doc.setDrawColor(...this.primaryColor);
    this.doc.roundedRect(110, finalY + 5, 85, 40, 2, 2, "S");

    const summaryItems = [
      ["Subtotal:", invoiceData.totalTaxableAmount],
      ["Tax:", invoiceData.totalTax],
      ["Total:", invoiceData.totalAmount]
    ];

    let yPos = finalY + 15;
    summaryItems.forEach(([label, value], index) => {
      this.doc.setFont("helvetica", index === 2 ? "bold" : "normal");
      this.doc.setFontSize(index === 2 ? 11 : 9);
      this.doc.setTextColor(60, 60, 60);
      this.doc.text(label, 115, yPos);
      this.doc.text(value, 185, yPos, { align: "right" });
      yPos += 10;
    });

    // Bank Details
    this.drawModernBankDetails(invoiceData, finalY);
    
    // Signature
    this.drawModernSignature(invoiceData, finalY);
  }

  drawModernBankDetails(invoiceData, finalY) {
    this.doc.setFillColor(249, 249, 249);
    this.doc.roundedRect(15, finalY + 5, 85, 40, 2, 2, "F");
    this.doc.setDrawColor(...this.primaryColor);
    this.doc.roundedRect(15, finalY + 5, 85, 40, 2, 2, "S");

    this.doc.setTextColor(...this.primaryColor);
    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("BANK DETAILS", 20, finalY + 15);

    this.doc.setTextColor(60, 60, 60);
    this.doc.setFontSize(8);
    this.doc.setFont("helvetica", "normal");
    this.doc.text(`Account Name: ${invoiceData.bank?.accountHolderName}`, 20, finalY + 22);
    this.doc.text(`Account No: ${invoiceData.bank?.accountNumber}`, 20, finalY + 28);
    this.doc.text(`IFSC: ${invoiceData.bank?.ifscCode}`, 20, finalY + 34);
    this.doc.text(`Bank: ${invoiceData.bank?.bankName}`, 20, finalY + 40);
  }

  drawModernSignature(invoiceData, finalY) {
    // Signature Area
    this.doc.setDrawColor(...this.primaryColor);
    this.doc.line(110, finalY + 60, 195, finalY + 60);
    
    this.doc.setTextColor(60, 60, 60);
    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("Authorized Signatory", 140, finalY + 65);
    
    if (invoiceData.signature) {
      this.doc.addImage(invoiceData.signature, "PNG", 140, finalY + 45, 20, 20);
    }
  }

  generateInvoice(invoiceData) {
    this.generateFullHeader(invoiceData);
    const tableEndY = this.drawItemsTable(invoiceData);
    
    if (tableEndY > 180) {
      this.doc.addPage();
      this.generateContinuationHeader();
      this.drawModernTotalsSection(invoiceData, 10);
    } else {
      this.drawModernTotalsSection(invoiceData, tableEndY);
    }
    
    this.addPageNumbers();
    return this.doc;
  }

  addPageNumbers() {
    const pageCount = this.doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.setFontSize(8);
      this.doc.setTextColor(...this.secondaryColor);
      this.doc.text(`Page ${i} of ${pageCount}`, 185, 8);
    }
  }
}

export default Template2;