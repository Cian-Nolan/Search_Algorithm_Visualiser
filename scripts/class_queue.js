class queue {
    constructor() {
      this.arr = new Array();
    }
  
    empty() {
      return (this.arr.length == 0);
    }
  
    top() {
      let ret = (this.arr.length != 0) ? this.arr[0] : -1;
      return ret;
    }
  
    push(val) {
      this.arr[this.arr.length] = val;
    }
  
    pop() {
      if (this.arr.length != 0) {
        for (let i = 0; i < this.arr.length - 1; i++) {
          this.arr[i] = this.arr[i + 1];
        }
        this.arr.length--;
      }
    }
  }