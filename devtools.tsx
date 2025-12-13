declare var chrome: any;

chrome.devtools.panels.create(
  "HTTP Tool",
  "", // Icon path
  "panel.html",
  (panel: any) => {
    console.log("Panel created");
  }
);