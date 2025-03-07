// BillTemplate.js
import jsPDF from "jspdf";
import "jspdf-autotable";

class Template2 {
  constructor() {
    this.doc = new jsPDF();
  }

  generateFullHeader(invoiceData) {
    this.doc.setFont("helvetica");
    this.doc.setFontSize(10);
    this.doc.text(`GSTIN : ${invoiceData.firstParty.gstin}`, 15, 15);

    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "italic");
    this.doc.text("Original Copy", 175, 15);
   
    // Get page width
    const pageWidth = this.doc.internal.pageSize.width;

    // Center-align "TAX INVOICE"
    this.doc.setFontSize(10);
    this.doc.setFont("courier", "bold");
    this.doc.text("TAX INVOICE", pageWidth / 2, 20, { align: "center" });
    this.doc.line(pageWidth / 2 - 12, 21, pageWidth / 2 + 12, 21); // Center the underline

    // Center-align trade name
    this.doc.setFontSize(14);
    this.doc.setFont("helvetica", "bold");
    const tradeName = `${invoiceData.firstParty.trade_name.replace(/^M\/S\s+/i, "")}`;
    this.doc.text(tradeName, pageWidth / 2, 27, { align: "center" });

    // Set font for address
    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "normal");

    // Format address
    const address = `${invoiceData.firstParty.principal_address.address1}, ${invoiceData.firstParty.principal_address.address2}, ${invoiceData.firstParty.principal_address.city}, ${invoiceData.firstParty.principal_address.state} - ${invoiceData.firstParty.principal_address.pincode}`;
    // Center-align address
    const addressLines = this.doc.splitTextToSize(address, 180); // Wrap text within 180 width
    this.doc.text(addressLines, pageWidth / 2, 32, { align: "center" });

    this.drawHeaderLines(invoiceData);
  }

  drawHeaderLines(invoiceData) {

    const pageWidth = this.doc.internal.pageSize.width;
  
    //this.doc.line(startX, y, endX, y); Start Line
    this.doc.line(10, 34, 200, 34);

    this.doc.setFont("helvetica", "bold");
    this.doc.text(`Invoice No          : ${invoiceData.party.invoiceNo}`, 12, 38);
    this.doc.text(`Invoice Date       : ${invoiceData.party.invoiceDate}`,12, 42);

    this.doc.text(`Place of Supply       : State`, pageWidth / 2 + 2, 38);
    this.doc.text(`Reverse Charge       : N`,pageWidth / 2 + 2, 42);
    
    this.doc.text(`Vehicle No : ${invoiceData.vehicleNumber ? invoiceData.vehicleNumber : ''}`, pageWidth / 2 + 50 , 38);
    this.doc.text(`E-Way No   : ${invoiceData.ewayNumber ? invoiceData.ewayNumber : ''}`,pageWidth / 2 + 50 , 42);

    this.doc.line(10, 44, 200, 44);  // End Line

    //this.doc.line(x, startY, x, endY);  Vertical Line
    this.doc.line(pageWidth / 2, 34, pageWidth / 2, 80);

    // Billed To Section

    const xl = 12;
    const yl = 48; 
    this.doc.setFont("helvetica", "normal");
    this.doc.text("Billed To", xl, yl);

    this.doc.text(`M/S ${invoiceData.party.trade_name.replace(/^M\/S\s+/i, "")}`,xl, yl+8);
    this.doc.text(`${invoiceData.party.principal_address.address1}`,xl, yl+12);
    this.doc.text(`${invoiceData.party.principal_address.address2}`,xl, yl+16);
    this.doc.text(`${invoiceData.party.principal_address.city}, ${invoiceData.party.principal_address.state}, ${invoiceData.party.principal_address.country} - ${invoiceData.party.principal_address.pincode}`, xl,yl+20);

    this.doc.text(`GSTIN/UIN : ${invoiceData.party.gstin}`,xl, yl+28);

    // Shipping Address Section
    
    const xr = pageWidth / 2 + 2;
    const yr = 48; 
    this.doc.setFont("helvetica", "normal");
    this.doc.text("Shipping Address", xr, yr);

    this.doc.text(`M/S ${invoiceData.party.trade_name.replace(/^M\/S\s+/i, "")}`,xr, yr+8);
    this.doc.text(`${invoiceData.party.shipping_address.address1}`,xr, yr+12);
    this.doc.text(`${invoiceData.party.shipping_address.address2}`,xr, yr+16);
    this.doc.text(`${invoiceData.party.shipping_address.city}, ${invoiceData.party.shipping_address.state}, ${invoiceData.party.shipping_address.country} - ${invoiceData.party.shipping_address.pincode}`, xr,yr+20);

    this.doc.text(`GSTIN/UIN : ${invoiceData.party.gstin}`,xr, yr+28);

    //this.doc.line(startX, y, endX, y); End Line
    this.doc.line(10, 80, 200, 80);

  }

  addPageNumbers() {
    const pageCount = this.doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.setFontSize(10);
      this.doc.text(`Page ${i} of ${pageCount}`, 180, 8);
      this.doc.setDrawColor(0); // Pure black (RGB 0,0,0)
      this.doc.rect(10, 10, 190, 277, "S"); // (x, y, width, height, style)
    }
  }

  drawItemsTable(invoiceData) {
    const tableColumns = [
      { header: "S.No", dataKey: "sno", width: 15 },
      { header: "Item Description", dataKey: "item", width: 60 },
      { header: "HSN/SAC Code", dataKey: "hsn", width: 25 },
      { header: "Qty", dataKey: "qty", width: 20 },
      { header: "Unit", dataKey: "unit", width: 20 },
      { header: "Price", dataKey: "price", width: 25 },
      { header: "Amount", dataKey: "amount", width: 30 },
    ];

    // Map actual invoice items to table rows
    let tableData = invoiceData.hsn_details.map((item, index) => ({
      sno: (index + 1).toString(),
      item: item.product_info,
      hsn: item.hsn_code.toString(),
      qty: invoiceData.quantities[index].toString(),
      unit: item.unit,
      price: invoiceData.rates[index].toString(),
      amount: item.taxableAmount,
    }));

    // Define initial capacity for the table (e.g., 10 rows per page)
    const initialCapacity = 10;

    // Pad the tableData with empty rows if data rows are fewer than the capacity
    while (tableData.length < initialCapacity) {
      tableData.push({
        sno: "",
        item: "",
        hsn: "",
        qty: "",
        unit: "",
        price: "",
        amount: ""
      });
    }

    let startY = 85;

    this.doc.autoTable({
      startY,
      margin: { left: 12 },
      head: [tableColumns.map((col) => col.header)],
      body: tableData.map((row) =>
        tableColumns.map((col) => row[col.dataKey])
      ),
      theme: "plain",
      columnStyles: tableColumns.reduce((styles, col, index) => {
        styles[index] = { cellWidth: col.width };
        return styles;
      }, {}),
      didDrawPage: (data) => {

        let { cursor } = data;

        // Adjust start position for new pages
        let tableStartY = startY;
        let tableEndY = cursor.y; // Gets the last row position

        // Draw header bottom line
        this.doc.line(10, tableStartY + 10, 200, tableStartY + 10);

        // Draw bottom line at the end of the table
        this.doc.line(10, tableEndY, 200, tableEndY);

        // Correct vertical column positions on each page
        let columnXPositions = [23, 83, 108, 128, 148, 173];

        columnXPositions.forEach((xPos) => {
          this.doc.line(xPos, tableStartY - 5, xPos, tableEndY);
        });

        startY = 15; // reset the start position
      },
    });

    return this.doc.lastAutoTable.finalY;
}


  drawTotalsSection(invoiceData, finalY) {
    
    this.doc.line(10,finalY+20,200,finalY+20);

    this.doc.line(170,finalY+30,200,finalY+30);

    this.doc.line(170,finalY,170,finalY+30);

    this.doc.line(10,finalY+50,200,finalY+50);

    this.doc.line(10,finalY+80,200,finalY+80);


    /*this.doc.rect(15, finalY + 5, 85, 15, "S");
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
    this.drawSignatureAndStamp(invoiceData, finalY);*/
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

    // draw total section
    this.drawTotalsSection(invoiceData, tableEndY);

    // Add page numbers
    this.addPageNumbers();  

    return this.doc;
  }
}

export default Template2;