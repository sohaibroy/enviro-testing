"use client";

import jsPDF from "jspdf";

const DownloadEstimate = ({ cartItems, subtotal, gst, totalAmount }) => {

  const formatToCADPrice = (number) =>
    Number(number).toLocaleString("en-CA", {
      style: "currency",
      currency: "CAD",
    }
    );

  const EstimateDownload = () => {
    if (cartItems.length === 0) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let verticalPos = margin;

    // PDF Styling
    const primaryColor = [0, 51, 102];
    const secondaryColor = [102, 102, 102];
    const titleFontSize = 18;
    const headingFontSize = 14;
    const bodyFontSize = 12;

    //Header
    doc.setFontSize(titleFontSize);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text("Enviro Works Estimate", pageWidth / 2, verticalPos, { align: "center" });
    verticalPos += 10;

    //Date
    doc.setFontSize(bodyFontSize);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...secondaryColor);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - margin, verticalPos, { align: "right" });
    verticalPos += 15;

    // Add Analyte information
    cartItems.forEach((item, index) => {
      if (verticalPos > doc.internal.pageSize.getHeight() - 50) {
        doc.addPage();
        verticalPos = margin;
      }

      // Analyte Name
      doc.setFontSize(headingFontSize);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...primaryColor);
      doc.text(`${item.analyte_name}`, margin, verticalPos);
      verticalPos += 10;

      // Method Name 
      doc.setFontSize(bodyFontSize);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...secondaryColor);
      doc.text(`Method: ${item.method_name}`, margin, verticalPos);
      verticalPos += 8;

      // Pricing
      doc.text(`Price: ${formatToCADPrice(
        item.selectedTurnaroundTime.price * item.required_quantity
      )}`, margin, verticalPos);
      verticalPos += 8;

      // Quantity Details
      doc.text(`Quantity: ${item.required_quantity}`, margin, verticalPos);
      verticalPos += 8;
      doc.text(`Pumps Required: ${item.required_pumps}`, margin, verticalPos);
      verticalPos += 8;
      doc.text(`Media Required: ${item.required_media}`, margin, verticalPos);
      verticalPos += 8;

      // Turnaround Time
      doc.text(`Turnaround: ${item.selectedTurnaroundTime.turnaround_time}`, margin, verticalPos);
      verticalPos += 8;

      // Comments
      if (item.customer_comment) {
        const comments = doc.splitTextToSize(
          `Comments: ${item.customer_comment}`,
          pageWidth - margin * 2
        );
        doc.text(comments, margin, verticalPos);
        verticalPos += comments.length * 8;
      }
    });

    // Subtotal
    doc.setFontSize(bodyFontSize);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...secondaryColor);
    doc.text(`Subtotal: ${formatToCADPrice(subtotal)}`, margin, verticalPos);
    verticalPos += 8;

    // GST
    doc.text(`GST (5%): ${formatToCADPrice(gst)}`, margin, verticalPos);
    verticalPos += 8;

    // Total
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text(`Total Amount: ${formatToCADPrice(totalAmount)}`, margin, verticalPos);
    verticalPos += 15;
    
    doc.setLineWidth(0.2);
    doc.setDrawColor(...primaryColor);
    doc.line(margin, verticalPos, pageWidth - margin, verticalPos);
    verticalPos += 15;
    
    //Footer
    doc.setFontSize(10);
    doc.setTextColor(...secondaryColor);
    doc.text(
      "Thank you for choosing Enviro Works",
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );

    doc.save(`EnviroWorks-Estimate.pdf`);
  };

  return (
    <button
      onClick={EstimateDownload}
      disabled={cartItems.length === 0}
      className={`bg-enviro_blue text-white px-6 py-2 rounded-md transition-all duration-300 ${cartItems.length === 0
        ? "opacity-50 cursor-not-allowed"
        : "hover:bg-[#002f6c]"
        }`}
    >
      Download Estimate
    </button>
  );
};

export default DownloadEstimate;