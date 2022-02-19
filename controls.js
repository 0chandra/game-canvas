class Control {
  constructor() {
    this.keys = [];

    this.keyDown = function (e) {
      if (
        e.key == "ArrowUp" ||
        e.key == "ArrowRight" ||
        e.key == "ArrowLeft" ||
        e.key == "ArrowDown" ||
        e.key == "Control" ||
        e.key == "Alt" ||
        e.key == "Shift"
      ) {
        e.preventDefault();
        if (this.keys.indexOf(e.key) == -1) {
          this.keys.push(e.key);
        }
      }
    };

    this.keyUp = function (e) {
      if (
        e.key == "ArrowUp" ||
        e.key == "ArrowRight" ||
        e.key == "ArrowLeft" ||
        e.key == "ArrowDown" ||
        e.key == "Control" ||
        e.key == "Alt" ||
        e.key == "Shift"
      ) {
        e.preventDefault();
        this.keys.splice(this.keys.indexOf(e.key), 1);
      }
    };
  }
}
