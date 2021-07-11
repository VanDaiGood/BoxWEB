export default function html([first, ...strings], ...values) {
    //hàm check, fix lại các thẻ html dưới dạng string để inner ra thẻ html
  return values
    .reduce((acc, cur) => acc.concat(cur, strings.shift()), [first])
    .filter((x) => (x && x !== true) || x === 0)
    .join("");
}

export function createStore(reducer) { 
// đầu tiên store sẽ lưu trữ thông tin ban đầu
//==> hàm reducer sẽ trả về dữ liệu ban đầu reducer.js:1,2,3
  let state = reducer();  
  const roots = new Map(); // roots: lưu trữ những thay đổi view: thẻ html

  // hàm: khi store thay đổi thì view cũng phải thay đổi
  function render() {
    //lap qua roots de render ra view
    for (const [root, component] of roots) {
      // component=> thành phần chứa giá trị của view
      const output = component(); // tra ve the html
      root.innerHTML = output;
    }
  }
  return { // return về 1 object bao gồm 3 hàm
    attach(component, root) {  // root là key, component là value
      // hàm nhận view để đẩy ra cac root (root ở đây là các thẻ html tượng trưng)
      roots.set(root, component); // lúc này roots sẽ có dữ liệu nên sẽ cần render lại
      render();
    },
    // hàm kết nối store vào view : gồm selector để lựa chọn view để lấy dữ liệu phù họp
    connect(selector = state => state) {
      // nhưng vẫn lấy hết state làm mặc định
      return component => (props, ...args) => 
        // props:những công cụ, dữ liệu mà mình muốn truyền vào component sau này
          component(Object.assign({}, props, selector(state), ...args));
          //trả về 1 object hợp nhất bởi state(dữ liệu cũ),props 
    },
    // view muốn thực hiện một hoạt động phải thông qua dispatch
    // khi thấy state được cập nhật(ấn vào button)
    // hàm sẽ kiểm tra xem state thay đổi thế nào để 
    // view ra màn hình
    dispatch(action, ...args) {
      // gồm action và hành động thêm, sửa, xóa( args)
      // và value mới 
      state = reducer(state, action, args); 
      //cập nhật lại state theo action
      render(); 
      // thực hiện lại render thay đổi view
    },
  };
}
