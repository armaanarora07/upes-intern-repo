// BillTemplate.js
import jsPDF from "jspdf";
import "jspdf-autotable";

class Template1 {
  constructor() {
    this.doc = new jsPDF();
  }

  generateContinuationHeader() {
    const pageCount = this.doc.getNumberOfPages();
    this.doc.setFontSize(10);
    this.doc.text(`Page ${pageCount}`, 180, 10);
  }

  generateFullHeader(invoiceData) {

    this.doc.addImage(invoiceData.logo, "PNG", 15,10, 15, 15);

    this.doc.setFont("helvetica");
    this.doc.setFontSize(14);
    this.doc.setFont("helvetica", "bold");
    const tradeName = `${invoiceData.firstParty.trade_name.replace(/^M\/S\s+/i, "")}`;
    this.doc.text(tradeName, 34, 15);

    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "normal");
    const address = `${invoiceData.firstParty.principal_address.address1}, ${invoiceData.firstParty.principal_address.address2}, ${invoiceData.firstParty.principal_address.city}, ${invoiceData.firstParty.principal_address.state} - ${invoiceData.firstParty.principal_address.pincode}`;
    this.doc.text(address, 34, 22);

    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(`GSTIN : ${invoiceData.firstParty.gstin}`, 15, 29);
    this.doc.text("TAX INVOICE", 90, 29);
    this.doc.text("ORIGINAL FOR RECIPENT", 150, 29);

    this.drawHeaderLines(invoiceData);
  }

  drawHeaderLines(invoiceData) {
    this.doc.setDrawColor(0);
    this.doc.line(15, 32, 195, 32);
    
    // Customer Details block
    this.doc.setFillColor(240, 240, 240);
    this.doc.rect(15, 35, 85, 40, "S");

    this.doc.setFont("helvetica", "bold");
    this.doc.text("Customer Detail", 17, 40);
    this.doc.setFont("helvetica", "normal");
    this.doc.text(`M/S ${invoiceData.party.legal_name}`, 17, 46);
    this.doc.text(`Address :`, 17, 50);
    this.doc.text(`${invoiceData.party.principal_address.address1}`, 17, 54);
    this.doc.text(`${invoiceData.party.principal_address.address2}`, 17, 58);
    this.doc.text(`GSTIN : ${invoiceData.party.gstin}`, 17, 62);
    this.doc.text(`Place of Supply : ${invoiceData.party.principal_address.country} - ${invoiceData.party.principal_address.pincode}`, 17, 66);

    // Invoice Details block
    this.drawInvoiceDetailsBlock(invoiceData);
  }

  drawInvoiceDetailsBlock(invoiceData) {
    this.doc.rect(100, 35, 95, 40, "S");
    this.doc.text(`Invoice No. : ${invoiceData.party.invoiceNo}`, 102, 40);
    this.doc.text(`Invoice Date : ${invoiceData.party.invoiceDate}`, 150, 40);
    this.doc.text("Chalan No. :", 102, 46);
    this.doc.text("Chalan Date :", 150, 46);
    this.doc.text("P.O.No. :", 102, 52);
    this.doc.text("Delivery Date :", 102, 58);
    this.doc.text("Reverse Charge :", 150, 58);
    this.doc.text("L.R.No. :", 102, 64);
    this.doc.text("Due Date :", 150, 64);
    this.doc.text("E-Way No. :", 102, 70);
  }

  addPageNumbers() {
    const pageCount = this.doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.setFontSize(10);
      this.doc.text(`Page ${i} of ${pageCount}`, 180, 10);
    }
  }

  drawItemsTable(invoiceData) {
    const tableColumns = [
      { header: "S.No", dataKey: "sno" },
      { header: "Item Description", dataKey: "item" },
      { header: "HSN/SAC Code", dataKey: "hsn" },
      { header: "IGST", dataKey: "igst" },
      { header: "Qty", dataKey: "qty" },
      { header: "Unit", dataKey: "unit" },
      { header: "Price", dataKey: "price" },
      { header: "Payable Tax", dataKey: "tax" },
      { header: "Amount", dataKey: "amount" },
    ];

    const tableData = invoiceData.hsn_details.map((item, index) => ({
      sno: (index + 1).toString(),
      item: item.product_info,
      hsn: item.hsn_code.toString(),
      igst: `${item.cgst}%`,
      qty: invoiceData.quantities[index].toString(),
      unit: item.unit,
      price: invoiceData.rates[index].toString(),
      tax: item.totalTax,
      amount: item.taxableAmount,
    }));

    const startY = 80;
    this.doc.autoTable({
      startY,
      head: [tableColumns.map((col) => col.header)],
      body: tableData.map((row) =>
        tableColumns.map((col) => row[col.dataKey])
      ),
      theme: "grid",
      headStyles: {
        fillColor: [245, 245, 245],
        textColor: [0, 0, 0],
        fontStyle: "bold",
        halign: "center",
        fontSize: 10,
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 10 },
        1: { halign: "left", cellWidth: 40 },
        2: { halign: "center", cellWidth: 25 },
        3: { halign: "center", cellWidth: 15 },
        4: { halign: "center", cellWidth: 15 },
        5: { halign: "center", cellWidth: 15 },
        6: { halign: "right", cellWidth: 15 },
        7: { halign: "right", cellWidth: 20 },
        8: { halign: "right", cellWidth: 25 },
      },
      margin: { left: 15 },
      didDrawPage: (data) => {
        if (data.pageNumber > 1) {
          this.generateContinuationHeader();
        }
      },
    });

    return this.doc.lastAutoTable.finalY;
  }

  drawTotalsSection(invoiceData, finalY) {
    // Amount in words section
    this.doc.rect(15, finalY + 5, 85, 15, "S");
    this.doc.setFont("helvetica", "bold");
    this.doc.text("TOTAL IN WORDS", 17, finalY + 10);
    this.doc.setFont("helvetica", "normal");
    const wrappedText = this.doc.splitTextToSize(invoiceData.totalAmountInWords, 80);
    this.doc.text(wrappedText, 17, finalY + 15);

    // Amount details
    this.drawAmountDetails(invoiceData, finalY);
    
    // Bank details and terms
    this.drawBankAndTerms(invoiceData, finalY);
    
    // Signature and stamp
    this.drawSignatureAndStamp(invoiceData, finalY);
  }

  drawAmountDetails(invoiceData, finalY) {
    // Taxable amount
    this.doc.rect(100, finalY + 5, 95, 15, "S");
    this.doc.setFont("helvetica", "bold");
    this.doc.text("Taxable Amount", 102, finalY + 10);
    this.doc.text(invoiceData.totalTaxableAmount, 180, finalY + 10, { align: "right" });

    // Total tax
    this.doc.rect(100, finalY + 20, 95, 10, "S");
    this.doc.text("Total Tax", 102, finalY + 25);
    this.doc.text(invoiceData.totalTax, 180, finalY + 25, { align: "right" });

    // Total amount after tax
    this.doc.rect(100, finalY + 30, 95, 10, "S");
    this.doc.text("Total Amount After Tax", 102, finalY + 35);
    this.doc.text(invoiceData.totalAmount, 180, finalY + 35, { align: "right" });

    // E. & O.E
    this.doc.rect(100, finalY + 40, 95, 10, "S");
    this.doc.text("E. & O.E.", 180, finalY + 45, { align: "right" });

    // GST reverse charge
    this.doc.rect(100, finalY + 50, 95, 10, "S");
    this.doc.text("GST PAYABLE ON REVERSE CHARGE", 102, finalY + 55);
    this.doc.text("N.A.", 180, finalY + 55, { align: "right" });
  }

  drawBankAndTerms(invoiceData, finalY) {
    // Bank details
    this.doc.rect(15, finalY + 20, 85, 20, "S");
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(8);
    if(invoiceData.bankEnabled && invoiceData.bank){
    this.doc.text("Bank Details", 17, finalY + 24);
    this.doc.text(`Account Holder Name : ${invoiceData.bank?.accountHolderName}`, 17, finalY + 27);
    this.doc.text(`Account Number : ${invoiceData.bank?.accountNumber}`, 17, finalY + 30);
    this.doc.text(`IFSC Code : ${invoiceData.bank?.ifscCode}`, 17, finalY + 33);
    this.doc.text(`Bank Name : ${invoiceData.bank?.bankName}`, 17, finalY + 36);
    }
    // Terms and conditions
    this.doc.rect(15, finalY + 40, 85, 20, "S");
    this.doc.text("Terms & Conditions", 17, finalY + 45);
    this.doc.text(`${invoiceData.tandc}`, 17, finalY + 50);
  }

  drawSignatureAndStamp(invoiceData, finalY) {
        
    // Signature and  Stamp  section
    this.doc.rect(100, finalY + 60, 95, 40, "S");
    this.doc.setFont("helvetica", "bold");
    if(invoiceData.attestationSelection) {
       // Stamp section
       if(invoiceData.stampEnabled && invoiceData.stamp){
       this.doc.text("Stamp :", 102, finalY + 70);
       const stX = 150 - 20;
       const stY = finalY + 71.5;
       this.doc.addImage(invoiceData.stamp, "PNG", stX, stY, 20, 20);
       }
    } else{
        // Signature section
        if(invoiceData.signatureEnabled && invoiceData.signature){
          this.doc.text("Signature :", 102, finalY + 70);
          const sigX = 150 - 20;
          const sigY = finalY + 71.5;
          this.doc.addImage(invoiceData.signature, "PNG", sigX, sigY, 20, 20);
        }
    }
    //Payment QR
    this.doc.rect(15, finalY + 60, 85, 40, "S");
    this.doc.setFont("helvetica", "bold");
    if(invoiceData.qr){
      this.doc.text("Payment QR :", 17, finalY + 70);
      const stX = 150 - 110;
      const stY = finalY + 71.5;
      this.doc.addImage(invoiceData.qr, "PNG", stX, stY, 20, 20);
    }
    
    // Company name
    const tradeName = invoiceData.firstParty.trade_name.replace(/^M\/S\s+/i, "");
    this.doc.text(`for ${tradeName}`, 170, finalY + 95, { align: "center" });
  }

  generateInvoice(invoiceData) {
    // Generate header
    this.generateFullHeader(invoiceData);

    // Generate items table and get final Y position
    const tableEndY = this.drawItemsTable(invoiceData);

    // Check if we need a new page for totals
    if (tableEndY > 180) {
      this.doc.addPage();
      this.generateContinuationHeader();
      this.drawTotalsSection(invoiceData, 10);
    } else {
      this.drawTotalsSection(invoiceData, tableEndY);
    }

    // Add page numbers
    this.addPageNumbers();

    return this.doc;
  }
}

export default Template1;