/**
 * The Controls class initializes the input listeners and tracks changes.
 */
export class Controls {
    constructor() {
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        this.upR = false;
        this.downR = false;
        this.leftR = false;
        this.rightR = false;
        this.spacebar = false;
        this.e = false;
        this.lClickDown = false;
        this.mClickDown = false;
        this.rClickDown = false;
        this.test = 'test';
        this.currentPos = 0;
        this.lastDir = 0;
        this.initListeners(this);
    }
    initListeners(x) {
        document.addEventListener('mousedown', function(evt) {
            switch (evt.button) {
                case 0:
                    x.lClickDown = true;
                    break;
                case 1:
                    x.mClickDown = true;
                    break;
                case 2:
                    x.rClickDown = true;
                    break;
            }
            x.mouseX = evt.clientX;
            x.mouseY = evt.clientY;
        });
        document.addEventListener('mouseup', function(evt) {
            switch (evt.button) {
                case 0:
                    x.lClickDown = false;
                    break;
                case 1:
                    x.mClickDown = false;
                    break;
                case 2:
                    x.rClickDown = false;
                    break;
            }
            x.mouseX = evt.clientX;
            x.mouseY = evt.clientY;
        });
        document.addEventListener('keydown', function(evt) {
            switch (evt.keyCode) {
                case 87: //up
                    if (!x.up) {
                        x.up = true;
                        x.lastDir = 1;
                    }
                    break;
                case 83: //down
                    if (!x.down) {
                        x.down = true;
                        x.lastDir = 3;
                    }
                    break;
                case 65: //left
                    if (!x.left) {
                        x.left = true;
                        x.lastDir = 0;
                    }
                    break;
                case 68: //right
                    if (!x.right) {
                        x.right = true;
                        x.lastDir = 2;
                    }
                    break;
                case 38: //upR
                    if (!x.upR) {
                        x.upR = true;
                        x.lastDir = 1;
                    }
                    break;
                case 40: //downR
                    if (!x.downR) {
                        x.downR = true;
                        x.lastDir = 3;
                    }
                    break;
                case 37: //leftR
                    if (!x.leftR) {
                        x.leftR = true;
                        x.lastDir = 0;
                    }
                    break;
                case 39: //rightR
                    if (!x.rightR) {
                        x.rightR = true;
                        x.lastDir = 2;
                    }
                    break;
                case 32:
                    x.spacebar = true;
                    break;
                case 69: //e
                    if (!x.e) {
                        x.e = true;
                    }
                    break;
                case 84: //t
                    x.t = true;
                    break;
            }
        });
        document.addEventListener('keyup', function(evt) {
            switch (evt.keyCode) {
                case 87: //up
                    x.up = false;
                    break;
                case 83: //down
                    x.down = false;
                    break;
                case 65: //left
                    x.left = false;
                    break;
                case 68: //right
                    x.right = false;
                    break;
                case 38: //upR
                    x.upR = false;
                    break;
                case 40: //downR
                    x.downR = false;
                    break;
                case 37: //leftR
                    x.leftR = false;
                    break;
                case 39: //rightR
                    x.rightR = false;
                    break;
                case 32:
                    x.spacebar = false;
                    break;
                case 69: //e
                    x.e = false;
                    break;
                case 27: // Escape
                    break;
                case 84: //t
                    x.t = false;
                    break;
                case 89: //y
                    //toggleFullScreen();
                    break;
                    //debug
                case 96:
                case 97:
                case 98:
                case 99:
                case 100:
                case 101:
                case 102:
                case 103:
                case 104:
                case 105:
                    break;
            }
        });

        /* Mobile controls
          id("left").addEventListener("touchstart", function () {
              debug.log("Left key");
              if (!x.left) {
                  x.left = true;
                  x.lastDir = 0;
                  id("left").style.transform = "scale(1.5)";
                  id("left").style.opacity = "1";
              }
          });
  
          id("right").addEventListener("touchstart", function () {
              debug.log("Right key");
              if (!x.right) {
                  x.right = true;
                  x.lastDir = 2;
                  id("right").style.transform = "scale(1.5)";
                  id("right").style.opacity = "1";
              }
          });
  
          id("up").addEventListener("touchstart", function () {
              debug.log("Up key");
              if (!x.up) {
                  x.up = true;
                  id("up").style.transform = "scale(1.5)";
                  id("up").style.opacity = "1";
                  x.lastDir = 1;
              }
          });
          id("down").addEventListener("touchstart", function () {
              debug.log("E key");
              if (!x.e) {
                  x.e = true;
                  id("down").style.transform = "scale(1.5)";
                  id("down").style.opacity = "1";
              }
          });
          id("left").addEventListener("touchend", function () {
              x.left = false;
              id("left").style.transform = "";
              id("left").style.opacity = "0.5";
          });
          id("right").addEventListener("touchend", function () {
              x.right = false;
              id("right").style.transform = "";
              id("right").style.opacity = "0.5";
          });
          id("up").addEventListener("touchend", function () {
              x.up = false;
              id("up").style.transform = "";
              id("up").style.opacity = "0.5";
          });
          id("down").addEventListener("touchend", function () {
              x.e = false;
              id("down").style.transform = "";
              id("down").style.opacity = "0.5";
          });
          //*/
    }
}