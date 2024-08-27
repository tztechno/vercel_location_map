function doGet() {
  const sheet = SpreadsheetApp.openById('1CvTR1rBtgcKHEADwZAksmOVxXQO_GF6297xRSaQxma4').getSheetByName('trace');
  const data = sheet.getDataRange().getValues();

  const geojson = {
    "type": "FeatureCollection",
    "features": data.slice(1).map(row => {
      const coordinates = parseWKT(row[0]);

      return {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": coordinates
        },
        "properties": {
          "name": row[2]  // 任意のプロパティ
        }
      };
    })
  };

  return ContentService.createTextOutput(JSON.stringify(geojson)).setMimeType(ContentService.MimeType.JSON);
}
