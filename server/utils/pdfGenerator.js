const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');
const CERTIFICATE_SIGNATORY_NAME = 'KOVURU RAHAMATHULLA';

/**
 * Helper to convert number to words for Indian Rupees
 */
function numberToWords(num) {
  if (!num || isNaN(num)) return 'Zero Rupees Only';
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return '';
  let str = '';
  str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
  str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
  str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
  str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
  str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'Rupees Only' : 'Rupees Only';
  return str.trim();
}

const formatAmount = (amount) => {
  const numericAmount = Number(amount);
  return Number.isFinite(numericAmount)
    ? numericAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0.00';
};

const normalizeInvoiceNumber = (invoiceNumber) => {
  const value = String(invoiceNumber || 'MARMAX-INV-001').trim();
  return value.replace(/^SDF-/i, 'MARMAX-');
};

/**
 * Generate an Official Corporate / Institutional Tax Invoice PDF
 * @param {Object} data - { invoiceNumber, studentName, studentEmail, courseTitle, amountPaid, paymentDate, accessValidity }
 * @returns {Promise<Buffer>}
 */
const generateInvoicePDF = (data) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 40 });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      const amount = Number(data.amountPaid);
      const amountValue = Number.isFinite(amount) ? amount : 0;
      const formattedAmount = formatAmount(amountValue);

      // Use the current website branding first; keep the server asset only as a fallback.
      const logoCandidates = [
        path.join(__dirname, '../../client/public/logo.png'),
        path.join(__dirname, '../assets/logo.png')
      ];
      let logoPath = logoCandidates.find(p => fs.existsSync(p));

      // 1. Website-aligned light and gold header
      doc.rect(40, 40, 515, 110).fill('#FFFFFF');
      doc.rect(40, 40, 515, 4).fill('#D4AF37');
      doc.rect(40, 146, 515, 4).fill('#D4AF37');

      // 2. Organization Branding (Left)
      let headerTextX = 40;
      if (logoPath) {
        try {
          doc.image(logoPath, 48, 50, { fit: [58, 74], align: 'center', valign: 'center' });
          headerTextX = 116;
        } catch (e) {
          console.error("Logo image load error in PDF:", e);
        }
      }

      doc.fillColor('#111827')
        .fontSize(16.5)
         .font('Helvetica-Bold')
         .text('MarketMax Trading Academy', headerTextX, 52);

      doc.fillColor('#4B5563')
         .fontSize(8.5)
         .font('Helvetica')
         .text('Academy of Trading, Technical Analysis & Financial Market Sciences', headerTextX, 70)
         .text('Professional market education, live classes, and structured learning.', headerTextX, 81)
         .text('Hyderabad, Telangana - 500081, India', headerTextX, 92)
         .text('support@marketmaxtrading.com  |  marketmaxtrading.com', headerTextX, 103);

      // 3. Invoice Badge & Meta Box (Right)
      const rightColX = 370;
      doc.rect(rightColX, 52, 185, 24).fill('#D4AF37');
      doc.fillColor('#111827')
         .fontSize(12)
         .font('Helvetica-Bold')
         .text('TAX INVOICE / RECEIPT', rightColX, 59, { width: 185, align: 'center' });

      // Invoice Details Block
      doc.rect(rightColX, 80, 185, 62).strokeColor('#E5E7EB').fill('#F9FAFB');
      
      doc.fillColor('#374151')
         .fontSize(8)
         .font('Helvetica-Bold')
         .text('Invoice No:', rightColX + 8, 86)
         .font('Helvetica')
         .text(data.invoiceNumber || 'MarketMax-INV-001', rightColX + 65, 86)

         .font('Helvetica-Bold')
         .text('Date:', rightColX + 8, 98)
         .font('Helvetica')
         .text(data.paymentDate || new Date().toLocaleDateString('en-IN'), rightColX + 65, 98)

         .font('Helvetica-Bold')
         .text('Place of Supply:', rightColX + 8, 110)
         .font('Helvetica')
         .text('Telangana (36)', rightColX + 75, 110)

         .font('Helvetica-Bold')
         .text('Status:', rightColX + 8, 122)
         .fillColor('#16A34A')
         .font('Helvetica-Bold')
         .text('PAID (CONFIRMED)', rightColX + 65, 122);

      // Horizontal Divider
      doc.moveTo(40, 150).lineTo(555, 150).strokeColor('#E5E7EB').lineWidth(1).stroke();

      // 4. Billed To & Service Details (Two Column Container)
      const infoBoxY = 160;
      
      // Billed To Box (Left)
      doc.rect(40, infoBoxY, 250, 75).strokeColor('#E5E7EB').fill('#FFFFFF');
      doc.rect(40, infoBoxY, 250, 18).fill('#F3F4F6');
      doc.fillColor('#1F2937').fontSize(8.5).font('Helvetica-Bold').text('BILLED TO (LEARNER DETAILS):', 48, infoBoxY + 5);

      doc.fillColor('#111827')
         .fontSize(9.5)
         .font('Helvetica-Bold')
         .text(data.studentName || 'Learner', 48, infoBoxY + 24)
         .fontSize(8.5)
         .font('Helvetica')
         .fillColor('#4B5563')
         .text(`Email: ${data.studentEmail}`, 48, infoBoxY + 37)
         .text(`Account Type: Registered Online Student`, 48, infoBoxY + 48)
         .text(`Country / Currency: India (INR)`, 48, infoBoxY + 59);

      // Provider Details Box (Right)
      doc.rect(305, infoBoxY, 250, 75).strokeColor('#E5E7EB').fill('#FFFFFF');
      doc.rect(305, infoBoxY, 250, 18).fill('#F3F4F6');
      doc.fillColor('#1F2937').fontSize(8.5).font('Helvetica-Bold').text('SERVICE / DELIVERY PARTICULARS:', 313, infoBoxY + 5);

      doc.fillColor('#4B5563')
         .fontSize(8.5)
         .font('Helvetica')
         .text('Service Category: Online Live Educational Training', 313, infoBoxY + 24)
         .text('SAC Code: 999293 (Commercial Training & Education)', 313, infoBoxY + 36)
         .text('Mode of Delivery: Instant Digital Dashboard & Live Zoom', 313, infoBoxY + 48)
         .text('Fulfillment: 100% Electronic Access', 313, infoBoxY + 60);

      // 5. Itemized Table
      const tableTop = 248;
      
      // Table Header Row
      doc.rect(40, tableTop, 515, 22).fill('#D4AF37');
      doc.fillColor('#FFFFFF')
         .fontSize(8.5)
         .font('Helvetica-Bold')
         .text('#', 45, tableTop + 6, { width: 20 })
         .text('COURSE / PROGRAM DESCRIPTION', 70, tableTop + 6, { width: 235 })
         .text('SAC', 315, tableTop + 6, { width: 55, align: 'center' })
         .text('VALIDITY', 375, tableTop + 6, { width: 80, align: 'center' })
         .text('AMOUNT (INR)', 460, tableTop + 6, { width: 90, align: 'right' });

      // Table Data Row
      const rowTop = tableTop + 22;
      doc.rect(40, rowTop, 515, 38).strokeColor('#E5E7EB').fill('#FFFFFF');
      
      // Clean short format for validity
      let validityText = '2 Months';
      if (data.accessValidity) {
        validityText = data.accessValidity.replace(/after completion/i, '').replace(/on-demand access/i, '').trim();
        if (!validityText.toLowerCase().includes('month') && !validityText.toLowerCase().includes('year')) {
          validityText += ' Access';
        }
      }

      doc.fillColor('#111827')
         .fontSize(8.5)
         .font('Helvetica-Bold')
         .text('1', 45, rowTop + 8, { width: 20 })
         .text(data.courseTitle || 'Live Trading & Technical Analysis Curriculum', 70, rowTop + 8, { width: 235 })
         .fontSize(7.5)
         .font('Helvetica')
         .fillColor('#6B7280')
         .text('Daily Live Zoom Classes, Study Notes & Recordings', 70, rowTop + 21, { width: 235 })
         .fillColor('#374151')
         .fontSize(8.5)
         .text('999293', 315, rowTop + 12, { width: 55, align: 'center' })
         .text(validityText, 375, rowTop + 12, { width: 80, align: 'center' })
         .fillColor('#111827')
         .font('Helvetica-Bold')
         .fontSize(9.5)
         .text(`Rs. ${formattedAmount}`, 460, rowTop + 12, { width: 90, align: 'right', lineBreak: false });

      // 6. Summary and Calculation Box (Right) & Words Box (Left)
      const sumTop = rowTop + 48;

      // Amount in words box (Left)
      doc.rect(40, sumTop, 290, 85).strokeColor('#E5E7EB').fill('#F9FAFB');
      doc.fillColor('#374151')
         .fontSize(8)
         .font('Helvetica-Bold')
         .text('AMOUNT IN WORDS:', 48, sumTop + 8)
         .fontSize(9)
         .font('Helvetica-Bold')
         .fillColor('#D4AF37')
         .text(numberToWords(amountValue), 48, sumTop + 20, { width: 270 })
         .font('Helvetica')
         .fillColor('#6B7280')
         .fontSize(7.5)
         .text('Payment Gateway: Razorpay / UPI / Netbanking', 48, sumTop + 48)
         .text('Transaction Ref: Confirmed & Settled to MarketMax Account', 48, sumTop + 58)
         .text('Educational services eligible for GST exemption under Sec 12AA.', 48, sumTop + 68);

      // Financial Calculation Table (Right)
      doc.rect(340, sumTop, 215, 85).strokeColor('#E5E7EB').fill('#FFFFFF');
      
      const calcX = 348;
      const valX = 475;

      doc.fillColor('#4B5563')
         .fontSize(8)
         .font('Helvetica')
         .text('Taxable Subtotal:', calcX, sumTop + 8)
         .text(`Rs. ${formattedAmount}`, valX, sumTop + 8, { width: 70, align: 'right' })

         .text('CGST (0%):', calcX, sumTop + 20)
         .text('Rs. 0.00', valX, sumTop + 20, { width: 70, align: 'right' })

         .text('SGST (0%):', calcX, sumTop + 32)
         .text('Rs. 0.00', valX, sumTop + 32, { width: 70, align: 'right' });

      // Total Paid Highlight Bar
      doc.rect(340, sumTop + 46, 215, 39).fill('#F0FDF4');
      doc.rect(340, sumTop + 46, 215, 39).strokeColor('#86EFAC').stroke();

      doc.fillColor('#166534')
         .fontSize(9)
         .font('Helvetica-Bold')
         .text('TOTAL PAID:', calcX, sumTop + 54)
           .fontSize(18)
           .text(`Rs. ${formattedAmount}`, 415, sumTop + 58, { width: 130, align: 'right', lineBreak: false });

      // 7. Live Program Access Notes
      const notesTop = sumTop + 96;
      doc.rect(40, notesTop, 515, 52).fill('#FDFBF7').strokeColor('#E5E7EB').stroke();
      
      doc.fillColor('#7A5B08')
         .fontSize(8)
         .font('Helvetica-Bold')
         .text('IMPORTANT LEARNER NOTES & LIVE CLASS ACCESS:', 48, notesTop + 6);

      doc.fillColor('#4B5563')
         .fontSize(7.5)
         .font('Helvetica')
         .text('• Live Zoom links, daily class timetable, and curriculum access are activated instantly in your Student Dashboard (My Learning).', 48, notesTop + 18)
         .text('• On-demand video recordings and downloadable course revision guides are accessible for the full duration of your validity period.', 48, notesTop + 28)
         .text('• Official digital Certificate of Completion is awarded automatically upon completing 100% course sessions.', 48, notesTop + 38);

      // 8. Bottom Digital Signature & Official Seal
      const signTop = notesTop + 62;
      
      // Digital Seal Stamp (Left)
      doc.rect(40, signTop, 180, 52).strokeColor('#D4AF37').lineWidth(1).fill('#F0FDF4');
      doc.fillColor('#D4AF37')
         .fontSize(8)
         .font('Helvetica-Bold')
         .text('★ DIGITALLY VERIFIED DOCUMENT ★', 40, signTop + 7, { width: 180, align: 'center' })
         .fontSize(7)
         .font('Helvetica')
         .text('MarketMax Trading Academy Certified', 40, signTop + 19, { width: 180, align: 'center' })
         .text(`Hash: ${Buffer.from(data.invoiceNumber || 'MarketMax').toString('hex').slice(0, 16).toUpperCase()}`, 40, signTop + 29, { width: 180, align: 'center' })
         .text('Generated electronically via MarketMax Portal', 40, signTop + 39, { width: 180, align: 'center' });

      // Digital Signature (Right)
      const signX = 360;
      doc.moveTo(signX, signTop + 30).lineTo(550, signTop + 30).strokeColor('#4B5563').lineWidth(1).stroke();

      // Signature cursive styling
      doc.fillColor('#111827')
         .fontSize(14)
         .font('Times-BoldItalic')
         .text('MarketMax Trading Academy', signX, signTop + 12, { width: 190, align: 'center' });

      doc.fillColor('#374151')
         .fontSize(8)
         .font('Helvetica-Bold')
         .text('Authorized Finance Controller', signX, signTop + 34, { width: 190, align: 'center' })
         .fontSize(7)
         .font('Helvetica')
         .text('MarketMax Trading Academy • Accounts Department', signX, signTop + 44, { width: 190, align: 'center' });

      // 9. Bottom Footer
      doc.fillColor('#9CA3AF')
         .fontSize(7)
         .font('Helvetica')
         .text('This is a system-generated payment invoice issued by MarketMax Trading Academy. No physical signature is required.', 40, 770, { width: 515, align: 'center' })
         .text('support@marketmaxtrading.com  |  marketmaxtrading.com  |  © 2026 MarketMax Trading Academy', 40, 780, { width: 515, align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Generate a High-Resolution PDF Certificate of Completion with Official MarketMax Green & Gold Template,
 * Recipient Script Typography, Dynamic Course Title, Sidebar Metadata, and Instructor Details (No Signature).
 * @param {Object} data - { studentName, courseTitle, completionDate, certificateId, studentId, instructorName, instructorTitle, instructorSubtitle, category, level, duration }
 * @returns {Promise<Buffer>}
 */
const generateCertificatePDF = (data) => {
  return new Promise((resolve, reject) => {
    try {
      // Landscape A4 for certificate (841.89 x 595.28 pt)
      const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 0 });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      const width = doc.page.width;
      const height = doc.page.height;

      // Certificate Template Background Candidates
      const templateCandidates = [
        path.join(__dirname, '../../client/public/certificate_template.png'),
        path.join(__dirname, '../assets/certificate_template.jpg'),
        path.join(__dirname, '../../client/public/certificate_template.jpg')
      ];
      const templatePath = templateCandidates.find(p => fs.existsSync(p));

      if (templatePath) {
        doc.image(templatePath, 0, 0, { width, height });
      } else {
        // Fallback vintage background if template not found
        doc.rect(0, 0, width, height).fill('#FCFAF6');
        doc.rect(18, 18, width - 36, height - 36).strokeColor('#D4AF37').lineWidth(2).stroke();
      }

      // Register Google Script Font (Alex Brush) for authentic calligraphy name
      const fontCandidates = [
        path.join(__dirname, '../assets/fonts/AlexBrush-Regular.ttf'),
        path.join(__dirname, '../assets/fonts/GreatVibes-Regular.ttf')
      ];
      const scriptFontPath = fontCandidates.find(p => fs.existsSync(p));
      let scriptFont = 'Times-BoldItalic';
      if (scriptFontPath) {
        try {
          doc.registerFont('AlexBrushFont', scriptFontPath);
          scriptFont = 'AlexBrushFont';
        } catch (e) {
          console.error("Font registration error:", e);
        }
      }

      // 1. Overlay values onto the PNG template's three-column metadata band.
      const metaWidth = 145;

      // Issue Date (Under ISSUE DATE label)
      const issueDate = data.completionDate || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
      doc.fillColor('#F3D36A')
         .font('Helvetica-Bold')
        .fontSize(6.5)
        .text(issueDate, 380, 443, { width: metaWidth, align: 'left', lineBreak: false });

      let durationText = '30 Days (20 Hours)';
      if (data.duration) {
        durationText = data.duration.replace(/\s*\n\s*/g, ' ').replace(/\s+/g, ' ').trim();
      }

      doc.fillColor('#F3D36A')
         .font('Helvetica-Bold')
        .fontSize(6.5)
        .text(durationText, 620, 443, { width: metaWidth, align: 'left', lineBreak: false });

      // Certificate ID (Under CERTIFICATE ID label)
      const certId = data.certificateId || (data.studentId ? `MKTMAX${data.studentId}` : `MKTMAX${Date.now().toString().slice(-8)}`);
      doc.fillColor('#F3D36A')
         .font('Helvetica-Bold')
        .fontSize(6.5)
        .text(certId, 170, 443, { width: metaWidth, align: 'left', lineBreak: false });

      // 2. Recipient Name (Center, perfectly balanced above green line)
      const studentName = data.studentName || 'Learner Name';
      const nameLen = studentName.length;
      const fontSize = nameLen > 30 ? 28 : (nameLen > 22 ? 32 : (nameLen > 15 ? 36 : 40));

      const recipientFontSize = studentName.length > 28 ? 28 : 32;
      doc.fillColor('#F3D36A')
        .font(scriptFont)
        .fontSize(recipientFontSize)
        .text(studentName, 170, 264, { width: 500, align: 'center' });

      // 3. Course Title (Center, below 'has successfully completed the')
      const defaultCourse = 'Trading for Market and Inner Balance';
      const courseTitle = data.courseTitle || defaultCourse;

      if (courseTitle) {
        // Overlay the course title inside the template's outlined course box.
          doc.fillColor('#F3D36A')
            .font('Times-Bold')
            .fontSize(14)
            .text(courseTitle, 190, 340, { width: 460, align: 'center' });
      }

      // 4. Bottom Instructor Details & Director Details (Centered directly under the template diamond ornaments at x≈289.4pt and x≈536.9pt)
      // Left: Instructor Details
      const instWidth = 170;
      const instBoxX = 105;

      const instName = CERTIFICATE_SIGNATORY_NAME;

      doc.fillColor('#D4AF37')
        .font('Helvetica-Bold')
        .fontSize(8.5)
        .text(instName, instBoxX, 510, { width: instWidth, align: 'center' });

      // Right: Director Details
      const dirWidth = 170;
      const dirBoxX = 570;

      doc.fillColor('#D4AF37')
        .font('Helvetica-Bold')
        .fontSize(8.5)
        .text(CERTIFICATE_SIGNATORY_NAME, dirBoxX, 510, { width: dirWidth, align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  generateInvoicePDF,
  generateCertificatePDF,
  normalizeInvoiceNumber
};


