import fs from "fs";
import PDFDocument from "pdfkit";

export async function createInvoice(invoice, person, path) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });

  generateHeader(doc);
  generateSupplierInformation(doc);
  generateCustomerInformation(doc, person);
  generateOrderInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);
  //   generateFooter(doc);

  doc.end();
  doc.pipe(fs.createWriteStream("invoices/" + path + ".pdf"));
}

function generateHeader(doc) {
  doc
    .image("public/bigbuy.jpg", 50, 45, { width: 150 })
    .fillColor("#444444")
    .font("fonts/Roboto-Black.ttf")
    .fontSize(20)
    .text("FAKTURA - č. 31000217", 200, 50, { align: "right" })
    .moveDown();
}

function generateSupplierInformation(doc) {
  doc.fillColor("#444444").fontSize(10).text("Dodavatel:", 50, 150);

  generateRandomHr(doc, 50, 290, 165);

  const supplierInformationTop = 180;

  doc
    .fontSize(10)
    .font("fonts/Roboto-Regular.ttf")
    .text(process.env.NAME, 50, supplierInformationTop)
    .text(process.env.ADDRESS, 50, supplierInformationTop + 15)
    .text(process.env.POSTAL_CODE, 50, supplierInformationTop + 30)
    .text(process.env.CITY, 80, supplierInformationTop + 30)
    .text(process.env.COUNTRY, 50, supplierInformationTop + 45)
    .moveDown();
}

function generateCustomerInformation(doc, person) {
  doc
    .font("fonts/Roboto-Black.ttf")
    .fillColor("#444444")
    .fontSize(10)
    .text("Odběratel:", 300, 150);

  generateRandomHr(doc, 300, 550, 165);

  const customerInformationTop = 180;

  doc
    .fontSize(10)
    .font("fonts/Roboto-Regular.ttf")
    .text(
      person.person_detail.first_name + " " + person.person_detail.last_name,
      300,
      customerInformationTop
    )
    .text(
      person.address.street + " " + person.address.numberDescriptive,
      300,
      customerInformationTop + 15
    )
    .text(person.address.postal_code, 300, customerInformationTop + 30)
    .text(person.address.village, 330, customerInformationTop + 30)
    .text("Česká republika", 300, customerInformationTop + 45)
    .moveDown();
}

function generateOrderInformation(doc, invoice) {
  doc
    .font("fonts/Roboto-Black.ttf")
    .fillColor("#444444")
    .fontSize(10)
    .text("Objednávka:", 50, 250);

  generateRandomHr(doc, 50, 290, 265);

  const customerInformationTop = 280;

  doc
    .fontSize(10)
    .font("fonts/Roboto-Regular.ttf")
    .text("Číslo objednávky:", 50, customerInformationTop)
    .text(invoice.invoice_nr, 150, customerInformationTop)
    .text("Datum objednávky:", 50, customerInformationTop + 15)
    .text(formatDate(new Date()), 150, customerInformationTop + 15)
    .text("Způsob úhrady: ", 50, customerInformationTop + 30)
    .text("Platební kartou online", 150, customerInformationTop + 30)
    .moveDown();
}

function generateInvoiceTable(doc, invoice) {
  generateHr(doc, 340);
  let i;
  const invoiceTableTop = 360;

  doc.font("fonts/Roboto-Black.ttf");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Produkt",
    "Cana za kus",
    "Počet",
    "Částka"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("fonts/Roboto-Regular.ttf");

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.title,
      formatCurrency(item.price),
      item.count,
      formatCurrency(item.price * item.count)
    );

    generateHr(doc, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "Mezisoučet",
    formatCurrency(invoice.total_price - invoice.deliver_method.price)
  );

  const paidToDatePosition = subtotalPosition + 20;
  generateTableRow(
    doc,
    paidToDatePosition,
    "",
    "",
    "Doprava",
    formatCurrency(invoice.deliver_method.price)
  );

  const duePosition = paidToDatePosition + 25;
  doc.font("fonts/Roboto-Black.ttf");
  generateTableRow(
    doc,
    duePosition,
    "",
    "",
    "Celkem",
    formatCurrency(invoice.total_price)
  );
  doc.font("Helvetica");
}

function generateFooter(doc) {
  doc
    .fontSize(10)
    .text(
      "Payment is due within 15 days. Thank you for your business.",
      50,
      780,
      { align: "center", width: 500 }
    );
}

function generateTableRow(doc, y, item, unitCost, quantity, lineTotal) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(unitCost, 280, y, { width: 90, align: "right" })
    .text(quantity, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function generateRandomHr(doc, x, x1, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(x, y).lineTo(x1, y).stroke();
}

function formatCurrency(price) {
  return price + "Kč";
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return day + "." + month + "." + year;
}
