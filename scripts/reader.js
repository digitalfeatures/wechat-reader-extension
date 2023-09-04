const ICON = {};

class CSSUnit {
  static toPXUnit(value) {
    return `${value}px`;
  }
}

function main() {
  let widthOfNotePanel = 0;
  let widthOfCatalog = 0;
  let widthOfControls = 0;

  {
    const targets = document.getElementsByClassName("app_content");
    if (targets.length) {
      const target = targets[0];
      const { offsetWidth } = target;
      const delta = window.innerWidth - offsetWidth;

      target.style["margin-right"] = CSSUnit.toPXUnit(delta);

      widthOfNotePanel = delta;
      widthOfCatalog = delta;
      widthOfControls = delta;
    }
  }

  {
    const targets = document.getElementsByClassName("readerNotePanel");
    if (targets.length) {
      const target = targets[0];

      target.style["display"] = "flex";

      target.style["z-index"] = 0;

      target.style["width"] = CSSUnit.toPXUnit(widthOfNotePanel);

      target.style["left"] = "unset";
      target.style["right"] = CSSUnit.toPXUnit(0);
    }
  }

  {
    const targets = document.getElementsByClassName("readerNotePanelBottomBar");
    if (targets.length) {
      const target = targets[0];

      target.style["margin-bottom"] = CSSUnit.toPXUnit(74);
    }
  }

  {
    const targets = document.getElementsByClassName("readerCatalog");
    if (targets.length) {
      const target = targets[0];

      target.style["width"] = CSSUnit.toPXUnit(widthOfNotePanel);

      target.style["right"] = CSSUnit.toPXUnit(0);
      target.style["left"] = "unset";
    }
  }

  {
    const targets = document.getElementsByClassName("readerControls");
    if (targets.length) {
      const target = targets[0];

      target.style["border-top"] = "1px solid rgba(238,240,244,.1)";

      target.style["display"] = "flex";
      target.style["flex-direction"] = "row";
      target.style["justify-content"] = "space-around";
      target.style["align-items"] = "center";

      target.style["width"] = CSSUnit.toPXUnit(widthOfControls);
      target.style["height"] = CSSUnit.toPXUnit(74);

      target.style["left"] = "unset";
      target.style["right"] = CSSUnit.toPXUnit(0);
      target.style["bottom"] = CSSUnit.toPXUnit(0);

      for (let i = 0; i < target.children.length; i++) {
        const child = target.children[i];

        child.style["margin-top"] = "unset";

        child.style["background-color"] = "transparent";
        child.style["box-shadow"] = "none";

        if (child.className.includes("note")) {
          child.style["display"] = "none";
        }

        if (child.className.includes("readerControls_fontSize")) {
          child.style["background-color"] = "transparent";
        }
      }
    }
  }
}

(function () {
  setTimeout(() => {
    main();
  }, 10 * 1000);
})();
