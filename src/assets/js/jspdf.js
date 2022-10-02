import { jsPDF } from 'jspdf';

onmessage = (e) => {
  const { selected, format, name, image } = e.data;
  const { w, h } = format;
  try {
    const doc = new jsPDF({ format: 'a4', unit: 'in' });
    doc.setFontSize(12);
    doc.setLineWidth(0.01);
    doc.setLineDash([0.04], 0);
    doc.text(`${name} (ID-${selected})`, 1, 1);
    doc.addImage(image, 'png', 1, 1.5, w, h, 'license', 'slow', 0);
    doc.addImage(image, 'png', 1 + w, 1.5, w, h, 'license', 'slow', 180);
    doc.roundedRect(1, 1.5, w, h, 0.125, 0.125);
    doc.roundedRect(1, 1.5 + h, w, h, 0.125, 0.125);
    postMessage(doc.output('blob'));
  } catch (e) {
    postMessage(null);
  }
};
