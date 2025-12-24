declare var chrome: any;

chrome.devtools.panels.create(
  "XApi",
  "", // Icon path
  "panel.html",
  (panel: any) => {
    console.log("Panel created");
  }
);