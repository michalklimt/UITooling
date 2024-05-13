document.addEventListener("DOMContentLoaded", () => {
  const csvUrl = document.body.getAttribute('data-csv-url');

  if (csvUrl) {
    fetch(csvUrl)
      .then(response => response.text())
      .then(data => {
        let rows = data.split("\n").map(row => row.trim()).filter(row => row); // Remove empty rows
        if (rows.length > 0) {
          createTable(rows);
        }
      }).catch(error => console.error("Error loading CSV:", error));
  } else {
    console.log("CSV file URL not found.");
  }
});

function createTable(rows) {
  let table = "<table><thead><tr>";
  let headers = rows[0].split(",");
  let logoUrlIndex = headers.findIndex(header => header.trim() === "Logo URL");

  if (logoUrlIndex === -1) {
    console.error("Column 'Logo URL' not found.");
    return; // Exit the function if Logo URL column is not found
  }

  // Add header for logo image and other headers
  table += `<th>Logo</th>`;
  headers.forEach(header => {
    if (!["Category Primary", "Direct Link", "Subcategory", "Logo URL", "Description"].includes(header.trim())) {
      table += `<th>${header.trim()}</th>`;
    }
  });
  table += "<th class='column-action'>Action</th></tr></thead><tbody>";

  rows.slice(1).forEach((row, rowIndex) => {
    let columns = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/g);
    // Fill in the missing cells to match the headers length
    while (columns.length < headers.length) {
      columns.push("");
    }

    table += "<tr>";
    let logoUrl = columns[logoUrlIndex] ? columns[logoUrlIndex].replace(/^"|"$/g, '').trim() : "placeholder-image-url.png"; // Use placeholder if the logo URL is missing
    table += `<td><img src="${logoUrl}" class="logo-image"></td>`;

    headers.forEach((header, headerIndex) => {
      if (!["Category Primary", "Direct Link", "Subcategory", "Logo URL", "Description"].includes(header.trim())) {
        let cellValue = columns[headerIndex].replace(/^"|"$/g, '').trim();
        table += `<td>${cellValue}</td>`;
      }
    });

    let linkColumnIndex = headers.indexOf("Direct Link");
    let cleanLink = columns[linkColumnIndex].replace(/^"|"$/g, '').trim() || "#";
    table += `<td class='column-action'><a href="${cleanLink}" class="link-button" target="_blank">Go to page →</a></td>`;

    table += "</tr>";
  });

  table += "</tbody></table>";
  document.querySelector(".table-wrapper").innerHTML = table;
}
