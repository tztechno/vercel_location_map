function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const wkt = data.wkt;
  const time = data.time;
  const name = data.name;  // nameを取得

  const folderId = '1lowkQmIovdnZ2Z1pWwKm5q9uouR529ue';
  const folder = DriveApp.getFolderById(folderId);
  
  const fileName = `${time}.csv`;
  const content = `WKT,time,name\n${wkt},${time},${name}`;
  
  folder.createFile(fileName, content);
  
  return ContentService.createTextOutput("Data saved successfully");
}

