import jsPDF from 'jspdf';
import { TraineeStudent, WeekPlan } from '../types/planner';
import { CATEGORIES } from '../data/categoriesAndPresets';

export function exportWeeklyPlannerToPdf(
  trainee: TraineeStudent,
  weekPlan: WeekPlan,
  monthName: string,
  year: number
) {
  // Create A4 Landscape PDF (297mm x 210mm)
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 297;
  const pageHeight = 210;
  const margin = 10;
  const contentWidth = pageWidth - margin * 2; // 277mm

  // --- 1. HEADER BRANDING BAR ---
  // Dark slate banner
  doc.setFillColor(15, 23, 42); // #0f172a
  doc.rect(margin, margin, contentWidth, 14, 'F');

  // Taxi amber accent block
  doc.setFillColor(245, 158, 11); // #f59e0b
  doc.rect(margin, margin, 5, 14, 'F');

  // Brand title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('SMART TAXI SOLUTIONS — DRIVER TRAINING & STUDY PLANNER', margin + 8, margin + 6.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text('Council Licensing Academy • SERU • Topographical • Highway Code • Safeguarding', margin + 8, margin + 11);

  // Month & Week on right of banner
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(245, 158, 11); // amber
  const monthWeekText = `${monthName.toUpperCase()} ${year} — WEEK ${weekPlan.weekNumber}`;
  doc.text(monthWeekText, pageWidth - margin - 4, margin + 6.5, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(226, 232, 240);
  doc.text(weekPlan.dateRange || `Week ${weekPlan.weekNumber}`, pageWidth - margin - 4, margin + 11, { align: 'right' });

  // --- 2. TRAINEE DOSSIER STRIP ---
  const dossierY = margin + 15.5;
  const dossierHeight = 11;
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.setLineWidth(0.3);
  doc.rect(margin, dossierY, contentWidth, dossierHeight, 'FD');

  const colW = contentWidth / 4;

  // Trainee & Phone
  doc.setTextColor(100, 116, 139); // slate-500
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.text('CANDIDATE NAME:', margin + 3, dossierY + 4);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8.5);
  doc.text(trainee.fullName, margin + 3, dossierY + 8.5);

  // Phone & Ref
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(6.5);
  doc.text('UK PHONE / REF:', margin + colW + 3, dossierY + 4);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8);
  doc.text(`${trainee.phoneNumber} (${trainee.applicationRef || 'N/A'})`, margin + colW + 3, dossierY + 8.5);

  // Council Authority
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(6.5);
  doc.text('LICENSING COUNCIL:', margin + colW * 2 + 3, dossierY + 4);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8);
  doc.text(trainee.council, margin + colW * 2 + 3, dossierY + 8.5);

  // Badge Type & Exam Date
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(6.5);
  doc.text('BADGE TYPE & EXAM DATE:', margin + colW * 3 + 3, dossierY + 4);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8);
  const examInfo = trainee.examDate ? `${trainee.badgeType} • Exam: ${trainee.examDate}` : trainee.badgeType;
  doc.text(examInfo, margin + colW * 3 + 3, dossierY + 8.5);

  // --- 3. THE 6-COLUMN WEEKLY PLANNER GRID ---
  const gridY = dossierY + dossierHeight + 2;
  const gridHeight = 153;
  const gridColWidth = contentWidth / 6; // ~46.16mm per column

  const weekdays = [
    { label: 'MONDAY', schedule: weekPlan.days.monday },
    { label: 'TUESDAY', schedule: weekPlan.days.tuesday },
    { label: 'WEDNESDAY', schedule: weekPlan.days.wednesday },
    { label: 'THURSDAY', schedule: weekPlan.days.thursday },
    { label: 'FRIDAY', schedule: weekPlan.days.friday },
  ];

  // Helper to draw clean text lines that fit into cell width
  const renderCellText = (
    text: string,
    x: number,
    y: number,
    maxW: number,
    isCompleted: boolean,
    fontSize: number = 6.5,
    maxLines: number = 2
  ) => {
    if (!text) return;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(fontSize);
    if (isCompleted) {
      doc.setTextColor(148, 163, 184); // slate-400
    } else {
      doc.setTextColor(30, 41, 59); // slate-800
    }
    const lines = doc.splitTextToSize(text, maxW);
    const displayed = lines.slice(0, maxLines);
    displayed.forEach((line: string, lIdx: number) => {
      doc.text(line, x, y + lIdx * (fontSize * 0.45));
    });
  };

  // Render 5 Weekdays
  weekdays.forEach(({ label, schedule }, colIdx) => {
    const x = margin + colIdx * gridColWidth;

    // Outer column boundary
    doc.setDrawColor(148, 163, 184);
    doc.setLineWidth(0.3);
    doc.rect(x, gridY, gridColWidth, gridHeight);

    // 1. Column Day Header (Slate-700)
    doc.setFillColor(51, 65, 85); // slate-700
    doc.rect(x, gridY, gridColWidth, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(label, x + 2.5, gridY + 5.5);

    // Date box
    doc.setFillColor(255, 255, 255);
    doc.rect(x + gridColWidth - 7, gridY + 1.2, 5.5, 5.5, 'F');
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(7.5);
    doc.text(schedule.dateNumber.toString(), x + gridColWidth - 4.2, gridY + 5.2, { align: 'center' });

    // 2. Morning Prep Section
    const morningY = gridY + 8;
    const morningHeight = 15;
    doc.setFillColor(241, 245, 249); // slate-100
    doc.rect(x, morningY, gridColWidth, morningHeight, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.line(x, morningY + morningHeight, x + gridColWidth, morningY + morningHeight);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.5);
    doc.setTextColor(71, 85, 105);
    doc.text('MORNING PREP (08:00)', x + 2, morningY + 3.5);

    if (schedule.morningPrep.title) {
      const mark = schedule.morningPrep.completed ? '[✓] ' : '[ ] ';
      renderCellText(mark + schedule.morningPrep.title, x + 2, morningY + 7, gridColWidth - 4, schedule.morningPrep.completed, 6.2, 2);
    }

    // 3. Training Modules (7 slots)
    const modulesStartY = morningY + morningHeight;
    const slotHeight = 16.5; // 16.5 * 7 = 115.5mm

    schedule.trainingModules.forEach((mod, mIdx) => {
      const slotY = modulesStartY + mIdx * slotHeight;

      // Divider line
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.2);
      doc.line(x, slotY, x + gridColWidth, slotY);

      // Slot index and time
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(5);
      doc.setTextColor(148, 163, 184);
      const timeStr = mod.time ? mod.time.split(' - ')[0] : `Slot ${mIdx + 1}`;
      doc.text(`SLOT ${mIdx + 1} • ${timeStr}`, x + 2, slotY + 3.2);

      // Category chip text
      const cat = CATEGORIES[mod.category] || CATEGORIES.topographical;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(5);
      doc.setTextColor(180, 83, 9); // amber/slate
      doc.text(cat.shortLabel.toUpperCase(), x + gridColWidth - 2, slotY + 3.2, { align: 'right' });

      // Title
      if (mod.title) {
        const mark = mod.completed ? '[✓] ' : '[ ] ';
        renderCellText(mark + mod.title, x + 2, slotY + 6.8, gridColWidth - 4, mod.completed, 6, 2);
      }
    });

    // 4. Evening Practice Section
    const eveningY = modulesStartY + slotHeight * 7;
    const eveningHeight = gridHeight - (eveningY - gridY);
    doc.setFillColor(241, 245, 249);
    doc.rect(x, eveningY, gridColWidth, eveningHeight, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.line(x, eveningY, x + gridColWidth, eveningY);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.5);
    doc.setTextColor(71, 85, 105);
    doc.text('EVENING PRACTICE (17:30)', x + 2, eveningY + 3.5);

    if (schedule.eveningPractice.title) {
      const mark = schedule.eveningPractice.completed ? '[✓] ' : '[ ] ';
      renderCellText(mark + schedule.eveningPractice.title, x + 2, eveningY + 7, gridColWidth - 4, schedule.eveningPractice.completed, 6.2, 2);
    }
  });

  // --- COLUMN 6: SATURDAY, SUNDAY & STRUCTURED NOTES ---
  const rightColX = margin + 5 * gridColWidth;
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.3);
  doc.rect(rightColX, gridY, gridColWidth, gridHeight);

  // 1. Saturday Header
  doc.setFillColor(51, 65, 85);
  doc.rect(rightColX, gridY, gridColWidth, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('SATURDAY', rightColX + 2.5, gridY + 5.5);

  // Date box
  doc.setFillColor(255, 255, 255);
  doc.rect(rightColX + gridColWidth - 7, gridY + 1.2, 5.5, 5.5, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(7.5);
  doc.text(weekPlan.saturday.dateNumber.toString(), rightColX + gridColWidth - 4.2, gridY + 5.2, { align: 'center' });

  // Saturday Tasks
  const satBodyY = gridY + 9;
  let curSatY = satBodyY;
  weekPlan.saturday.tasks.forEach((t) => {
    if (t.title) {
      const mark = t.completed ? '[✓] ' : '[ ] ';
      renderCellText(mark + t.title, rightColX + 2, curSatY, gridColWidth - 4, t.completed, 6, 2);
      curSatY += 7.5;
    }
  });

  // 2. Sunday Header
  const sunHeaderY = gridY + 38;
  doc.setDrawColor(203, 213, 225);
  doc.line(rightColX, sunHeaderY, rightColX + gridColWidth, sunHeaderY);

  doc.setFillColor(51, 65, 85);
  doc.rect(rightColX, sunHeaderY, gridColWidth, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('SUNDAY', rightColX + 2.5, sunHeaderY + 5.5);

  // Sunday Date box
  doc.setFillColor(255, 255, 255);
  doc.rect(rightColX + gridColWidth - 7, sunHeaderY + 1.2, 5.5, 5.5, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(7.5);
  doc.text(weekPlan.sunday.dateNumber.toString(), rightColX + gridColWidth - 4.2, sunHeaderY + 5.2, { align: 'center' });

  // Sunday Tasks
  let curSunY = sunHeaderY + 10;
  weekPlan.sunday.tasks.forEach((t) => {
    if (t.title) {
      const mark = t.completed ? '[✓] ' : '[ ] ';
      renderCellText(mark + t.title, rightColX + 2, curSunY, gridColWidth - 4, t.completed, 6, 2);
      curSunY += 7.5;
    }
  });

  // 3. Structured Notes & Instructor Feedback
  const notesHeaderY = sunHeaderY + 38;
  doc.setDrawColor(203, 213, 225);
  doc.line(rightColX, notesHeaderY, rightColX + gridColWidth, notesHeaderY);

  doc.setFillColor(254, 243, 199); // amber-100
  doc.rect(rightColX, notesHeaderY, gridColWidth, 6, 'F');
  doc.setTextColor(146, 64, 14); // amber-800
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.text('INSTRUCTOR NOTES & WEAK AREAS', rightColX + 2, notesHeaderY + 4.2);

  // Lined notes box
  const notesContentY = notesHeaderY + 7;
  const notesHeight = gridHeight - (notesContentY - gridY) - 1;
  doc.setFillColor(255, 255, 255);
  doc.rect(rightColX, notesContentY, gridColWidth, notesHeight, 'F');

  if (weekPlan.notes) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(30, 41, 59);
    const noteLines = doc.splitTextToSize(weekPlan.notes, gridColWidth - 4);
    noteLines.slice(0, 18).forEach((nl: string, idx: number) => {
      doc.text(nl, rightColX + 2, notesContentY + 3.5 + idx * 3.4);
    });
  } else {
    // Draw guide lines if empty
    doc.setDrawColor(241, 245, 249);
    for (let l = 1; l <= 14; l++) {
      doc.line(rightColX + 2, notesContentY + l * 4, rightColX + gridColWidth - 2, notesContentY + l * 4);
    }
  }

  // --- 4. SIGN-OFF FOOTER ---
  const footerY = pageHeight - margin - 5;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.line(margin, footerY - 2, pageWidth - margin, footerY - 2);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(51, 65, 85);
  doc.text('Trainee Signature:', margin + 3, footerY + 2);
  doc.setDrawColor(148, 163, 184);
  doc.line(margin + 28, footerY + 2, margin + 85, footerY + 2);

  doc.text('Lead Instructor Sign-off:', margin + 95, footerY + 2);
  doc.line(margin + 128, footerY + 2, margin + 185, footerY + 2);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Smart Taxi Solutions • Council Licensing Portfolio Form STS-W8 • Verified Document', pageWidth - margin - 3, footerY + 2, { align: 'right' });

  // Save the PDF
  const cleanName = trainee.fullName.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `${cleanName}_Weekly_Study_Planner_Week_${weekPlan.weekNumber}_${monthName}_${year}.pdf`;
  doc.save(filename);
}
