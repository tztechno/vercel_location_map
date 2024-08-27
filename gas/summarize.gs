function doGet() {
  try {
    summarizeCsvDataToSheet();
    return ContentService.createTextOutput('処理が完了しました。');
  } catch (error) {
    return ContentService.createTextOutput('エラーが発生しました: ' + error.toString());
  }
}

function summarizeCsvDataToSheet() {
  try {
    const folderId = '1lowkQmIovdnZ2Z1pWwKm5q9uouR529ue';
    const spreadsheetId = '1CvTR1rBtgcKHEADwZAksmOVxXQO_GF6297xRSaQxma4';
    const sheetName = 'trace';

    let sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
    if (!sheet) {
      sheet = SpreadsheetApp.openById(spreadsheetId).insertSheet(sheetName);
    }
    sheet.clear();
    sheet.appendRow(['WKT', 'time', 'name']);

    const folder = DriveApp.getFolderById(folderId);
    const files = folder.getFiles();
    const batchSize = 10; // 一度に処理するファイル数
    let fileArray = [];

    while (files.hasNext()) {
      fileArray.push(files.next());
      if (fileArray.length === batchSize) {
        processFiles(fileArray, sheet);
        fileArray = [];
      }
    }

    if (fileArray.length > 0) {
      processFiles(fileArray, sheet);
    }

    Logger.log('処理が完了しました。');
  } catch (error) {
    Logger.log('エラーが発生しました: ' + error.toString());
  }
}

function processFiles(files, sheet) {
  files.forEach(file => {
    const content = file.getBlob().getDataAsString().trim();
    const rows = content.split('\n').map(row => row.split(',').map(cell => cell.trim()));

    if (rows.length > 1 && rows[1].length >= 3) {
      const point = rows[1][0];
      const time = rows[1][1];
      const name = rows[1][2];

      const dataToAppend = [String(point), String(time), String(name)];
      sheet.appendRow(dataToAppend);
    }
  });
}
