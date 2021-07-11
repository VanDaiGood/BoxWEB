function Validator(options) {
    // ham get parents cua element input de lay ra the span 
    function getParents(element, selector) {
        while (element.parentElement) { // noi bot len dan dan
            if (element.parentElement.matches(selector)) { // neu element cha co selector can tim ?
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }
    //Ham style bao loi
    var selectorRules = {};

    function Validate(inputElement, rule) {
        var errorMessage;
        var errorElement = getParents(inputElement, options.formGroup).querySelector(options.errorSelector); // lay ra the span tuong ung de bao loi
        // lay ra cac rule cua selector
        var rules = selectorRules[rule.selector];
        // lap qua tung rule va kiem tra
        // Neu co loi thi dung viec kiem tra
        for (var i = 0; i < rules.length; ++i) {
            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](formElement.querySelector(rule.selector + ':checked'));
                    break;
                default:
                    errorMessage = rules[i](inputElement.value);
            }
            if (errorMessage) break; // neu phat hien 1 loi se dung kiem tra
        }

        if (errorMessage) { // co loi

            errorElement.innerText = errorMessage;
            inputElement.classList.add('InvalidBorderWrong'); // style cho the input
            errorElement.classList.add('InvalidMessage'); //style cho the span
            inputElement.classList.remove('InvalidBorderRight'); // bo style cua the input dung
        } else { // Nhập đúng form==> nguoc lai voi tren
            errorElement.innerText = '';
            inputElement.classList.remove('InvalidBorderWrong');
            errorElement.classList.remove('InvalidMessage');
            inputElement.classList.add('InvalidBorderRight');
        }
        if (errorMessage) return true;
        else return false;
    }

    // Lấy element cua form
    var formElement = document.querySelector(options.form);

    if (formElement) {

        // Kiem tra tat ca khi bam nut submit
        formElement.onsubmit = function (e) {
            e.preventDefault();

            var formError = false; // luu gia tri thong bao loi cua ca formElement

            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var hasError = Validate(inputElement, rule);
                // kiem tra tat ca rule ma khong can quan tam khi click hay blur
                if (hasError) // neu co it nhat 1 loi
                    formError = true;

            });

            if (!formError) {

                if (typeof options.onSubmit === 'function') {

                    var enableInput = formElement.querySelectorAll('[name]'); // lay cac thong tin duoi dang nodelist

                    var formValues = Array.from(enableInput).reduce(function (values, input) {
                        // chuyen nodelist thanh array roi gan lai vao object
                        switch (input.type) {
                            case 'radio':
                                if (input.matches(':checked'))
                                    values[input.name] = input.value;
                                else
                                    return values;

                            case 'checkbox':   // input la checkbox: lay het cac box duoc chon

                                if (!Array.isArray(values[input.name])) {  // chua co gia tri nao
                                    if (!input.matches(':checked')) {   // kiem tra box co duoc chon
                                        values[input.name] = '';       // khong: tra ve 1 chuoi rong
                                        return values;
                                    }
                                    else
                                    values[input.name] = [];    
                                }
                                if(input.matches(':checked'))
                                values[input.name].push(input.value);
                                break;
                            default:
                                values[input.name] = input.value; // tao phan tu gom key va gia tri tuong ung
                        }
                        return values;
                    }, {});

                    options.onSubmit(formValues); // console thong tin nhap vao the input
                }
            }
        }

        options.rules.forEach(function (rule) {
            // rule la 1 object
            // them tat ca cac rule vao 1 mang de tranh thieu sot
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }

            var inputElements = formElement.querySelectorAll(rule.selector);
            Array.from(inputElements).forEach(function (inputElement) {
                //Xu ly case blur ra ngoai
                inputElement.onblur = function () {
                    Validate(inputElement, rule);
                }
                // xu ly khi nguoi dung nhap vao input ==> bo message bao loi
                inputElement.oninput = function () {
                    var errorElement = getParents(inputElement, options.formGroup).querySelector(options.errorSelector);
                    errorElement.innerText = '';
                    getParents(inputElement, options.formGroup).querySelector('.infor').classList.remove('InvalidBorder');
                    errorElement.classList.remove('InvalidMessage');
                }
            });
        })
    }
}

// Dinh nghia rule
//1. khi co loi: tra ra message loi
//2. khi hop le: khong tra ra gi ca
Validator.isRequired = function (selector, message) {
    return {
        selector: selector, // selector tuong ung cua element

        test: function (value) {
            var isRightForm = value; // bo ky tu space de tranh viec nhap vao toan dau cach
            // co gia tri nhap vao ?
            return (isRightForm) ? undefined : message || 'Vui lòng nhập vào trường này.'; // uu tien tra ve message neu message co gia tri 
        }
    };
}

Validator.isEmail = function (selector) {
    return {
        selector: selector,

        test: function (value) {
            // Mã kiểm tra Email hợp lệ
            var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            return regex.test(value) ? undefined : 'Email chưa chính xác';
        }
    };
}

Validator.minLength = function (selector, min, message) {
    return {
        selector: selector,

        test: function (value) {
            return value.length >= min ? undefined : message || `Mật khẩu phải có tối thiểu ${min} ký tự.`;
        }
    };
}
Validator.isConfirmed = function (selector, getConfirmValue, message) {
    return {
        selector: selector,

        test: function (value) {
            return value === getConfirmValue() ? undefined : message || 'Mật khẩu nhập lại không chính xác !!!';
        }
    }
}