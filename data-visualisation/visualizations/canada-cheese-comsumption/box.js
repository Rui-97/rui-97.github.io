function Box(x, y, width, height, category) {
  //public properites---------------------
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.category = category.name;

  //methods----------------------------------
  this.isMouseOver = function (mouseX, mouseY) {
    let dis = dist(
      mouseX,
      mouseY,
      this.x + this.width / 2,
      this.y + this.height / 2
    );
    if (dis <= this.width / 2) {
      return true;
    }
  };
  this.draw = function () {
    fill(category.color);
    rect(this.x, this.y, this.width, this.height);
  };
}
