// BillTemplate.js
import jsPDF from "jspdf";
import "jspdf-autotable";

class Template2 {
  constructor() {
    this.doc = new jsPDF();
  }

  generateFullHeader(invoiceData) {

    console.log(invoiceData);
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
      item: item.product_info? item.product_info: '',
      hsn: item.hsn_code ? item.hsn_code.toString(): '',
      qty: invoiceData.quantities ? invoiceData.quantities[index].toString() : '',
      unit: item.unit ? item.unit : '',
      price: invoiceData.rates? invoiceData.rates[index].toString() : '',
      amount: item.taxableAmount ? item.taxableAmount : '',
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

    this.doc.text(invoiceData.totalTaxableAmount,175, finalY + 5);
    
    this.doc.text(`Add: CGST`,55, finalY + 10);
    this.doc.text(`@`,125, finalY + 10);
    this.doc.text(`${invoiceData.cgstRate} %`,150, finalY + 10);
    this.doc.text(invoiceData.totalCGSTTax,175, finalY + 10);

    this.doc.text(`Add: SGST`,55, finalY + 15);
    this.doc.text(`@`,125, finalY + 15);
    this.doc.text(`${invoiceData.sgstRate} %`,150, finalY + 15);
    this.doc.text(invoiceData.totalSGSTTax,175, finalY + 15);

    this.doc.text(`Grand Total`,70, finalY + 25);
    this.doc.text(`${invoiceData.totalQuantity}`,125, finalY + 25);
    this.doc.text(`${invoiceData.unit}`,150, finalY + 25);
    this.doc.text(invoiceData.totalAmount,175, finalY + 25);

    this.doc.line(170,finalY,170,finalY+30);
   
    this.drawUnderlineTotals(12,finalY+32,"Tax Rate",String(invoiceData.cgstRate + invoiceData.sgstRate));

    this.drawUnderlineTotals(30,finalY+32,"Taxable Amount",invoiceData.totalTaxableAmount);

    this.drawUnderlineTotals(60,finalY+32,"CGST Amt",invoiceData.totalCGSTTax);

    this.drawUnderlineTotals(80,finalY+32,"SGST Amt",invoiceData.totalSGSTTax);

    this.drawUnderlineTotals(100,finalY+32,"Total Tax",invoiceData.totalTax);

    this.doc.text(invoiceData.totalAmountInWords, 12, finalY + 47);

    this.doc.line(10,finalY+50,200,finalY+50);

    this.drawSignatureandTerms(invoiceData,finalY);
  }

  drawUnderlineTotals(xPos,yPos,text,data) {
    this.doc.setFont("helvetica", "bold");
    const textWidth = this.doc.getTextWidth(text);
    this.doc.text(text, xPos, yPos);
    this.doc.line(xPos, yPos + 1, xPos + textWidth, yPos + 1);
    this.doc.setFont("helvetica", "normal");
    this.doc.text(text === "Tax Rate" ? data +" %" : data, xPos, yPos+6);
  }

  drawSignatureandTerms(invoiceData,finalY){

    const pageWidth = this.doc.internal.pageSize.width;

    this.doc.setFont("helvetica", "bold");

    this.doc.text("Terms and Conditions",15, finalY + 55);

    this.doc.text("E & O.E",15, finalY + 60);

    this.doc.line(10,finalY+63,pageWidth/2,finalY+63); // line

  const inputText = Array.isArray(invoiceData.tandc) ? invoiceData.tandc.join('\n') : (invoiceData.tandc || '');

    const points = inputText.split("\n");

    let y = finalY+68;

    this.doc.setFont("helvetica", "normal");

    points.forEach(point => {
       
      const wrappedText = this.doc.splitTextToSize(point, (pageWidth/2)-10); // Wrap text
       
      this.doc.text(wrappedText, 12, y);
       
      y += wrappedText.length * 3 + 4; // Add line spacing dynamically
    
    });
    
    this.doc.line(pageWidth / 2,finalY+50, pageWidth / 2, finalY+90);  // Vertical Line

    this.doc.setFont("helvetica", "bold");

    this.doc.text("Receiver Signature:",pageWidth/2 + 2, finalY + 55);
    
    this.doc.line(pageWidth/2,finalY+70,200,finalY+70);

    const tradeName = invoiceData.firstParty.trade_name.replace(/^M\/S\s+/i, "");

    this.doc.text(`For ${tradeName}`,pageWidth/2 + 20, finalY + 85);

    this.doc.line(10,finalY+90,200,finalY+90);
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