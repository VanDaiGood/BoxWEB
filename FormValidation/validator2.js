function Validation(formSelector) {
    var _this = this;

    //lay element cha cua element input
    function getParents(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector))
                return element.parentElement;
            element = element.parentElement;
        }
    }
    var formRules = {};   // bao gom cac rule cua tung loai input
    /**
     * Quy uoc tao rule:
     * -neu co loi : tra ve 1 message loi
     * -khong co loi thi return undefined
     */

    // gom cac ham quy dinh cho tung rule
    var validatorRules = {
        required: function (value) {
            return value ? undefined : 'Vui lòng nhập vào trường này.';
        },
        email: function (value) {
            var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

            return regex.test(value) ? undefined : 'Email không chính xác.';
        },
        min: function (min) {
            return function (value) {
                return value.length >= min ? undefined : `Vui lòng nhập ít nhất ${min} ký tự`;
            };
        },
    }

    // lay ra cac element trong form
    var formElement = document.querySelector(formSelector);
    if (formElement) {
        //lay ra cac the input trong form
        var inputs = formElement.querySelectorAll('[name][rules]');

        //lap qua tung the input
        for (var input of inputs) {
            // lay tung rule cua the bo vao 1 mang
            var rules = input.getAttribute('rules').split('|');

            //lap qua tung rule cua input
            for (var rule of rules) {

                // kiem tra co gia tri yeu cau rieng cua rule
                var ruleHasValue = rule.includes(':');
                // mang tach tung phan tu cua 1 rule (min,max,rule,...)
                var ruleInfor;

                if (ruleHasValue) {
                    ruleInfor = rule.split(':');
                    rule = ruleInfor[0];  //lay ten rule
                }
                var ruleFunc = validatorRules[rule];  // chay truoc ham cua rule co gia tri cho them (min,max,....)
                if (ruleHasValue)
                    ruleFunc = ruleFunc(ruleInfor[1]); //chay lai 1 lan nua de tra ve dung kieu
                if (Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFunc);
                }
                else {
                    formRules[input.name] = [ruleFunc]; // luu message tra ve cua tung rule trong the input
                }
            }
            // lang nghe su kien de validate

            input.onblur = handleValidate;  // khi blur ra ngoai
            input.oninput = handleClearError; // khi nhap vao the input
        }
        //ham xu ly khi blur ra ngoai
        function handleValidate(event) {
            var rules = formRules[event.target.name];  //mang lay tat ca cac mess loi cua tung loai the
            var errorMessage;

            for (var rule of rules) {
                errorMessage = rule(event.target.value);  //tra ve mess loi cua the input
                if (errorMessage)
                    break;
            }
            // neu co mess loi tra ve==> style cho viec nhap sai
            if (errorMessage) {
                var formGroup = getParents(event.target, '.form-group');
                if (formGroup) {
                    event.target.classList.add('InvalidBorderWrong');
                    var formMessage = formGroup.querySelector('.form_message');
                    if (formMessage) {
                        formMessage.innerText = errorMessage;
                        formMessage.classList.add('InvalidMessage');
                    }
                }
            }
            else {// neu khong co loi : style cho viec nhap dung
                event.target.classList.remove('InvalidBorderWrong');
                event.target.classList.add('InvalidBorderRight');
            }
            return !errorMessage; // tra ve ket qua viec kiem tra loi
        }
        // ham xu ly khi nhap vao input
        function handleClearError(event) {
            // bo het style cua viec nhap sai
            var formGroup = getParents(event.target, '.form-group');
            event.target.classList.remove('InvalidBorder');
            var formMessage = formGroup.querySelector('.form_message');
            formMessage.innerText ='';
        }
    }
    // neu bam nut submit== > giong phan validator truoc
    formElement.onsubmit = function (event) {
        event.preventDefault();
        var isRightForm = false;
        var inputs = formElement.querySelectorAll('[name][rules]');
        for (var input of inputs) {
            isRightForm = handleValidate({ target: input });
        }
        // khong co loi khi nhap vao ?
        //console.log(isRightForm);
        if (isRightForm) {
            if(typeof _this.onSubmit()==='function'){
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
                                values[input.name] = [];  //tao phan tu ban dau la 1 mang rong
                        }
                        if (input.matches(':checked')) // neu o checkbox duoc chon?
                            values[input.name].push(input.value); //them vao 
                        break;// 
                    default:
                        values[input.name] = input.value; // tao phan tu gom key va gia tri tuong ung
                }
                      return values;
                  },{});
                 // goi lai ham onsubmit va tra ve gia tri cua form
                  _this.onSubmit(formValues);
            }
        }
    }
}
