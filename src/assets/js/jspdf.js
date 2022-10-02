import { jsPDF } from 'jspdf';

onmessage = (e) => {
  try {
    const { selected, format, name, image, ratio } = e.data;
    console.log(ratio);
    const { w, h } = format;
    const r = w / h;
    const l = ratio > r;
    const ih = l ? (h * r) / ratio : h;
    const iw = l ? w : (w * ratio) / r;
    const ix = l ? 0 : (w - iw) / 2;
    const iy = l ? (h - ih) / 2 : 0;
    const jx = l ? 1 : 1 - ix;
    const jy = l ? 1.5 + iy * 3 : 1.5;
    const doc = new jsPDF({ format: 'a4', unit: 'in' });
    doc.setFontSize(12);
    doc.setLineWidth(0.01);
    doc.setLineDash([0.04], 0);
    doc.text(`${name} (ID-${selected})`, 1, 1);
    doc.addImage(image, 'png', 1 + ix, 1.5 + iy, iw, ih, 'license', 'slow', 0);
    doc.addImage(image, 'png', jx + w, jy, iw, ih, 'license', 'slow', 180);
    doc.roundedRect(1, 1.5, w, h, 0.125, 0.125);
    doc.roundedRect(1, 1.5 + h, w, h, 0.125, 0.125);
    postMessage(doc.output('blob'));
  } catch (e) {
    console.error(e);
    postMessage(null);
  }
};
